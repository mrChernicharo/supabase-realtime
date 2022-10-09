import { createSignal, createEffect, onMount } from "solid-js";
import { parseWeekday } from "./helpers";
import CustomerAppointmentOffers from "./CustomerAppointmentOffers";
import { s } from "./styles";
import { Show } from "solid-js";

export default function CustomerDetails(props) {
  const noAppointments = () => !props.customer.appointments.length;

  return (
    <>
      <button onClick={props.onClose}>X</button>
      <h2>{props.customer.name}</h2>
      <p>{props.customer.email}</p>
      <p>{props.customer.id}</p>

      <h3>Customer Availability</h3>
      <ul style={s.ul}>
        <For each={props.customer.availability}>
          {(timeBlock) => (
            <li style={s.li}>
              <span style={{ color: timeBlock.status === "1" ? "green" : "red" }}>
                {parseWeekday(timeBlock.day)} {timeBlock.time}
              </span>
            </li>
          )}
        </For>
      </ul>

      <Show when={noAppointments()}>
        <CustomerAppointmentOffers
          customerId={props.customer.id}
          offers={props.customer.appointmentOffers}
        />
      </Show>
    </>
  );
}
