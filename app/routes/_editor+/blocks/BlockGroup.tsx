import { Fragment, useMemo, useState } from "react";

import {
   DragOverlay,
   DndContext,
   type DragEndEvent,
   type DragStartEvent,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
   SortableContext,
   rectSortingStrategy,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Combobox, Listbox, RadioGroup, Transition } from "@headlessui/react";
import { useMatches, useParams } from "@remix-run/react";
import { arrayMoveImmutable } from "array-move";
import {
   Rows,
   ChevronDown,
   Columns,
   Component,
   Database,
   GripVertical,
   LayoutGrid,
   List,
   Move,
   Pencil,
   Plus,
   Trash,
} from "lucide-react";
import { nanoid } from "nanoid";
import { Transforms, createEditor } from "slate";
import type { BaseEditor } from "slate";
import { Editable, ReactEditor, Slate, useSlate, withReact } from "slate-react";
import useSWR from "swr";

import { settings } from "mana-config";
import type { Collection, Entry, Site } from "payload/generated-types";
import customConfig from "~/_custom/config.json";
import { Image } from "~/components";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
// eslint-disable-next-line import/no-cycle
import { Block } from "~/routes/_editor+/blocks/Block";
import { Leaf } from "~/routes/_editor+/blocks/Leaf";
import { onKeyDown } from "~/routes/_editor+/functions/editorCore";
import { swrRestFetcher } from "~/utils";

import Toolbar from "../components/Toolbar";
import type {
   CustomElement,
   GroupElement,
   groupItem,
} from "../functions/types";

type Props = {
   element: GroupElement;
};

export const GROUP_COLORS = [
   "#a1a1aa",
   "#f87171",
   "#fb923c",
   "#facc15",
   "#4ade80",
   "#60a5fa",
   "#c084fc",
   "#f472b6",
];

