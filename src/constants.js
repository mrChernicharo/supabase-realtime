import { timeMinutesToStr, timeStrToMinutes } from "./helpers";

export const INITIAL_STORE = {
  professionals: [],
  customers: [],
  staff: [],
};
export const DEFAULT_CUSTOMER_AVAILABILITY = [
  { customer_id: "", day: 1, time: "15:00" },
  { customer_id: "", day: 2, time: "10:30" },
  { customer_id: "", day: 3, time: "14:30" },
  { customer_id: "", day: 3, time: "15:00" },
  { customer_id: "", day: 5, time: "09:30" },
];

export const DEFAULT_PROFESSIONAL_AVAILABILITY = [
  { professional_id: "", day: 1, time: "09:30" },
  { professional_id: "", day: 1, time: "10:00" },
  { professional_id: "", day: 1, time: "10:30" },
  { professional_id: "", day: 1, time: "11:00" },
  { professional_id: "", day: 1, time: "11:30" },
  { professional_id: "", day: 1, time: "14:00" },
  { professional_id: "", day: 1, time: "14:30" },
  { professional_id: "", day: 3, time: "10:00" },
  { professional_id: "", day: 3, time: "10:30" },
  { professional_id: "", day: 3, time: "11:00" },
  { professional_id: "", day: 3, time: "15:00" },
  { professional_id: "", day: 3, time: "15:30" },
];

// prettier-ignore
export const ALL_TIMES = ['00:00', '00:30',
 '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
 '04:00', '04:30', '05:00', '05:30',  '06:00', '06:30',
 '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
 '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
 '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
 '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
 '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
 '22:00', '22:30', '23:00', '23:30'];

export const DEFAULT_SLOT = { day: "monday", start: "10:00", end: "16:00" };
