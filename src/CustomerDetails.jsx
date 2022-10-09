import { createSignal, createEffect, onMount } from "solid-js";
import { parseWeekday } from "./helpers";
import CustomerAppointmentOffers from "./CustomerAppointmentOffers";

export default function CustomerDetails(props) {
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

      <CustomerAppointmentOffers offers={props.customer.appointmentOffers} />
    </>
  );
}
