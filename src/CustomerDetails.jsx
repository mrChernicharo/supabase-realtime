import { createSignal, createEffect, onMount } from "solid-js";
import { parseWeekday, getProfessionalById } from "./helpers";
import CustomerAppointmentOffers from "./CustomerAppointmentOffers";
import CustomerAvailability from "./CustomerAvailability";
import { s } from "./styles";
import { Show } from "solid-js";
import { store } from "./store";
import Badge from "./Badge";

export default function CustomerDetails(props) {
  const noAppointments = () => !props.customer.appointments.length;

  const isBrandNewUser = (person) =>
    !person.appointments.length && !person.appointmentOffers.length;
  const hasOffers = (person) => person.appointmentOffers.length;
  const haveAppointments = (person) => person.appointments.length;

  return (
    <>
      <button onClick={props.onClose}>X</button>
      <h2>
        <Badge
          success={haveAppointments(props.customer)}
          warn={hasOffers(props.customer)}
          danger={isBrandNewUser(props.customer)}
        />
        {props.customer.name}
      </h2>
      <p>{props.customer.email}</p>
      <p>{props.customer.id}</p>

      <CustomerAvailability
        availability={props.customer.availability}
        appointments={props.customer.appointments}
      />

      <Show when={noAppointments()}>
        <CustomerAppointmentOffers
          customerId={props.customer.id}
          offers={props.customer.appointmentOffers}
        />
      </Show>
    </>
  );
}
