import { ReactEditor, useSlate } from "slate-react";
import type { CustomElement, TierElement } from "../types";
import type { BaseEditor } from "slate";
import { Transforms } from "slate";
import { useDebouncedValue, useIsMount } from "~/hooks";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useZorm } from "react-zorm";
import { z } from "zod";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Tooltip from "~/components/Tooltip";
import {
   ChevronsDownUp,
   ChevronsUpDown,
   GripVertical,
   Minus,
   Plus,
} from "lucide-react";
import { useMutation } from "~/liveblocks.config";
import { arrayMoveImmutable } from "array-move";
import { Combobox, Listbox, Transition } from "@headlessui/react";
import { useParams } from "@remix-run/react";
import type { Collection, Entry } from "payload/generated-types";
import useSWR from "swr";
import { nanoid } from "nanoid";

type Props = {
   element: TierElement;
};

const FormSchema = z.object({
   tierLabel: z.string().min(1),
});

const fetcher = (...args: any) => fetch(args).then((res) => res.json());

export default function BlockTierList({ element }: Props) {
   const editor = useSlate();

   const isMount = useIsMount();

   const [tierLabel, setTierLabel] = useState(element.tierLabel);

   const { siteId } = useParams();

   const [selectedCollection, setSelectedCollection] = useState(
      element.collection
   );

   const [tierSelectQuery, setTierSelectQuery] = useState("");

   const { data: collectionData } = useSWR(
      `https://mana.wiki/api/collections?where[site.slug][equals]=${siteId}&[hiddenCollection][equals]=false`,
      fetcher
   );

   const { data: entryData } = useSWR(
      `https://${siteId}-db.mana.wiki/api/${selectedCollection}?where[name][contains]=${tierSelectQuery}&depth=1`,
      fetcher
   );

   const [selected, setSelected] = useState(collectionData?.docs[0]);

   const filteredEntries =
      tierSelectQuery === ""
         ? entryData?.docs
         : entryData?.docs.filter((item: Entry) =>
              item.name
                 .toLowerCase()
                 .replace(/\s+/g, "")
                 .includes(tierSelectQuery.toLowerCase().replace(/\s+/g, ""))
           );

   const debouncedTierLabel = useDebouncedValue(tierLabel, 500);

   useEffect(() => {
      if (!isMount) {
         const path = ReactEditor.findPath(editor, element);
         const newProperties: Partial<CustomElement> = {
            tierLabel: tierLabel,
         };
         return Transforms.setNodes<CustomElement>(editor, newProperties, {
            at: path,
         });
      }
   }, [debouncedTierLabel]);

   const zo = useZorm("signup", FormSchema, {
      onValidSubmit(e) {
         e.preventDefault();
         alert("Form ok!\n" + JSON.stringify(e.data, null, 2));
      },
   });

   const disabled = zo.validation?.success === false;

   const tierItems = element.tierItems;

   //DND kit needs array of strings
   const itemIds = useMemo(() => tierItems.map((item) => item.id), [tierItems]);

   const updateRowLb = useMutation(({ storage }, index, value) => {
      const blocks = storage.get("blocks");
      blocks.set(index, value);
   }, []);

   function handleUpdateCollection(
      event: any,
      editor: BaseEditor & ReactEditor,
      element: TierElement
   ) {
      const path = ReactEditor.findPath(editor, element);

      const newProperties: Partial<CustomElement> = {
         ...element,
         collection: event,
      };

      updateRowLb(path[0], newProperties);
      setSelectedCollection(event);
      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   }

   function handleAddEntry(
      event: any,
      editor: BaseEditor & ReactEditor,
      element: TierElement
   ) {
      const path = ReactEditor.findPath(editor, element);
      console.log(event);
      const newProperties: Partial<CustomElement> = {
         ...element,
         tierItems: [
            ...element.tierItems,
            {
               id: nanoid(),
               name: event.name,
               path: `${siteId}/${selectedCollection}/${event.id}`,
               iconUrl: `https://mana.wiki/cdn-cgi/image//${event.icon.url}`,
            },
         ],
      };

      updateRowLb(path[0], newProperties);
      setSelectedCollection(event);
      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   }

   function handleDragEnd(
      event: DragEndEvent,
      editor: BaseEditor & ReactEditor,
      element: TierElement
   ) {
      const { active, over } = event;

      if (active.id !== over?.id) {
         const tierItems = element.tierItems;

         const oldIndex = tierItems.findIndex((obj) => {
            return obj.id === active.id;
         });

         const newIndex = tierItems.findIndex((obj) => {
            return obj.id === over?.id;
         });

         const updatedTierItems = arrayMoveImmutable(
            tierItems,
            oldIndex,
            newIndex
         );

         const path = ReactEditor.findPath(editor, element);

         const newProperties: Partial<CustomElement> = {
            ...element,
            tierItems: updatedTierItems,
         };

         //Send update to liveblocks
         updateRowLb(path[0], newProperties);

         //Now we update the local SlateJS state
         return Transforms.setNodes<CustomElement>(editor, newProperties, {
            at: path,
         });
      }
   }

   function deleteRow(
      id: string,
      editor: BaseEditor & ReactEditor,
      element: TierElement
   ) {
      const tierItems = element.tierItems;

      const path = ReactEditor.findPath(editor, element);

      const updatedTierItems = tierItems.filter((item) => item.id !== id);

      const newProperties: Partial<CustomElement> = {
         ...element,
         tierItems: updatedTierItems,
      };

      updateRowLb(path[0], newProperties);

      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   }

   const activeSelectItem = (item: any) =>
      collectionData?.docs?.find((obj: Collection) => obj.slug === item)?.name;

   return (
      <div className="my-3">
         <>
            <div className="flex items-center justify-between">
               <input
                  className="border-0 bg-transparent p-0 text-lg font-bold focus:ring-0"
                  type="text"
                  placeholder="Enter a tier label..."
                  defaultValue={element.tierLabel}
                  name={zo.fields.tierLabel()}
                  onChange={(event) => setTierLabel(event.target.value)}
               />
               <Listbox
                  value={selectedCollection}
                  onChange={(event) =>
                     handleUpdateCollection(event, editor, element)
                  }
               >
                  <div className="relative z-10">
                     <Listbox.Button className="text-1 flex items-center gap-2 text-sm font-semibold hover:underline">
                        {({ value }) => (
                           <>
                              {activeSelectItem(value)}
                              <ChevronsUpDown
                                 className="text-emerald-500"
                                 size={16}
                              />
                           </>
                        )}
                     </Listbox.Button>
                     <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                     >
                        <Listbox.Options
                           className="border-color text-1 bg-3 shadow-1 absolute right-0
               mt-2 w-[160px] rounded-lg border p-1.5 shadow-lg"
                        >
                           {collectionData?.docs?.map(
                              (row: Collection, rowIdx: number) => (
                                 <Listbox.Option key={rowIdx} value={row.slug}>
                                    {({ selected }) => (
                                       <>
                                          <button
                                             className="text-1 relative flex w-full items-center gap-3 truncate
                                     rounded-md px-2 py-1 text-sm hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                             // onClick={() =>

                                             // }
                                          >
                                             {selected ? (
                                                <span
                                                   className="absolute right-2 h-1.5 w-1.5 rounded-full
                                        bg-emerald-500"
                                                />
                                             ) : null}
                                             {row.name}
                                          </button>
                                       </>
                                    )}
                                 </Listbox.Option>
                              )
                           )}
                        </Listbox.Options>
                     </Transition>
                  </div>
               </Listbox>
            </div>
            <div
               className="border-color divide-color bg-2 relative
               mt-2 divide-y rounded-lg border shadow-sm"
            >
               <DndContext
                  onDragEnd={(event) => handleDragEnd(event, editor, element)}
                  modifiers={[restrictToVerticalAxis]}
               >
                  <SortableContext
                     items={itemIds}
                     strategy={verticalListSortingStrategy}
                  >
                     {tierItems?.map((row) => (
                        <SortableItem
                           key={row.id}
                           rowId={row.id}
                           element={element}
                           deleteRow={() => deleteRow(row.id, editor, element)}
                        />
                     ))}
                  </SortableContext>
               </DndContext>
               <div
                  className="text-1 bg-2 relative flex items-center justify-between
                  rounded-b-lg px-3 py-2"
               >
                  <div className="flex w-full items-center gap-3">
                     <Combobox
                        value={selected}
                        onChange={(event) =>
                           handleAddEntry(event, editor, element)
                        }
                     >
                        <div className="flex-grow">
                           <div className="bg-2 flex items-center gap-3">
                              <Combobox.Button className="group">
                                 <div
                                    className="shadow-1 border-color flex h-8 w-8
                                 items-center justify-center rounded-full border bg-white
                                 shadow-sm group-hover:bg-emerald-50 dark:bg-bg3Dark dark:group-hover:bg-zinc-700/50"
                                 >
                                    <Plus
                                       className="text-emerald-500"
                                       size={20}
                                    />
                                 </div>
                              </Combobox.Button>
                              <Combobox.Input
                                 className="bg-2 h-10 w-full border-0 px-0 focus:outline-none focus:ring-0"
                                 placeholder="Add a tier entry..."
                                 onChange={(event) =>
                                    setTierSelectQuery(event.target.value)
                                 }
                              />
                           </div>
                           <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                              afterLeave={() => setTierSelectQuery("")}
                           >
                              <Combobox.Options
                                 className="bg-2 border-color shadow-1 absolute left-0 z-20 mt-4 max-h-60
                              w-full overflow-auto rounded-lg border-2 p-2 shadow-xl focus:outline-none"
                              >
                                 {filteredEntries?.length === 0 &&
                                 tierSelectQuery !== "" ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-sm">
                                       Nothing found.
                                    </div>
                                 ) : (
                                    filteredEntries?.map((entry: Entry) => (
                                       <Combobox.Option
                                          key={entry.id}
                                          className={({ active }) =>
                                             `cursor-default select-none rounded-md py-2 px-3 text-sm font-bold ${
                                                active
                                                   ? "dark:border-emeald-900 shadow-1 bg-zinc-100 shadow-sm dark:bg-bg1Dark"
                                                   : ""
                                             }`
                                          }
                                          value={entry}
                                       >
                                          {entry.name}
                                       </Combobox.Option>
                                    ))
                                 )}
                              </Combobox.Options>
                           </Transition>
                        </div>
                     </Combobox>
                  </div>
               </div>
            </div>

            {/* <form ref={zo.ref}>
                  <input
                     type="text"
                     name={zo.fields.name()}
                     className="bg-3 text-header border-color h-9
                w-20 truncate rounded-md border-2 p-0 px-2
                font-bold focus:border-zinc-200
               focus:ring-0 dark:placeholder:text-zinc-300 focus:dark:border-zinc-700"
                  />
                  <button disabled={disabled} type="submit">
                     Add
                  </button>
               </form> */}
         </>
      </div>
   );
}

