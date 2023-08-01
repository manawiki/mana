import { type ReactElement, type ReactNode, lazy } from "react";
import { type PlacesType, Tooltip as TT } from "react-tooltip";
import { lazily } from "react-lazily";
const ReactDOMServer = lazily(() => import("react-dom/server"));

type TooltipProps = {
   id: string;
   html?: any;
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
            className={className}
            data-tooltip-id={id}
            data-tooltip-html={
               html ? ReactDOMServer.renderToStaticMarkup(html) : null
            }
            data-tooltip-content={content}
            data-tooltip-place={side}
         >
            {children}
         </div>
      </>
   );
}
