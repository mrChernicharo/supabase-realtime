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
      <h3>{props.professional.name}</h3>
      <p>{props.professional.email}</p>

      <ul>
        <For each={availability()}>
          {(timeBlock) => (
            <li>
              <p>
                {parseWeekday(timeBlock.day)} {timeBlock.time}
              </p>
            </li>
          )}
        </For>
      </ul>
    </>
  );
}
