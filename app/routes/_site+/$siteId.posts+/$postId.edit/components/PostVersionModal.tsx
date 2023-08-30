import { useMemo, useCallback, Fragment, useState } from "react";

import { RadioGroup, Tab } from "@headlessui/react";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { Descendant } from "slate";
import { createEditor } from "slate";
import type { RenderElementProps } from "slate-react";
import { Slate, Editable, withReact } from "slate-react";

import { Modal } from "~/components";
import { EditorBlocks } from "~/routes/_editor+/components/EditorBlocks";
import { Leaf } from "~/routes/_editor+/components/Leaf";
import { isAdding } from "~/utils";

import { PostHeader } from "../../components/PostHeader";

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
      return <EditorBlocks {...props} />;
   }, []);

   const init = versions.docs[0];
   const [selectedVersion, setSelectedVersion] = useState(init);

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
            setSearchParams((searchParams) => {
               searchParams.delete("page");
               return searchParams;
            });
         }}
         show={isVersionModalOpen}
      >
         <div
            className="bg-2 min-h-full w-full transform overflow-hidden rounded-md
               text-left align-middle transition-all laptop:w-[1200px] laptop:max-w-[1200px]"
         >
            <section className="bg-3 flex items-start">
               <Tab.Group>
                  <Tab.Panels className="bg-3 max-h-[90vh] w-[899px] overflow-auto px-4 pb-4">
                     <div
                        className="bg-3 text-1 border-color fixed left-0 top-0 z-10 
                        mb-3 flex h-12 w-[898px] items-center border-b px-4 text-sm font-bold"
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
                                 <h1 className="font-header text-3xl font-bold">
                                    {version.version.name}
                                 </h1>
                                 <PostHeader post={version} />
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
                  <div className="border-color h-full min-h-[90vh] w-[300px] border-l">
                     <Tab.List className="flex min-h-[90vh] flex-col">
                        <div className="grid flex-none grid-cols-2 gap-4 p-4">
                           <button
                              className="h-9 rounded-md bg-emerald-500 text-sm font-bold text-white"
                              onClick={() => {
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
                              onClick={() => {
                                 setVersionModal(false);
                                 setSearchParams((searchParams) => {
                                    searchParams.delete("page");
                                    return searchParams;
                                 });
                              }}
                           >
                              Cancel
                           </button>
                        </div>
                        <RadioGroup
                           className="bg-3 border-color divide-color mx-4 flex-grow divide-y overflow-auto border-y"
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
                                                } group relative flex w-full cursor-pointer items-center gap-2 rounded-md py-3`}
                                             >
                                                {version._status ==
                                                "published" ? (
                                                   <span className="shadow-1 bg-1 rounded-lg px-2 py-1 text-xs font-semibold shadow">
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
                                                      className="absolute right-0 top-1/2 z-10 h-2 w-2
                                                 -translate-y-1/2  rounded-full bg-emerald-500"
                                                   />
                                                ) : null}
                                             </RadioGroup.Label>
                                          )}
                                       </RadioGroup.Option>
                                    </Tab>
                                 )
                           )}
                        </RadioGroup>
                        <section className="m-4 flex items-center justify-between">
                           <div className="text-1 flex items-center gap-1 text-sm">
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
