import { createStore } from "solid-js/store";
import { supabase } from "./supabaseClient";
import {
  INITIAL_STORE,
  DEFAULT_CUSTOMER_AVAILABILITY,
  DEFAULT_PROFESSIONAL_AVAILABILITY,
} from "./constants";

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
  const { data: removedAvailability, err } = await supabase
    .from("professional_availability")
    .delete()
    .match({ professional_id: id })
    .select();
  if (err) return console.log(err);

  const { data, error } = await supabase
    .from("professionals")
    .delete({ cascade: true })
    .match({ id })
    .select();
  if (error) return console.log(error);

  const entry = data[0];

  console.log("remove Professional", entry, removedAvailability);
  setStore(
    "professionals",
    store.professionals.filter((o) => o.id !== id)
  );

  channel.send({
    type: "broadcast",
    event: "professional_removed",
    entry,
  });
};

const createAppointmentOffers = async (customerId, offers) => {
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
Promise.all([
  supabase
    .from("staff")
    .select("*")
    .then(({ data }) => setStore("staff", data)),
  supabase
    .from("customers")
    .select(
      `*, 
      availability:customer_availability ( id, day, time, status ), 
      appointments:realtime_appointments ( id, day, time, status ),
      appointmentOffers:appointment_offers ( id, day, time, professional_id )`
    )
    .then(({ data }) => setStore("customers", data)),
  supabase
    .from("professionals")
    .select(
      `*, 
      availability:professional_availability (id, day, time, status), 
      appointments:realtime_appointments ( id, day, time, status )`
    )
    .then(({ data }) => setStore("professionals", data)),
]);

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
