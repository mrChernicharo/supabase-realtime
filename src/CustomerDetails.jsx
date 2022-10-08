import { createSignal } from "solid-js";
import { onMount } from "solid-js";
import { loadCustomerAvailability } from "./store";
import { parseWeekday } from "./helpers";

export default function CustomerDetails(props) {
  const [availability, setAvailability] = createSignal([]);

  onMount(async () => {
    const results = await loadCustomerAvailability(props.customer.id);
    setAvailability(results);
  });

  return (
    <>
      <button onClick={props.onClose}>X</button>
      <h3>{props.customer.name}</h3>
      <p>{props.customer.email}</p>

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
