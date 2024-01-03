import type { ReactNode } from "react";
import { Children, Fragment, useState } from "react";

import {
   FloatingDelayGroup,
   useFloating,
   useHover,
   useInteractions,
} from "@floating-ui/react";
import { Popover, Transition } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import type { FetcherWithComponents } from "@remix-run/react";
import clsx from "clsx";

import type { Config } from "payload/generated-types";
import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import { EditorVersionModal } from "~/routes/_editor+/core/components/EditorVersionModal";
import { isProcessing } from "~/utils";

export const command_button = `border border-color-sub shadow-sm shadow-1 hover:border-zinc-300 bg-3-sub flex h-9 w-9 items-center justify-center rounded-full dark:hover:border-zinc-600`;

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

   const [isHoverActive, setHoverState] = useState(false);

   const { refs, context } = useFloating({
      open: isHoverActive,
      onOpenChange: setHoverState,
   });

   const hover = useHover(context, {
      delay: {
         open: 0,
         close: 400,
      },
   });

   const { getReferenceProps } = useInteractions([hover]);

   const submitData = {
      collectionSlug,
      intent: "publish",
      ...(pageId && { pageId }),
      ...(siteId && { siteId }),
      ...(collectionId && { collectionId }),
      ...(entryId && { entryId }),
   };

   const actionPath =
      collectionSlug == "contentEmbeds" ? `/c/embed` : undefined;

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
      <div
         ref={refs.setReference}
         {...getReferenceProps()}
         className="z-40 flex flex-col items-center justify-between max-laptop:hidden"
      >
         <FloatingDelayGroup delay={{ open: 1000, close: 200 }}>
            {isPublishing ? (
               <div className="flex h-9 w-9 items-center justify-center rounded-full dark:bg-dark500 border-2 dark:border-zinc-500 bg-zinc-50 border-zinc-300">
                  <Icon
                     name="loader-2"
                     size={16}
                     className="mx-auto animate-spin text-zinc-700 dark:text-white"
                  />
               </div>
            ) : (
               <>
                  {isChanged ? (
                     <Tooltip placement="top">
                        <TooltipTrigger
                           className="transition duration-100 flex h-9 w-9 items-center justify-center shadow 
                           shadow-gray-300 dark:shadow-zinc-800 bg-zinc-50 border-zinc-300 relative
                           rounded-full dark:bg-dark500 border-2 dark:border-zinc-500 z-10
                           hover:bg-zinc-100 dark:hover:bg-zinc-500 active:translate-y-0.5"
                           disabled={disabled}
                           onClick={() => {
                              fetcher.submit(submitData, {
                                 method: "POST",
                                 action: actionPath,
                              });
                           }}
                        >
                           <Icon
                              name="send"
                              size={16}
                              className={clsx(
                                 isHoverActive ? "rotate-12" : "",
                                 "text-zinc-500 pt-0.5 pr-[1px] dark:text-white transition ease-in-out transform",
                              )}
                           />
                        </TooltipTrigger>
                        <TooltipContent>Publish changes</TooltipContent>
                     </Tooltip>
                  ) : (
                     <Tooltip placement="top">
                        <TooltipTrigger
                           className="flex cursor-default hover:border-zinc-300 dark:hover:border-dark500 shadow shadow-1 relative
                           border-2 border-zinc-200 dark:border-zinc-500 bg-2-sub rounded-full h-9 w-9 items-center justify-center z-10"
                        >
                           {isAutoSaving ? (
                              <Icon
                                 name="loader-2"
                                 size={18}
                                 className="animate-spin"
                              />
                           ) : (
                              <Icon name="check" size={18} />
                           )}
                        </TooltipTrigger>
                        <TooltipContent>
                           No changes to publish...
                        </TooltipContent>
                     </Tooltip>
                  )}
               </>
            )}
            <Transition
               show={isHoverActive}
               enter="transition ease duration-500 transform"
               enterFrom="opacity-0 -translate-y-12"
               enterTo="opacity-100 translate-y-0"
               leave="transition ease duration-300 transform"
               leaveFrom="opacity-100 translate-y-0"
               leaveTo="opacity-0 -translate-y-12"
               className="flex flex-col"
            >
               <span className="h-3 w-0.5 bg-zinc-200 dark:bg-dark450 mx-auto" />
               <Tooltip placement="right">
                  <TooltipTrigger
                     className={command_button}
                     onClick={() => setVersionModal(true)}
                  >
                     <Icon name="clock-9" size={16} />
                  </TooltipTrigger>
                  <TooltipContent>History</TooltipContent>
               </Tooltip>
               {_primaryOptions && (
                  <>
                     <span className="h-2 w-0.5 bg-zinc-200 dark:bg-dark450 mx-auto" />
                     {_primaryOptions}
                  </>
               )}
               {_secondaryOptions && (
                  <>
                     <span className="h-2 w-0.5 bg-zinc-200 dark:bg-dark450 mx-auto" />
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
                                    <Tooltip placement="right">
                                       <TooltipTrigger
                                          className={command_button}
                                       >
                                          {open ? (
                                             <Icon
                                                name="x"
                                                className="text-1"
                                                size={14}
                                             />
                                          ) : (
                                             <Icon
                                                name="more-vertical"
                                                size={16}
                                             />
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
                  </>
               )}
            </Transition>
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
