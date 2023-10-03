import React, { useCallback, useEffect, useRef } from "react";

type OptionProps<T> = {
   /**
    * If the option is currently selected.
    */
   selected: boolean;
   /**
    * The label to display for the option.
    */
   label: string;
   /**
    * The value of the option.
    */
   value: T;
   /**
    * A callback triggered when the option is clicked.
    */
   onClick: (v: T) => void;
   /**
    * If the option is disabled.
    */
   disabled: boolean;
};

/**
 * Custom Option component.
 */
function Option<T>({
   selected,
   value,
   label,
   onClick,
   disabled,
   ...props
}: OptionProps<T>): JSX.Element {
   const ref = useRef<HTMLButtonElement>(null);

   const handleClick = useCallback(() => {
      if (!disabled) {
         onClick(value);
      }
   }, [onClick, disabled, value]);

   useEffect(() => {
      if (selected) {
         ref.current?.focus();
      }

      return () => ref.current?.blur();
   }, [selected]);

   return (
      <button
         key={label}
         ref={ref}
         type="button"
         className={`sassy--option ${selected ? "sassy--option__active" : ""} ${
            disabled ? "sassy--option__disabled" : ""
         }`}
         onClick={handleClick}
         {...props}
      >
         {label}
      </button>
   );
}

export default Option;
