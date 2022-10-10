import { createStore } from "solid-js/store";
import { supabase } from "./supabaseClient";
import { getProfessionalById, findCustomerIndexById, findProfessionalIndexById } from "./helpers";
import {
  INITIAL_STORE,
  DEFAULT_CUSTOMER_AVAILABILITY,
  DEFAULT_PROFESSIONAL_AVAILABILITY,
} from "./constants";

const fetchServer = async () =>
  await Promise.all([
    supabase
      .from("staff")
      .select("*")
      .then(({ data }) => setStore("staff", data)),
    supabase
      .from("customers")
      .select(
        `*, 
      availability:customer_availability ( id, day, time, status ), 
      appointments:realtime_appointments ( id, professional_id, day, time, datetime, status ),
      appointmentOffers:appointment_offers ( id, day, time, professional_id )`
      )
      .then(({ data }) => setStore("customers", data)),
    supabase
      .from("professionals")
      .select(
        `*, 
      availability:professional_availability (id, day, time, status), 
      appointments:realtime_appointments ( id, customer_id, day, time, datetime, status )`
      )
      .then(({ data }) => setStore("professionals", data)),
  ]);

const channel = supabase.channel("db-changes");

const [store, setStore] = createStore(INITIAL_STORE);

const dbHandleDeleteProfessional = async (id) => {
  // 1. remove professional availability slots
  const { data: removedProfessionalAvailability, error: err } = await supabase
    .from("professional_availability")
    .delete()
    .match({ professional_id: id })
    .select();
  if (err) return console.log(err);

  // 2. remove professional appointments
  const { data: removedAppointments, error: err1 } = await supabase
    .from("realtime_appointments")
    .delete()
    .match({ professional_id: id })
    .select();
  if (err1) return console.log(err1);

  // 3. patch status of affected customer_availabilities
  const availsToPatch = [];
  removedAppointments.forEach((appointment) => {
    const { customer_id, day, time } = appointment;
    availsToPatch.push({ customer_id, day, time });
  });
  const [customerIds, days, times] = [
    availsToPatch.map((o) => o.customer_id),
    availsToPatch.map((o) => o.day),
    availsToPatch.map((o) => o.time),
  ];

  let updatedCustomerAvails = null;
  if (store.customers.length && customerIds.length && days.length && times.length) {
    const { data, error: err3 } = await supabase
      .from("customer_availability")
      .update({ status: "1" })
      .filter("customer_id", "in", `(${customerIds})`)
      .filter("day", "in", `(${days})`)
      .filter("time", "in", `(${times})`)
      .select();

    if (err3) return console.log({ err3 });
    updatedCustomerAvails = data;
  }

  // 4. delete professional!
  const { data: deletedProfessional, error } = await supabase
    .from("professionals")
    .delete()
    .match({ id })
    .select();
  if (error) return console.log(error);

  console.log({
    deletedProfessional,
    removedAppointments,
    removedProfessionalAvailability,
    updatedCustomerAvails,
    availsToPatch,
    customerIds,
    days,
    times,
  });

  return deletedProfessional[0];
};

const dbHandleDeleteCustomer = async (id) => {
  // 1. remove customer availability
  const { data: removedAvailability, err } = await supabase
    .from("customer_availability")
    .delete()
    .match({ customer_id: id })
    .select();
  if (err) return console.log(err);

  // 2. remove customer appointments
  const { data: removedAppointments, error: err1 } = await supabase
    .from("realtime_appointments")
    .delete()
    .match({ customer_id: id })
    .select();
  if (err1) return console.log(err1);

  // 3. patch status of affected professional_availabilities
  const availsToPatch = [];
  removedAppointments.forEach((appointment) => {
    const { professional_id, day, time } = appointment;
    availsToPatch.push({ professional_id, day, time });
  });
  const [professionalIds, days, times] = [
    availsToPatch.map((o) => o.professional_id),
    availsToPatch.map((o) => o.day),
    availsToPatch.map((o) => o.time),
  ];

  let updatedProfessionalAvails = null;
  if (store.professionals.length && professionalIds.length && days.length && times.length) {
    const { data: avaliData, error: err3 } = await supabase
      .from("professional_availability")
      .update({ status: "1" })
      .filter("professional_id", "in", `(${professionalIds})`)
      .filter("day", "in", `(${days})`)
      .filter("time", "in", `(${times})`)
      .select();

    if (err3) return console.log({ err3 });
    updatedProfessionalAvails = avaliData;
  }

  // 4. delete the damn customer!
  const { data: deletedCustomer, error } = await supabase
    .from("customers")
    .delete()
    .match({ id })
    .select();
  if (error) return console.log(error);

  console.log("removeCustomer", {
    deletedCustomer,
    removedAppointments,
    removedAvailability,
    updatedProfessionalAvails,
    availsToPatch,
    days,
    professionalIds,
    times,
  });

  return deletedCustomer[0];
};
// db update funcs
const addStaff = async ({ name, email }) => {
  const { data, error } = await supabase.from("staff").insert([{ name, email }]).select();
  if (error) return console.log(error);

  const entry = data[0];

  console.log("addStaff", { entry });
  setStore("staff", (prev) => [...prev, entry]);

  channel.send({
    type: "broadcast",
    event: "staff_added",
    entry,
  });
};

