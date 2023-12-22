import type { HTMLProps, PropsWithRef } from "react";
import React, {
   forwardRef,
   useCallback,
   useEffect,
   useMemo,
   useState,
} from "react";

import { useIsMount } from "~/utils";

import {
   alignTime,
   generateHourOptions,
   generateMinuteOptions,
   convertHourFrom12HrTo24Hr,
} from "./methods";
import type { DisplayFormat, Time } from "./types";
import { Meridiem } from "./types";
import type { OptionType } from "../components/select";
import CustomSelect from "../components/select";

/**
 * Props for TimePicker React Component
 */
export type TimePickerProps = {
   /**
    * This function is called when the selected date is changed.
    */
   onChange: (time: Time) => void;
   /**
    * The selected date.
    */
   value: Time;
   /**
    * If the TimePicker is disabled
    */
   disabled?: boolean;
   /**
    * Which time format to use
    */
   displayFormat?: DisplayFormat;
   /**
    * The number of minutes between each minute select option - default is 30
    */
   minutesInterval?: number;
} & PropsWithRef<
   Omit<
      HTMLProps<HTMLInputElement>,
      "onChange" | "selected" | "options" | "value" | "disabled"
   >
>;

const meridiemOptions: OptionType<Meridiem>[] = [
   { value: Meridiem.AM, label: Meridiem.AM, disabled: false },
   { value: Meridiem.PM, label: Meridiem.PM, disabled: false },
];

const formatNumber = (v: number) => v.toString().padStart(2, "0");

/**
 * TimePicker React Component
 */
const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
   (
      {
         onChange,
         value,
         className,
         disabled,
         displayFormat = "12hr",
         minutesInterval = 5,
         ...props
      },
      ref,
   ) => {
      const isMount = useIsMount();

      if (
         typeof minutesInterval !== "number" &&
         minutesInterval < 1 &&
         Number.isInteger(minutesInterval)
      ) {
         throw new Error("minutesInterval must be an integer greater than 0");
      }

      const [selectedTime, setSelectedTime] = useState(() => {
         if (value !== undefined) return alignTime(value, minutesInterval);
         const d = new Date();
         return alignTime(
            { minutes: d.getMinutes(), hours: d.getHours() },
            minutesInterval,
         );
      });

      const [currentMeridiem, setCurrentMeridiem] = useState<Meridiem>(() =>
         selectedTime.hours <= 11 ? Meridiem.AM : Meridiem.PM,
      );

      const handleMinutesChange = useCallback(
         (v: number) => {
            setSelectedTime((t) => {
               return alignTime({ ...t, minutes: v }, minutesInterval);
            });
         },
         [minutesInterval],
      );

      const handleHoursChange = useCallback(
         (v: number) => {
            setSelectedTime((t) => {
               let hours = v;
               if (displayFormat === "12hr") {
                  hours = convertHourFrom12HrTo24Hr(hours, currentMeridiem);
               }
               return alignTime({ ...t, hours }, minutesInterval);
            });
         },
         [minutesInterval, currentMeridiem, displayFormat],
      );

      const handleMeridiemChange = useCallback((v: Meridiem) => {
         setCurrentMeridiem(v);
         setSelectedTime((t) => {
            if (v === Meridiem.AM) {
               return {
                  minutes: t.minutes,
                  hours: t.hours - 12,
               };
            }
            return {
               minutes: t.minutes,
               hours: t.hours + 12,
            };
         });
      }, []);

      // the array of options of minutes to select from
      const minuteOptions = useMemo(
         () => generateMinuteOptions(minutesInterval),
         [minutesInterval],
      );

      // the array of options of hours to select from
      const hourOptions = useMemo(
         () => generateHourOptions(displayFormat),
         [displayFormat],
      );

      //
      const currentHourDisplayValue = useMemo(() => {
         if (displayFormat === "24hr") return selectedTime.hours;
         const h =
            currentMeridiem === Meridiem.AM
               ? selectedTime.hours
               : selectedTime.hours - 12;
         if (h === 0) return 12;
         return h;
      }, [selectedTime.hours, displayFormat, currentMeridiem]);

      useEffect(() => {
         //Only update state after initial mount
         if (!isMount) {
            onChange(selectedTime);
         }
      }, [selectedTime]);

      useEffect(() => {
         setSelectedTime(alignTime(selectedTime, minutesInterval));
      }, [minutesInterval]);

      return (
         <div
            className={`stp ${className ?? ""} ${
               disabled ? "stp--disabled" : ""
            }`}
            {...props}
            ref={ref}
         >
            <CustomSelect
               disabled={disabled}
               value={currentHourDisplayValue}
               onChange={handleHoursChange}
               options={hourOptions}
               formatValue={formatNumber}
            />
            <span
               className={`text-1 mt-1 inline-flex flex-col items-center justify-center gap-0.5 ${
                  disabled ? "stp--divider__disabled" : ""
               }`}
            >
               <span className="block h-0.5 w-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
               <span className="block h-0.5 w-0.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            </span>
            <CustomSelect
               disabled={disabled}
               value={selectedTime.minutes}
               onChange={handleMinutesChange}
               options={minuteOptions}
               formatValue={formatNumber}
            />
            {displayFormat === "12hr" && (
               <CustomSelect
                  disabled={disabled}
                  value={currentMeridiem}
                  onChange={handleMeridiemChange}
                  options={meridiemOptions}
               />
            )}
         </div>
      );
   },
);

TimePicker.displayName = "TimePicker";

export default TimePicker;
