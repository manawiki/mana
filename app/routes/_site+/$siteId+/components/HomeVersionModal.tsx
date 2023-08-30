import type { Dispatch, SetStateAction } from "react";
import { useMemo, useCallback, Fragment, useState } from "react";

import { RadioGroup, Tab } from "@headlessui/react";
import { useFetcher, useMatches } from "@remix-run/react";
import clsx from "clsx";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import type { Descendant } from "slate";
import { createEditor } from "slate";
import type { RenderElementProps } from "slate-react";
import { Slate, Editable, withReact } from "slate-react";

import { Modal } from "~/components";
import type { HomeContent } from "~/db/payload-types";
import { EditorBlocks } from "~/routes/_editor+/components/EditorBlocks";
import { Leaf } from "~/routes/_editor+/components/Leaf";
import { isAdding } from "~/utils";

export const HomeVersionModal = ({
   isVersionModalOpen,
   setVersionModal,
}: {
   isVersionModalOpen: boolean;
   setVersionModal: Dispatch<SetStateAction<boolean>>;
}) => {
   //layout presume to have site data, might be brittle in the future
   //@ts-expect-error
   const versions = useMatches()?.[2]?.data?.versions as HomeContent[];

   const fetcher = useFetcher();

   const adding = isAdding(fetcher, "versionUpdate");

   const editor = useMemo(() => withReact(createEditor()), []);

   const renderElement = useCallback((props: RenderElementProps) => {
      return <EditorBlocks {...props} />;
   }, []);

   const [selectedVersion, setSelectedVersion] = useState(versions[0]);

   return (
      <Modal
         onClose={() => {
            setVersionModal(false);
         }}
         show={isVersionModalOpen}
      >
         <div
            className="bg-2 border-color min-h-full w-full transform overflow-hidden rounded-md border
               text-left align-middle transition-all laptop:w-[1077px] laptop:max-w-[1100px]"
         >
            <section className="bg-3 flex items-start">
               <Tab.Group>
                  <Tab.Panels className="bg-3 max-h-[90vh] w-[775px] overflow-auto px-4 pb-4">
                     <div
                        className="bg-2 text-1 border-color fixed left-0 top-0 z-10 
                        mb-3 flex h-12 w-[775px] items-center border-b px-4 text-sm font-bold"
                     >
                        {format(
                           new Date(selectedVersion?.updatedAt as string),
                           "MMMM d, hh:mm aaa"
                        )}
                     </div>
                     {versions?.map(
                        (version: any) =>
                           version.version?.content && (
                              <Tab.Panel className="mt-16" key={version.id}>
                                 <h1 className="font-header text-3xl font-bold">
                                    {version.version.name}
                                 </h1>
                                 <Slate
                                    editor={editor}
                                    initialValue={
                                       version.version?.content as Descendant[]
                                    }
                                 >
                                    <Editable
                                       renderElement={renderElement}
                                       renderLeaf={Leaf}
                                       readOnly={true}
                                    />
                                 </Slate>
                              </Tab.Panel>
                           )
                     )}
                  </Tab.Panels>
                  <div className="border-color flex h-full max-h-[90vh] min-h-[90vh] w-[300px] flex-col  border-l">
                     <Tab.List className="flex flex-grow flex-col justify-between overflow-auto">
                        <RadioGroup
                           className="bg-3 m-4 space-y-1 overflow-auto"
                           value={selectedVersion}
                           onChange={setSelectedVersion}
                        >
                           {versions?.map(
                              (row, index) =>
                                 //@ts-expect-error
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
                                                   "group relative flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2"
                                                )}
                                             >
                                                {/* {index == 0 &&
                                                   checked(
                                                      <span className="self-end rounded-full px-2 py-0.5 text-[10px] font-bold dark:bg-zinc-700">
                                                         hwllo
                                                      </span>
                                                   )} */}
                                                <time
                                                   className="flex items-center gap-1.5 text-sm group-hover:underline"
                                                   dateTime={row?.updatedAt}
                                                >
                                                   {format(
                                                      new Date(
                                                         row?.updatedAt as string
                                                      ),
                                                      "MMMM d, hh:mm aaa"
                                                   )}
                                                </time>
                                                {/* {checked == false  : "asdasd"} */}
                                                {index == 0 && (
                                                   <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-bold uppercase dark:bg-zinc-600 dark:text-white">
                                                      Live
                                                   </span>
                                                )}
                                             </RadioGroup.Label>
                                          )}
                                       </RadioGroup.Option>
                                    </Tab>
                                 )
                           )}
                        </RadioGroup>
                        <div className="border-color grid flex-none grid-cols-2 gap-4 border-t p-4">
                           <button
                              className="h-9 rounded-md bg-zinc-500 text-sm font-bold text-white"
                              onClick={() => {
                                 fetcher.submit(
                                    {
                                       intent: "versionUpdate",
                                       collectionSlug: "homeContents",
                                       versionId: selectedVersion.id,
                                    },
                                    {
                                       method: "patch",
                                    }
                                 );
                                 setVersionModal(false);
                                 // Not ideal, but theres no good way to update slate state externally
                                 // https://stackoverflow.com/questions/74101405/how-to-clear-all-text-in-slate-js-editor
                                 location.reload();
                              }}
                           >
                              {adding ? (
                                 <Loader2 className="mx-auto h-5 w-5 animate-spin" />
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
};
