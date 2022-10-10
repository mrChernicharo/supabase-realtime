import { ALL_TIMES } from "./constants";

export const dateToWeekday = (n) => {
  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return weekdays[n];
};
export const weekdayToDate = (weekday) => {
  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(
    weekday
  );
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

const getOverlapTypes = (a, b) => {
  let overlapTypes = [];
  // start overlap
  if (a.start <= b.start && a.start <= b.end && a.end >= b.start && a.end <= b.end)
    overlapTypes.push("start");
  // fit inside
  if (a.start >= b.start && a.start <= b.end && a.end >= b.start && a.end <= b.end) {
    overlapTypes.push("fit");
  }
  // end overlap
  if (a.start >= b.start && a.start <= b.end && a.end >= b.start && a.end >= b.end)
    overlapTypes.push("end");
  // encompass
  if (a.start <= b.start && a.start <= b.end && a.end >= b.start && a.end >= b.end) {
    overlapTypes.push("encompass");
  }

  return overlapTypes;
};

export const superposeRanges = (messyDayRanges) => {
  if (!messyDayRanges[0].day) return [];
  console.log("superposeRanges=================", messyDayRanges[0].day.toUpperCase(), {
    messyDayRanges,
  });
  // range: { day: 'tuesday', start: '10:00', end: '16:00' }
  // array of ranges. merge slots to clean the superposing

  const messyNumericRanges = messyDayRanges.map((r) => ({
    day: weekdayToDate(r.day),
    start: timeStrToMinutes(r.start),
    end: timeStrToMinutes(r.end),
  }));

  const mergedNumRanges = [messyNumericRanges[0]];

  for (let i = 1; i < messyNumericRanges.length; i++) {
    let overlap = false;

    for (let j = 0; j < mergedNumRanges.length; j++) {
      console.log(i, j);
      // console.log("overlap?", i, j, getOverlapTypes(messyNumericRanges[i], mergedNumRanges[j]));
      // they overlap?
      //    merge, return
      if (getOverlapTypes(messyNumericRanges[i], mergedNumRanges[j]).length) {
        overlap = true;

        console.log("overlap!!!!!!!", getOverlapTypes(messyNumericRanges[i], mergedNumRanges[j]));
        if (getOverlapTypes(messyNumericRanges[i], mergedNumRanges[j]) === "start") {
          mergedNumRanges[j].start = messyNumericRanges[i].start;
          break;
        }
        if (getOverlapTypes(messyNumericRanges[i], mergedNumRanges[j]) === "end") {
          mergedNumRanges[j].end = messyNumericRanges[i].end;

          break;
        }
        if (getOverlapTypes(messyNumericRanges[i], mergedNumRanges[j]) === "encompass") {
          mergedNumRanges[j].start = messyNumericRanges[i].start;
          mergedNumRanges[j].end = messyNumericRanges[i].end;
          break;
        }
      }
    }

    // no overlap?
    //    push
    if (!overlap) {
      mergedNumRanges.push(messyNumericRanges[i]);
    }
  }

  // numericRanges.forEach((nRange, ri) => {
  //   numericRanges.forEach((r, i) => {
  //     console.log(ri, i);
  //     if (ri === 0) {
  //       mergedNumRanges.push(nRange);
  //       return;
  //     } else {
  //       if (nRange.start === r.start && nRange.end === r.end) {
  //         console.log("same", ri, i);
  //         // mergedNumRanges.push(r);
  //         return;
  //       }
  //       if (getOverlapTypes(nRange, r).length) {
  //         console.log("overlap!!", ri, i);
  //         console.log(ri, i, { nRange, r, overlap: getOverlapTypes(nRange, r) });
  //       } else {
  //         console.log("nothing", ri, i);
  //       }
  //     }
  //   });

  //   // console.log({ nRange });
  // });

  console.log({ messyDayRanges, mergedNumRanges, messyNumericRanges });
  return mergedNumRanges;
};

export const sliceRangesIntoAvailabilities = (ranges) => {
  const rangesToSlice = ranges;
  console.log({ rangesToSlice });
  return rangesToSlice;
};

export const parseAvailabilityRangesIntoArray = (ranges) => {
  const rangesByDay = {};
  ranges.forEach((range) => {
    if (!(range.day in rangesByDay)) rangesByDay[range.day] = [];
    rangesByDay[range.day].push(range);
  });

  const availabilities = [];
  Object.keys(rangesByDay).forEach((weekday) => {
    const superposedNumericRanges = superposeRanges(rangesByDay[weekday]);
    const dbReadySlicedAvailabilities = sliceRangesIntoAvailabilities(superposedNumericRanges);
    dbReadySlicedAvailabilities.forEach((av) => availabilities.push(av));
  });

  // const numericRanges = ranges.map((r) => ({
  //   day: weekdayToDate(r.day),
  //   start: timeStrToMinutes(r.start),
  //   end: timeStrToMinutes(r.end),
  // }));
  console.log({ ranges, /** numericRanges,*/ availabilities, rangesByDay });
  return ranges;
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
