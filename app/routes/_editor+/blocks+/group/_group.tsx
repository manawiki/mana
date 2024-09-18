import type { ReactNode } from "react";
import React, { Fragment, useContext, useEffect, useState } from "react";

import {
   DragOverlay,
   DndContext,
   type DragEndEvent,
   type DragStartEvent,
   closestCenter,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
   SortableContext,
   arrayMove,
   rectSortingStrategy,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FloatingDelayGroup, offset } from "@floating-ui/react";
import {
   Combobox,
   Dialog,
   Listbox,
   RadioGroup,
   Transition,
} from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import clsx from "clsx";
import { request as gqlRequest, gql } from "graphql-request";
import { nanoid } from "nanoid";
import type { Select } from "payload-query";
import { select } from "payload-query";
import qs from "qs";
import { Transforms, Node, Editor } from "slate";
import type { BaseEditor } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import useSWR from "swr";
import { z } from "zod";
import { zx } from "zodix";

import type {
   Collection,
   Entry,
   Image as PayloadImage,
   Post,
   Site,
} from "payload/generated-types";
import { Avatar } from "~/components/Avatar";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Modal } from "~/components/Modal";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
// eslint-disable-next-line import/order
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { gqlEndpoint, gqlFormat } from "~/utils/fetchers.server";
import { useIsMount } from "~/utils/use-debounce";
import {
   useRootLoaderData,
   useSiteLoaderData,
} from "~/utils/useSiteLoaderData";

// eslint-disable-next-line import/no-cycle
import { BlockGroupItemView } from "./group-view";
import { NestedEditor } from "../../core/dnd";
import {
   BlockType,
   type CustomElement,
   type GroupElement,
   type GroupItemElement,
} from "../../core/types";

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

//@ts-ignore
const GroupDnDContext = React.createContext();

const defaultOptions = [
   { slug: "post", name: "Post" },
   { slug: "site", name: "Site" },
];

type groupRowData = {
   id: string;
   siteId: Site["slug"];
   name: string;
   isCustomSite: boolean;
   slug?: Post["slug"];
   icon: { url: string };
   subtitle?: string;
};

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);

   const { filterOption, groupSelectQuery } = zx.parseQuery(request, {
      filterOption: z.string(),
      groupSelectQuery: z.string(),
   });
   const slug = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteSlug,
         },
      },
      depth: 1,
      user,
   });
   const site = slug?.docs[0];

   //For posts and site
   if (defaultOptions.some((e) => e.slug === filterOption)) {
      switch (filterOption) {
         case "post": {
            const { docs } = await payload.find({
               collection: "posts",
               where: {
                  site: {
                     equals: site?.id,
                  },
                  publishedAt: {
                     exists: true,
                  },
                  ...(groupSelectQuery
                     ? {
                          name: {
                             contains: groupSelectQuery,
                          },
                       }
                     : {}),
               },
               depth: 1,
               overrideAccess: false,
               user,
            });
            const postSelect: Select<Post> = {
               id: true,
               name: true,
               slug: true,
               subtitle: true,
            };
            const imageSelect: Select<PayloadImage> = {
               id: false,
               url: true,
            };
            const filtered = docs.map((doc) => {
               // Use icon field, otherwise default to post banner
               const icon =
                  (doc.icon && select(imageSelect, doc.icon)) ??
                  (doc.banner && select(imageSelect, doc.banner));

               const result = {
                  ...select(postSelect, doc),
                  icon,
                  siteId: siteSlug,
                  isCustomSite: site?.type == "custom",
               };
               //@ts-ignore
               return result as groupRowData;
            });
            return json(filtered);
         }
         case "site": {
            const { docs } = await payload.find({
               collection: "sites",
               where: {
                  isPublic: {
                     equals: true,
                  },
                  ...(groupSelectQuery
                     ? {
                          name: {
                             contains: groupSelectQuery,
                          },
                       }
                     : {}),
               },
               depth: 1,
               overrideAccess: false,
               user,
            });
            const filtered = docs.map((doc) => {
               return {
                  ...select(
                     {
                        id: true,
                        name: true,
                     },
                     doc,
                  ),
                  isCustomSite: doc?.type == "custom",
                  siteId: siteSlug,
                  icon: doc.icon && select({ id: false, url: true }, doc.icon),
               };
            });
            return json(filtered);
         }
         default:
            return null;
      }
   }
   //For entries
   const collection = site?.collections?.find(
      (collection) => collection.slug === filterOption,
   );

   if (collection?.customDatabase) {
      const label = gqlFormat(filterOption, "list");

      const document = gql`
         query ($groupSelectQuery: String!) {
               rows: ${label}(
                  where: {
                  name: { contains: $groupSelectQuery }
                  }
               ) {
               docs {
                  id
                  slug
                  name
                  icon {
                     url
                  }
               }
            }
         }
      `;

      const result: any = await gqlRequest(
         gqlEndpoint({
            isCustomDB: true,
         }),
         document,
         {
            groupSelectQuery,
         },
      );
      const data = result.rows.docs as groupRowData[];
      const filtered = data.map((doc) => {
         return {
            ...doc,
            siteId: siteSlug,
            isCustomSite: collection.customDatabase,
         };
      });
      return json(filtered);
   }

   const { docs } = await payload.find({
      collection: "entries",
      where: {
         site: {
            equals: site?.id,
         },
         "collectionEntity.slug": {
            equals: filterOption,
         },
         ...(groupSelectQuery
            ? {
                 name: {
                    contains: groupSelectQuery,
                 },
              }
            : {}),
      },
      depth: 1,
      overrideAccess: false,
      user,
   });
   const filtered = docs.map((doc) => {
      return {
         ...select(
            {
               id: true,
               name: true,
               slug: true,
            },
            doc,
         ),
         siteId: siteSlug,
         isCustomSite: site?.type == "custom",
         icon: doc.icon && select({ id: false, url: true }, doc.icon),
      };
   });
   return json(filtered);
}

