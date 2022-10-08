import { createSignal } from "solid-js";
import { onMount } from "solid-js";
import { loadCustomerAvailability } from "./store";
import { parseWeekday } from "./helpers";

export default function CustomerDetails(props) {
  return (
    <>
      <button onClick={props.onClose}>X</button>
      <h2>{props.customer.name}</h2>
      <p>{props.customer.email}</p>

      <h3>Customer Availability</h3>
      <ul>
        <For each={props.customer.customer_availability}>
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
