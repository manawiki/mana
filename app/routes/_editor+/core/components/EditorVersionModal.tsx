import type { Dispatch, SetStateAction } from "react";
import { Fragment, useState } from "react";

import { RadioGroup, Tab } from "@headlessui/react";
import { useFetcher, useMatches } from "@remix-run/react";
import clsx from "clsx";
import dt from "date-and-time";

import type { Config } from "payload/generated-types";
import { Image, Modal } from "~/components";
import { Icon } from "~/components/Icon";
import { isAdding } from "~/utils";

import { EditorView } from "./EditorView";

export function EditorVersionModal({
   pageId,
   isVersionModalOpen,
   setVersionModal,
   collectionSlug,
}: {
   pageId?: string;
   isVersionModalOpen: boolean;
   setVersionModal: Dispatch<SetStateAction<boolean>>;
   collectionSlug: keyof Config["collections"];
}) {
   const { data } = useMatches()?.[2] as any;

   const versions =
      collectionSlug == "contentEmbeds"
         ? data.entry.embeddedContent.find((item: any) => item?.id === pageId)
         ?.versions ?? []
         : data?.versions ?? [];

   const fetcher = useFetcher();
   const adding = isAdding(fetcher, "versionUpdate");

   const [selectedVersion, setSelectedVersion] = useState(versions[0]);

   return (
      <Modal
         onClose={() => {
            setVersionModal(false);
         }}
         show={isVersionModalOpen}
      >
         <div
            className="bg-2 border-color-sub min-h-full w-full transform overflow-hidden rounded-md border
               text-left align-middle transition-all laptop:w-[1077px] laptop:max-w-[1100px]"
         >
            <section className="bg-3 flex items-start">
               <Tab.Group>
                  <Tab.Panels className="bg-3 max-h-[90vh] w-[775px] overflow-auto px-4 pb-4 no-scrollbar">
                     <div
                        className="bg-2-sub text-1 border-color-sub fixed left-0 top-0 z-20
                        mb-3 flex h-12 w-[775px] items-center border-b px-4 text-sm font-bold"
                     >
                        <div className="flex gap-x-2">
                           <div>
                              {selectedVersion?.updatedAt &&
                                 dt.format(
                                    new Date(selectedVersion?.updatedAt as any),
                                    "MMMM D, hh:mm A",
                                 )}
                           </div>
                           <div className="border-l border-color-sub flex pl-2">
                              <div
                                 className="bg-3 shadow-1 flex h-5 w-5 items-center justify-center
                                          overflow-hidden rounded-full border border-zinc-200 shadow-sm dark:border-zinc-600"
                              >
                                 {selectedVersion?.version?.versionAuthor?.avatar?.url ? (
                                    <Image
                                       url={selectedVersion?.version?.versionAuthor?.avatar?.url}
                                       options="aspect_ratio=1:1&height=80&width=80"
                                       alt="User Avatar"
                                    />
                                 ) : (
                                    <Icon
                                       name="dog"
                                       className="text-1 m-0.5"
                                       size={20}
                                    />
                                 )}
                              </div>
                              <div className="pl-2">{selectedVersion?.version?.versionAuthor?.username ?? ("Unknown contributor")}</div>
                           </div>
                        </div>
                     </div>
                     {versions?.map(
                        (version: any) =>
                           version?.version?.content && (
                              <Tab.Panel className="pt-16" key={version?.id}>
                                 <h1 className="font-header text-3xl font-bold">
                                    {version?.version?.name}
                                 </h1>
                                 <EditorView data={version?.version?.content} />
                              </Tab.Panel>
                           ),
                     )}
                  </Tab.Panels>
                  <div className="border-color-sub flex h-full max-h-[90vh] min-h-[90vh] w-[300px] flex-col  border-l">
                     <Tab.List className="flex flex-grow flex-col justify-between overflow-auto">
                        <RadioGroup
                           className="bg-3 m-4 space-y-1 overflow-auto"
                           value={selectedVersion}
                           onChange={setSelectedVersion}
                           by="id"
                        >
                           {versions?.map(
                              (row: any, index: any) =>
                                 row.version?.content && (
                                    <Tab as={Fragment} key={row.id}>
                                       <RadioGroup.Option
                                          key={row.id}
                                          value={row}
                                       >
                                          {({ active, checked }) => (
                                             <RadioGroup.Label
                                                className={clsx(
                                                   checked
                                                      ? "bg-zinc-100 font-semibold dark:bg-zinc-700/80"
                                                      : "text-1",
                                                   "group relative flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2",
                                                )}
                                             >
                                                <time
                                                   className="flex items-center gap-1.5 text-sm group-hover:underline"
                                                   dateTime={row?.updatedAt}
                                                >
                                                   {dt.format(
                                                      new Date(
                                                         row?.updatedAt as string,
                                                      ),
                                                      "MMMM D, hh:mm A",
                                                   )}
                                                </time>
                                                {index == 0 && (
                                                   <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-bold uppercase dark:bg-zinc-600 dark:text-white">
                                                      Live
                                                   </span>
                                                )}
                                             </RadioGroup.Label>
                                          )}
                                       </RadioGroup.Option>
                                    </Tab>
                                 ),
                           )}
                        </RadioGroup>
                        <div className="border-color grid flex-none grid-cols-2 gap-4 border-t p-4">
                           <button
                              className="h-9 rounded-md bg-zinc-500 text-sm font-bold text-white"
                              onClick={() => {
                                 fetcher.submit(
                                    {
                                       intent: "versionUpdate",
                                       collectionSlug: collectionSlug,
                                       //@ts-ignore
                                       versionId: selectedVersion.id,
                                    },
                                    {
                                       method: "patch",
                                       action: "/editor",
                                    },
                                 );
                                 setVersionModal(false);
                                 // Not ideal, but theres no good way to update slate state externally
                                 // https://stackoverflow.com/questions/74101405/how-to-clear-all-text-in-slate-js-editor
                                 location.reload();
                              }}
                           >
                              {adding ? (
                                 <Icon
                                    name="loader-2"
                                    className="mx-auto h-5 w-5 animate-spin"
                                 />
                              ) : (
                                 "Restore"
                              )}
                           </button>
                           <button
                              className="h-9 rounded-md bg-zinc-200 text-sm
                           font-bold focus:bg-zinc-100 dark:bg-zinc-700 dark:focus:bg-zinc-600"
                              onClick={() => {
                                 setVersionModal(false);
                              }}
                           >
                              Cancel
                           </button>
                        </div>
                     </Tab.List>
                  </div>
               </Tab.Group>
            </section>
         </div>
      </Modal>
   );
}
