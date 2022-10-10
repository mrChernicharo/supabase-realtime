import { createSignal, createEffect } from "solid-js";
import { parseWeekday, getWorkingHours, getMergedAvailability } from "./helpers";
import { DEFAULT_SLOT } from "./constants";

const workingHours = getWorkingHours({ min: "08:00", max: "20:00" });

function DayTimeRangeField(props) {
  return (
    <div>
      <select value={parseWeekday(props.slot.day)}>
        <For each={[0, 1, 2, 3, 4, 5, 6]}>{(day) => <option>{parseWeekday(day)}</option>}</For>
      </select>

      <select value={props.slot.start}>
        <For each={workingHours}>{(hour) => <option>{hour}</option>}</For>
      </select>

      <select value={props.slot.end}>
        <For each={workingHours}>{(hour) => <option>{hour}</option>}</For>
      </select>
    </div>
  );
}

export default function EditProfessionalAvailability(props) {
  let addAvailabilityRangeFormRef;
  const [currAvailability, setCurrAvailability] = createSignal([]);
  const [newSlots, setNewSlots] = createSignal([DEFAULT_SLOT]);
  // const [newSlot, setNewSlot] = createSignal(DEFAULT_SLOT);

  function handleAddAvailabilityRange(e) {
    e.preventDefault();
    console.log(e);

    // pluck weekday, start, end for all fields
    const selectFieldValues = [...e.currentTarget]
      .filter((field) => field.tagName === "SELECT")
      .map((s) => s.value);

    console.log({ addAvailabilityRangeFormRef, selectFieldValues });

    // const selectedTimeBlocks = fieldValues.map((d) => ({
    //   ...d.dataset,
    //   customer_id: props.customer.id,
    // }));

    // grab all availability ranges and merge them into new clean availability ranges

    // send it to db appreciation
  }

  createEffect(() => {
    setCurrAvailability(getMergedAvailability(props.availability));
  });

  return (
    <div>
      <h5>Edit professional availability</h5>
      <form onSubmit={handleAddAvailabilityRange} ref={addAvailabilityRangeFormRef}>
        <For each={currAvailability()}>{(slot, i) => <DayTimeRangeField slot={slot} />}</For>
        <div>
          <For each={newSlots()}>
            {(slot, i) => (
              <div>
                <div>add new</div>
                <DayTimeRangeField slot={slot} />
              </div>
            )}
          </For>

          <button type="button" onClick={(e) => setNewSlots((prev) => [...prev, DEFAULT_SLOT])}>
            Add
          </button>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
}
