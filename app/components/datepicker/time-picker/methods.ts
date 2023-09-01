import { OptionType } from './../components/select';
import { Time, Meridiem, TimeDisplay, DisplayFormat } from './types';

const option = (n: number) => ({
  value: n,
  label: n.toString().padStart(2, '0'),
  disabled: false,
});

/**
 * Creates a time value aligned with the minutes interval from am raw time input
 *
 * @param {Time} time The time value
 * @param {number} interval The interval between each minute select option
 * @returns {Time} Time value rounded to the nearest interval
 */
export const alignTime = (
  { hours, minutes }: Time,
  interval: number,
  lower: boolean = true
): Time => {
  const rem = minutes % interval;
  // round minutes to nearest interval
  if (rem !== 0) {
    minutes = lower ? minutes - rem : minutes + interval - rem;
  }
  return {
    hours,
    minutes,
  };
};

/**
 * Convert Time to a 12hr TimeDisplay format
 *
 * @param selectedTime
 */
export const timeToTimeDisplay = (selectedTime: Time): TimeDisplay => {
  let hours;
  let meridiem = Meridiem.AM;
  if (selectedTime.hours === 0) {
    hours = 12;
  } else if (selectedTime.hours === 12) {
    hours = 12;
    meridiem = Meridiem.PM;
  } else if (selectedTime.hours > 12) {
    hours = selectedTime.hours - 12;
    meridiem = Meridiem.PM;
  } else {
    hours = selectedTime.hours;
  }

  return {
    hours,
    minutes: selectedTime.minutes,
    meridiem,
  };
};

export const generateHourOptions = (
  timeFormat: DisplayFormat
): OptionType<number>[] => {
  if (timeFormat === '12hr') {
    const listOfOptions: OptionType<number>[] = new Array(12);
    listOfOptions[0] = option(12);
    for (let i = 1; i <= 11; i += 1) {
      listOfOptions[i] = option(i);
    }
    return listOfOptions;
  }
  const listOfOptions: OptionType<number>[] = new Array(24);
  for (let i = 0; i <= 23; i += 1) {
    listOfOptions[i] = option(i);
  }
  return listOfOptions;
};

export const generateMinuteOptions = (
  minutesInterval: number
): OptionType<number>[] => {
  let options: OptionType<number>[] = [];
  for (let i = 0; i < 60; i += minutesInterval) {
    options.push(option(i));
  }
  return options;
};

/**
 * Convert a value from 12 hour time format to 24 hour format
 *
 * @param hour hour to convert
 * @param meridiem am or pm
 */
export const convertHourFrom12HrTo24Hr = (
  hour: number,
  meridiem: Meridiem
): number => {
  if (hour === 12) {
    return meridiem === Meridiem.AM ? 0 : 12;
  } else if (meridiem === Meridiem.PM) {
    return hour + 12;
  } else {
    return hour;
  }
};
