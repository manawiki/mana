import React, { useMemo } from "react";

import type { OptionType } from "../components/select";
import CustomSelect from "../components/select";

export type MonthPickerProps = {
   value: string;
   onChange: (year: string) => void;
   disabled: boolean;
};

const months = [
   "January",
   "February",
   "March",
   "April",
   "May",
   "June",
   "July",
   "August",
   "September",
   "October",
   "November",
   "December",
];

const MonthPicker: React.FC<MonthPickerProps> = ({
   value,
   onChange,
   disabled,
}) => {
   const options = useMemo(
      () =>
         months.map(
            (m) =>
               ({
                  value: m,
                  label: m,
                  disabled: false,
               } as OptionType<string>)
         ),
      []
   );

   return (
      <CustomSelect
         className="sdp--select__month"
         value={value}
         onChange={onChange}
         options={options}
         disabled={disabled}
      />
   );
};

export default MonthPicker;
