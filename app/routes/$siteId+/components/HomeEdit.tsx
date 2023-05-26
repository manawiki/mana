import { Link, useFetcher } from "@remix-run/react";
import type { Site } from "payload/generated-types";
import { useState, useEffect } from "react";
import { DotLoader } from "~/components";
import { useStorage } from "~/liveblocks.config";
import { isAdding, isProcessing } from "~/utils";
import { Tooltip } from "../../../modules/editor/components";
import { Home, Loader2, Save } from "lucide-react";

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
      <div className="absolute -right-20 top-16">
         {isUpdating ? (
            <div
               className="shadow-1 inline-flex items-center justify-center rounded-lg border 
               border-blue-200/80 bg-gradient-to-b
               from-blue-50 to-blue-100 p-2 text-sm font-bold text-white shadow-sm transition
               dark:border-blue-900 dark:from-blue-950 dark:to-blue-950/80 
               dark:shadow-blue-950"
            >
               <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            </div>
         ) : isChanged == true ? (
            <fetcher.Form method="post">
               <Tooltip
                  id="save-home-changes"
                  side="top"
                  content="Save Changes"
               >
                  <button
                     disabled={disabled}
                     type="submit"
                     name="intent"
                     value="update"
                  >
                     <div
                        className="shadow-1 inline-flex items-center justify-center rounded-lg border 
                           border-blue-200/80 bg-gradient-to-b
                           from-blue-50 to-blue-100 p-2 text-sm font-bold text-white shadow-sm transition
                           dark:border-blue-900 dark:from-blue-950 dark:to-blue-950/80 
                           dark:shadow-blue-950"
                     >
                        <Save
                           className="text-blue-400 dark:text-blue-200"
                           size={18}
                        />
                     </div>
                  </button>
               </Tooltip>
            </fetcher.Form>
         ) : null}
      </div>
   );
};
