import { ReactEditor, useSlate } from "slate-react";
import type { CustomElement, GroupElement, groupRow } from "../types";
import type { BaseEditor } from "slate";
import { Transforms } from "slate";
import { useDebouncedValue, useIsMount } from "~/hooks";
import { Fragment, useEffect, useMemo, useState } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DragOverlay } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
   SortableContext,
   rectSortingStrategy,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Tooltip from "~/components/Tooltip";
import {
   ChevronDown,
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
import { useMutation } from "~/liveblocks.config";
import { arrayMoveImmutable } from "array-move";
import { Combobox, Listbox, RadioGroup, Transition } from "@headlessui/react";
import { Link, useParams, useRouteLoaderData } from "@remix-run/react";
import type { Collection, Entry, Site } from "payload/generated-types";
import useSWR from "swr";
import { nanoid } from "nanoid";
import { Image } from "~/components";
import TextareaAutosize from "react-textarea-autosize";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

type Props = {
   element: GroupElement;
};

const fetcher = (...args: any) => fetch(args).then((res) => res.json());

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

export default function BlockGroup({ element }: Props) {
   const editor = useSlate();

   const isMount = useIsMount();

   const [groupLabel, setGroupLabel] = useState(element.groupLabel);

   const { siteId } = useParams();

   const { site } = useRouteLoaderData("routes/$siteId") as { site: Site };

   const [groupSelectQuery, setGroupSelectQuery] = useState("");

   const siteType = site.type;

   //Get collection data, used to populate select
   const { data: collectionData } = useSWR(
      `https://mana.wiki/api/collections?where[site.slug][equals]=${siteId}&[hiddenCollection][equals]=false`,
      fetcher
   );

   const defaultOptions = [
      { slug: "post", name: "Post" },
      { slug: "site", name: "Site" },
   ];

   const selectOptions = collectionData
      ? [].concat(defaultOptions, collectionData?.docs)
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
               return `https://mana.wiki/api/posts?where[site.slug][equals]=${siteId}&where[name][contains]=${groupSelectQuery}&depth=1`;
            }
            case "site": {
               return `https://mana.wiki/api/sites?where[name][contains]=${groupSelectQuery}&depth=1`;
            }
            default:
               return null;
         }
      }
      //For entries
      if (siteType == "custom") {
         return `https://${siteId}-db.mana.wiki/api/${selectedCollection}?where[name][contains]=${groupSelectQuery}&depth=1`;
      }
      if (siteType == "core") {
         return `https://mana.wiki/api/entries?where[site.slug][equals]=${siteId}&where[collectionEntity.slug][equals]=${selectedCollection}&where[name][contains]=${groupSelectQuery}&depth=1`;
      }
   };

   //Get custom entry data to popular icon and title
   const { data: entryData } = useSWR(() => getDataType(), fetcher);

   const filteredEntries =
      groupSelectQuery === ""
         ? entryData?.docs
         : entryData?.docs.filter((item: Entry) =>
              item.name
                 .toLowerCase()
                 .replace(/\s+/g, "")
                 .includes(groupSelectQuery.toLowerCase().replace(/\s+/g, ""))
           );

   const debouncedGroupLabel = useDebouncedValue(groupLabel, 500);

   useEffect(() => {
      if (!isMount) {
         const path = ReactEditor.findPath(editor, element);
         const newProperties: Partial<CustomElement> = {
            groupLabel: groupLabel,
         };
         return Transforms.setNodes<CustomElement>(editor, newProperties, {
            at: path,
         });
      }
   }, [debouncedGroupLabel]);

   const groupItems = element.groupItems;

   //DND kit needs array of strings
   const itemIds = useMemo(
      () => groupItems.map((item) => item.id),
      [groupItems]
   );

   const updateRowLb = useMutation(({ storage }, index, value) => {
      const blocks = storage.get("blocks");
      blocks.set(index, value);
   }, []);

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

      updateRowLb(path[0], newProperties);
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
      console.log(isCustomSite);
      const newProperties: Partial<CustomElement> = {
         ...element,
         groupItems: [
            ...element.groupItems,
            {
               id: nanoid(),
               isCustomSite,
               refId: event.id,
               name: event.name,
               path: rowPath(),
               iconUrl: event?.icon?.url ?? event?.banner?.url,
            },
         ],
      };

      updateRowLb(path[0], newProperties);
      setSelectedCollection(event);
      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   }

   function handleUpdateGroupBlock(
      event: any,
      editor: BaseEditor & ReactEditor,
      element: GroupElement
   ) {
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

      updateRowLb(path[0], newProperties);
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
   ) as groupRow;

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
      element: GroupElement
   ) {
      const groupItems = element.groupItems;

      const path = ReactEditor.findPath(editor, element);

      const updatedGroupItems = groupItems.filter((item) => item.id !== id);

      const newProperties: Partial<CustomElement> = {
         ...element,
         groupItems: updatedGroupItems,
      };

      updateRowLb(path[0], newProperties);

      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   }

   const activeSelectItem = (item: any) =>
      selectOptions.find((obj: Collection) => obj.slug === item)?.name;

   const [editMode, setEditMode] = useState(false);
   const [viewMode, setViewMode] = useState(element.viewMode);

   return (
      <div className="my-3">
         <>
            <div className="flex items-center justify-between pb-2">
               <section className="flex items-center gap-3">
                  <input
                     className="bg-3 border-0 p-0 font-header text-[22px] font-bold focus:ring-0 dark:text-zinc-200"
                     type="text"
                     placeholder="Group name..."
                     defaultValue={element.groupLabel}
                     onChange={(event) => setGroupLabel(event.target.value)}
                  />
               </section>
               <section className="flex flex-none items-center gap-2.5">
                  {/* <Tooltip
                     id="edit-mode-group-list"
                     side="left"
                     className="flex items-center"
                     content={`${
                        editMode ? "Disable edit mode" : "Enable edit mode"
                     }`}
                  >
                     <Switch
                        checked={editMode}
                        onChange={setEditMode}
                        className={`${
                           editMode
                              ? "bg-emerald-500 dark:bg-emerald-900"
                              : "bg-zinc-300 dark:bg-zinc-700"
                        }
                        relative mr-1 inline-flex h-6 w-10 shrink-0 cursor-pointer 
                        rounded-full border-2 border-transparent transition-colors 
                        duration-200 ease-in-out focus:outline-none focus-visible:ring-2  
                     focus-visible:ring-white focus-visible:ring-opacity-75`}
                     >
                        <span className="sr-only">Toggle Edit Mode</span>
                        <span
                           aria-hidden="true"
                           className={`${
                              editMode ? "translate-x-4" : "translate-x-0"
                           }
                                          pointer-events-none inline-block h-5 w-5 transform rounded-full
                                          bg-white ring-0 transition duration-200 ease-in-out dark:bg-zinc-300`}
                        />
                     </Switch>
                  </Tooltip> */}

                  <div>
                     <Listbox value={selectedCollection}>
                        <Tooltip
                           id="group-color"
                           side="top"
                           content="Switch Color"
                        >
                           <Listbox.Button
                              className="bg-2 flex h-7 w-7 items-center 
                              justify-center rounded-full focus:outline-none"
                           >
                              <div
                                 style={{
                                    backgroundColor: element.color,
                                 }}
                                 className="h-3 w-3 rounded-full"
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
                              className="border-color text-1 bg-2 shadow-1 absolute -top-9 right-8 z-30 mr-0.5
                                flex h-10 items-center gap-3 rounded-full border px-4"
                           >
                              {GROUP_COLORS?.map(
                                 (color: string, rowIdx: number) => (
                                    <Listbox.Option key={rowIdx} value={color}>
                                       <button
                                          type="button"
                                          onClick={() =>
                                             handleUpdateGroupBlock(
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
                  </div>
                  <RadioGroup
                     className="flex cursor-pointer items-center gap-1"
                     value={viewMode}
                     onChange={(event) =>
                        handleUpdateViewMode(event, editor, element)
                     }
                  >
                     <RadioGroup.Option value="list">
                        {({ checked }) => (
                           <Tooltip
                              id="group-list-view"
                              side="top"
                              content="List View"
                           >
                              <div
                                 className={`${
                                    checked
                                       ? "bg-zinc-100 dark:bg-zinc-700"
                                       : ""
                                 }
                                 flex h-7 w-7 items-center justify-center rounded`}
                              >
                                 <List
                                    style={{
                                       color:
                                          checked == true ? element.color : "",
                                    }}
                                    size={16}
                                 />
                              </div>
                           </Tooltip>
                        )}
                     </RadioGroup.Option>
                     <RadioGroup.Option value="grid">
                        {({ checked }) => (
                           <Tooltip
                              id="group-grid-view"
                              side="top"
                              content="Gird View"
                           >
                              <div
                                 className={`${
                                    checked
                                       ? "bg-zinc-100 dark:bg-zinc-700"
                                       : ""
                                 }
                           flex h-7 w-7 items-center justify-center rounded`}
                              >
                                 <LayoutGrid
                                    style={{
                                       color:
                                          checked == true ? element.color : "",
                                    }}
                                    size={16}
                                 />
                              </div>
                           </Tooltip>
                        )}
                     </RadioGroup.Option>
                  </RadioGroup>
               </section>
            </div>
            <div
               className="text-1 bg-2 border-color relative mb-2.5 flex
                  items-center justify-between rounded-xl border px-2 py-1.5"
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
                                 <Plus
                                    style={{
                                       color: element.color,
                                    }}
                                    size={20}
                                 />
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
                              className="bg-2 border-color shadow-1 absolute left-0 z-20 mt-3 max-h-60
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
                                             {/* @ts-expect-error */}
                                             {entry?.icon?.url ||
                                             entry?.banner?.url ? (
                                                <Image
                                                   url={
                                                      entry?.icon?.url ??
                                                      entry?.banner?.url
                                                   }
                                                   options="fit=crop,width=60,height=60,gravity=auto"
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
                  <div className="relative z-10 flex-none">
                     <Listbox.Button
                        className="text-1 z-20 flex items-center gap-1.5
                        p-2 text-sm font-bold hover:underline"
                     >
                        {({ value }) => (
                           <>
                              {activeSelectItem(value) ?? "Select a Collection"}
                              <ChevronDown
                                 style={{
                                    color: element.color,
                                 }}
                                 size={20}
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
                           className="border-color bg-2 shadow-1 absolute right-0
                           z-30 mt-1 w-[160px] rounded-lg border p-1.5 shadow-lg"
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
                                                <span
                                                   style={{
                                                      backgroundColor:
                                                         element.color,
                                                   }}
                                                   className="absolute right-2 h-1.5 w-1.5 rounded-full"
                                                />
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
                                          <span
                                             style={{
                                                backgroundColor: element.color,
                                             }}
                                             className="absolute right-2 h-1.5 w-1.5 rounded-full"
                                          />
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
                                          <span
                                             style={{
                                                backgroundColor: element.color,
                                             }}
                                             className="absolute right-2 h-1.5 w-1.5 rounded-full"
                                          />
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
            </div>
            <section>
               <DndContext
                  onDragStart={handleDragStart}
                  onDragEnd={(event) => handleDragEnd(event, editor, element)}
               >
                  <SortableContext
                     items={itemIds}
                     strategy={
                        viewMode == "list"
                           ? verticalListSortingStrategy
                           : rectSortingStrategy
                     }
                  >
                     {groupItems?.length === 0 ? null : viewMode == "list" ? (
                        <div
                           className="border-color divide-color shadow-1 relative
                        divide-y overflow-hidden rounded-lg border shadow-sm"
                        >
                           {groupItems?.map((row) => (
                              <SortableListItem
                                 editMode={editMode}
                                 key={row.id}
                                 rowId={row.id}
                                 element={element}
                                 deleteRow={() =>
                                    deleteRow(row.id, editor, element)
                                 }
                              />
                           ))}
                        </div>
                     ) : (
                        <div className="grid grid-cols-2 gap-3 tablet:grid-cols-3 desktop:grid-cols-4">
                           {groupItems?.map((row) => (
                              <SortableGridItem
                                 editMode={editMode}
                                 key={row.id}
                                 rowId={row.id}
                                 element={element}
                                 deleteRow={() =>
                                    deleteRow(row.id, editor, element)
                                 }
                              />
                           ))}
                        </div>
                     )}
                  </SortableContext>
                  <DragOverlay modifiers={[restrictToParentElement]}>
                     {activeElement && viewMode == "list" ? (
                        <div className="p-1.5">
                           <div
                              className="bg-1 shadow-1 border-color flex items-center
                               justify-between gap-3 rounded-lg border p-1.5 shadow"
                           >
                              <div className="flex items-center gap-3">
                                 <div
                                    style={{
                                       borderColor: element.color,
                                    }}
                                    className="shadow-1 flex h-8 w-8 items-center
                                justify-between overflow-hidden rounded-full border shadow-sm"
                                 >
                                    {activeElement?.iconUrl ? (
                                       <Image
                                          url={activeElement?.iconUrl}
                                          options="fit=crop,width=60,height=60,gravity=auto"
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
                     ) : viewMode == "grid" ? (
                        <div className="bg-1 border-color shadow-1 relative rounded-md border p-3 shadow">
                           <div className="bg-3 shadow-1 absolute right-1 top-1 flex h-7 w-7 cursor-grab items-center justify-center rounded-md hover:shadow">
                              <Move className="text-1" size={16} />
                           </div>
                           <div
                              style={{
                                 borderColor: element.color,
                              }}
                              className="shadow-1 mx-auto mb-1.5 flex h-14 w-14
                           items-center overflow-hidden rounded-full border-2 shadow-sm"
                           >
                              {activeElement?.iconUrl ? (
                                 <Image
                                    url={activeElement?.iconUrl}
                                    options="fit=crop,width=60,height=60,gravity=auto"
                                    alt={activeElement?.name ?? "Icon"}
                                 />
                              ) : (
                                 <Component
                                    className="text-1 mx-auto"
                                    size={18}
                                 />
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
         </>
      </div>
   );
}

const SortableListItem = ({
   rowId,
   element,
   deleteRow,
   editMode,
}: {
   rowId: string;
   element: GroupElement;
   deleteRow: () => void;
   editMode: boolean;
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
            {row?.isCustomSite ? (
               <a
                  className="bg-2 flex flex-grow items-center gap-3 hover:underline"
                  href={row?.path ?? ""}
               >
                  <div
                     style={{
                        borderColor: element.color,
                     }}
                     className="shadow-1 flex h-8 w-8 items-center
                     justify-between overflow-hidden rounded-full border-2 shadow-sm"
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
                  <span className="text-1 truncate text-sm font-bold">
                     {row?.name}
                  </span>
               </a>
            ) : (
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
               justify-between overflow-hidden rounded-full border-2 shadow-sm"
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
                  <span className="text-1 truncate text-sm font-bold">
                     {row?.name}
                  </span>
               </Link>
            )}
            {/* <input
               type="text"
               className="bg-1 h-6 w-10 rounded-full border-0 px-3 text-center text-sm font-bold"
            /> */}
            <div className="flex select-none items-center gap-1 opacity-0 group-hover:opacity-100">
               <Tooltip side="left" id={`delete-${rowId}`} content="Delete">
                  <button
                     className="hover:bg-3 shadow-1 flex h-7 w-7 items-center justify-center rounded-md hover:shadow"
                     onClick={deleteRow}
                     aria-label="Delete"
                  >
                     <Trash
                        className="text-zinc-400 dark:text-zinc-500"
                        size={16}
                     />
                  </button>
               </Tooltip>
               <Tooltip
                  side="left"
                  id={`drag-${rowId}`}
                  content="Drag to reorder"
               >
                  <button
                     type="button"
                     aria-label="Drag to reorder"
                     ref={setActivatorNodeRef}
                     {...listeners}
                     className="hover:bg-3 shadow-1 flex h-7 w-7 cursor-grab items-center justify-center rounded-md hover:shadow"
                  >
                     <GripVertical className="text-1" size={16} />
                  </button>
               </Tooltip>
            </div>
         </div>
         {editMode && (
            <TextareaAutosize
               className="border-color -mb-[9px] w-full resize-none overflow-hidden border-x-0 border-y bg-transparent bg-white 
          p-0 px-3 py-3 placeholder-zinc-300 focus:outline-none
          focus:ring-transparent dark:bg-bg1Dark dark:placeholder-zinc-700"
               // name={zo.fields.title()}
               // defaultValue={post.name}
               // onChange={(event) => setTitleValue(event.target.value)}
               placeholder="Add a description..."
            />
         )}
      </div>
   );
};

const SortableGridItem = ({
   rowId,
   element,
   deleteRow,
   editMode,
}: {
   rowId: string;
   element: GroupElement;
   deleteRow: () => void;
   editMode: boolean;
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
         className="bg-2 border-color shadow-1 relative rounded-md border p-3 shadow-sm"
      >
         <div
            className="absolute left-0 top-0 flex w-full select-none 
         items-center justify-between gap-1 p-1 opacity-0 group-hover:opacity-100"
         >
            <Tooltip side="top" id={`delete-${rowId}`} content="Delete">
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
            </Tooltip>
            <Tooltip side="top" id={`drag-${rowId}`} content="Drag to reorder">
               <button
                  type="button"
                  aria-label="Drag to reorder"
                  ref={setActivatorNodeRef}
                  {...listeners}
                  className="hover:bg-3 shadow-1 flex h-7 w-7 cursor-grab items-center justify-center rounded-md hover:shadow"
               >
                  <Move className="text-1" size={16} />
               </button>
            </Tooltip>
         </div>
         {/* Can't use client routing if site is custom */}
         {row?.isCustomSite ? (
            <a className="block" href={row?.path ?? ""}>
               <div
                  style={{
                     borderColor: element.color,
                  }}
                  className="shadow-1 mx-auto mb-1.5 flex h-14 w-14
               items-center overflow-hidden rounded-full border-2 shadow-sm"
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
               <div className="text-1 truncate text-center text-xs font-bold">
                  {row?.name}
               </div>
            </a>
         ) : (
            <Link
               key={row?.id}
               to={row?.path ?? ""}
               prefetch="intent"
               className="block"
            >
               <div
                  style={{
                     borderColor: element.color,
                  }}
                  className="shadow-1 mx-auto mb-1.5 flex h-14 w-14
               items-center overflow-hidden rounded-full border-2 shadow-sm"
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
               <div className="text-1 truncate text-center text-xs font-bold">
                  {row?.name}
               </div>
            </Link>
         )}
      </div>
   );
};