const SortableItem = ({
   rowId,
   element,
   deleteRow,
}: {
   rowId: string;
   element: TierElement;
   deleteRow: () => void;
}) => {
   const {
      transition,
      attributes,
      transform,
      isSorting,
      isDragging,
      setActivatorNodeRef,
      setNodeRef,
      listeners,
   } = useSortable({
      id: rowId,
   });

   const row = element.tierItems.find((obj) => {
      return obj.id === rowId;
   });

   return (
      <div
         {...attributes}
         ref={setNodeRef}
         style={
            {
               transition: transition,
               transform: CSS.Transform.toString(transform),
               pointerEvents: isSorting ? "none" : undefined,
               opacity: isDragging ? 0 : 1,
            } as React.CSSProperties /* cast because of css variable */
         }
         className="relative px-4 py-2"
      >
         <Image url={row.icon.url} />
         <div>{row?.name}</div>
         <div
            className="absolute right-2 top-2 flex select-none items-center gap-1 opacity-0 group-hover:opacity-100"
            contentEditable={false}
         >
            <Tooltip side="left" id={`delete-${rowId}`} content="Delete">
               <button
                  className="hover:bg-3 shadow-1 flex h-7 w-7 items-center justify-center rounded-md hover:shadow"
                  onClick={deleteRow}
                  aria-label="Delete"
               >
                  <Minus size={16} />
               </button>
            </Tooltip>
            <Tooltip side="left" id={`drag-${rowId}`} content="Drag to reorder">
               <button
                  type="button"
                  aria-label="Drag to reorder"
                  ref={setActivatorNodeRef}
                  {...listeners}
                  className="hover:bg-3 shadow-1 flex h-7 w-7 cursor-grab items-center justify-center rounded-md hover:shadow"
               >
                  <GripVertical size={16} />
               </button>
            </Tooltip>
         </div>
      </div>
   );
};
