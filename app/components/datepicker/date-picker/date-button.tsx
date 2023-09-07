import React, { memo, useCallback, useMemo } from "react";

import dt from "date-and-time";

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

const DateButton: React.FC<DateButtonProps> = ({
   date,
   active,
   onClick,
   selected,
}) => {
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
};

// take care of onClick
export default memo(
   DateButton,
   (p, n) =>
      dt.isSameDay(p.date, n.date) &&
      p.active === n.active &&
      p.selected === n.selected
);
