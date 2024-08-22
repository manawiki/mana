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
         <div className={clsx(isSection ? "" : "fixed h-full z-50")}>
            <div
               className={clsx(
                  isSection
                     ? ""
                     : "fixed bottom-20 laptop:bottom-10 w-full left-0",
               )}
            >
               <div
                  className={clsx(
                     isSection
                        ? ""
                        : `rounded-xl shadow shadow-1 p-2 max-w-sm
                           backdrop-blur-lg dark:bg-black/30 bg-white/30 
                           border border-zinc-300/70 dark:border-zinc-600/50 mx-auto`,
                  )}
               >
                  <div className="flex w-full items-center justify-between gap-3">
                     <div className="flex items-center gap-3">
                        <Tooltip placement="top">
                           <TooltipTrigger
                              title="History"
                              className={command_button}
                              onClick={() => setVersionModal(true)}
                           >
                              <Icon title="History" name="clock-9" size={16} />
                           </TooltipTrigger>
                           <TooltipContent>History</TooltipContent>
                        </Tooltip>
                        {/* @ts-ignore */}
                        {_primaryOptions && <>{_primaryOptions}</>}
                        {/* @ts-ignore */}
                        {_secondaryOptions && (
                           <>
                              <Popover className="relative">
                                 {({ open }) => (
                                    <>
                                       <Popover.Button as="div">
                                          <Tooltip placement="top">
                                             <TooltipTrigger
                                                title="Settings"
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
                                             className="dark:border-zinc-600 bottom-10 bg-3-sub w-32 shadow-1 p-1
                                                    transform rounded-lg border shadow absolute right-0"
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
                     <Tooltip placement="top">
                        <TooltipTrigger
                           title="Publish Changes"
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
                              color={isChanged ? "green" : "zinc"}
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
                     <EditorVersionModal
                        pageId={pageId}
                        isVersionModalOpen={isVersionModalOpen}
                        setVersionModal={setVersionModal}
                        collectionSlug={collectionSlug}
                     />
                  </div>
               </div>
            </div>
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
