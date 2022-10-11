import { createSignal, createEffect, onMount } from "solid-js";
import { dateToWeekday, getProfessionalById } from "./helpers";
import CustomerAppointmentOffers from "./CustomerAppointmentOffers";
import CustomerAvailability from "./CustomerAvailability";
import { s } from "./styles";
import { Show } from "solid-js";
import { store } from "./store";
import Badge from "./Badge";
import Icon from "./Icon";
import Appointments from "./Appointments";
import Button from "./Button";

export default function CustomerDetails(props) {
  const [isAppointmentsOpen, setIsAppointmentsOpen] = createSignal(false);

  const isBrandNewUser = () =>
    !props.customer.appointments.length && !props.customer.appointmentOffers.length;
  const hasOffers = () => props.customer.appointmentOffers.length;
  const haveAppointments = () => props.customer.appointments.length;

  return (
    <>
      <Button type="close" onClick={props.onClose} />

      <h2>
        <Badge success={haveAppointments()} warn={hasOffers()} danger={isBrandNewUser()} />
        {props.customer.name}
      </h2>
      <p>{props.customer.email}</p>
      <p>{props.customer.id}</p>

      <CustomerAvailability
        availability={props.customer.availability}
        appointments={props.customer.appointments}
      />

      <Show when={!haveAppointments()}>
        <CustomerAppointmentOffers
          customerId={props.customer.id}
          offers={props.customer.appointmentOffers}
        />
      </Show>

      <Show when={haveAppointments()}>
        <Show
          when={isAppointmentsOpen()}
          fallback={<Button type="open" onClick={(e) => setIsAppointmentsOpen(true)} />}
        >
          <div>
            <Button type="close" onClick={(e) => setIsAppointmentsOpen(false)} />
            <Appointments appointments={props.customer.appointments} />
          </div>
        </Show>
      </Show>
    </>
  );
}
