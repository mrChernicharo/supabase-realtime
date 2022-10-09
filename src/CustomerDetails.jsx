import { createSignal, createEffect, onMount } from "solid-js";
import { parseWeekday } from "./helpers";
import { supabase } from "./supabaseClient";
import AppointmentOffers from "./AppointmentOffers";

export default function CustomerDetails(props) {
  const [customerAppointmentOffers, setCustomerAppointmentOffers] = createSignal(null);
  const [isLoading, setIsLoading] = createSignal(true);

  createEffect(async () => {
    setIsLoading(true);

    // getCustomerAppointmentOffers
    const { data } = await supabase
      .from("appointment_offers")
      .select("*")
      .eq("customer_id", props.customer.id);

    setCustomerAppointmentOffers(data);

    setIsLoading(false);
  });

  // appointment offers
  return (
    <>
      <button onClick={props.onClose}>X</button>
      <h2>{props.customer.name}</h2>
      <p>{props.customer.email}</p>

      <h3>Customer Availability</h3>
      <ul>
        <For each={props.customer.availability}>
          {(timeBlock) => (
            <li>
              <p style={{ color: timeBlock.status === "1" ? "green" : "red" }}>
                {parseWeekday(timeBlock.day)} {timeBlock.time}
              </p>
            </li>
          )}
        </For>
      </ul>

      <AppointmentOffers offers={customerAppointmentOffers()} />
    </>
  );
}
