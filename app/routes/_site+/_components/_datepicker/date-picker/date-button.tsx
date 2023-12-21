import React, { useCallback, useMemo } from "react";

type DateButtonProps = {
   date: Date;
   active: boolean;
   selected: boolean;
   onClick: (date: Date) => void;
};

const dateOptions: Intl.DateTimeFormatOptions = {
   weekday: "long",
   month: "long",
   day: "numeric",
   year: "numeric",
};

export function DateButton({
   date,
   active,
   onClick,
   selected,
}: DateButtonProps) {
   const handleClick = useCallback(() => {
      onClick(date);
   }, [onClick, date]);

   const dateAriaLabel = useMemo(
      () => date.toLocaleDateString("en-US", dateOptions),
      [date, dateOptions]
   );

   return (
      <button
         className={`sdp--square-btn sdp--date-btn ${
            selected ? "sdp--date-btn__selected" : ""
         } sdp--text ${!active ? "sdp--text__inactive" : ""}`}
         onClick={handleClick}
         tabIndex={active ? 0 : -1}
         aria-label={`${
            selected ? "Currently selected" : "Select"
         } ${dateAriaLabel}`}
         type="button"
      >
         {date.getDate()}
      </button>
   );
}
