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
  const { data, error } = await supabase.from("staff").delete().match({ id }).select();
  if (error) return console.log(error);

  const entry = data[0];
  console.log("removeStaff", entry);
  setStore(
    "staff",
    store.staff.filter((o) => o.id !== id)
  );

  channel.send({
    type: "broadcast",
    event: "staff_removed",
    entry,
  });
};

const removeCustomer = async (id) => {
  const { data: removedAvailability, err } = await supabase
    .from("customer_availability")
    .delete()
    .match({ customer_id: id })
    .select();
  if (err) return console.log(err);

  const { data, error } = await supabase.from("customers").delete().match({ id }).select();
  if (error) return console.log(error);

  const entry = data[0];

  console.log("removeCustomer", entry, removedAvailability);
  setStore(
    "customers",
    store.customers.filter((o) => o.id !== id)
  );

  channel.send({
    type: "broadcast",
    event: "customer_removed",
    entry,
  });
};

const removeProfessional = async (id) => {
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

  // 3. patch status of affected customer_availabilities
  const { data: updatedCustomerAvails, error: err3 } = await supabase
    .from("customer_availability")
    .update({ status: "1" })
    .filter("customer_id", "in", `(${customerIds})`)
    .filter("day", "in", `(${days})`)
    .filter("time", "in", `(${times})`)
    .select();

  if (err3) return console.log(err3);

  // 4. remove appointments where professional is involved
  // ON CASCADE seems to be doing it

  // 5. delete professional
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

  const entry = deletedProfessional[0];
  console.log("remove Professional", entry, removedProfessionalAvailability);
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

  // 1. clear appointment_offers made to customer
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
  // update store
  // 1. clear appointment_offers made to customer
  setStore(
    "customers",
    findCustomerIndexById(customerId, store.customers),
    "appointmentOffers",
    (prev) => []
  );
  // 2. patch customer availability (status)
  setStore(
    "customers",
    findCustomerIndexById(customerId, store.customers),
    "availability",
    (prev) =>
      prev.map((av) => (av.id === updatedCustomerAvail[0].id ? updatedCustomerAvail[0] : av))
  );
  // 3. professional availability (status)
  setStore(
    "professionals",
    findProfessionalIndexById(offer.professional_id, store.professionals),
    "availability",
    (prev) => prev.map((av) => (av.id === updatedProfAvail[0].id ? updatedProfAvail[0] : av))
  );
  // 4. create appointment 🎉
  setStore("customers", findCustomerIndexById(customerId, store.customers), "appointments", [
    newAppointment,
  ]);
  setStore(
    "professionals",
    findProfessionalIndexById(offer.professional_id, store.professionals),
    "appointments",
    [
      ...getProfessionalById(offer.professional_id, store.professionals).appointments,
      newAppointment,
    ]
  );

  console.log({
    newAppointment,
    data,
    deletedOffers,
    updatedCustomerAvail,
    updatedProfAvail,
    customerIdx: findCustomerIndexById(customerId, store.customers),
  });

  // . notify professional??

  // . send realtime event
  channel.send({
    type: "broadcast",
    event: "appointment_offer_confirmed_by_customer",
    customerId,
    entry: offer,
  });
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
};
