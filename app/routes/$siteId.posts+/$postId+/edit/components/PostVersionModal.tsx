import { useFetcher, useParams } from "@remix-run/react";
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
import { ResponsiveModal } from "~/components/ResponsiveModal";

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

   const [selectedVersion, setSelectedVersion] = useState(versions?.docs[0]);

   const updateData = useMutation(
      ({ storage }) => {
         const blocks = storage.get("blocks");
         blocks.clear();
         const data = selectedVersion?.version?.content;
         return data.map((block: any) => blocks.push(block));
      },
      [selectedVersion]
   );

   return (
      <ResponsiveModal
         onClose={() => {
            setVersionModal(false);
         }}
         show={isVersionModalOpen}
      >
         <div
            className="w-full laptop:max-w-[1200px] laptop:w-[1200px] transform
               text-left align-middle transition-all rounded-lg"
         >
            <section className="grid laptop:grid-cols-5">
               <Tab.Group>
                  <Tab.Panels className="col-span-4 bg-3 p-4 border-r border-color  overflow-auto">
                     {versions?.docs?.map(
                        (version: any) =>
                           version.version?.content && (
                              <Tab.Panel key={version.id}>
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
                  <Tab.List className="col-span-1 flex flex-col sticky top-0">
                     <div className="border-b flex items-center justify-between border-color bg-2 py-3 pl-4 pr-2">
                        <div className="font-bold text-1">History</div>
                        <div className="flex items-center">
                           <button className="w-8 h-8 flex items-center justify-center">
                              <ChevronLeft
                                 className="text-emerald-500"
                                 size={24}
                              />
                           </button>
                           <button className="w-8 h-8 flex items-center justify-center">
                              <ChevronRight
                                 className="text-emerald-500"
                                 size={24}
                              />
                           </button>
                        </div>
                     </div>
                     <RadioGroup
                        className="flex-grow bg-3 py-2.5 px-4 overflow-auto divide-y divide-color"
                        value={selectedVersion}
                        onChange={setSelectedVersion}
                     >
                        {versions?.docs?.map(
                           (version: any) =>
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
                                             } cursor-pointer rounded-md relative group block w-full py-3`}
                                          >
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
                                                   className="absolute top-1/2 right-3 h-2 w-2 rounded-full
                                                 bg-emerald-500  -translate-y-1/2"
                                                />
                                             ) : null}
                                          </RadioGroup.Label>
                                       )}
                                    </RadioGroup.Option>
                                 </Tab>
                              )
                        )}
                     </RadioGroup>
                     <div className="grid grid-cols-2 p-3.5 border-t border-color gap-4 flex-none">
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
                  </Tab.List>
               </Tab.Group>
            </section>
         </div>
      </ResponsiveModal>
   );
};
