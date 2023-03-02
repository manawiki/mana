import { useState } from "react";

export function FormLabel(props: {
   text: string;
   htmlFor?: any;
   error?: any;
   tooltipId?: string;
   tooltipContent?: string;
}) {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <label
         className="text-xs pb-1 flex items-center gap-1"
         htmlFor={props.htmlFor}
      >
         <div className="font-bold uppercase">{props.text}</div>
         {props.error ? (
            <div className="flex items-center gap-1">
               <span>-</span>
               <span className="text-red-400 font-semibold">{props.error}</span>
            </div>
         ) : null}
      </label>
   );
}