const addCustomer = async ({ name, email }) => {
  const { data, error } = await supabase.from("customers").insert([{ name, email }]).select();
  if (error) return console.log(error);

  const customerAvailability = DEFAULT_CUSTOMER_AVAILABILITY.map((o) => ({
    ...o,
    customer_id: data[0].id,
    status: "1",
  }));

  const { data: availability, error: err2 } = await supabase
    .from("customer_availability")
    .insert(customerAvailability)
    .select();
  if (err2) return console.log(err2);

  const entry = { ...data[0], availability, appointments: [], appointmentOffers: [] };

  console.log("addCustomer", { entry });
  setStore("customers", (prev) => [...prev, entry]);

  channel.send({
    type: "broadcast",
    event: "customer_added",
    entry,
  });
};

const addProfessional = async ({ name, email }) => {
  const { data, error } = await supabase.from("professionals").insert([{ name, email }]).select();
  if (error) return console.log(error);

  const professionalAvailability = DEFAULT_PROFESSIONAL_AVAILABILITY.map((o) => ({
    ...o,
    professional_id: data[0].id,
    status: "1",
  }));

  const { data: availability, error: err2 } = await supabase
    .from("professional_availability")
    .insert(professionalAvailability)
    .select();
  if (err2) return console.log(err2);

  const entry = { ...data[0], availability, appointments: [] };

  console.log("addProfessional", { entry });
  setStore("professionals", (prev) => [...prev, entry]);

  channel.send({
    type: "broadcast",
    event: "professional_added",
    entry,
  });
};

const removeStaff = async (id) => {
  const staffEntry = store.staff.find((s) => s.id === id);
  const professional = store.professionals.find((p) => p.email === staffEntry.email);

  if (professional) {
    await dbHandleDeleteProfessional(professional.id);
  }

  const { data, error } = await supabase.from("staff").delete().match({ id }).select();
  if (error) return console.log(error);

  const entry = data[0];

  fetchServer();

  channel.send({
    type: "broadcast",
    event: "staff_removed",
    entry,
  });
};

const removeCustomer = async (id) => {
  const entry = await dbHandleDeleteCustomer(id);

  console.log("and refetch everything so state is in sync!");
  await fetchServer();
  console.log("OK!");

  channel.send({
    type: "broadcast",
    event: "customer_removed",
    entry,
  });
};

const removeProfessional = async (id) => {
  const entry = await dbHandleDeleteProfessional(id);
  console.log("remove Professional", entry);
  console.log("and refetch everything so state is in sync!");
  await fetchServer();
  console.log("OK!");

  channel.send({
    type: "broadcast",
    event: "professional_removed",
    entry,
  });
};

const createAppointmentOffers = async (customerId, offers) => {
  if (!offers.length) {
    return console.log("createAppointmentOffers with no offers! Abort it", { offers, customerId });
  }
  console.log("createAppointmentOffers", { offers, customerId });

  // patch/remove previous offers
  const { data: deletedData, error: deleteError } = await supabase
    .from("appointment_offers")
    .delete()
    .eq("customer_id", customerId)
    .select();

  if (deleteError) {
    console.log(deleteError);
    return;
  }

  const { data, error } = await supabase.from("appointment_offers").insert(offers).select();

  if (error) {
    console.log(error);
    return;
  }

  console.log("appointment offer created", data);
  setStore("customers", (prev) =>
    prev.map((c) => (c.id === customerId ? { ...c, appointmentOffers: data } : c))
  );

  channel.send({
    type: "broadcast",
    event: "appointment_offer_created",
    customerId,
    entries: data,
  });

  console.log({ data, deletedData });

  // return data
};

