import { createSignal, createEffect } from "solid-js";
import { onMount } from "solid-js";
import { supabase } from "./supabaseClient";
import Staff from "./Staff";
import Customers from "./Customers";
import Professionals from "./Professionals";
import AppointmentRequests from "./AppointmentRequests";
import { store } from "./store";

function App() {
  return (
    <>
      <div style={{ display: "flex" }}>
        <Staff />

        <Customers />

        <Professionals />
      </div>

      <AppointmentRequests />
      {/* <pre>{JSON.stringify(store, null, 2)}</pre> */}
    </>
  );
}

export default App;
