import { ALL_TIMES } from "./constants";
export const parseWeekday = (n) => {
  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return weekdays[n];
};

export const timeStrToMinutes = (timeStr) => +timeStr.split(":")[0] * 60 + +timeStr.split(":")[1];
export const timeMinutesToStr = (minutes) =>
  `${parseInt(minutes / 60) < 10 ? `0${parseInt(minutes / 60)}` : parseInt(minutes / 60)}:${
    minutes % 60 > 0 ? minutes % 60 : `${minutes % 60}0`
  }`;

export const getWorkingHours = ({ min, max }) => {
  const allTimesInMinutes = ALL_TIMES.map(timeStrToMinutes);
  return allTimesInMinutes
    .filter((t) => t >= timeStrToMinutes(min) && t <= timeStrToMinutes(max))
    .map(timeMinutesToStr);
};

export const mergeAvailability = (slots) => {
  const slotsByDay = {};
  slots.forEach((slot) => {
    if (!(slot.day in slotsByDay)) slotsByDay[slot.day] = [];
    slotsByDay[slot.day].push(slot);
  });

  const res = {};

  Object.keys(slotsByDay).forEach((day) => {
    const mergedSlots = [];

    slotsByDay[day].forEach((slot, i) => {
      const currSlot = {
        day,
        start: timeStrToMinutes(slot.time),
        end: timeStrToMinutes(slot.time) + 30,
      };

      if (i === 0) {
        mergedSlots.push(currSlot);
      } else {
        const prevSlot = mergedSlots.at(-1);

        console.log({ currSlot, prevSlot });

        if (currSlot.start === prevSlot.end) {
          const mergedSlot = { ...prevSlot, end: currSlot.end };
          console.log("merge", { slot, prevSlot, mergedSlot });
          mergedSlots[mergedSlots.length - 1] = mergedSlot;

          // mergedSlots.at(-1) = { ...prevSlot, end: currSlot.end };
        } else {
          mergedSlots.push({
            day,
            start: timeStrToMinutes(slot.time),
            end: timeStrToMinutes(slot.time) + 30,
          });
        }
      }
    });

    res[day] = mergedSlots;
  });

  console.log("mergeAvailability", { slots, slotsByDay, res });
  // [
  //   {
  //     "id": "c7dd0e2c-a8ce-4d5e-8854-ba14fb0f9629",
  //     "day": "1",
  //     "time": "14:00",
  //     "status": "1"
  //   },
  //   {
  //     "id": "cc5b57e0-9f09-4d08-8c1b-04e115c18931",
  //     "day": "1",
  //     "time": "14:30",
  //     "status": "1"
  //   },
  // ]

  /**
   *
   * [{day, start, end}, {day, start, end}]
   *
   */

  return slots;
};