export function BlockGroup({
   element,
   children,
}: {
   element: GroupElement;
   children: ReactNode;
}) {
   const editor = useSlate();
   const isGroupEmpty = element?.children[0]?.path ? false : true;

   const { siteSlug } = useRootLoaderData();

   const [groupSelectQuery, setGroupSelectQuery] = useState("");

   //Get collection data, used to populate select

   const { site } = useSiteLoaderData();

   const fetcher = (...args: [any]) => fetch(...args).then((res) => res.json());

   const selectOptions = site.collections
      ? [...defaultOptions, ...site.collections]
      : defaultOptions;

   const [selected] = useState();

   const [filterOption, setFilterOption] = useState(element.collection);

   const groupDataQuery = qs.stringify(
      {
         siteSlug,
         filterOption,
         groupSelectQuery,
      },
      { addQueryPrefix: true },
   );

   const { data: entryData } = useSWR(
      `/blocks/group${groupDataQuery}`,
      fetcher,
   );

   const filteredEntries =
      groupSelectQuery === ""
         ? [] //TODO Make this pull default set, used to be "entryData"
         : entryData?.filter((item: Entry) =>
              item.name
                 .toLowerCase()
                 .replace(/\s+/g, "")
                 .includes(groupSelectQuery.toLowerCase().replace(/\s+/g, "")),
           );

   //DND kit needs array of strings
   function handleUpdateFilter(event: any) {
      const path = ReactEditor.findPath(editor, element);
      setFilterOption(event);
      return Transforms.setNodes<CustomElement>(
         editor,
         { collection: event },
         {
            at: path,
         },
      );
   }

   function handleAddEntry(event: groupRowData) {
      const rowPath = () => {
         switch (filterOption) {
            case "site": {
               return `/${event.siteId}`;
            }
            case "post": {
               return `/p/${event.slug}`;
            }
            default:
               return `/c/${filterOption}/${event.slug ?? event.id}`; //May need to update filterOption to an event variable when we want to siteId to work globally
         }
      };
      const path = [
         ReactEditor.findPath(editor, element)[0],
         isGroupEmpty ? 0 : element.children.length,
      ];

      const nodeId = nanoid();
      const newProperties: Partial<CustomElement> = {
         id: nodeId,
         type: BlockType.GroupItem,
         siteId: event.siteId,
         labelColor: GROUP_COLORS["0"],
         isCustomSite: event.isCustomSite,
         refId: event.id,
         name: event.name,
         isPost: filterOption === "post",
         subtitle: event?.subtitle,
         path: rowPath(),
         iconUrl: event?.icon?.url,
         children: [{ text: "" }],
      };

      //@ts-ignore
      Transforms.insertNodes(editor, newProperties, { at: path });

      //Update DND state after adding item
      return setGroupItems((items) => [...items, nodeId]);
   }

   interface Editors extends BaseEditor, ReactEditor {}

   function handleUpdateItemsViewMode(
      event: any,
      editor: Editors,
      element: GroupElement,
   ) {
      const path = ReactEditor.findPath(editor, element);
      setItemsViewMode(event);
      return Transforms.setNodes<CustomElement>(
         editor,
         { itemsViewMode: event },
         {
            at: path,
         },
      );
   }

   // DND Functions
   const [activeId, setActiveId] = useState<string | null>(null);

   const activeElement = findNestedObj(
      element.children,
      "id",
      activeId,
   ) as unknown as GroupItemElement;

   //From https://stackoverflow.com/questions/15523514/find-by-key-deep-in-a-nested-array
   function findNestedObj(
      entireObj: object,
      keyToFind: string,
      valToFind: string | null,
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

   const [groupItems, setGroupItems] = useState(
      isGroupEmpty ? [] : element.children.map((item) => item.id),
   );

   function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;

      if (active.id !== over?.id) {
         setGroupItems((items) => {
            const oldIndex = items.findIndex((x) => {
               return x === active.id;
            });

            const newIndex = items.findIndex((x) => {
               return x === over?.id;
            });

            return arrayMove(items, oldIndex, newIndex);
         });
      }
   }

   const activeSelectItem = (item: any) =>
      selectOptions.find((obj) => obj.slug === item)?.name;

   const [itemsViewMode, setItemsViewMode] = useState(element.itemsViewMode);

   const [isElementEditorOpen, setElementEditor] = useState(isGroupEmpty);

   return (
      <div contentEditable={false} className="mb-3 group/group relative">
         <section
            className={clsx(
               itemsViewMode == "list"
                  ? `border-color-sub divide-color-sub shadow-1 group relative
                        mb-2.5 divide-y overflow-hidden rounded-lg border shadow-sm`
                  : "",
               itemsViewMode == "grid"
                  ? "grid grid-cols-2 gap-3 pb-2.5 tablet:grid-cols-3 laptop:grid-cols-2 desktop:grid-cols-4"
                  : "",
               "",
            )}
         >
            <DndContext
               onDragStart={handleDragStart}
               onDragEnd={handleDragEnd}
               collisionDetection={closestCenter}
            >
               <SortableContext
                  items={groupItems}
                  strategy={
                     itemsViewMode == "list"
                        ? verticalListSortingStrategy
                        : rectSortingStrategy
                  }
               >
                  <GroupDnDContext.Provider
                     value={{ groupItems, setGroupItems }}
                  >
                     {children}
                  </GroupDnDContext.Provider>
               </SortableContext>
               <DragOverlay modifiers={[restrictToParentElement]}>
                  {activeElement && (
                     <BlockGroupItemView element={activeElement} />
                  )}
               </DragOverlay>
            </DndContext>
         </section>
         <Float
            middleware={[
               offset({
                  mainAxis: 8,
                  crossAxis: -22,
               }),
            ]}
            dialog
            placement="left-start"
            portal
         >
            <Float.Reference>
               <div className="flex size-10 laptop:absolute -right-12 top-0">
                  <Button
                     className="size-9 !p-0"
                     color="light/zinc"
                     onClick={() => setElementEditor(true)}
                     contentEditable={false}
                  >
                     <Icon name="list-plus" size={16} />
                  </Button>
               </div>
            </Float.Reference>
            <Transition appear show={isElementEditorOpen} as={Fragment}>
               <Dialog as="div" onClose={() => setElementEditor(false)}>
                  <div className="fixed inset-0">
                     <div className="flex min-h-full items-center p-4 text-center">
                        <Float.Content
                           as={Fragment}
                           transitionChild
                           enter="transition ease-out duration-300"
                           enterFrom="opacity-0 translate-y-1"
                           enterTo="opacity-100 translate-y-0"
                           leave="transition ease-in duration-150"
                           leaveFrom="opacity-100 translate-y-0"
                           leaveTo="opacity-0 translate-y-1"
                        >
                           <Dialog.Panel>
                              <div className="relative w-full laptop:w-[728px] px-4">
                                 <div
                                    className="flex px-2 py-0.5 shadow-xl border-2 items-center shadow-1 bg-3-sub border-color-sub
                                    justify-center transform rounded-full"
                                 >
                                    <div className="flex w-full items-center gap-3">
                                       <Combobox
                                          value={selected}
                                          onChange={handleAddEntry}
                                       >
                                          <div className="flex-grow">
                                             <div className="flex items-center gap-3">
                                                <Combobox.Button
                                                   className="group flex-none shadow-sm border border-color dark:border-zinc-600 rounded-full 
                                                   w-7 h-7 flex items-center justify-center bg-zinc-50 dark:bg-dark450"
                                                >
                                                   {({ open }) => (
                                                      <Icon
                                                         name="plus"
                                                         className={`${
                                                            open
                                                               ? "rotate-45"
                                                               : ""
                                                         } transform transition duration-300 ease-in-out`}
                                                         size={16}
                                                      />
                                                   )}
                                                </Combobox.Button>
                                                <Combobox.Input
                                                   autoFocus
                                                   className="bg-3-sub h-10 w-full border-0 px-0 focus:outline-none focus:ring-0"
                                                   placeholder="Search..."
                                                   name="search"
                                                   onChange={(event) =>
                                                      setGroupSelectQuery(
                                                         event.target.value,
                                                      )
                                                   }
                                                />
                                             </div>
                                             <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                                afterLeave={() =>
                                                   setGroupSelectQuery("")
                                                }
                                             >
                                                <Combobox.Options
                                                   className="dark:bg-dark350 bg-white border-color-sub divide-color-sub no-scrollbar absolute left-0 z-30 mt-2 max-h-60
                                                 w-full divide-y overflow-auto rounded-xl border drop-shadow-xl focus:outline-none"
                                                >
                                                   {filteredEntries?.length ===
                                                   0 ? (
                                                      <div className="relative text-center cursor-default select-none p-3 text-sm">
                                                         Nothing found.
                                                      </div>
                                                   ) : (
                                                      filteredEntries?.map(
                                                         (entry: Entry) => (
                                                            <Combobox.Option
                                                               key={entry.id}
                                                               className={({
                                                                  active,
                                                               }) =>
                                                                  `cursor-default select-none p-2 text-sm font-bold ${
                                                                     active
                                                                        ? "bg-zinc-50 dark:bg-dark400"
                                                                        : ""
                                                                  } flex items-center gap-2`
                                                               }
                                                               value={entry}
                                                            >
                                                               <>
                                                                  <span
                                                                     className="border-color shadow-1 flex h-8 w-8 flex-none items-center
                                                                  justify-between overflow-hidden rounded-full border shadow-sm"
                                                                  >
                                                                     {entry
                                                                        ?.icon
                                                                        ?.url ? (
                                                                        <Image
                                                                           url={
                                                                              entry
                                                                                 ?.icon
                                                                                 ?.url
                                                                           }
                                                                           options="aspect_ratio=1:1&height=80&width=80"
                                                                           alt={
                                                                              entry?.name ??
                                                                              "Icon"
                                                                           }
                                                                        />
                                                                     ) : (
                                                                        <Icon
                                                                           name="component"
                                                                           className="text-1 mx-auto"
                                                                           size={
                                                                              18
                                                                           }
                                                                        />
                                                                     )}
                                                                  </span>
                                                                  <span className="flex-grow">
                                                                     {
                                                                        entry.name
                                                                     }
                                                                  </span>
                                                               </>
                                                            </Combobox.Option>
                                                         ),
                                                      )
                                                   )}
                                                </Combobox.Options>
                                             </Transition>
                                          </div>
                                       </Combobox>
                                    </div>
                                    <Listbox
                                       value={filterOption}
                                       onChange={handleUpdateFilter}
                                    >
                                       <div className="relative z-30 flex-none">
                                          <Listbox.Button
                                             className="text-1 flex items-center gap-1.5
                                             p-2 text-sm font-bold hover:underline"
                                          >
                                             {({ value }) => (
                                                <>
                                                   {activeSelectItem(value) ??
                                                      "Select"}
                                                   <Icon
                                                      name="chevron-down"
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
                                                className="border-color-sub bg-2-sub shadow-1 absolute right-0
                                             z-20 w-[160px] rounded-lg border p-1.5 shadow-lg"
                                             >
                                                {site.collections?.map(
                                                   (
                                                      row: Collection,
                                                      rowIdx: number,
                                                   ) => (
                                                      <Listbox.Option
                                                         key={rowIdx}
                                                         value={row.slug}
                                                      >
                                                         {({ selected }) => (
                                                            <>
                                                               <button
                                                                  className="relative flex w-full items-center gap-3 truncate
                                                               rounded-md px-2 py-1 text-sm hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                                               >
                                                                  {selected ? (
                                                                     <span className="absolute right-2 h-1.5 w-1.5 rounded-full" />
                                                                  ) : null}
                                                                  <Icon
                                                                     name="database"
                                                                     className="text-1"
                                                                     size={14}
                                                                  />
                                                                  {row.name}
                                                               </button>
                                                            </>
                                                         )}
                                                      </Listbox.Option>
                                                   ),
                                                )}
                                                <Listbox.Option
                                                   key="post"
                                                   value="post"
                                                >
                                                   {({ selected }) => (
                                                      <>
                                                         <button
                                                            className="relative flex w-full items-center gap-3 truncate
                                                         rounded-md px-2 py-1 text-sm hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                                         >
                                                            {selected ? (
                                                               <span className="absolute right-2 h-1.5 w-1.5 rounded-full" />
                                                            ) : null}
                                                            <Icon
                                                               name="pencil"
                                                               className="text-1"
                                                               size={14}
                                                            />
                                                            Post
                                                         </button>
                                                      </>
                                                   )}
                                                </Listbox.Option>
                                                <Listbox.Option
                                                   key="site"
                                                   value="site"
                                                >
                                                   {({ selected }) => (
                                                      <>
                                                         <button
                                                            className="relative flex w-full items-center gap-3 truncate
                                                            rounded-md px-2 py-1 text-sm hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                                         >
                                                            {selected ? (
                                                               <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-zinc-500" />
                                                            ) : null}
                                                            <Icon
                                                               name="component"
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
                                          handleUpdateItemsViewMode(
                                             event,
                                             editor,
                                             element,
                                          )
                                       }
                                    >
                                       <RadioGroup.Option value="list">
                                          {({ checked }) => (
                                             <Tooltip>
                                                <TooltipTrigger title="List View">
                                                   <div
                                                      className={clsx(
                                                         checked
                                                            ? "bg-zinc-50 shadow-sm border border-color-sub shadow-1 dark:bg-dark450"
                                                            : "",
                                                         "flex h-7 w-7 items-center justify-center rounded-full",
                                                      )}
                                                   >
                                                      <RadioGroup.Label className="sr-only">
                                                         List View
                                                      </RadioGroup.Label>
                                                      <Icon
                                                         name="list"
                                                         className={`${
                                                            checked
                                                               ? "text-zinc-500 dark:text-zinc-300"
                                                               : ""
                                                         }`}
                                                         size={14}
                                                      />
                                                   </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                   List View
                                                </TooltipContent>
                                             </Tooltip>
                                          )}
                                       </RadioGroup.Option>
                                       <RadioGroup.Option value="grid">
                                          {({ checked }) => (
                                             <Tooltip>
                                                <TooltipTrigger title="Grid View">
                                                   <div
                                                      className={clsx(
                                                         checked
                                                            ? "bg-zinc-50 shadow-sm border border-color-sub shadow-1 dark:bg-dark450"
                                                            : "",
                                                         "flex h-7 w-7 items-center justify-center rounded-full",
                                                      )}
                                                   >
                                                      <RadioGroup.Label className="sr-only">
                                                         Grid View
                                                      </RadioGroup.Label>
                                                      <Icon
                                                         name="layout-grid"
                                                         className={`${
                                                            checked
                                                               ? "text-zinc-500 dark:text-zinc-300"
                                                               : ""
                                                         }`}
                                                         size={14}
                                                      />
                                                   </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                   Gird View
                                                </TooltipContent>
                                             </Tooltip>
                                          )}
                                       </RadioGroup.Option>
                                    </RadioGroup>
                                 </div>
                              </div>
                           </Dialog.Panel>
                        </Float.Content>
                     </div>
                  </div>
               </Dialog>
            </Transition>
         </Float>
      </div>
   );
}

export function BlockGroupItem({
   element,
   children,
}: {
   element: GroupItemElement;
   children: ReactNode;
}) {
   const editor = useSlate();

   const path = ReactEditor.findPath(editor, element);

   const parent = Node.parent(editor, path) as GroupElement;

   const itemsViewMode = parent.itemsViewMode;
   const isMount = useIsMount();

   //@ts-ignore
   const { groupItems } = useContext(GroupDnDContext);

   const {
      transition,
      attributes,
      transform,
      isSorting,
      isDragging,
      setActivatorNodeRef,
      setNodeRef,
      listeners,
      data,
   } = useSortable({
      id: element.id,
   });
   /**
    * We sort in the Slate Node since we can't
    * update the child state from the parent
    */

   useEffect(() => {
      if (!isMount && !isDragging && !isSorting) {
         return groupItems.forEach((row: any) => {
            Transforms.moveNodes<CustomElement>(editor, {
               //@ts-ignore
               at: [path[0]],
               match: (node: any) =>
                  Editor.isBlock(editor, node) && node.id == row,
               to: [path[0], groupItems.findIndex((item: any) => item == row)],
            });
         });
      }
   }, [data]);

   function updateLabelColor(event: string) {
      return Transforms.setNodes<CustomElement>(
         editor,
         { labelColor: event },
         {
            at: path,
         },
      );
   }

   function updateLabelValue(event: string) {
      Transforms.setNodes<CustomElement>(
         editor,
         { label: event },
         {
            at: path,
         },
      );
      return setLabelValue(event);
   }

   const [labelValue, setLabelValue] = useState(element?.label);

   const [editMode, setEditMode] = useState(false);
   const [modalStatus, setModalStatus] = useState(false);

   return (
      <>
         {itemsViewMode == "list" && (
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
               className="bg-2-sub relative"
            >
               <div className="hidden">{children}</div>
               <div className="flex items-center justify-between gap-2 p-3">
                  <div className="bg-2-sub flex flex-grow items-center gap-3">
                     {element.isPost && element.iconUrl ? (
                        <div className="flex items-center w-full gap-5 group">
                           {element.iconUrl && (
                              <div className="w-1/2 tablet:w-28 flex-none overflow-hidden rounded-lg border-y tablet:border dark:border-zinc-500 border-zinc-200 shadow-sm shadow-1">
                                 <Image
                                    alt={element.name}
                                    className="w-full object-cover"
                                    height={300}
                                    options="height=300"
                                    url={element?.iconUrl}
                                 />
                              </div>
                           )}
                           <div className="relative flex-grow space-y-1">
                              {element.name && (
                                 <div className="font-header font-bold group-hover:underline line-clamp-2">
                                    {element.name}
                                 </div>
                              )}
                              {element.subtitle && (
                                 <div className="text-sm text-1 line-clamp-2">
                                    {element.subtitle}
                                 </div>
                              )}
                           </div>
                        </div>
                     ) : (
                        <>
                           <div className="bg-white dark:bg-dark450 dark:border-zinc-600/70 shadow-1 flex size-9 items-center justify-between rounded-full border shadow-sm group">
                              {element?.iconUrl ? (
                                 <Avatar
                                    src={element?.iconUrl}
                                    initials={
                                       element?.iconUrl
                                          ? undefined
                                          : element.name.charAt(0)
                                    }
                                    className="size-9"
                                    options="aspect_ratio=1:1&height=80&width=80"
                                 />
                              ) : element.isPost ? (
                                 <Icon
                                    name="pen-square"
                                    className="text-1 mx-auto"
                                    size={14}
                                 />
                              ) : (
                                 <Icon
                                    name="database"
                                    className="text-1 mx-auto"
                                    size={15}
                                 />
                              )}
                           </div>
                           <span className="truncate text-sm font-bold group-hover:underline">
                              {element?.name}
                           </span>
                        </>
                     )}
                  </div>
                  <div
                     className="absolute bg-white dark:bg-dark450 border dark:border-zinc-600 rounded-md divide-x dark:divide-zinc-600
                  left-2 flex items-center opacity-0 group-hover:opacity-100 shadow-sm shadow-1"
                  >
                     <FloatingDelayGroup delay={{ open: 1000 }}>
                        <Tooltip>
                           <TooltipTrigger title="Edit Toggle">
                              <button
                                 className="flex h-6 w-5 items-center justify-center"
                                 onClick={() => setEditMode(!editMode)}
                              >
                                 {editMode ? (
                                    <Icon name="chevron-left" size={16} />
                                 ) : (
                                    <Icon name="more-vertical" size={14} />
                                 )}
                              </button>
                           </TooltipTrigger>
                           <TooltipContent>
                              {editMode ? "Close" : "Edit"}
                           </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                           <TooltipTrigger title="Drag to reorder">
                              <button
                                 type="button"
                                 aria-label="Drag to reorder"
                                 ref={setActivatorNodeRef}
                                 {...listeners}
                                 className="cursor-grab h-6 w-7 items-center flex justify-center"
                              >
                                 <Icon
                                    name="move"
                                    className="text-1"
                                    size={12}
                                 />
                              </button>
                           </TooltipTrigger>
                           <TooltipContent>Drag to reorder</TooltipContent>
                        </Tooltip>
                     </FloatingDelayGroup>
                  </div>
                  {editMode && (
                     <div className="group-hover:flex hidden gap-2 flex-none items-center justify-center">
                        <button
                           className="flex h-5 w-5 items-center justify-center"
                           onClick={() => setModalStatus(true)}
                           aria-label="Add content"
                        >
                           <Icon
                              name="pencil"
                              className="w-3.5 h-3.5 hover:text-blue-500"
                           />
                        </button>
                        <button
                           className="flex h-5 w-5 items-center justify-center"
                           onClick={() => {
                              Transforms.delete(editor, {
                                 at: path,
                              });
                           }}
                           aria-label="Delete"
                        >
                           <Icon
                              name="trash"
                              className="w-3.5 h-3.5 hover:text-red-400"
                           />
                        </button>
                        <div className="relative h-5 z-20 mx-auto flex w-20 items-center justify-center">
                           <Listbox value={element?.labelColor}>
                              <Listbox.Button className="hidden h-3 w-3 items-center justify-center rounded-full focus:outline-none group-hover:flex absolute right-1 top-1">
                                 <div
                                    style={{
                                       backgroundColor: element?.labelColor,
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
                                    className="border-color-sub text-1 bg-3-sub shadow-1 absolute -top-4 right-7 z-30 flex min-w-[100px]
                           items-center justify-center gap-2 rounded-full border p-2 shadow-sm"
                                 >
                                    {GROUP_COLORS?.map(
                                       (color: string, rowIdx: number) => (
                                          <Listbox.Option
                                             className="flex items-center justify-center"
                                             key={rowIdx}
                                             value={color}
                                          >
                                             <button
                                                type="button"
                                                onClick={() =>
                                                   updateLabelColor(color)
                                                }
                                                className="h-3.5 w-3.5 rounded-full"
                                                key={color}
                                                style={{
                                                   backgroundColor: color,
                                                }}
                                             ></button>
                                          </Listbox.Option>
                                       ),
                                    )}
                                 </Listbox.Options>
                              </Transition>
                           </Listbox>
                           <input
                              style={{
                                 backgroundColor: `${element?.labelColor}33`,
                              }}
                              onChange={(event) =>
                                 updateLabelValue(event.target.value)
                              }
                              value={labelValue}
                              type="text"
                              className="h-6 w-20 hidden group-hover:flex items-center justify-center rounded-full border-0 text-center text-[10px] font-bold"
                           />
                        </div>
                     </div>
                  )}
                  {element.groupContent && !editMode && (
                     <button
                        className="flex group/doc h-7 w-7 items-center justify-center"
                        onClick={() => setModalStatus(true)}
                        aria-label="Add content"
                     >
                        <Icon
                           name="file-text"
                           className="text-zinc-400 dark:text-zinc-500 group-hover/doc:text-zinc-500 group-hover/doc:dark:text-zinc-200"
                           size={14}
                        />
                     </button>
                  )}
                  {element.label && !editMode && (
                     <div className="flex items-center justify-center">
                        <div
                           className="flex h-6 w-20 items-center justify-center rounded-full border-0 text-center text-[10px] font-bold"
                           style={{
                              backgroundColor: `${element?.labelColor}33`,
                           }}
                        >
                           {element.label}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         )}
         {itemsViewMode == "grid" && (
            <div
               contentEditable={false}
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
               className="bg-2-sub focus:outline-none flex items-center justify-center border-color-sub shadow-1 group relative rounded-lg border p-3 shadow-sm"
            >
               {element.groupContent && !editMode && (
                  <button
                     className="flex h-7 w-7 absolute group/doc right-1.5 top-1.5 z-20 items-center justify-center"
                     onClick={() => setModalStatus(true)}
                     aria-label="Add content"
                  >
                     <Icon
                        name="file-text"
                        className="text-zinc-400 dark:text-zinc-500 group-hover/doc:text-zinc-500 group-hover/doc:dark:text-zinc-200"
                        size={14}
                     />
                  </button>
               )}
               <div className="absolute left-0 top-0 h-full flex w-full select-none justify-between gap-1 p-1 opacity-0 group-hover:opacity-100">
                  <FloatingDelayGroup delay={{ open: 1000 }}>
                     <div
                        className={clsx(
                           editMode ? "justify-end" : "justify-between",
                           "absolute inset-y-0 left-0 flex flex-col h-full pb-1",
                        )}
                     >
                        {!editMode && (
                           <Tooltip placement="left-start">
                              <TooltipTrigger
                                 title="Drag to reorder"
                                 type="button"
                                 aria-label="Drag to reorder"
                                 ref={setActivatorNodeRef}
                                 {...listeners}
                                 className="flex h-7 w-7 pt-1.5 pl-1.5 cursor-grab items-center justify-center rounded-md"
                              >
                                 <Icon
                                    name="move"
                                    className="text-1"
                                    size={16}
                                 />
                              </TooltipTrigger>
                              <TooltipContent>Drag to reorder</TooltipContent>
                           </Tooltip>
                        )}
                        {editMode && (
                           <div
                              className="rounded-md border divide-y divide-color-sub border-color flex items-center flex-col 
                              dark:border-zinc-700 dark:bg-dark400 bg-white mb-[1px] ml-1.5 w-6"
                           >
                              <Tooltip placement="right-start">
                                 <TooltipTrigger
                                    type="button"
                                    aria-label="Delete"
                                    onClick={() => {
                                       Transforms.delete(editor, {
                                          at: path,
                                       });
                                    }}
                                    className="flex group/delete items-center justify-center w-full h-6"
                                 >
                                    <Icon
                                       name="trash"
                                       className="w-2.5 h-2.5 group-hover/delete:text-red-400"
                                    />
                                 </TooltipTrigger>
                                 <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                              <Tooltip placement="right-start">
                                 <TooltipTrigger
                                    type="button"
                                    onClick={() => setModalStatus(true)}
                                    aria-label="Add content"
                                    className="flex group/edit items-center justify-center w-full h-6"
                                 >
                                    <Icon
                                       name="pencil"
                                       className="w-2.5 h-2.5 group-hover/edit:text-blue-500"
                                    />
                                 </TooltipTrigger>
                                 <TooltipContent>Add content</TooltipContent>
                              </Tooltip>
                           </div>
                        )}
                        <button
                           type="button"
                           onClick={() => setEditMode(!editMode)}
                           className="flex px-2 h-6 bg-2-sub pl-2.5 items-center justify-center"
                        >
                           {editMode ? (
                              <Icon name="x" size={14} />
                           ) : (
                              <Icon name="more-horizontal" size={16} />
                           )}
                        </button>
                     </div>
                  </FloatingDelayGroup>
               </div>
               <div className="block">
                  {/* Label Editor */}
                  {editMode && (
                     <>
                        <div className="relative h-5 z-20 mx-auto flex w-20 items-center justify-center mb-2">
                           <input
                              style={{
                                 backgroundColor: `${element?.labelColor}33`,
                              }}
                              onChange={(event) =>
                                 updateLabelValue(event.target.value)
                              }
                              value={labelValue}
                              type="text"
                              className="h-5 w-20 rounded-full p-0 focus:ring-transparent focus:outline-none border-0 text-center text-[10px] font-bold"
                           />
                           <Listbox value={element?.labelColor}>
                              <Float
                                 as={Fragment}
                                 enter="transition duration-100 ease-out"
                                 enterFrom="transform scale-95 opacity-0"
                                 enterTo="transform scale-100 opacity-100"
                                 leave="transition duration-75 ease-out"
                                 leaveFrom="transform scale-100 opacity-100"
                                 leaveTo="transform scale-95 opacity-0"
                                 offset={2}
                                 placement="bottom"
                                 portal
                              >
                                 <Listbox.Button
                                    style={{
                                       backgroundColor: element?.labelColor,
                                    }}
                                    className="flex items-center absolute h-3 w-3 rounded-full top-1 right-1 justify-center focus:outline-none"
                                 />
                                 <Listbox.Options className="border-color-sub text-1 bg-3-sub shadow-1 grid min-w-[100px] grid-cols-4 items-center justify-center gap-2 rounded-lg border p-2 shadow-sm focus:outline-none">
                                    {GROUP_COLORS?.map(
                                       (color: string, rowIdx: number) => (
                                          <Listbox.Option
                                             className="flex items-center justify-center"
                                             key={rowIdx}
                                             value={color}
                                          >
                                             <button
                                                type="button"
                                                onClick={() =>
                                                   updateLabelColor(color)
                                                }
                                                className="h-3.5 w-3.5 rounded-full"
                                                key={color}
                                                style={{
                                                   backgroundColor: color,
                                                }}
                                             ></button>
                                          </Listbox.Option>
                                       ),
                                    )}
                                 </Listbox.Options>
                              </Float>
                           </Listbox>
                        </div>
                     </>
                  )}
                  {element.label && !editMode && (
                     <div className="flex items-center justify-center pb-2">
                        <div
                           className="flex h-5 w-20 items-center justify-center rounded-full border-0 text-center text-[10px] font-bold"
                           style={{
                              backgroundColor: `${element?.labelColor}33`,
                           }}
                        >
                           {element.label}
                        </div>
                     </div>
                  )}
                  <Avatar
                     src={element?.iconUrl}
                     initials={
                        element?.iconUrl ? undefined : element.name.charAt(0)
                     }
                     className="size-14 mx-auto"
                     options="aspect_ratio=1:1&height=120&width=120"
                  />
                  <div className="text-center pt-2 text-xs font-bold">
                     {element?.name}
                  </div>
               </div>
            </div>
         )}
         <Modal
            onClose={() => {
               setModalStatus(false);
            }}
            unmount={false}
            show={modalStatus}
         >
            <div className="flex group justify-end pb-2 pr-1">
               <button
                  className="flex items-center gap-1"
                  onClick={() => setModalStatus(false)}
               >
                  <span className="text-zinc-200 dark:text-zinc-400 group-hover:underline text-xs">
                     Close
                  </span>
                  <Icon
                     name="x"
                     size={16}
                     className="text-white dark:text-zinc-500"
                  />
               </button>
            </div>
            <div
               className="bg-3 max-tablet:min-w-[100vw] max-h-[70vh] min-h-[200px] transform tablet:rounded-lg relative
               text-left align-middle transition-all tablet:w-[760px] no-scrollbar"
            >
               <div className="p-4 flex items-center gap-3">
                  <div className="flex items-center flex-none gap-1.5">
                     <span className="shadow-1 border-color-sub flex h-7 w-7 items-center overflow-hidden rounded-full border shadow-sm">
                        {element?.iconUrl ? (
                           <Image
                              url={element?.iconUrl}
                              options="aspect_ratio=1:1&height=120&width=120"
                              alt={element?.name ?? "Icon"}
                           />
                        ) : (
                           <Icon
                              name="component"
                              className="text-1 mx-auto"
                              size={18}
                           />
                        )}
                     </span>
                     <span className="font-bold font-header text-lg">
                        {element.name}
                     </span>
                  </div>
                  <span className="bg-zinc-100 dark:bg-dark350 rounded-full h-0.5 w-full flex-grow" />
               </div>
               <div className="p-4 pb-1.5 pt-0">
                  <NestedEditor
                     field="groupContent"
                     element={element}
                     editor={editor}
                     readOnly={editMode ? false : true}
                  />
               </div>
            </div>
         </Modal>
      </>
   );
}