const confirmOffer = async (customerId, offer) => {
  console.log("confirmOffer", { customerId, offer });

  // 1. clear appointment_offer to other customers
  const offersToRemove = [];
  store.customers.forEach((customer) => {
    const offerToRemove = customer.appointmentOffers.find(
      (o) =>
        o.professional_id === offer.professional_id && o.day === offer.day && o.time === offer.time
    );
    if (offerToRemove) offersToRemove.push(offerToRemove);
  });

  console.log("clear appointment_offer to other customers", { offersToRemove });
  for (const off of offersToRemove) {
    const { data: deletedOff, error: deleteOffError } = await supabase
      .from("appointment_offers")
      .delete()
      .match({ id: off.id })
      .select();
    if (deleteOffError) {
      console.log({ deleteOffError });
      return;
    }
    console.log({ deletedOff });
  }

  // 1.5 clear all appointment_offers made to customer
  const { data: deletedOffers, error: deleteOfferError } = await supabase
    .from("appointment_offers")
    .delete()
    .eq("customer_id", customerId)
    .select();
  if (deleteOfferError) {
    console.log({ deleteOfferError });
    return;
  }

  // 2. patch customer availability (status)
  const { data: updatedCustomerAvail, error: updateCAvError } = await supabase
    .from("customer_availability")
    .update({ status: "0" })
    .match({ customer_id: customerId, day: offer.day, time: offer.time })
    .select();
  if (updateCAvError) {
    console.log({ updateCAvError });
    return;
  }
  // 3. professional availability (status)
  const { data: updatedProfAvail, error: updatePAvError } = await supabase
    .from("professional_availability")
    .update({ status: "0" })
    .match({ professional_id: offer.professional_id, day: offer.day, time: offer.time })
    .select();
  if (updatePAvError) {
    console.log({ updatePAvError });
    return;
  }
  const newAppointment = {
    customer_id: customerId,
    professional_id: offer.professional_id,
    day: offer.day,
    time: offer.time,
    datetime: offer.ISODate,
    status: "1",
  };

  // 4. create appointment 🎉
  const { data, error: appointmentError } = await supabase
    .from("realtime_appointments")
    .insert(newAppointment)
    .select();
  if (appointmentError) {
    console.log({ appointmentError });
    return;
  }

  await fetchServer();
  channel.send({
    type: "broadcast",
    event: "appointment_offer_confirmed_by_customer",
    customerId,
    entry: offer,
  });
};

const updateProfessionalAvailability = async (availabilities) => {
  console.log("updateProfessionalAvailability", { availabilities });
};

// realtime events handlers
const onStaffAdded = (payload) => {
  console.log("staff_added", { payload });
  setStore("staff", (prev) => [...prev, { ...payload.entry }]);
};

const onCustomerAdded = (payload) => {
  console.log("customer_added", { payload });
  setStore("customers", (prev) => [...prev, { ...payload.entry }]);
};

const onProfessionalAdded = (payload) => {
  console.log("professional_added", { payload });
  setStore("professionals", (prev) => [...prev, { ...payload.entry }]);
};

const onStaffRemoved = (payload) => {
  console.log("staff_removed", { payload });
  setStore("staff", (prev) => prev.filter((p) => p.id !== payload.entry.id));
};

const onCustomerRemoved = (payload) => {
  console.log("customer_removed", { payload });
  setStore("customers", (prev) => prev.filter((p) => p.id !== payload.entry.id));
};

const onProfessionalRemoved = (payload) => {
  console.log("professional_removed", { payload });
  setStore("professionals", (prev) => prev.filter((p) => p.id !== payload.entry.id));
};

const onAppointmentOfferCreated = (payload) => {
  console.log("onAppointmentOfferCreated", { payload });
  setStore("customers", (prev) =>
    prev.map((c) =>
      c.id === payload.customerId ? { ...c, appointmentOffers: [...payload.entries] } : c
    )
  );
};

const onAppointmentOfferConfirmed = (payload) => {
  console.log("appointment offer confirmed by customer", { payload });
};

// initial fetching (hydration)
fetchServer();

// realtime subscription
// prettier-ignore
channel
  .on("broadcast", { event: "staff_added" }, onStaffAdded)
  .on("broadcast", { event: "customer_added" }, onCustomerAdded)
  .on("broadcast", { event: "professional_added" }, onProfessionalAdded)
  .on("broadcast", { event: "staff_removed" }, onStaffRemoved)
  .on("broadcast", { event: "customer_removed" }, onCustomerRemoved)
  .on("broadcast", { event: "professional_removed" }, onProfessionalRemoved)
  .on("broadcast", { event: "appointment_offer_created" }, onAppointmentOfferCreated)
  .on("broadcast", { event: "appointment_offer_confirmed_by_customer" }, onAppointmentOfferConfirmed)
  .subscribe(console.log);

export {
  store,
  addCustomer,
  addProfessional,
  addStaff,
  removeCustomer,
  removeProfessional,
  removeStaff,
  createAppointmentOffers,
  confirmOffer,
  updateProfessionalAvailability,
};
