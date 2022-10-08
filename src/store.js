import { createStore } from "solid-js/store";
import { supabase } from "./supabaseClient";

const INITIAL_STORE = {
  professionals: [],
  customers: [],
  staff: [],
};

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

  const entry = data[0];

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

  const entry = data[0];

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
  const { data, error } = await supabase.from("customers").delete().match({ id }).select();
  if (error) return console.log(error);

  const entry = data[0];

  console.log("removeCustomer", entry);
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
  const { data, error } = await supabase.from("professionals").delete().match({ id }).select();
  if (error) return console.log(error);

  const entry = data[0];

  console.log("remove Professional", entry);
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

// initial fetching (hydration)
Promise.all([
  supabase
    .from("staff")
    .select("*")
    .then(({ data }) => setStore("staff", data)),
  supabase
    .from("customers")
    .select("*")
    .then(({ data }) => setStore("customers", data)),
  supabase
    .from("professionals")
    .select("*")
    .then(({ data }) => setStore("professionals", data)),
]);

// realtime subscription
channel
  .on("broadcast", { event: "staff_added" }, onStaffAdded)
  .on("broadcast", { event: "customer_added" }, onCustomerAdded)
  .on("broadcast", { event: "professional_added" }, onProfessionalAdded)
  .on("broadcast", { event: "staff_removed" }, onStaffRemoved)
  .on("broadcast", { event: "customer_removed" }, onCustomerRemoved)
  .on("broadcast", { event: "professional_removed" }, onProfessionalRemoved)
  .subscribe(console.log);

export {
  store,
  addCustomer,
  addProfessional,
  addStaff,
  removeCustomer,
  removeProfessional,
  removeStaff,
};
