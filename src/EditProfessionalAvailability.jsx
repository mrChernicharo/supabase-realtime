import { createSignal, createEffect } from "solid-js";
import {
  dateToWeekday,
  getWorkingHours,
  mergeAvailabilityArrayIntoRanges,
  parseAvailabilityRangesIntoArray,
  timeStrToMinutes,
} from "./helpers";
import { DEFAULT_SLOT } from "./constants";

const workingHours = getWorkingHours({ min: "08:00", max: "20:00" });

function DayTimeRangeField(props) {
  return (
    <div>
      <select value={dateToWeekday(props.slot.day)}>
        <For each={[0, 1, 2, 3, 4, 5, 6]}>{(day) => <option>{dateToWeekday(day)}</option>}</For>
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
  const [additionalSlots, setAdditionalSlots] = createSignal([DEFAULT_SLOT]);
  // const [newSlot, setNewSlot] = createSignal(DEFAULT_SLOT);

  function handleAddAvailabilityRange(e) {
    e.preventDefault();
    console.log(e);

    // pluck weekday, start, end for all fields
    const selectValues = [...e.currentTarget]
      .filter((field) => field.tagName === "SELECT")
      .map((s) => s.value);

    // get them organized as availability ranges
    const availabilityRanges = [];
    for (let i = 2; i < selectValues.length; i += 3) {
      const [day, start, end] = [selectValues[i - 2], selectValues[i - 1], selectValues[i]];
      availabilityRanges.push({ day, start, end });
    }

    console.log({
      addAvailabilityRangeFormRef,
      selectValues,
      availabilityRanges,
      // mergedAvailability,
    });
    // merge availability ranges them into new clean availability ranges
    const mergedAvailability = parseAvailabilityRangesIntoArray(availabilityRanges);

    console.log({
      addAvailabilityRangeFormRef,
      selectValues,
      availabilityRanges,
      mergedAvailability,
    });
    // send it to db appreciation
  }

  createEffect(() => {
    setCurrAvailability(mergeAvailabilityArrayIntoRanges(props.availability));
  });

  return (
    <div>
      <h5>Edit professional availability</h5>
      <form onSubmit={handleAddAvailabilityRange} ref={addAvailabilityRangeFormRef}>
        <For each={currAvailability()}>{(slot, i) => <DayTimeRangeField slot={slot} />}</For>
        <div>
          <For each={additionalSlots()}>
            {(slot, i) => (
              <div>
                <div>add new</div>
                <DayTimeRangeField slot={slot} />
              </div>
            )}
          </For>

          <button
            type="button"
            onClick={(e) => setAdditionalSlots((prev) => [...prev, DEFAULT_SLOT])}
          >
            Add
          </button>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
}
