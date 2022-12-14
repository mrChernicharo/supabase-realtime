import { createSignal, createEffect } from "solid-js";
import {
  dateToWeekday,
  getWorkingHours,
  mergeAvailabilityArrayIntoRanges,
  parseAvailabilityRangesIntoArray,
  timeStrToMinutes,
  getProfessionalById,
} from "./helpers";
import { DEFAULT_SLOT } from "./constants";
import { updateProfessionalAvailability } from "./store";

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

  const isAppointment = (o) => o.id;

  function handleSubmitAvailabilityRanges(e) {
    e.preventDefault();

    // pluck weekday, start, end for all fields
    const selectValues = [...e.currentTarget]
      .filter((field) => field.tagName === "SELECT")
      .map((s) => s.value);

    // get them organized in an array availability of ranges
    const availabilityRanges = [];
    for (let i = 2; i < selectValues.length; i += 3) {
      const [day, start, end] = [selectValues[i - 2], selectValues[i - 1], selectValues[i]];
      availabilityRanges.push({ day, start, end });
    }

    // merge availability ranges into new clean availability ranges
    const mergedAvailability = parseAvailabilityRangesIntoArray(availabilityRanges);
    const newAvailability = [...mergedAvailability];

    // figure out the status of each cleanArr element. Merge appointments encompassed
    // in the new availability list

    const newAvailPlusExistingAppointments = [...newAvailability, ...props.appointments];
    const pushedAppointmentsIds = [];

    for (let [i, slot] of newAvailability.entries()) {
      const actualAppointmentAtSameTime = newAvailPlusExistingAppointments
        .filter((o) => isAppointment(o))
        .find((o) => o.time === slot.time && o.day === slot.day);

      if (actualAppointmentAtSameTime) {
        console.log("repeated", slot);
        newAvailability[i] = actualAppointmentAtSameTime;
        pushedAppointmentsIds.push(actualAppointmentAtSameTime.id);
      }
    }

    // push remaining appointments
    const remainingAppointments = props.appointments.filter(
      (ap) => !pushedAppointmentsIds.includes(ap.id)
    );

    // combine them
    const newAvailabilityWithPrevAppointments = [...newAvailability, ...remainingAppointments];

    // parse appointments into availabilities
    const parsedNewAvailability = newAvailabilityWithPrevAppointments.map((d) => ({
      day: d.day,
      time: d.time,
      status: isAppointment(d) ? "0" : "1",
    }));

    console.log({
      newAvailPlusExistingAppointments,
      availabilityRanges,
      mergedAvailability,
      newAvailability,
      remainingAppointments,
      currAvailability: props.availability,
      currAppointments: props.appointments,
      newAvailabilityWithPrevAppointments,
      parsedNewAvailability,
    });

    return parsedNewAvailability;
  }

  createEffect(() => {
    setCurrAvailability(mergeAvailabilityArrayIntoRanges(props.availability));
  });

  return (
    <div>
      <h5>Edit professional availability</h5>
      <form onSubmit={handleSubmitAvailabilityRanges} ref={addAvailabilityRangeFormRef}>
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
