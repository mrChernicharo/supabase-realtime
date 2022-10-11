import { For } from "solid-js";
import Icon from "./Icon";

import AppointmentCard from "./AppointmentCard";

export default function Appointments(props) {
  return (
    <div>
      <div>Appointments</div>
      <For each={props.appointments}>
        {(appointment) => <AppointmentCard appointment={appointment} />}
      </For>
    </div>
  );
}