export function BlockGroup({ element }: Props) {
   const editor = useSlate();

   const siteId = useParams()?.siteId ?? customConfig?.siteId;

   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const site = useMatches()?.[1]?.data?.site as Site;

   const [groupSelectQuery, setGroupSelectQuery] = useState("");

   const siteType = site.type;

   //Get collection data, used to populate select
   const { data: collectionData } = useSWR(
      `${settings.domainFull}/api/collections?where[site.slug][equals]=${siteId}&[hiddenCollection][equals]=false`,
      swrRestFetcher
   );

   const defaultOptions = [
      { slug: "post", name: "Post" },
      { slug: "site", name: "Site" },
   ];

   const selectOptions = collectionData
      ? [...defaultOptions, ...collectionData?.docs]
      : defaultOptions;

   const [selected] = useState();

   const [selectedCollection, setSelectedCollection] = useState(
      element.collection
   );

   const getDataType = () => {
      //For posts and site
      if (defaultOptions.some((e) => e.slug === selectedCollection)) {
         switch (selectedCollection) {
            case "post": {
               return `${settings.domainFull}/api/posts?where[site.slug][equals]=${siteId}&where[name][contains]=${groupSelectQuery}&depth=1`;
            }
            case "site": {
               return `${settings.domainFull}/api/sites?where[name][contains]=${groupSelectQuery}&depth=1`;
            }
            default:
               return null;
         }
      }
      //For entries
      if (siteType == "custom") {
         return `https://${siteId}-db.${settings.domain}/api/${selectedCollection}?where[name][contains]=${groupSelectQuery}&depth=1`;
      }
      if (siteType == "core") {
         return `${settings.domainFull}/api/entries?where[site.slug][equals]=${siteId}&where[collectionEntity.slug][equals]=${selectedCollection}&where[name][contains]=${groupSelectQuery}&depth=1`;
      }
   };

   //Get custom entry data to populate icon and title
   const { data: entryData } = useSWR(() => getDataType(), swrRestFetcher);

   const filteredEntries =
      groupSelectQuery === ""
         ? entryData?.docs
         : entryData?.docs.filter((item: Entry) =>
              item.name
                 .toLowerCase()
                 .replace(/\s+/g, "")
                 .includes(groupSelectQuery.toLowerCase().replace(/\s+/g, ""))
           );

   const groupItems = element.groupItems;

   //DND kit needs array of strings
   const itemIds = useMemo(
      () => groupItems.map((item) => item.id),
      [groupItems]
   );

   function handleUpdateCollection(
      event: any,
      editor: BaseEditor & ReactEditor,
      element: GroupElement
   ) {
      const path = ReactEditor.findPath(editor, element);

      const newProperties: Partial<CustomElement> = {
         ...element,
         collection: event,
      };

      setSelectedCollection(event);
      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   }

   function handleAddEntry(
      event: any,
      editor: BaseEditor & ReactEditor,
      element: GroupElement
   ) {
      const path = ReactEditor.findPath(editor, element);

      const rowPath = () => {
         switch (selectedCollection) {
            case "site": {
               return `/${event.slug}`;
            }
            case "post": {
               return `/${siteId}/posts/${event.id}/${event.url}`;
            }
            default:
               return `/${siteId}/collections/${selectedCollection}/${event.id}`;
         }
      };

      const isCustomSite = event.type == "custom" ? true : false;

      const newProperties: Partial<CustomElement> = {
         ...element,
         groupItems: [
            ...element.groupItems,
            {
               id: nanoid(),
               labelColor: GROUP_COLORS["0"],
               isCustomSite,
               refId: event.id,
               name: event.name,
               path: rowPath(),
               iconUrl: event?.icon?.url ?? event?.banner?.url,
            },
         ],
      };
      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   }

   function handleUpdateViewMode(
      event: any,
      editor: BaseEditor & ReactEditor,
      element: GroupElement
   ) {
      const path = ReactEditor.findPath(editor, element);
      const newProperties: Partial<CustomElement> = {
         ...element,
         viewMode: event,
      };
      setViewMode(event);

      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   }

   function handleUpdateItemsViewMode(
      event: any,
      editor: BaseEditor & ReactEditor,
      element: GroupElement
   ) {
      const path = ReactEditor.findPath(editor, element);
      const newProperties: Partial<CustomElement> = {
         ...element,
         itemsViewMode: event,
      };
      setItemsViewMode(event);

      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   }

   // DND Functions

   const [activeId, setActiveId] = useState<string | null>(null);

   const activeElement = findNestedObj(
      editor.children,
      "id",
      activeId
   ) as unknown as groupItem;

   //From https://stackoverflow.com/questions/15523514/find-by-key-deep-in-a-nested-array
   function findNestedObj(
      entireObj: object,
      keyToFind: string,
      valToFind: string | null
   ) {
      let foundObj;
      JSON.stringify(entireObj, (_, nestedValue) => {
         if (nestedValue && nestedValue[keyToFind] === valToFind) {
            foundObj = nestedValue;
         }
         return nestedValue;
      });
      return foundObj;
   }

   function handleDragStart(event: DragStartEvent) {
      setActiveId(event.active.id as string);
   }

   function handleDragEnd(
      event: DragEndEvent,
      editor: BaseEditor & ReactEditor,
      element: GroupElement
   ) {
      const { active, over } = event;

      if (active.id !== over?.id) {
         const groupItems = element.groupItems;

         const oldIndex = groupItems.findIndex((obj) => {
            return obj.id === active.id;
         });

         const newIndex = groupItems.findIndex((obj) => {
            return obj.id === over?.id;
         });

         const updatedGroupItems = arrayMoveImmutable(
            groupItems,
            oldIndex,
            newIndex
         );

         const path = ReactEditor.findPath(editor, element);

         const newProperties: Partial<CustomElement> = {
            ...element,
            groupItems: updatedGroupItems,
         };

         //Now we update the local SlateJS state
         return Transforms.setNodes<CustomElement>(editor, newProperties, {
            at: path,
         });
      }
   }

   function deleteRow(
      id: string,
      editor: BaseEditor & ReactEditor,
      element: GroupElement
   ) {
      const groupItems = element.groupItems;

      const path = ReactEditor.findPath(editor, element);

      const updatedGroupItems = groupItems.filter((item) => item.id !== id);

      const newProperties: Partial<CustomElement> = {
         ...element,
         groupItems: updatedGroupItems,
      };

      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   }

   const activeSelectItem = (item: any) =>
      selectOptions.find((obj) => obj.slug === item)?.name;

   const [viewMode, setViewMode] = useState(element.viewMode);
   const [itemsViewMode, setItemsViewMode] = useState(element.itemsViewMode);

   return (
      <div className="my-2">
         <section className="mb-3 flex items-center justify-between gap-3">
            <div
               className="text-1 bg-2 border-color shadow-1 relative flex
                  h-14 flex-grow items-center justify-between rounded-xl border px-2 shadow-sm"
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
                                 <Plus size={20} />
                              </div>
                           </Combobox.Button>
                           <Combobox.Input
                              autoFocus
                              className="bg-2 h-10 w-full border-0 px-0 focus:outline-none focus:ring-0"
                              placeholder="Search..."
                              onChange={(event) =>
                                 setGroupSelectQuery(event.target.value)
                              }
                           />
                        </div>
                        <Transition
                           as={Fragment}
                           leave="transition ease-in duration-100"
                           leaveFrom="opacity-100"
                           leaveTo="opacity-0"
                           afterLeave={() => setGroupSelectQuery("")}
                        >
                           <Combobox.Options
                              className="bg-2 border-color shadow-1 absolute left-0 z-30 mt-3 max-h-60
                              w-full overflow-auto rounded-lg border p-2 shadow-xl focus:outline-none"
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
                                             {entry?.icon?.url ? (
                                                <Image
                                                   url={entry?.icon?.url}
                                                   options="aspect_ratio=1:1&height=80&width=80"
                                                   alt={entry?.name ?? "Icon"}
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
                  <div className="relative z-30 flex-none">
                     <Listbox.Button
                        className="text-1 flex items-center gap-1.5
                        p-2 text-sm font-bold hover:underline"
                     >
                        {({ value }) => (
                           <>
                              {activeSelectItem(value) ?? "Select a Collection"}
                              <ChevronDown size={20} />
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
                           className="border-color bg-2 shadow-1 absolute right-0
                           z-20 mt-1 w-[160px] rounded-lg border p-1.5 shadow-lg"
                        >
                           {collectionData?.docs?.map(
                              (row: Collection, rowIdx: number) => (
                                 <Listbox.Option key={rowIdx} value={row.slug}>
                                    {({ selected }) => (
                                       <>
                                          <button
                                             className="relative flex w-full items-center gap-3 truncate
                                     rounded-md px-2 py-1 text-sm hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                          >
                                             {selected ? (
                                                <span className="absolute right-2 h-1.5 w-1.5 rounded-full" />
                                             ) : null}
                                             <Database
                                                className="text-1"
                                                size={14}
                                             />
                                             {row.name}
                                          </button>
                                       </>
                                    )}
                                 </Listbox.Option>
                              )
                           )}
                           <Listbox.Option key="post" value="post">
                              {({ selected }) => (
                                 <>
                                    <button
                                       className="relative flex w-full items-center gap-3 truncate
                                     rounded-md px-2 py-1 text-sm hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                    >
                                       {selected ? (
                                          <span className="absolute right-2 h-1.5 w-1.5 rounded-full" />
                                       ) : null}
                                       <Pencil className="text-1" size={14} />
                                       Post
                                    </button>
                                 </>
                              )}
                           </Listbox.Option>
                           <Listbox.Option key="site" value="site">
                              {({ selected }) => (
                                 <>
                                    <button
                                       className="relative flex w-full items-center gap-3 truncate
                                     rounded-md px-2 py-1 text-sm hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                    >
                                       {selected ? (
                                          <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-zinc-500" />
                                       ) : null}
                                       <Component
                                          className="text-1"
                                          size={14}
                                       />
                                       Site
                                    </button>
                                 </>
                              )}
                           </Listbox.Option>
                        </Listbox.Options>
                     </Transition>
                  </div>
               </Listbox>
               <RadioGroup
                  className="flex cursor-pointer items-center gap-1"
                  value={itemsViewMode}
                  onChange={(event) =>
                     handleUpdateItemsViewMode(event, editor, element)
                  }
               >
                  <RadioGroup.Option value="list">
                     {({ checked }) => (
                        <Tooltip>
                           <TooltipTrigger>
                              <div
                                 className={`${
                                    checked
                                       ? "shadow-1 bg-white shadow dark:bg-zinc-700"
                                       : ""
                                 }
                                 flex h-7 w-7 items-center justify-center rounded`}
                              >
                                 <RadioGroup.Label className="sr-only">
                                    List View
                                 </RadioGroup.Label>
                                 <List
                                    className={`${
                                       checked ? "text-zinc-500" : ""
                                    }`}
                                    size={16}
                                 />
                              </div>
                           </TooltipTrigger>
                           <TooltipContent>List View</TooltipContent>
                        </Tooltip>
                     )}
                  </RadioGroup.Option>
                  <RadioGroup.Option value="grid">
                     {({ checked }) => (
                        <Tooltip>
                           <TooltipTrigger>
                              <div
                                 className={`${
                                    checked
                                       ? "shadow-1 bg-white shadow dark:bg-zinc-700"
                                       : ""
                                 }
                           flex h-7 w-7 items-center justify-center rounded`}
                              >
                                 <RadioGroup.Label className="sr-only">
                                    Grid View
                                 </RadioGroup.Label>
                                 <LayoutGrid
                                    className={`${
                                       checked ? "text-zinc-500" : ""
                                    }`}
                                    size={16}
                                 />
                              </div>
                           </TooltipTrigger>
                           <TooltipContent>Gird View</TooltipContent>
                        </Tooltip>
                     )}
                  </RadioGroup.Option>
               </RadioGroup>
            </div>

            <RadioGroup
               className="bg-2 shadow-1 border-color flex h-14 
                  cursor-pointer items-center gap-1 rounded-lg border px-2.5 shadow-sm"
               value={viewMode}
               onChange={(event) =>
                  handleUpdateViewMode(event, editor, element)
               }
            >
               <RadioGroup.Option value="1-col">
                  {({ checked }) => (
                     <Tooltip>
                        <TooltipTrigger>
                           <div
                              className={`${
                                 checked
                                    ? "shadow-1 bg-white shadow dark:bg-zinc-700"
                                    : ""
                              }
                                 flex h-8 w-8 items-center justify-center rounded`}
                           >
                              <RadioGroup.Label className="sr-only">
                                 List View
                              </RadioGroup.Label>
                              <Rows
                                 className={`${checked ? "text-zinc-500" : ""}`}
                                 size={16}
                              />
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>1-Column</TooltipContent>
                     </Tooltip>
                  )}
               </RadioGroup.Option>
               <RadioGroup.Option value="2-col">
                  {({ checked }) => (
                     <Tooltip>
                        <TooltipTrigger>
                           <div
                              className={`${
                                 checked
                                    ? "shadow-1 bg-white shadow dark:bg-zinc-700"
                                    : ""
                              }
                           flex h-8 w-8 items-center justify-center rounded`}
                           >
                              <RadioGroup.Label className="sr-only">
                                 2-Columns
                              </RadioGroup.Label>
                              <Columns
                                 className={`${checked ? "text-zinc-500" : ""}`}
                                 size={16}
                              />
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>2-Columns</TooltipContent>
                     </Tooltip>
                  )}
               </RadioGroup.Option>
            </RadioGroup>
         </section>
         <section>
            <DndContext
               onDragStart={handleDragStart}
               onDragEnd={(event) => handleDragEnd(event, editor, element)}
            >
               <SortableContext
                  items={itemIds}
                  strategy={
                     itemsViewMode == "list"
                        ? verticalListSortingStrategy
                        : rectSortingStrategy
                  }
               >
                  {groupItems?.length === 0 ? null : itemsViewMode == "list" ? (
                     <>
                        {viewMode == "1-col" && (
                           <>
                              <div
                                 className="border-color divide-color shadow-1 relative
                                 mb-2.5 divide-y overflow-hidden rounded-lg border shadow-sm"
                              >
                                 {groupItems?.map((row) => (
                                    <SortableListItem
                                       editor={editor}
                                       key={row.id}
                                       rowId={row.id}
                                       element={element}
                                       deleteRow={() =>
                                          deleteRow(row.id, editor, element)
                                       }
                                    />
                                 ))}
                              </div>
                           </>
                        )}
                        {viewMode == "2-col" && (
                           <div className="grid laptop:grid-cols-2 laptop:gap-4">
                              <div>
                                 <div
                                    className="border-color divide-color shadow-1 relative
                                    mb-2.5 divide-y overflow-hidden rounded-lg border shadow-sm"
                                 >
                                    {groupItems?.map((row) => (
                                       <SortableListItem
                                          editor={editor}
                                          key={row.id}
                                          rowId={row.id}
                                          element={element}
                                          deleteRow={() =>
                                             deleteRow(row.id, editor, element)
                                          }
                                       />
                                    ))}
                                 </div>
                              </div>
                              <div>
                                 <InlineEditor
                                    editor={editor}
                                    element={element}
                                 />
                              </div>
                           </div>
                        )}
                     </>
                  ) : (
                     <>
                        {viewMode == "1-col" && (
                           <>
                              <div className="grid grid-cols-2 gap-3 pb-2.5 tablet:grid-cols-3 laptop:grid-cols-2 desktop:grid-cols-4">
                                 {groupItems?.map((row) => (
                                    <SortableGridItem
                                       editor={editor}
                                       key={row.id}
                                       rowId={row.id}
                                       element={element}
                                       deleteRow={() =>
                                          deleteRow(row.id, editor, element)
                                       }
                                    />
                                 ))}
                              </div>
                           </>
                        )}
                        {viewMode == "2-col" && (
                           <div className="grid laptop:grid-cols-2 laptop:gap-4">
                              <div>
                                 <div className="grid grid-cols-2 gap-3 pb-2.5">
                                    {groupItems?.map((row) => (
                                       <SortableGridItem
                                          editor={editor}
                                          key={row.id}
                                          rowId={row.id}
                                          element={element}
                                          deleteRow={() =>
                                             deleteRow(row.id, editor, element)
                                          }
                                       />
                                    ))}
                                 </div>
                              </div>
                              <div>
                                 <InlineEditor
                                    editor={editor}
                                    element={element}
                                 />
                              </div>
                           </div>
                        )}
                     </>
                  )}
               </SortableContext>
               <DragOverlay modifiers={[restrictToParentElement]}>
                  {activeElement && itemsViewMode == "list" ? (
                     <div className="p-1.5">
                        <div
                           className="bg-1 shadow-1 border-color flex items-center
                               justify-between gap-3 rounded-lg border p-1.5 shadow"
                        >
                           <div className="flex items-center gap-3">
                              <div
                                 className="shadow-1 flex h-8 w-8 items-center
                                justify-between overflow-hidden rounded-full border shadow-sm"
                              >
                                 {activeElement?.iconUrl ? (
                                    <Image
                                       url={activeElement?.iconUrl}
                                       options="aspect_ratio=1:1&height=80&width=80"
                                       alt={activeElement?.name ?? "Icon"}
                                    />
                                 ) : (
                                    <Component
                                       className="text-1 mx-auto"
                                       size={18}
                                    />
                                 )}
                              </div>
                              <div className="truncate">
                                 {activeElement?.name}
                              </div>
                           </div>
                           <div className="bg-3 shadow-1 flex h-7 w-7 cursor-grab items-center justify-center rounded-md shadow">
                              <GripVertical className="text-1" size={16} />
                           </div>
                        </div>
                     </div>
                  ) : itemsViewMode == "grid" ? (
                     <div className="bg-1 border-color shadow-1 relative rounded-md border p-3 shadow">
                        <div className="bg-3 shadow-1 absolute right-1 top-1 flex h-7 w-7 cursor-grab items-center justify-center rounded-md hover:shadow">
                           <Move className="text-1" size={16} />
                        </div>
                        <div
                           className="shadow-1 mx-auto mb-1.5 flex h-14 w-14
                           items-center overflow-hidden rounded-full border-2 shadow-sm"
                        >
                           {activeElement?.iconUrl ? (
                              <Image
                                 url={activeElement?.iconUrl}
                                 options="aspect_ratio=1:1&height=80&width=80"
                                 alt={activeElement?.name ?? "Icon"}
                              />
                           ) : (
                              <Component className="text-1 mx-auto" size={18} />
                           )}
                        </div>
                        <div className="text-1 truncate text-center text-xs font-bold">
                           {activeElement?.name}
                        </div>
                     </div>
                  ) : null}
               </DragOverlay>
            </DndContext>
         </section>
      </div>
   );
}

const InlineEditor = ({
   editor,
   element,
}: {
   editor: BaseEditor & ReactEditor;
   element: GroupElement;
}) => {
   const inlineEditor = useMemo(() => withReact(createEditor()), []);

   const updateContentValue = (event: any) => {
      const path = ReactEditor.findPath(editor, element);
      const newProperties: Partial<CustomElement> = {
         ...element,
         content: event,
      };
      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   };

   return (
      <div>
         <Slate
            onChange={(e) => updateContentValue(e)}
            editor={inlineEditor}
            // @ts-ignore
            initialValue={
               element.content ?? [
                  {
                     type: "paragraph",
                     children: [{ text: "" }],
                  },
               ]
            }
         >
            {/* @ts-ignore */}
            <Toolbar />
            <Editable
               placeholder="Start writing..."
               renderElement={Block}
               renderLeaf={Leaf}
               onKeyDown={(e) => onKeyDown(e, inlineEditor)}
            />
         </Slate>
      </div>
   );
};

const SortableListItem = ({
   editor,
   rowId,
   element,
   deleteRow,
}: {
   editor: BaseEditor & ReactEditor;
   rowId: string;
   element: GroupElement;
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

   const row = element.groupItems.find((obj) => {
      return obj.id === rowId;
   });

   const updateLabelColor = (event: any) => {
      const path = ReactEditor.findPath(editor, element);
      const currentGroupItems = element.groupItems;
      const groupItems = currentGroupItems.map((x) =>
         x.id === rowId ? { ...x, labelColor: event } : x
      );

      const newProperties: Partial<CustomElement> = {
         ...element,
         groupItems,
      };

      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   };

   const updateLabelValue = (event: any) => {
      const path = ReactEditor.findPath(editor, element);
      const currentGroupItems = element.groupItems;
      const groupItems = currentGroupItems.map((x) =>
         x.id === rowId ? { ...x, label: event } : x
      );

      const newProperties: Partial<CustomElement> = {
         ...element,
         groupItems,
      };
      setLabelValue(event);

      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   };

   const [labelValue, setLabelValue] = useState(row?.label);

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
         className="bg-2 relative"
      >
         <div className="flex items-center justify-between gap-2 p-2.5">
            <div className="bg-2 flex flex-grow items-center gap-3 truncate hover:underline">
               <div
                  className="shadow-1 border-color flex h-8 w-8 items-center
               justify-between overflow-hidden rounded-full border-2 shadow-sm"
               >
                  {row?.iconUrl ? (
                     <Image
                        url={row?.iconUrl}
                        options="aspect_ratio=1:1&height=80&width=80"
                        alt={row?.name ?? "Icon"}
                     />
                  ) : (
                     <Component className="text-1 mx-auto" size={18} />
                  )}
               </div>
               <span className="text-1 truncate text-sm font-bold">
                  {row?.name}
               </span>
            </div>
            <div className="absolute left-2 flex items-center gap-3 opacity-0 group-hover:opacity-100">
               <Tooltip>
                  <TooltipTrigger> Drag to reorder</TooltipTrigger>
                  <TooltipContent>
                     <button
                        type="button"
                        aria-label="Drag to reorder"
                        ref={setActivatorNodeRef}
                        {...listeners}
                        className="bg-3 shadow-1 flex h-7 w-7 cursor-grab items-center justify-center rounded-md shadow"
                     >
                        <GripVertical className="text-1" size={16} />
                     </button>
                  </TooltipContent>
               </Tooltip>

               <Tooltip>
                  <TooltipTrigger>
                     <button
                        className="bg-3 shadow-1 flex h-7 w-7 items-center justify-center rounded-md shadow"
                        onClick={deleteRow}
                        aria-label="Delete"
                     >
                        <Trash
                           className="text-zinc-400 dark:text-zinc-500"
                           size={16}
                        />
                     </button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
               </Tooltip>
            </div>
            <div className="flex flex-none items-center justify-center">
               <Listbox value={row?.labelColor}>
                  <Listbox.Button
                     className="bg-2 hidden h-7 w-7 items-center justify-center
                              rounded-full focus:outline-none group-hover:flex"
                  >
                     <div
                        style={{
                           backgroundColor: row?.labelColor,
                        }}
                        className="h-3 w-3 rounded-full"
                     />
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
                        className="border-color text-1 bg-2 shadow-1 absolute -top-4 right-7 z-30 flex
                              min-w-[100px] items-center justify-center gap-2 rounded-full border p-2"
                     >
                        {GROUP_COLORS?.map((color: string, rowIdx: number) => (
                           <Listbox.Option
                              className="flex items-center justify-center"
                              key={rowIdx}
                              value={color}
                           >
                              <button
                                 type="button"
                                 onClick={() => updateLabelColor(color)}
                                 className="h-3.5 w-3.5 rounded-full"
                                 key={color}
                                 style={{
                                    backgroundColor: color,
                                 }}
                              ></button>
                           </Listbox.Option>
                        ))}
                     </Listbox.Options>
                  </Transition>
               </Listbox>
               <input
                  style={{
                     backgroundColor: `${row?.labelColor}33`,
                  }}
                  onChange={(event) => updateLabelValue(event.target.value)}
                  value={labelValue}
                  type="text"
                  className="h-6 w-20 rounded-full border-0 text-center text-[10px] font-bold uppercase"
               />
            </div>
         </div>
      </div>
   );
};

const SortableGridItem = ({
   rowId,
   element,
   deleteRow,
   editor,
}: {
   rowId: string;
   editor: BaseEditor & ReactEditor;
   element: GroupElement;
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

   const row = element.groupItems.find((obj) => {
      return obj.id === rowId;
   });

   const updateLabelColor = (event: any) => {
      const path = ReactEditor.findPath(editor, element);
      const currentGroupItems = element.groupItems;
      const groupItems = currentGroupItems.map((x) =>
         x.id === rowId ? { ...x, labelColor: event } : x
      );

      const newProperties: Partial<CustomElement> = {
         ...element,
         groupItems,
      };

      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   };

   const updateLabelValue = (event: any) => {
      const path = ReactEditor.findPath(editor, element);
      const currentGroupItems = element.groupItems;
      const groupItems = currentGroupItems.map((x) =>
         x.id === rowId ? { ...x, label: event } : x
      );

      const newProperties: Partial<CustomElement> = {
         ...element,
         groupItems,
      };
      setLabelValue(event);

      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   };

   const [labelValue, setLabelValue] = useState(row?.label);

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
         className="bg-2 border-color shadow-1 relative rounded-lg border p-3 shadow-sm"
      >
         <div
            className="absolute left-0 top-0 flex w-full select-none 
         items-center justify-between gap-1 p-1 opacity-0 group-hover:opacity-100"
         >
            <Tooltip>
               <TooltipTrigger>
                  <button
                     className="hover:bg-3 shadow-1 flex h-7 w-7 items-center justify-center rounded-full hover:shadow"
                     onClick={deleteRow}
                     aria-label="Delete"
                  >
                     <Trash
                        className="text-zinc-400 dark:text-zinc-500"
                        size={16}
                     />
                  </button>
               </TooltipTrigger>
               <TooltipContent>Delete</TooltipContent>
            </Tooltip>

            <Tooltip>
               <TooltipTrigger>
                  <button
                     type="button"
                     aria-label="Drag to reorder"
                     ref={setActivatorNodeRef}
                     {...listeners}
                     className="hover:bg-3 shadow-1 flex h-7 w-7 cursor-grab items-center justify-center rounded-md hover:shadow"
                  >
                     <Move className="text-1" size={16} />
                  </button>
               </TooltipTrigger>
               <TooltipContent>Drag to reorder</TooltipContent>
            </Tooltip>
         </div>
         <div className="block truncate">
            <div className="relative z-20 mx-auto flex w-20 items-center justify-center pt-0.5">
               <input
                  style={{
                     backgroundColor: `${row?.labelColor}33`,
                  }}
                  onChange={(event) => updateLabelValue(event.target.value)}
                  value={labelValue}
                  type="text"
                  className="h-5 w-20 rounded-full border-0 text-center text-[10px] font-bold uppercase"
               />
            </div>
            <div
               className="shadow-1 border-color mx-auto mt-2 flex h-[60px] w-[60px]
               items-center overflow-hidden rounded-full border-2 shadow"
            >
               {row?.iconUrl ? (
                  <Image
                     url={row?.iconUrl}
                     options="aspect_ratio=1:1&height=120&width=120"
                     alt={row?.name ?? "Icon"}
                  />
               ) : (
                  <Component className="text-1 mx-auto" size={18} />
               )}
            </div>
            <div className="text-1 truncate pt-1 text-center text-sm font-bold">
               {row?.name}
            </div>
         </div>
         <div className="absolute bottom-2 left-1 hidden group-hover:block">
            <Listbox value={row?.labelColor}>
               <Listbox.Button
                  className="bg-2 flex h-7 w-7 items-center 
                              justify-center rounded-full focus:outline-none"
               >
                  <div
                     style={{
                        backgroundColor: row?.labelColor,
                     }}
                     className="h-3 w-3 rounded-full"
                  />
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
                     className="border-color text-1 bg-2 shadow-1 absolute -top-20 left-2 z-30 grid
                              min-w-[100px] grid-cols-4 items-center justify-center gap-2 rounded-lg border p-2"
                  >
                     {GROUP_COLORS?.map((color: string, rowIdx: number) => (
                        <Listbox.Option
                           className="flex items-center justify-center"
                           key={rowIdx}
                           value={color}
                        >
                           <button
                              type="button"
                              onClick={() => updateLabelColor(color)}
                              className="h-3.5 w-3.5 rounded-full"
                              key={color}
                              style={{
                                 backgroundColor: color,
                              }}
                           ></button>
                        </Listbox.Option>
                     ))}
                  </Listbox.Options>
               </Transition>
            </Listbox>
         </div>
      </div>
   );
};
