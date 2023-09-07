import React, { useMemo } from "react";

import type { OptionType } from "../components/select";
import CustomSelect from "../components/select";

export type YearPickerProps = {
   fromYear: number;
   toYear: number;
   value: number;
   onChange: (year: number) => void;
   disabled: boolean;
};

function* generateRange(from: number, to: number, step: number) {
   for (let i = from; i <= to; i += step) {
      yield i;
   }
}

const YearPicker: React.FC<YearPickerProps> = ({
   fromYear,
   toYear,
   value,
   onChange,
   disabled,
}) => {
   const options = useMemo(
      () =>
         Array.from(generateRange(fromYear, toYear, 1)).map(
            (v) =>
               ({
                  value: v,
                  label: v.toString(),
                  disabled: false,
               } as OptionType<number>)
         ),
      [fromYear, toYear]
   );

   return (
      <CustomSelect
         value={value}
         onChange={onChange}
         options={options}
         disabled={disabled}
      />
   );
};

export default YearPicker;
