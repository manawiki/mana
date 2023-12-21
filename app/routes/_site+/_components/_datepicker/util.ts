import type { Time } from "./time-picker/types";

export const getCurrentTime = (): Time => convertDateToTime(new Date());

export const convertDateToTime = (d: Date): Time => ({
   hours: d.getHours(),
   minutes: d.getMinutes(),
});

export const convertTimeToDate = (t: Time, d?: Date): Date => {
   const newDate = d ? new Date(d.valueOf()) : new Date();
   newDate.setHours(t.hours);
   newDate.setMinutes(t.minutes);
   return newDate;
};
