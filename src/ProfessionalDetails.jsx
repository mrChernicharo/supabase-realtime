import { createSignal } from "solid-js";
import { onMount } from "solid-js";
import { loadProfessionalAvailability } from "./store";
import { parseWeekday, getWorkingHours, mergeAvailability } from "./helpers";
import EditProfessionalAvailability from "./EditProfessionalAvailability";

export default function ProfessionalDetails(props) {
  return (
    <>
      <button onClick={props.onClose}>X</button>
      <h2>{props.professional.name}</h2>
      <p>{props.professional.email}</p>

      <h3>Professional Availability</h3>
      <ul>
        <For each={props.professional.availability}>
          {(timeBlock) => (
            <li>
              <p style={{ color: timeBlock.status === "1" ? "green" : "red" }}>
                {parseWeekday(timeBlock.day)} {timeBlock.time}
              </p>
            </li>
          )}
        </For>
      </ul>

      <pre>{JSON.stringify(mergeAvailability(props.professional.availability), null, 2)}</pre>

      <EditProfessionalAvailability />
    </>
  );
}
