import type { ReactElement, ReactNode } from "react";
import { type PlacesType, Tooltip as TT } from "react-tooltip";

type TooltipProps = {
   id: string;
   children: ReactElement;
   content: ReactNode;
   side?: PlacesType;
};

export default function Tooltip({
   id,
   children,
   content,
   side = "top",
   ...props
}: TooltipProps) {
   return (
      <>
         <TT className="text-xs" id={id} />
         <div
            data-tooltip-id={id}
            data-tooltip-content={content}
            data-tooltip-place={side}
         >
            {children}
         </div>
      </>
   );
}
