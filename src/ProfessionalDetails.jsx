import { createSignal } from "solid-js";
import { onMount } from "solid-js";
import { loadProfessionalAvailability } from "./store";
import { parseWeekday } from "./helpers";

export default function ProfessionalDetails(props) {
  const [availability, setAvailability] = createSignal([]);

  onMount(async () => {
    const results = await loadProfessionalAvailability(props.professional.id);
    setAvailability(results);
  });

  return (
    <>
      <button onClick={props.onClose}>X</button>
      <h2>{props.professional.name}</h2>
      <p>{props.professional.email}</p>

      <h3>Professional Availability</h3>
      <ul>
        <For each={availability()}>
          {(timeBlock) => (
            <li>
              <p style={{ color: timeBlock.status === "1" ? "green" : "red" }}>
                {parseWeekday(timeBlock.day)} {timeBlock.time}
              </p>
            </li>
          )}
        </For>
      </ul>
    </>
  );
}