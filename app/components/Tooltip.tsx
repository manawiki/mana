import type { ReactElement, ReactNode } from "react";

import { type PlacesType, Tooltip as TT } from "react-tooltip";

type TooltipProps = {
   id: string;
   html?: any; //Needs to be actual html string, not jsx; ie class= instead of className=, ${variable} instead of {variable} etc;
   className?: string;
   children: ReactElement;
   content?: ReactNode;
   side?: PlacesType;
};

export default function Tooltip({
   id,
   className,
   children,
   content,
   html,
   side = "top",
   ...props
}: TooltipProps) {
   return (
      <>
         <TT className="rounded px-3 text-xs font-semibold" id={id} />
         <div
            {...props}
            className={className}
            data-tooltip-id={id}
            data-tooltip-html={html}
            data-tooltip-content={content}
            data-tooltip-place={side}
         >
            {children}
         </div>
      </>
   );
}
