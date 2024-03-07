import dt from "date-and-time";

import type { DisplayDate, WeekStartDay } from "./types";

enum DAYS {
   "Sunday" = 0,
   "Monday" = 1,
   "Tuesday" = 2,
   "Wednesday" = 3,
   "Thursday" = 4,
   "Friday" = 5,
   "Saturday" = 6,
}

export enum MONTHS {
   "January" = 0,
   "February" = 1,
   "March" = 2,
   "April" = 3,
   "May" = 4,
   "June" = 5,
   "July" = 6,
   "August" = 7,
   "September" = 8,
   "October" = 9,
   "November" = 10,
   "December" = 11,
}

export const getMonthNameFromNumber = (month: number): string => {
   if (month < 0 || month > 11) {
      throw new Error(`Invalid month number: ${month}`);
   }
   return MONTHS[month]!;
};

export const getMonthNumberFromName = (month: string): number => {
   switch (month) {
      case "January":
         return 0;
      case "February":
         return 1;
      case "March":
         return 2;
      case "April":
         return 3;
      case "May":
         return 4;
      case "June":
         return 5;
      case "July":
         return 6;
      case "August":
         return 7;
      case "September":
         return 8;
      case "October":
         return 9;
      case "November":
         return 10;
      case "December":
         return 11;
      default:
         throw new Error(`Invalid month name: ${month}`);
   }
};

export const getDayFromNumber = (
   day: number,
   weekStartsFrom: WeekStartDay,
): string => {
   if (day < 0 || day > 6) {
      throw new Error(`Invalid month number: ${day}`);
   }
   switch (weekStartsFrom) {
      case "Monday":
         return DAYS[(day + 1) % 7]!;
      case "Sunday":
         return DAYS[day]!;
      default:
         throw new Error(`Invalid week start day: ${weekStartsFrom}`);
   }
};

export const getDaysOfWeek = (weekStartsFrom: WeekStartDay) => {
   if (weekStartsFrom === "Monday") {
      return ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
   }
   return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
};

const getMidnight = (n: number): number => {
   const d = new Date(n);
   d.setHours(0, 0, 0, 0);
   return d.valueOf();
};

export const getDatesOfMonth = (
   date: Date,
   minDateValue: number,
   maxDateValue: number,
   weekStartsFrom: WeekStartDay,
): DisplayDate[] => {
   const currentYear = date.getFullYear();
   const currentMonth = date.getMonth();
   const minDate = getMidnight(minDateValue);
   const maxDate = getMidnight(maxDateValue);

   // generate dates of each week of the month including the residue dates
   // of the last week of previous month and first week of next month
   const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
   const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

   // first day of the pervious month
   // const previousMonth = dt.addMonths(firstDayOfMonth, -1);
   // last day of the pervious month
   const previousMonthLastDay = dt.addDays(firstDayOfMonth, -1);

   const dates: DisplayDate[] = [];

   // the number of the weekday of the first day of the month
   const firstWeekDayOfMonth = firstDayOfMonth.getDay();
   // the number of the weekday of the last day of the month
   const lastWeekDayOfMonth = lastDayOfMonth.getDay();

   if (weekStartsFrom === "Sunday") {
      // insert the residual dates of previous month's last week
      for (let i = 1; i <= firstWeekDayOfMonth; i++) {
         const d = dt.addDays(previousMonthLastDay, i - firstWeekDayOfMonth);
         dates.push({
            date: d,
            active: false,
            ms: d.valueOf(),
         });
      }

      const fullYear = date.getFullYear();
      const fullMonth = date.getMonth();
      // insert the dates of the current month
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
         const d = new Date(fullYear, fullMonth, i);
         const dValue = d.valueOf();
         // compare day of month
         dates.push({
            date: d,
            active: dValue >= minDate && dValue <= maxDate,
            ms: dValue,
         });
      }

      let i = lastWeekDayOfMonth + 1;
      let counter = 1;
      // insert the residual dates of the next month
      while (i <= 6) {
         const d = dt.addDays(lastDayOfMonth, counter++);
         dates.push({
            date: d,
            active: false,
            ms: d.valueOf(),
         });
         i++;
      }
   } else {
      // insert the residual dates of previous month's last week
      for (let i = 1; i < firstWeekDayOfMonth; i++) {
         const d = dt.addDays(
            previousMonthLastDay,
            i - firstWeekDayOfMonth + 1,
         );
         dates.push({
            date: d,
            active: false,
            ms: d.valueOf(),
         });
      }

      const fullYear = date.getFullYear();
      const fullMonth = date.getMonth();
      // insert the dates of the current month
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
         const d = new Date(fullYear, fullMonth, i);
         const dValue = d.valueOf();
         // compare day of month
         dates.push({
            date: d,
            active: dValue >= minDate && dValue <= maxDate,
            ms: dValue,
         });
      }

      let i = lastWeekDayOfMonth;
      let counter = 1;
      // insert the residual dates of the next month
      while (i <= 6) {
         const d = dt.addDays(lastDayOfMonth, counter++);
         dates.push({
            date: d,
            active: false,
            ms: d.valueOf(),
         });
         i++;
      }
   }

   return dates;
};
