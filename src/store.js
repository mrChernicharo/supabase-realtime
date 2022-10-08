import { createStore } from "solid-js/store";
import { supabase } from "./supabaseClient";

const INITIAL_STORE = {
  professionals: [],
  customers: [],
  staff: [],
};

const [store, setStore] = createStore(INITIAL_STORE);

const addStaff = async ({ name, email }) => {
  const { data: newEntry } = await supabase.from("staff").insert([{ name, email }]).select();

  console.log("addStaff", { newEntry });
  setStore("staff", (prev) => [...prev, newEntry[0]]);
};

const addCustomer = async ({ name, email }) => {
  const { data: newEntry } = await supabase.from("customers").insert([{ name, email }]).select();

  console.log("addCustomer", { newEntry });
  setStore("customers", (prev) => [...prev, newEntry[0]]);
};

const addProfessional = async ({ name, email }) => {
  const { data: newEntry } = await supabase
    .from("professionals")
    .insert([{ name, email }])
    .select();

  console.log("addProfessional", { newEntry });
  setStore("professionals", (prev) => [...prev, newEntry[0]]);
};

const removeStaff = async (id) => {
  const { data: removedEntry } = await supabase.from("staff").delete().match({ id }).select();
  console.log("removeStaff", removedEntry);
  setStore(
    "staff",
    store.staff.filter((o) => o.id !== id)
  );
};

const removeCustomer = async (id) => {
  const { data: removedEntry } = await supabase.from("customers").delete().match({ id }).select();
  console.log("removeCustomer", removedEntry);
  setStore(
    "customers",
    store.customers.filter((o) => o.id !== id)
  );
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
};

const { data: fetchedStaff } = await supabase.from("staff").select("*");
const { data: fetchedCustomers } = await supabase.from("customers").select("*");
const { data: fetchedProfessionals } = await supabase.from("professionals").select("*");

setStore("staff", fetchedStaff);
setStore("customers", fetchedCustomers);
setStore("professionals", fetchedProfessionals);

export {
  store,
  addCustomer,
  addProfessional,
  addStaff,
  removeCustomer,
  removeProfessional,
  removeStaff,
};
