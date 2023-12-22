import { Fragment, useState, useEffect } from "react";

import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Switch } from "@headlessui/react";
import {
   useFetcher,
   type FetcherWithComponents,
   useMatches,
   useLocation,
   useParams,
} from "@remix-run/react";
import clsx from "clsx";
import type { Zorm } from "react-zorm";
import { useValue, useZorm } from "react-zorm";
import urlSlug from "url-slug";
import { z } from "zod";

import { Icon } from "~/components/Icon";
import type { Collection, Site } from "~/db/payload-types";
import { isAdding, useDebouncedValue, useIsMount } from "~/utils";

export type Section = {
   id: string;
   name?: string;
   showTitle?: boolean;
};

export const SectionSchema = z.object({
   collectionId: z.string(),
   name: z.string(),
   sectionId: z.string(),
   showTitle: z.coerce.boolean(),
});

export function Sections() {
   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const { site } = (useMatches()?.[1]?.data as { site: Site | null }) ?? {
      site: null,
   };

   //Get path for custom site
   const { pathname } = useLocation();
   const collectionSlug = pathname.split("/")[2];
   const collectionId = useParams()?.collectionId ?? collectionSlug;

   const collection = site?.collections?.find(
      (collection) => collection.slug === collectionId,
   );

   const fetcher = useFetcher();

   //Sections
   const zoSections = useZorm("sections", SectionSchema);
   const addingSection = isAdding(fetcher, "addSection");

   const [isSectionsOpen, setSectionsOpen] = useState<boolean>(false);
   const [activeId, setActiveId] = useState<string | null>(null);

   const sections = collection?.sections?.map((item) => item.id) ?? [];

   function handleDragStart(event: DragStartEvent) {
      if (event.active) {
         setActiveId(event.active.id as string);
      }
   }

   function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      if (active.id !== over?.id) {
         fetcher.submit(
            {
               collectionId: collection?.id ?? "",
               activeId: active?.id,
               overId: over?.id ?? "",
               intent: "updateSectionOrder",
            },
            {
               method: "patch",
            },
         );
      }
      setActiveId(null);
   }

   const activeSection = collection?.sections?.find(
      (x) => "id" in x && x.id === activeId,
   );

   useEffect(() => {
      if (!addingSection) {
         zoSections.refObject.current && zoSections.refObject.current.reset();
      }
   }, [addingSection, zoSections.refObject]);

   return (
      <div className="relative">
         <button
            onClick={() => setSectionsOpen(!isSectionsOpen)}
            className="absolute flex items-center dark:hover:border-zinc-500/70 gap-2 justify-center -top-[33px] shadow-1 shadow-sm 
            z-10 bg-3-sub rounded-lg border border-zinc-200 dark:border-zinc-600/80 right-0 hover:border-zinc-300/80 overflow-hidden"
         >
            <div className="flex items-center gap-1.5">
               <div className="text-[10px] font-bold text-1 pl-2.5">
                  Sections
               </div>
               <Icon
                  name="chevron-down"
                  className={clsx(
                     isSectionsOpen ? "rotate-180" : "",
                     "transform transition duration-300 text-1 ease-in-out",
                  )}
                  size={14}
               />
               <div className="text-[10px] font-bold border-l border-zinc-200 dark:border-zinc-600 py-1 text-1 bg-zinc-50 px-2 dark:bg-dark350">
                  {sections?.length}
               </div>
            </div>
         </button>
         {/* Sections */}
         {isSectionsOpen && (
            <>
               <div className="pb-1">
                  <fetcher.Form
                     ref={zoSections.ref}
                     className="flex items-center gap-4"
                     method="post"
                  >
                     <div className="flex items-center gap-3 pl-0.5 flex-grow">
                        <Icon
                           name="list-plus"
                           className="text-1 flex-none"
                           size={16}
                        />
                        <input
                           required
                           placeholder="Type a section name..."
                           name={zoSections.fields.name()}
                           type="text"
                           className="w-full bg-transparent placeholder:text-zinc-400 dark:placeholder:text-zinc-500 
                        font-semibold text-sm h-10 p-0 focus:border-0 focus:ring-0 border-0"
                        />
                        <input
                           value={collection?.id}
                           name={zoSections.fields.collectionId()}
                           type="hidden"
                        />
                        <SectionIdField zo={zoSections} />
                        <Switch.Group>
                           <div className="flex items-center group">
                              <Switch.Label
                                 className="flex-grow cursor-pointer dark:text-zinc-400 text-zinc-500  group-hover:underline 
                        decoration-zinc-300 dark:decoration-zinc-600 underline-offset-2 text-xs w-16"
                              >
                                 Show Title
                              </Switch.Label>
                              <Switch as={Fragment} name="showTitle">
                                 {({ checked }) => (
                                    <div className="dark:border-zinc-600/60 bg-2-sub relative flex-none flex h-5 w-[36px] items-center rounded-full border">
                                       <span className="sr-only">
                                          Show Title
                                       </span>
                                       <div
                                          className={clsx(
                                             checked
                                                ? "translate-x-[18px] dark:bg-zinc-300 bg-zinc-400"
                                                : "translate-x-1 bg-zinc-300 dark:bg-zinc-500",
                                             "inline-flex h-3 w-3 transform items-center justify-center rounded-full transition",
                                          )}
                                       />
                                    </div>
                                 )}
                              </Switch>
                           </div>
                        </Switch.Group>
                     </div>
                     <button
                        className="flex items-center flex-none gap-2 border border-color dark:hover:border-zinc-500 hover:border-zinc-200
                     rounded-full py-1 dark:bg-zinc-700 dark:border-zinc-600 pl-3 pr-1.5 bg-zinc-100 border-zinc-300 shadow-sm shadow-1"
                        name="intent"
                        value="addSection"
                        type="submit"
                     >
                        <div className="flex items-center gap-2">
                           <span className="text-1 text-xs font-bold">Add</span>
                           {addingSection ? (
                              <Icon
                                 name="loader-2"
                                 size={14}
                                 className="animate-spin text-zinc-400"
                              />
                           ) : (
                              <Icon
                                 name="plus-circle"
                                 className="text-zinc-400"
                                 size={14}
                              />
                           )}
                        </div>
                     </button>
                  </fetcher.Form>
               </div>
               <DndContext
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                  collisionDetection={closestCenter}
               >
                  <SortableContext
                     items={sections}
                     strategy={verticalListSortingStrategy}
                  >
                     <div className="divide-y bg-2-sub divide-color-sub border rounded-lg border-color-sub mb-4 shadow-sm shadow-1">
                        {collection?.sections?.map((row) => (
                           <SortableSectionItem
                              key={row.id}
                              section={row}
                              fetcher={fetcher}
                              collectionId={collection?.id}
                           />
                        ))}
                     </div>
                  </SortableContext>
                  <DragOverlay adjustScale={false}>
                     {activeSection && (
                        <SortableSectionItem
                           fetcher={fetcher}
                           section={activeSection}
                           collectionId={collection?.id}
                        />
                     )}
                  </DragOverlay>
               </DndContext>
            </>
         )}
      </div>
   );
}

