import { useState } from "react";

import { Icon } from "~/components/Icon";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";

import { copyToClipBoard } from "../utils/copyToClipBoard";

export function Record({
   value,
   name,
   type,
}: {
   value: string | undefined;
   name?: Boolean;
   type?: "A" | "CNAME";
}) {
   const [recordValue] = useState(value ?? "");

   const [copySuccess, setCopySuccess] = useState(
      <Icon name="copy" size={14} />,
   );
   return (
      <div className="w-full truncate">
         <div className="text-sm pb-1.5 font-semibold">
            Record {name ? "Name" : "Value"}
         </div>
         <div
            className="border dark:border-zinc-600/40 rounded-lg flex items-center 
         dark:bg-dark350 overflow-hidden h-10 w-full shadow-sm dark:shadow-zinc-800/50"
         >
            {name ? (
               <span
                  className="flex items-center justify-center flex-none h-10 px-3 bg-zinc-50
            text-center font-semibold text-sm border-r dark:border-zinc-600/40 dark:bg-dark400"
               >
                  {type}
               </span>
            ) : undefined}
            <span className="flex-grow px-3 text-1 truncate">
               {recordValue}
            </span>
            <Tooltip>
               <TooltipTrigger
                  type="button"
                  onClick={() => copyToClipBoard(recordValue, setCopySuccess)}
                  className="group w-10 h-10 flex items-center justify-center"
               >
                  {copySuccess}
               </TooltipTrigger>
               <TooltipContent>Copy</TooltipContent>
            </Tooltip>
         </div>
      </div>
   );
}
