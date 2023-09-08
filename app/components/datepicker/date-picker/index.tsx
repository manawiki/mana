import type { HTMLProps, PropsWithRef } from "react";
import React, { forwardRef, useCallback, useMemo, useState } from "react";

import dt from "date-and-time";

import { DateButton } from "./date-button";
import { Header } from "./header";
import {
   getDatesOfMonth,
   getDaysOfWeek,
   getMonthNumberFromName,
} from "./methods";
import type { WeekStartDay } from "./types";

export type DatePickerProps = {
   /**
    * This function is called when the selected date is changed.
    */
   onChange: (date: Date) => void;
   /**
    * The selected date.
    */
   value: Date;
   /**
    * The minimum date that can be selected (inclusive).
    * Default is 1st January 1900
    */
   minDate?: Date;
   /**
    * The maximum date that can be selected (inclusive).
    * Default is 100 years from now
    */
   maxDate?: Date;
   /**
    * Week starts from which day
    */
   weekStartsFrom?: WeekStartDay;
   /**
    * If the DatePicker is disabled
    */
   disabled?: boolean;
} & PropsWithRef<
   Omit<
      HTMLProps<HTMLInputElement>,
      | "onChange"
      | "selected"
      | "options"
      | "value"
      | "type"
      | "name"
      | "disabled"
   >
>;

/**
 * DatePicker component to pick dates
 */
const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
   (
      {
         onChange,
         value = new Date(),
         minDate,
         maxDate,
         weekStartsFrom = "Sunday",
         className,
         disabled = false,
         ...props
      },
      ref
   ) => {
      const minDateValue = useMemo(
         () => minDate?.valueOf() ?? new Date(1900, 0, 1).valueOf(),
         [minDate]
      );
      const maxDateValue = useMemo(
         () => maxDate?.valueOf() ?? dt.addYears(new Date(), 100).valueOf(),
         [maxDate]
      );

      // current month and year the user is viewing
      const [openedDate, setOpenedDate] = useState<Date>(value);

      const nextMonth = useCallback(
         () => setOpenedDate((d) => dt.addMonths(d, 1)),
         [setOpenedDate]
      );

      const prevMonth = useCallback(
         () => setOpenedDate((d) => dt.addMonths(d, -1)),
         [setOpenedDate]
      );

      const onMonthChange = useCallback(
         (month: string) => {
            setOpenedDate(
               (d) =>
                  new Date(
                     d.getFullYear(),
                     getMonthNumberFromName(month),
                     d.getDate()
                  )
            );
         },
         [setOpenedDate]
      );

      const onYearChange = useCallback(
         (year: number) => {
            setOpenedDate((d) => new Date(year, d.getMonth(), d.getDate()));
         },
         [setOpenedDate]
      );

      const handleClick = useCallback((d: Date) => onChange(d), [onChange]);

      const daysOfWeekElements = useMemo(
         () =>
            getDaysOfWeek(weekStartsFrom).map((v) => (
               <p
                  key={v}
                  className={`sdp--text ${
                     disabled ? "sdp--text__inactive" : ""
                  }`}
               >
                  {v}
               </p>
            )),
         [weekStartsFrom, disabled]
      );

      const daysOfMonthList = useMemo(
         () =>
            getDatesOfMonth(
               openedDate,
               minDateValue,
               maxDateValue,
               weekStartsFrom
            ),
         [openedDate, minDateValue, maxDateValue, weekStartsFrom]
      );

      return (
         <div
            className={`sdp ${className ?? ""} ${
               disabled ? "sdp--disabled" : ""
            }`}
            aria-label="Date Picker"
            tabIndex={disabled ? -1 : 0}
            ref={ref}
            {...props}
         >
            <Header
               month={openedDate.getMonth()}
               year={openedDate.getFullYear()}
               minDateValue={minDateValue}
               maxDateValue={maxDateValue}
               nextMonth={nextMonth}
               prevMonth={prevMonth}
               onYearChange={onYearChange}
               onMonthChange={onMonthChange}
               disabled={disabled}
            />
            <div className="sdp--grid">{daysOfWeekElements}</div>
            <div className="sdp--grid">
               {daysOfMonthList.map(({ date, active, ms }) => (
                  <DateButton
                     key={ms}
                     date={date}
                     active={active && !disabled}
                     selected={dt.isSameDay(value, date)}
                     onClick={handleClick}
                  />
               ))}
            </div>
         </div>
      );
   }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
