import { ReactEditor, useSlate } from "slate-react";
import type { CustomElement, TierElement } from "../types";
import type { BaseEditor } from "slate";
import { Transforms } from "slate";
import { useDebouncedValue, useIsMount } from "~/hooks";
import { Fragment, useEffect, useMemo, useState } from "react";
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
   ChevronDown,
   ChevronsDown,
   ChevronsUpDown,
   Component,
   Edit,
   GripVertical,
   Minus,
   Plus,
   X,
} from "lucide-react";
import { useMutation } from "~/liveblocks.config";
import { arrayMoveImmutable } from "array-move";
import { Combobox, Listbox, Popover, Transition } from "@headlessui/react";
import { Link, useParams, useRouteLoaderData } from "@remix-run/react";
import type { Collection, Entry, Site } from "payload/generated-types";
import useSWR from "swr";
import { nanoid } from "nanoid";
import { Image } from "~/components";

type Props = {
   element: TierElement;
};

const fetcher = (...args: any) => fetch(args).then((res) => res.json());

export const TIER_COLORS = [
   "#FF7F7F",
   "#FEBF7E",
   "#FFDF7E",
   "#FFFF7F",
   "#BEFF7F",
];

export default function BlockTierList({ element }: Props) {
   const editor = useSlate();

   const isMount = useIsMount();

   const [tierLabel, setTierLabel] = useState(element.tierLabel);

   const { siteId } = useParams();

   const { site } = useRouteLoaderData("routes/$siteId") as { site: Site };

   const [tierSelectQuery, setTierSelectQuery] = useState("");

   const { data: collectionData } = useSWR(
      `https://mana.wiki/api/collections?where[site.slug][equals]=${siteId}&[hiddenCollection][equals]=false`,
      fetcher
   );

   const [selected, setSelected] = useState(collectionData?.docs[0]);

   const [selectedCollection, setSelectedCollection] = useState(
      element.collection
   );

   const { data: entryData } = useSWR(
      `https://${siteId}-db.mana.wiki/api/${selectedCollection}?where[name][contains]=${tierSelectQuery}&depth=1`,
      fetcher
   );

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
      const newProperties: Partial<CustomElement> = {
         ...element,
         tierItems: [
            ...element.tierItems,
            {
               id: nanoid(),
               name: event.name,
               path: `/${siteId}/collections/${selectedCollection}/${
                  event.id
               }/${site.type == "custom" ? "c" : "w"}`,
               iconUrl: event?.icon?.url,
            },
         ],
      };

      updateRowLb(path[0], newProperties);
      setSelectedCollection(event);
      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   }

   function handleUpdateTierBlock(
      event: any,
      editor: BaseEditor & ReactEditor,
      element: TierElement
   ) {
      console.log(event);
      const path = ReactEditor.findPath(editor, element);
      const newProperties: Partial<CustomElement> = {
         ...element,
         color: event,
      };

      updateRowLb(path[0], newProperties);
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
            <div className="flex items-center justify-between pb-2">
               <section className="flex items-center gap-3">
                  <span
                     className="h-7 w-1 rounded-full"
                     style={{
                        backgroundColor: element.color,
                     }}
                  />
                  <input
                     className="bg-3 border-none p-0 font-header text-2xl font-bold focus:ring-0"
                     type="text"
                     placeholder="Tier name..."
                     defaultValue={element.tierLabel}
                     onChange={(event) => setTierLabel(event.target.value)}
                  />
               </section>
               <section className="">
                  <Listbox value={selectedCollection}>
                     <Tooltip id="tier-color" side="top" content="Switch Color">
                        <Listbox.Button
                           className="bg-2 border-color flex h-8 w-8 items-center 
                              justify-center rounded-md border focus:outline-none"
                        >
                           <div
                              style={{
                                 backgroundColor: element.color,
                              }}
                              className="h-3.5 w-3.5 rounded-full"
                           />
                        </Listbox.Button>
                     </Tooltip>
                     <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                     >
                        <Listbox.Options
                           className="border-color text-1 bg-2 shadow-1 absolute -top-9 right-10 z-30 mt-1
                                flex h-8 items-center gap-2 rounded-md border px-2"
                        >
                           {TIER_COLORS?.map(
                              (color: string, rowIdx: number) => (
                                 <Listbox.Option key={rowIdx} value={color}>
                                    <button
                                       type="button"
                                       onClick={() =>
                                          handleUpdateTierBlock(
                                             color,
                                             editor,
                                             element
                                          )
                                       }
                                       className="h-3.5 w-3.5 rounded-full"
                                       key={color}
                                       style={{
                                          backgroundColor: color,
                                       }}
                                    ></button>
                                 </Listbox.Option>
                              )
                           )}
                        </Listbox.Options>
                     </Transition>
                  </Listbox>
               </section>
            </div>
            <div
               className={`${
                  tierItems.length > 0
                     ? "border-color divide-color relative divide-y rounded-lg border shadow-sm"
                     : ""
               } `}
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
                  className={`${
                     tierItems.length > 0
                        ? "rounded-t-none"
                        : "border-color border"
                  } text-1 bg-2 relative flex items-center justify-between
                  rounded-lg p-2`}
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
                                    className="shadow-1 border-color flex h-[30px] w-[30px]
                                 items-center justify-center rounded-full border bg-white
                                 shadow-sm group-hover:bg-zinc-50 dark:bg-bg3Dark dark:group-hover:bg-zinc-700/50"
                                 >
                                    <Plus className="text-zinc-500" size={20} />
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
                                 {filteredEntries?.length === 0 ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-sm">
                                       Nothing found.
                                    </div>
                                 ) : (
                                    filteredEntries?.map((entry: Entry) => (
                                       <Combobox.Option
                                          key={entry.id}
                                          className={({ active }) =>
                                             `cursor-default select-none rounded-md p-2 text-sm font-bold ${
                                                active
                                                   ? "dark:border-emeald-900 shadow-1 bg-zinc-100 shadow-sm dark:bg-bg1Dark"
                                                   : ""
                                             } flex items-center gap-2`
                                          }
                                          value={entry}
                                       >
                                          <>
                                             <span
                                                className="border-color shadow-1 flex h-8 w-8 flex-none items-center
                                             justify-between overflow-hidden rounded-full border-2 shadow-sm"
                                             >
                                                {/* @ts-expect-error */}
                                                {entry?.icon?.url ? (
                                                   <Image
                                                      url={entry?.icon?.url}
                                                      options="fit=crop,width=60,height=60,gravity=auto"
                                                      alt={
                                                         entry?.name ?? "Icon"
                                                      }
                                                   />
                                                ) : (
                                                   <Component
                                                      className="text-1 mx-auto"
                                                      size={18}
                                                   />
                                                )}
                                             </span>
                                             <span className="flex-grow">
                                                {entry.name}
                                             </span>
                                          </>
                                       </Combobox.Option>
                                    ))
                                 )}
                              </Combobox.Options>
                           </Transition>
                        </div>
                     </Combobox>
                  </div>
                  <Listbox
                     value={selectedCollection}
                     onChange={(event) =>
                        handleUpdateCollection(event, editor, element)
                     }
                  >
                     <div className="relative z-10 flex-none">
                        <Listbox.Button
                           className="text-1 bg-3 z-20 flex items-center gap-1.5
                        rounded-full px-4 py-2 text-xs font-bold shadow hover:underline"
                        >
                           {({ value }) => (
                              <>
                                 {activeSelectItem(value) ??
                                    "Select a Collection"}
                                 <ChevronDown
                                    className="text-zinc-500"
                                    size={18}
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
                              className="border-color text-1 bg-2 shadow-1 absolute right-0
                           z-30 mt-1 w-[160px] rounded-lg border p-1.5 shadow-lg"
                           >
                              {collectionData?.docs?.map(
                                 (row: Collection, rowIdx: number) => (
                                    <Listbox.Option
                                       key={rowIdx}
                                       value={row.slug}
                                    >
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
                                        bg-zinc-500"
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
            </div>
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
         className="bg-2 relative flex items-center justify-between gap-2 p-2 first:rounded-t-lg"
      >
         <Link
            key={row?.id}
            to={row?.path ?? ""}
            prefetch="intent"
            className="bg-2 flex flex-grow items-center gap-3 hover:underline"
         >
            <div
               style={{
                  borderColor: element.color,
               }}
               className="shadow-1 flex h-8 w-8 items-center
               justify-between overflow-hidden rounded-full border shadow-sm"
            >
               {row?.iconUrl ? (
                  <Image
                     url={row?.iconUrl}
                     options="fit=crop,width=60,height=60,gravity=auto"
                     alt={row?.name ?? "Icon"}
                  />
               ) : (
                  <Component className="text-1 mx-auto" size={18} />
               )}
            </div>
            <span>{row?.name}</span>
         </Link>
         <div
            className="flex select-none items-center gap-1 opacity-0 group-hover:opacity-100"
            contentEditable={false}
         >
            <Tooltip side="left" id={`delete-${rowId}`} content="Delete">
               <button
                  className="hover:bg-3 shadow-1 flex h-7 w-7 items-center justify-center rounded-md hover:shadow"
                  onClick={deleteRow}
                  aria-label="Delete"
               >
                  <X size={16} />
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
         <Tooltip side="left" id={`edit-${rowId}`} content="Edit">
            {/* <span className="shadow-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm dark:bg-bg3Dark"> */}
            <Edit className="text-1 mr-2" size={18} />
            {/* </span> */}
         </Tooltip>
      </div>
   );
};
