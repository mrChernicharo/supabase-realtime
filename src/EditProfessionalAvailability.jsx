import { createSignal, createEffect } from "solid-js";
import { parseWeekday, getWorkingHours, getMergedAvailability } from "./helpers";

export default function EditProfessionalAvailability(props) {
  const workingHours = getWorkingHours({ min: "08:00", max: "20:00" });
  const [currAvailability, setCurrAvailability] = createSignal([]);

  createEffect(() => {
    setCurrAvailability(getMergedAvailability(props.availability));
  });

  return (
    <>
      <h5>Edit professional availability</h5>

      <For each={currAvailability()}>
        {(slot, i) => (
          <div>
            <div>{i() + 1}</div>

            <select value={parseWeekday(slot.day)}>
              <For each={[0, 1, 2, 3, 4, 5, 6]}>
                {(day) => <option>{parseWeekday(day)}</option>}
              </For>
            </select>

            <select value={slot.start}>
              <For each={workingHours}>{(hour) => <option>{hour}</option>}</For>
            </select>

            <select value={slot.end}>
              <For each={workingHours}>{(hour) => <option>{hour}</option>}</For>
            </select>
          </div>
        )}
      </For>
    </>
  );
}
