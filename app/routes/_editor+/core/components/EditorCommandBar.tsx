import type { ReactNode } from "react";
import { Children, Fragment, useState } from "react";

import { FloatingDelayGroup } from "@floating-ui/react";
import { Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import type { FetcherWithComponents } from "@remix-run/react";
import { Check, Clock9, Loader2, MoreHorizontal, Send, X } from "lucide-react";

import type { Config } from "payload/generated-types";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import { EditorVersionModal } from "~/routes/_editor+/core/components/EditorVersionModal";
import { isProcessing } from "~/utils";

export const EditorCommandBar = ({
   isChanged,
   fetcher,
   collectionSlug,
   collectionId,
   entryId,
   pageId,
   siteId,
   primaryOptions,
   secondaryOptions,
   children,
}: {
   isChanged: boolean | undefined;
   fetcher: FetcherWithComponents<unknown>;
   collectionSlug: keyof Config["collections"];
   collectionId?: string;
   entryId?: string;
   pageId?: string;
   siteId?: string;
   primaryOptions?: ReactNode;
   secondaryOptions?: ReactNode;
   children?: ReactNode;
}) => {
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
      ...(collectionId && { collectionId }),
      ...(entryId && { entryId }),
   };

   const actionPath =
      collectionSlug == "contentEmbeds" ? `/${siteId}/c/embed` : undefined;

   //@ts-ignore
   let _primaryOptions, _secondaryOptions;

   Children.forEach(children, (child: any) => {
      if (child?.type === PrimaryOptions) {
         return (_primaryOptions = child);
      }
      if (child?.type === SecondaryOptions) {
         return (_secondaryOptions = child);
      }
   });

   if (!_primaryOptions) _primaryOptions = primaryOptions;
   if (!_secondaryOptions) _secondaryOptions = secondaryOptions;

   return (
      <div className="shadow-1 bg-2-sub border-color-sub z-40 flex flex-col items-center justify-between gap-2 rounded-full border w-12 py-2 shadow-sm max-laptop:hidden">
         <FloatingDelayGroup delay={{ open: 1000, close: 200 }}>
            {isPublishing ? (
               <div className="flex h-8 w-8 items-center justify-center rounded-full dark:bg-dark500 border dark:border-zinc-500 bg-zinc-200 border-zinc-300">
                  <Loader2
                     size={16}
                     className="mx-auto animate-spin text-zinc-700 dark:text-white"
                  />
               </div>
            ) : (
               <>
                  {isChanged ? (
                     <Tooltip placement="left">
                        <TooltipTrigger
                           className="transition duration-100 flex h-8 w-8 items-center justify-center shadow-sm shadow-1 bg-zinc-200 border-zinc-300 
                           rounded-full dark:bg-dark500 border dark:border-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-500 active:translate-y-0.5"
                           disabled={disabled}
                           onClick={() => {
                              fetcher.submit(submitData, {
                                 method: "POST",
                                 action: actionPath,
                              });
                           }}
                        >
                           <Send
                              size={16}
                              className="text-zinc-700 pt-0.5 dark:text-white"
                           />
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
                  className="transition duration-100 border border-color shadow-sm shadow-1
                  active:translate-y-0.5 hover:bg-3-sub flex h-8 w-8 items-center justify-center rounded-full"
                  onClick={() => setVersionModal(true)}
               >
                  <Clock9 size={16} />
               </TooltipTrigger>
               <TooltipContent>History</TooltipContent>
            </Tooltip>
            {_primaryOptions}
            <Popover>
               {({ open }) => (
                  <>
                     <Float
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                        placement="left-start"
                        offset={4}
                     >
                        <Popover.Button as="div">
                           <Tooltip placement="left">
                              <TooltipTrigger
                                 className="transition duration-100 border border-color shadow-sm shadow-1
                                 active:translate-y-0.5 hover:bg-3-sub flex h-8 w-8 items-center justify-center rounded-full"
                              >
                                 {open ? (
                                    <X className="text-1" size={14} />
                                 ) : (
                                    <MoreHorizontal size={16} />
                                 )}
                              </TooltipTrigger>
                              <TooltipContent>Settings</TooltipContent>
                           </Tooltip>
                        </Popover.Button>
                        <Popover.Panel className="border-color-sub bg-3-sub w-32 shadow-1 p-1 transform rounded-lg border shadow">
                           {/* @ts-ignore */}
                           {_secondaryOptions}
                        </Popover.Panel>
                     </Float>
                  </>
               )}
            </Popover>
         </FloatingDelayGroup>
         <EditorVersionModal
            pageId={pageId}
            isVersionModalOpen={isVersionModalOpen}
            setVersionModal={setVersionModal}
            collectionSlug={collectionSlug}
         />
      </div>
   );
};

const PrimaryOptions = ({ children }: { children: ReactNode }) => (
   <div>{children}</div>
);
const SecondaryOptions = ({ children }: { children: ReactNode }) => (
   <div>{children}</div>
);

EditorCommandBar.PrimaryOptions = PrimaryOptions;
EditorCommandBar.SecondaryOptions = SecondaryOptions;
