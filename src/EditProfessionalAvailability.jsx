import { createSignal } from "solid-js";
import { onMount } from "solid-js";
import { loadProfessionalAvailability } from "./store";
import { parseWeekday, getWorkingHours } from "./helpers";

export default function EditProfessionalAvailability(props) {
  const workingHours = getWorkingHours({ min: "08:00", max: "20:00" });

  return (
    <>
      <h5>Edit professional availability</h5>
      <For each={[0, 1, 2, 3, 4, 5, 6]}>
        {(day) => (
          <div>
            <p>{parseWeekday(day)}</p>

            <select>
              <For each={workingHours}>{(hour) => <option>{hour}</option>}</For>
            </select>

            <select>
              <For each={workingHours}>{(hour) => <option>{hour}</option>}</For>
            </select>
          </div>
        )}
      </For>
    </>
  );
}