export function SectionIdField({ zo }: { zo: Zorm<typeof SectionSchema> }) {
   const value = useValue({
      zorm: zo,
      name: zo.fields.name(),
   });
   return (
      <>
         {value && (
            <div className="flex items-center gap-1.5 max-laptop:hidden">
               <div className="text-[10px] font-bold text-1">ID</div>
               <input
                  readOnly
                  name={zo.fields.sectionId()}
                  type="text"
                  className="h-6 bg-transparent focus:bg-3 text-left focus:border-0 focus:ring-0 
                  pb-0.5 text-zinc-400 dark:text-zinc-500 text-xs border-0 p-0 mt-0"
                  value={urlSlug(value)}
               />
            </div>
         )}
      </>
   );
}

export function SortableSectionItem({
   section,
   fetcher,
   collectionId,
}: {
   section: Section;
   fetcher: FetcherWithComponents<unknown>;
   collectionId: Collection["id"] | undefined;
}) {
   const sectionFields = {
      collectionId: collectionId ?? "",
      sectionId: section?.id,
   };

   const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      isSorting,
      transition,
      isDragging,
      setActivatorNodeRef,
   } = useSortable({ id: section.id });

   const [titleVisibility, setTitleVisibility] = useState(section?.showTitle);

   const isMount = useIsMount();

   const [sectionName, setSectionName] = useState(section?.name);

   const debouncedSectionName = useDebouncedValue(sectionName, 500);

   useEffect(() => {
      if (!isMount) {
         fetcher.submit(
            {
               ...sectionFields,
               showTitle: titleVisibility ?? null,
               intent: "updateSection",
            },
            {
               method: "patch",
            },
         );
      }
   }, [titleVisibility]);

   useEffect(() => {
      if (!isMount) {
         fetcher.submit(
            {
               ...sectionFields,
               name: debouncedSectionName ?? "",
               intent: "updateSection",
            },
            { method: "patch" },
         );
      }
   }, [debouncedSectionName]);

   return (
      <div
         ref={setNodeRef}
         style={
            {
               transition: transition,
               transform: CSS.Transform.toString(transform),
               pointerEvents: isSorting ? "none" : undefined,
               opacity: isDragging ? 0 : 1,
            } as React.CSSProperties /* cast because of css variable */
         }
         {...attributes}
         className="flex items-center gap-3 p-2 justify-between"
      >
         <div className="flex items-center gap-2.5 flex-grow">
            <div
               className={clsx(
                  isDragging ? "cursor-grabbing" : "cursor-move",
                  "dark:hover:bg-dark400 hover:bg-zinc-100 px-0.5 py-1.5 rounded-md",
               )}
               aria-label="Drag to reorder"
               ref={setActivatorNodeRef}
               {...listeners}
            >
               <Icon name="grip-vertical" size={14} className="text-1" />
            </div>
            <input
               required
               value={sectionName}
               onChange={(event) => setSectionName(event.target.value)}
               type="text"
               className="w-full bg-transparent font-semibold text-xs h-6 p-0 focus:border-0 focus:ring-0 border-0"
            />
         </div>
         <div className="text-xs text-zinc-400 dark:text-zinc-500 border-r border-color-sub pr-3">
            {section.id}
         </div>
         <Switch.Group>
            <div className="flex items-center group gap-2">
               <Switch.Label
                  className={clsx(
                     !titleVisibility
                        ? "text-zinc-400"
                        : "dark:text-zinc-200 text-zinc-600",
                     "flex-grow cursor-pointer group-hover:underline font-semibold flex items-center gap-1 decoration-zinc-300 dark:decoration-zinc-600 underline-offset-2 text-[10px]",
                  )}
               >
                  <span>Title</span>
               </Switch.Label>
               <Switch
                  checked={!titleVisibility}
                  onChange={() => setTitleVisibility(!titleVisibility)}
                  as={Fragment}
               >
                  {({ checked }) => (
                     <div className="dark:border-zinc-600/60 bg-white dark:bg-dark450 relative flex-none flex h-5 w-[34px] items-center rounded-full border">
                        <span className="sr-only">Title</span>
                        <div
                           className={clsx(
                              !checked
                                 ? "translate-x-[16px] dark:bg-zinc-300 bg-zinc-400"
                                 : "translate-x-1 bg-zinc-300 dark:bg-zinc-500",
                              "inline-flex h-3 w-3 transform items-center justify-center rounded-full transition",
                           )}
                        />
                     </div>
                  )}
               </Switch>
            </div>
         </Switch.Group>
      </div>
   );
}
