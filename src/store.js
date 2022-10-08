import { createStore } from "solid-js/store";
import { supabase } from "./supabaseClient";

const INITIAL_STORE = {
  professionals: [],
  customers: [],
  staff: [],
};

const channel = supabase.channel("db-changes");

const [store, setStore] = createStore(INITIAL_STORE);

const addStaff = async ({ name, email }) => {
  const { data } = await supabase.from("staff").insert([{ name, email }]).select();
  const newEntry = data[0];

  console.log("addStaff", { newEntry });
  setStore("staff", (prev) => [...prev, newEntry]);

  channel.send({
    type: "broadcast",
    event: "staff_added",
    payload: newEntry,
  });
};

const addCustomer = async ({ name, email }) => {
  const { data } = await supabase.from("customers").insert([{ name, email }]).select();
  const newEntry = data[0];

  console.log("addCustomer", { newEntry });
  setStore("customers", (prev) => [...prev, newEntry]);

  channel.send({
    type: "broadcast",
    event: "customer_added",
    payload: newEntry,
  });
};

const addProfessional = async ({ name, email }) => {
  const { data } = await supabase.from("professionals").insert([{ name, email }]).select();
  const newEntry = data[0];

  console.log("addProfessional", { newEntry });
  setStore("professionals", (prev) => [...prev, newEntry]);

  channel.send({
    type: "broadcast",
    event: "professional_added",
    payload: newEntry,
  });
};

const removeStaff = async (id) => {
  const { data: removedEntry } = await supabase.from("staff").delete().match({ id }).select();
  console.log("removeStaff", removedEntry);
  setStore(
    "staff",
    store.staff.filter((o) => o.id !== id)
  );

  channel.send({
    type: "broadcast",
    event: "staff_removed",
    payload: removedEntry,
  });
};

const removeCustomer = async (id) => {
  const { data: removedEntry } = await supabase.from("customers").delete().match({ id }).select();
  console.log("removeCustomer", removedEntry);
  setStore(
    "customers",
    store.customers.filter((o) => o.id !== id)
  );

  channel.send({
    type: "broadcast",
    event: "customer_removed",
    payload: removedEntry,
  });
};

const removeProfessional = async (id) => {
  const { data: removedEntry } = await supabase
    .from("professionals")
    .delete()
    .match({ id })
    .select();

  console.log("remove Professional", removedEntry);
  setStore(
    "professionals",
    store.professionals.filter((o) => o.id !== id)
  );

  channel.send({
    type: "broadcast",
    event: "professional_removed",
    payload: removedEntry,
  });
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

// realtime events handles & subscription
channel
  .on("broadcast", { event: "staff_added" }, console.log)
  .on("broadcast", { event: "customer_added" }, console.log)
  .on("broadcast", { event: "professional_added" }, console.log)
  .on("broadcast", { event: "staff_removed" }, console.log)
  .on("broadcast", { event: "customer_removed" }, console.log)
  .on("broadcast", { event: "professional_removed" }, console.log)
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
