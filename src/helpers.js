import { ALL_TIMES } from "./constants";

export const dateToWeekday = (n) => {
  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return weekdays[n];
};
export const weekdayToDate = (weekday) => {
  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].findIndex(
    (day) => day === weekday
  );
};

export const timeStrToMinutes = (timeStr) => {
  const [hours, mins] = timeStr.split(":");

  const totalMinutes = +hours * 60 + +mins;
  // console.log({ timeStr, hours, mins, totalMinutes });
  return totalMinutes;
};
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

export const mergeAvailabilityArrayIntoRanges = (slots) => {
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

export const sliceSuperposeRanges = (messyDayRanges) => {
  if (!messyDayRanges[0].day) return [];

  // range: { day: 'tuesday', start: '10:00', end: '16:00' }
  const messyNumericRanges = messyDayRanges.map((r) => ({
    day: r.day,
    start: timeStrToMinutes(r.start),
    end: timeStrToMinutes(r.end),
    // status: r.status
  }));

  const set = new Set();

  for (let range of messyNumericRanges) {
    let s = range.start;
    let e = range.end - 30;

    while (s <= e) {
      // console.log(range, s);
      set.add(s);
      s += 30;
    }
  }

  const slicedTimes = Array.from(set);
  return [...slicedTimes.map(timeMinutesToStr).sort()];
};

export const parseAvailabilityRangesIntoArray = (ranges) => {
  const rangesByDay = {};
  ranges.forEach((range) => {
    if (!(range.day in rangesByDay)) rangesByDay[range.day] = [];
    rangesByDay[range.day].push(range);
  });

  const cleanArr = [];
  Object.keys(rangesByDay).forEach((weekday) => {
    const stringDayAvails = sliceSuperposeRanges(rangesByDay[weekday]);

    cleanArr.push(
      ...stringDayAvails.map((time) => ({
        day: weekdayToDate(weekday).toString(),
        time,
        status: "1",
      }))
    );
  });

  return cleanArr;
};

export const getProfessionalById = (id, professionals) => professionals.find((p) => p.id === id);
export const findProfessionalIndexById = (id, professionals) =>
  professionals.findIndex((p) => p.id === id);

export const getCustomerById = (id, customers) => customers.find((p) => p.id === id);
export const findCustomerIndexById = (id, customers) => customers.findIndex((p) => p.id === id);

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
