import { useFetcher } from "@remix-run/react";
import type { Site } from "payload/generated-types";
import { useState, useEffect } from "react";
import { DotLoader } from "~/components";
import { useStorage } from "~/liveblocks.config";
import { isAdding, isProcessing } from "~/utils";
import { Tooltip } from "../../modules/editor/components";

export const HomeEdit = ({ site }: { site: Site }) => {
   const fetcher = useFetcher();
   const isUpdating = isAdding(fetcher, "update");
   const disabled = isProcessing(fetcher.state);

   const [isChanged, setChanged] = useState(false);

   const blocks = useStorage((root) => root.blocks);

   //Toggle state for publish button
   useEffect(() => {
      if (blocks == null) {
         return;
      }
      const isDiffBlocks =
         JSON.stringify(blocks) === JSON.stringify(site.content);

      if (isDiffBlocks == false) {
         return setChanged(true);
      }
      return setChanged(false);
   }, [blocks, site]);

   return (
      <div className="relative">
         {isUpdating ? (
            <div className="border-color bg-2 mb-6 flex h-9 w-24 items-center justify-center rounded-full border-2">
               <DotLoader />
            </div>
         ) : isChanged == true ? (
            <fetcher.Form method="post" className="relative mb-6 h-9 w-24">
               <Tooltip
                  id="save-home-changes"
                  side="right"
                  content="Save Changes"
               >
                  <button
                     disabled={disabled}
                     type="submit"
                     name="intent"
                     value="update"
                  >
                     <div
                        className="shadow-1 group inline-flex h-9 w-24 items-center justify-center rounded-full bg-blue-500 
                              text-sm font-bold text-white shadow-sm transition hover:bg-blue-600 dark:hover:bg-blue-400"
                     >
                        Update
                        <svg
                           className="-mr-1 ml-2 mt-0.5 stroke-white stroke-2"
                           fill="none"
                           width="12"
                           height="12"
                           viewBox="0 0 12 12"
                           aria-hidden="true"
                        >
                           <path
                              className="opacity-0 transition group-hover:opacity-100"
                              d="M0 5h7"
                           ></path>
                           <path
                              className="transition group-hover:translate-x-[3px]"
                              d="M1 1l4 4-4 4"
                           ></path>
                        </svg>
                     </div>
                  </button>
               </Tooltip>
            </fetcher.Form>
         ) : null}
      </div>
   );
};
