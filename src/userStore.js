import { createStore } from "solid-js/store";
import { getCustomerById, getProfessionalById } from "./helpers";
import { addCustomer, addProfessional } from "./store";
import { supabase } from "./supabaseClient";

const INITIAL_USER_STORE = {
  category: "",
  email: "",
  user_id: "",
};

const [userStore, setUserStore] = createStore(INITIAL_USER_STORE);

const fetchCustomerByEmail = async (email) => {
  const { data, error } = await supabase.from("customers").select("*").match({ email });
  if (error) return console.log(error);

  return data[0];
};

const fetchProfessionalByEmail = async (email) => {
  const { data, error } = await supabase.from("professionals").select("*").match({ email });
  if (error) return console.log(error);

  return data[0];
};

const login = async (category, email = "") => {
  if (!email && category !== "admin") return;
  let user;

  switch (category) {
    case "professional": {
      user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        console.log("grabbed professional from local storage!");
      }
      if (!user) {
        console.log("check professional email!");
        user = await fetchProfessionalByEmail(email);
      }
      if (!user) {
        console.log("new professional!");
        user = await addProfessional({ email, name: email.split("@")[0] });
        localStorage.setItem("user", JSON.stringify({ ...user, category: "professional" }));
      }

      setUserStore({ ...user, category: "professional" });

      return "/professional";
    }
    case "customer": {
      user = localStorage.getItem("user");

      if (user) {
        console.log("grabbed customer from local storage!");
      }
      if (!user) {
        console.log("check customer email!");
        user = await fetchCustomerByEmail(email);
      }
      if (!user) {
        console.log("new customer!");
        user = await addCustomer({ email, name: email.split("@")[0] });
        localStorage.setItem("user", JSON.stringify({ ...user, category: "customer" }));
      }

      setUserStore({ ...user, category: "customer" });

      return "/customer";
    }
    case "admin":
    default: {
      setUserStore({ category: "admin" });

      return "/admin";
    }
  }
};

const logout = async () => {
  console.log("logout");
  localStorage.removeItem("user");
  setUserStore(user);
};

export { userStore, setUserStore, login, logout };
