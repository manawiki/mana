import type { ReactNode } from "react";
import { Children, Fragment, useState } from "react";

import { Popover, Transition } from "@headlessui/react";
import type { FetcherWithComponents } from "@remix-run/react";
import clsx from "clsx";

import type { Config } from "payload/generated-types";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import { EditorVersionModal } from "~/routes/_editor+/core/components/EditorVersionModal";
import { isProcessing } from "~/utils/form";

export const command_button = `border dark:border-zinc-600 shadow-sm shadow-1 hover:border-zinc-300 dark:bg-dark450 
flex size-9 items-center justify-center rounded-full dark:hover:border-zinc-600 bg-zinc-50`;

export const EditorCommandBar = ({
   isChanged,
   fetcher,
   collectionSlug,
   collectionId,
   entryId,
   pageId,
   postId,
   homeContentId,
   primaryOptions,
   secondaryOptions,
   children,
   isSection,
}: {
   isChanged: boolean | undefined;
   fetcher: FetcherWithComponents<unknown>;
   collectionSlug: keyof Config["collections"];
   collectionId?: string;
   entryId?: string;
   postId?: string;
   pageId?: string;
   homeContentId?: string;
   primaryOptions?: ReactNode;
   secondaryOptions?: ReactNode;
   children?: ReactNode;
   isSection?: boolean;
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
      ...(postId && { postId }),
      ...(pageId && { pageId }),
      ...(homeContentId && { homeContentId }),
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
      <>
         <div className="tablet_editor:flex-col max-tablet_editor:gap-3 flex w-full items-center justify-between">
            <div
               className={clsx(
                  isSection && !isChanged ? "hidden" : "",
                  isChanged ? "" : "tablet_editor:hidden",
                  "order-last tablet_editor:order-first",
               )}
            >
               <Tooltip placement="top">
                  <TooltipTrigger
                     asChild
                     disabled={!isChanged || disabled || isAutoSaving}
                     onClick={() => {
                        fetcher.submit(submitData, {
                           method: "POST",
                           action: actionPath,
                        });
                     }}
                  >
                     <Button
                        color={isChanged ? "blue" : "zinc"}
                        className="size-9 !p-0"
                     >
                        {isAutoSaving || isPublishing ? (
                           <Icon
                              title="Saving"
                              name="loader-2"
                              size={18}
                              className="animate-spin"
                           />
                        ) : (
                           <Icon
                              title="Save then publish"
                              name="send"
                              size={18}
                              className="pt-0.5 text-white transition ease-in-out hover:rotate-12 transform"
                           />
                        )}
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent>Publish changes</TooltipContent>
               </Tooltip>
               <span className="max-tablet_editor:hidden h-3 w-0.5 bg-zinc-200 dark:bg-dark450 mx-auto block" />
            </div>
            <Popover className="relative">
               {({ open }) => (
                  <>
                     <Popover.Button
                        className="border bg-gradient-to-br from-zinc-50 to-white shadow-sm shadow-1 relative z-40 order-first
                     hover:border-zinc-400/80 flex size-9 items-center justify-center border-zinc-300/80 rounded-full tablet_editor:order-last
                      dark:hover:border-zinc-500 dark:from-dark500 dark:to-dark450 focus:outline-none dark:border-zinc-500/70"
                     >
                        <Tooltip placement="top">
                           <TooltipTrigger asChild>
                              {isAutoSaving && !isChanged ? (
                                 <Icon
                                    name="loader-2"
                                    size={18}
                                    className="animate-spin"
                                 />
                              ) : (
                                 <Icon
                                    title="More Options"
                                    name="more-horizontal"
                                    size={16}
                                    className={clsx(
                                       open ? "rotate-90" : "",
                                       "text-zinc-500 dark:text-white transition ease-in-out transform",
                                    )}
                                 />
                              )}
                           </TooltipTrigger>
                           <TooltipContent>More Options</TooltipContent>
                        </Tooltip>
                     </Popover.Button>
                     <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                     >
                        <Popover.Panel
                           className={clsx(
                              isSection
                                 ? "max-tablet_editor:right-10 max-tablet_editor:-top-[27px]"
                                 : "max-tablet_editor:left-10 max-tablet_editor:top-0 max-tablet_editor:pl-2",
                              "z-50 absolute",
                           )}
                        >
                           <div className="flex tablet_editor:flex-col items-center">
                              <span className="max-tablet_editor:hidden tablet_editor:h-2 h-0.5 tablet_editor:w-0.5 w-10 bg-zinc-200 dark:bg-dark450 mx-auto" />
                              <Tooltip placement="right">
                                 <TooltipTrigger
                                    className={command_button}
                                    onClick={() => setVersionModal(true)}
                                 >
                                    <Icon
                                       title="History"
                                       name="clock-9"
                                       size={16}
                                    />
                                 </TooltipTrigger>
                                 <TooltipContent>History</TooltipContent>
                              </Tooltip>
                              {/* @ts-ignore */}
                              {_primaryOptions && (
                                 <>
                                    <span className="tablet_editor:h-2 h-0.5 tablet_editor:w-0.5 w-3 bg-zinc-200 dark:bg-dark450 mx-auto" />
                                    {_primaryOptions}
                                 </>
                              )}
                              {/* @ts-ignore */}
                              {_secondaryOptions && (
                                 <>
                                    <span className="tablet_editor:h-2 h-0.5 tablet_editor:w-0.5 w-3 bg-zinc-200 dark:bg-dark450 mx-auto" />
                                    <Popover className="relative">
                                       {({ open }) => (
                                          <>
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
                                                            title="Settings"
                                                            name="more-horizontal"
                                                            size={16}
                                                         />
                                                      )}
                                                   </TooltipTrigger>
                                                   <TooltipContent>
                                                      Settings
                                                   </TooltipContent>
                                                </Tooltip>
                                             </Popover.Button>
                                             <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="opacity-0 translate-y-1"
                                                enterTo="opacity-100 translate-y-0"
                                                leave="transition ease-in duration-150"
                                                leaveFrom="opacity-100 translate-y-0"
                                                leaveTo="opacity-0 translate-y-1"
                                             >
                                                <Popover.Panel
                                                   className="border-color-sub max-tablet_editor:bottom-10 tablet_editor:top-0 tablet_editor:right-11 bg-3-sub w-32 shadow-1 p-1
                                                    transform rounded-lg border shadow absolute"
                                                >
                                                   {/* @ts-ignore */}
                                                   {_secondaryOptions}
                                                </Popover.Panel>
                                             </Transition>
                                          </>
                                       )}
                                    </Popover>
                                 </>
                              )}
                           </div>
                        </Popover.Panel>
                     </Transition>
                  </>
               )}
            </Popover>
            <EditorVersionModal
               pageId={pageId}
               isVersionModalOpen={isVersionModalOpen}
               setVersionModal={setVersionModal}
               collectionSlug={collectionSlug}
            />
         </div>
      </>
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
