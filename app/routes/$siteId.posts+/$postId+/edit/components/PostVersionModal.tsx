import { useFetcher, useSearchParams } from "@remix-run/react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { isAdding } from "~/utils";
import type { Descendant } from "slate";
import { createEditor } from "slate";
import type { RenderElementProps } from "slate-react";
import { Slate, Editable, withReact } from "slate-react";
import { useMemo, useCallback, Fragment, useState } from "react";
import Block from "../forge/blocks/Block";
import Leaf from "../forge/blocks/Leaf";
import { format } from "date-fns";
import { RadioGroup, Tab } from "@headlessui/react";
import { useMutation } from "~/liveblocks.config";
import { Modal } from "~/components";

export const PostVersionModal = ({
   isVersionModalOpen,
   setVersionModal,
   versions,
}: {
   isVersionModalOpen: any;
   setVersionModal: any;
   versions: any;
}) => {
   const fetcher = useFetcher();

   const adding = isAdding(fetcher, "versionUpdate");

   const editor = useMemo(() => withReact(createEditor()), []);

   const renderElement = useCallback((props: RenderElementProps) => {
      return <Block {...props} />;
   }, []);

   const init = versions.docs[0];
   const [selectedVersion, setSelectedVersion] = useState(init);

   //Clear the current list on liveblocks and push the revision
   const updateData = useMutation(
      ({ storage }) => {
         const blocks = storage.get("blocks");
         blocks.clear();
         const data = selectedVersion?.version?.content;
         return data.map((block: any) => blocks.push(block));
      },
      [selectedVersion]
   );

   //Pagination
   const [, setSearchParams] = useSearchParams({});
   const currentEntry = versions?.pagingCounter;
   const totalEntries = versions?.totalDocs;
   const totalPages = versions?.totalPages;
   const limit = versions?.limit;
   const hasNextPage = versions?.hasNextPage;
   const hasPrevPage = versions?.hasPrevPage;

   return (
      <Modal
         onClose={() => {
            setVersionModal(false);
         }}
         show={isVersionModalOpen}
      >
         <div
            className="w-full laptop:max-w-[1200px] laptop:w-[1200px] transform bg-2 rounded-md
               text-left align-middle transition-all min-h-full overflow-hidden border-x border-color"
         >
            <section className="flex items-start bg-3">
               <Tab.Group>
                  <Tab.Panels className="w-[899px] max-h-[90vh] bg-3 px-4 pb-4 overflow-auto">
                     <div
                        className="fixed h-12 font-bold flex items-center w-[898px] left-0 
                        mb-3 z-10 top-0 bg-3 border-b text-1 border-color px-4 text-sm"
                     >
                        {format(
                           new Date(selectedVersion?.updatedAt as string),
                           "MMMM d, hh:mm aaa"
                        )}
                     </div>
                     {versions?.docs?.map(
                        (version: any) =>
                           version.version?.content && (
                              <Tab.Panel className="mt-16" key={version.id}>
                                 <Slate
                                    editor={editor}
                                    value={
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
                  <div className="w-[300px] h-full border-l border-color min-h-[90vh]">
                     <Tab.List className="flex flex-col min-h-[90vh]">
                        <div className="grid grid-cols-2 p-4 gap-4 flex-none">
                           <button
                              className="text-sm h-9 font-bold text-white bg-emerald-500 rounded-md"
                              onClick={() => {
                                 updateData();
                                 fetcher.submit(
                                    {
                                       intent: "versionUpdate",
                                       versionId: selectedVersion.id,
                                    },
                                    {
                                       method: "patch",
                                    }
                                 );
                                 setVersionModal(false);
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
                              onClick={() => setVersionModal(false)}
                           >
                              Cancel
                           </button>
                        </div>
                        <RadioGroup
                           className="flex-grow bg-3 mx-4 border-y border-color overflow-auto divide-y divide-color"
                           value={selectedVersion}
                           onChange={setSelectedVersion}
                        >
                           {versions?.docs?.map(
                              (version: any, index: number) =>
                                 version.version?.content && (
                                    <Tab as={Fragment} key={version.id}>
                                       <RadioGroup.Option
                                          key={version.id}
                                          value={version}
                                       >
                                          {({ active, checked }) => (
                                             <RadioGroup.Label
                                                className={`${
                                                   checked ? "font-bold" : ""
                                                } cursor-pointer rounded-md flex gap-2 relative group items-center w-full py-3`}
                                             >
                                                {index == 0 &&
                                                currentEntry == 1 ? (
                                                   <span className="text-xs shadow shadow-1 bg-1 rounded-lg px-2 py-1 font-semibold">
                                                      Live
                                                   </span>
                                                ) : null}
                                                <time
                                                   className={`
                                          ${
                                             checked
                                                ? "font-semibold"
                                                : "text-1"
                                          } flex items-center gap-1.5 text-sm group-hover:underline`}
                                                   dateTime={version?.updatedAt}
                                                >
                                                   {format(
                                                      new Date(
                                                         version?.updatedAt as string
                                                      ),
                                                      "MMMM d, hh:mm aaa"
                                                   )}
                                                </time>
                                                {checked ? (
                                                   <span
                                                      className="absolute top-1/2 right-0 h-2 w-2 rounded-full
                                                 bg-emerald-500  -translate-y-1/2 z-10"
                                                   />
                                                ) : null}
                                             </RadioGroup.Label>
                                          )}
                                       </RadioGroup.Option>
                                    </Tab>
                                 )
                           )}
                        </RadioGroup>
                        <section className="flex items-center justify-between m-4">
                           <div className="text-sm flex items-center gap-1 text-1">
                              Showing{" "}
                              <span className="font-bold">{currentEntry}</span>{" "}
                              to{" "}
                              <span className="font-bold">
                                 {limit + currentEntry - 1 > totalEntries
                                    ? totalEntries
                                    : limit + currentEntry - 1}
                              </span>{" "}
                              of{" "}
                              <span className="font-bold">{totalEntries}</span>{" "}
                              results
                           </div>
                           {/* Pagination Section */}
                           {totalPages > 1 && (
                              <div className="text-1 flex items-center justify-between text-sm">
                                 <div className="flex items-center gap-3 text-xs">
                                    {hasPrevPage ? (
                                       <button
                                          className="flex items-center gap-1 font-semibold uppercase hover:underline"
                                          onClick={() =>
                                             setSearchParams((searchParams) => {
                                                searchParams.set(
                                                   "page",
                                                   versions.prevPage as any
                                                );
                                                return searchParams;
                                             })
                                          }
                                       >
                                          <ChevronLeft
                                             size={24}
                                             className="text-emerald-500"
                                          />
                                       </button>
                                    ) : null}
                                    {hasNextPage && hasPrevPage && (
                                       <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                                    )}
                                    {hasNextPage ? (
                                       <button
                                          className="flex items-center gap-1 font-semibold uppercase hover:underline"
                                          onClick={() =>
                                             setSearchParams((searchParams) => {
                                                searchParams.set(
                                                   "page",
                                                   versions.nextPage as any
                                                );
                                                return searchParams;
                                             })
                                          }
                                       >
                                          <ChevronRight
                                             size={24}
                                             className="text-emerald-500"
                                          />
                                       </button>
                                    ) : null}
                                 </div>
                              </div>
                           )}
                        </section>
                     </Tab.List>
                  </div>
               </Tab.Group>
            </section>
         </div>
      </Modal>
   );
};
