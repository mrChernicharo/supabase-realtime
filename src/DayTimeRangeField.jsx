import { dateToWeekday, weekdayToDate, WORKING_HOURS } from "./helpers";
import Button from "./Button";

export default function DayTimeRangeField(props) {
  let dayRef, startRef, endRef;
  // console.log({ props, v: dateToWeekday(+props.slot.day) });
  function bubbleUpValue() {
    const newSlot = {
      day: weekdayToDate(dayRef.value).toString(),
      start: startRef.value,
      end: endRef.value,
    };
    props.onChange(newSlot);
  }

  return (
    <div>
      <select ref={dayRef} value={dateToWeekday(+props.slot.day)} onChange={bubbleUpValue}>
        <For each={[0, 1, 2, 3, 4, 5, 6]}>{(day) => <option>{dateToWeekday(day)}</option>}</For>
      </select>

      <select ref={startRef} value={props.slot.start} onChange={bubbleUpValue}>
        <For each={WORKING_HOURS}>{(hour) => <option>{hour}</option>}</For>
      </select>

      <select ref={endRef} value={props.slot.end} onChange={bubbleUpValue}>
        <For each={WORKING_HOURS}>{(hour) => <option>{hour}</option>}</For>
      </select>

      <Button kind="trash" onClick={(e) => props.onDelete(props.slot)} />
    </div>
  );
}
