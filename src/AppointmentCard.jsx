import { dateToWeekday } from "./helpers";

export default function AppointmentCard(props) {
  console.log(props.appointment);

  return (
    <div style={props.style}>
      <Show when={props.appointment.professional_name}>
        <div>{props.appointment.professional_name}</div>
      </Show>

      <Show when={props.appointment.customer_name}>
        <div>{props.appointment.customer_name}</div>
      </Show>

      <div>
        {dateToWeekday(props.appointment.day)} {props.appointment.time}
      </div>
      <div>{props.appointment.datetime}</div>
    </div>
  );
}
