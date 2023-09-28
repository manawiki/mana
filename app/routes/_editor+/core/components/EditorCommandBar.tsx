import { useState } from "react";

import { FloatingDelayGroup } from "@floating-ui/react";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import type { FetcherWithComponents } from "@remix-run/react";
import { Check, Clock9, Loader2 } from "lucide-react";

import type { Config } from "payload/generated-types";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import { EditorVersionModal } from "~/routes/_editor+/core/components/EditorVersionModal";
import { isProcessing } from "~/utils";

export function EditorCommandBar({
   isChanged,
   fetcher,
   collectionSlug,
   pageId,
   siteId,
}: {
   isChanged: boolean | undefined;
   fetcher: FetcherWithComponents<never>;
   collectionSlug: keyof Config["collections"];
   pageId?: string;
   siteId?: string;
}) {
   const isAutoSaving =
      fetcher.state === "submitting" &&
      fetcher.formData?.get("intent") === "update";

   const isPublishing =
      fetcher.state === "submitting" &&
      fetcher.formData?.get("intent") === "publish";

   const disabled = isProcessing(fetcher.state);
   const [isVersionModalOpen, setVersionModal] = useState(false);

   const submitData = {
      collectionSlug,
      intent: "publish",
      ...(pageId && { pageId }),
      ...(siteId && { siteId }),
   };

   return (
      <div className="shadow-1 bg-2-sub border-color-sub z-40 flex w-11 flex-col items-center justify-between gap-2 rounded-full border py-1.5 shadow max-laptop:hidden">
         <FloatingDelayGroup delay={{ open: 1000, close: 200 }}>
            {isPublishing ? (
               <div className="flex h-8 w-8 items-center justify-center rounded-full dark:bg-zinc-100 bg-zinc-700">
                  <Loader2 className="mx-auto h-4 w-4 animate-spin text-white dark:text-zinc-900" />
               </div>
            ) : (
               <>
                  {isChanged ? (
                     <Tooltip placement="left">
                        <TooltipTrigger>
                           <button
                              className="flex h-8 w-8 items-center justify-center rounded-full dark:bg-zinc-100 bg-zinc-700"
                              disabled={disabled}
                              onClick={() => {
                                 fetcher.submit(submitData, {
                                    method: "post",
                                 });
                              }}
                           >
                              <PaperAirplaneIcon className="h-4 text-white dark:text-zinc-900 w-4" />
                           </button>
                        </TooltipTrigger>
                        <TooltipContent>Publish latest changes</TooltipContent>
                     </Tooltip>
                  ) : (
                     <Tooltip placement="left">
                        <TooltipTrigger className="flex cursor-default h-8 w-8 items-center justify-center">
                           {isAutoSaving ? (
                              <Loader2 size={18} className="animate-spin" />
                           ) : (
                              <Check size={18} />
                           )}
                        </TooltipTrigger>
                        <TooltipContent>
                           No changes to publish...
                        </TooltipContent>
                     </Tooltip>
                  )}
               </>
            )}
            <Tooltip placement="left">
               <TooltipTrigger
                  className="transition duration-100 active:translate-y-0.5 hover:bg-3-sub flex h-8 w-8 items-center justify-center rounded-full"
                  onClick={() => setVersionModal(true)}
               >
                  <Clock9 size={18} />
               </TooltipTrigger>
               <TooltipContent>History</TooltipContent>
            </Tooltip>
         </FloatingDelayGroup>
         <EditorVersionModal
            isVersionModalOpen={isVersionModalOpen}
            setVersionModal={setVersionModal}
            collectionSlug={collectionSlug}
         />
      </div>
   );
}
