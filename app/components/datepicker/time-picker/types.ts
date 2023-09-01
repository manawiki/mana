/**
 * Time type
 */
export type Time = {
  hours: number;
  minutes: number;
};

/**
 * Time display type
 */
export type TimeDisplay = {
  hours: number;
  minutes: number;
  meridiem?: Meridiem;
};

export type DisplayFormat = '12hr' | '24hr';

export enum Meridiem {
  AM = 'AM',
  PM = 'PM',
}
