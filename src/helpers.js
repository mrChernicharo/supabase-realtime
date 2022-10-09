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

export const getMergedAvailability = (slots) => {
  const slotsByDay = {};
  slots.forEach((slot) => {
    if (!(slot.day in slotsByDay)) slotsByDay[slot.day] = [];
    slotsByDay[slot.day].push(slot);
  });

  let res = [];

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

        if (currSlot.start === prevSlot.end) {
          const mergedSlot = { ...prevSlot, end: currSlot.end };
          mergedSlots[mergedSlots.length - 1] = mergedSlot;
        } else {
          mergedSlots.push({
            day,
            start: timeStrToMinutes(slot.time),
            end: timeStrToMinutes(slot.time) + 30,
          });
        }
      }
    });

    res = [
      ...res,
      ...mergedSlots.map((o) => ({
        ...o,
        start: timeMinutesToStr(o.start),
        end: timeMinutesToStr(o.end),
      })),
    ];
  });

  return res;
};

export const getProfessionalById = (id, professionals) => professionals.find((p) => p.id === id);

export const getDiffFromNextSameWeekday = (weekday) => {
  const futureWeekday = weekday;
  const todayWeekday = new Date().getDay();
  let dayDiff;

  if (futureWeekday > todayWeekday) {
    // same week
    dayDiff = futureWeekday - todayWeekday;
  } else {
    // next week
    dayDiff = futureWeekday + 7 - todayWeekday;
  }
  return dayDiff;
};
