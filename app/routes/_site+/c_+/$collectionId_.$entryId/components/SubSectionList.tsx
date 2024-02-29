import { useEffect, useState } from "react";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   arrayMove,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFetcher } from "@remix-run/react";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import type { Collection } from "~/db/payload-types";
import { isAdding, isProcessing } from "~/utils/form";

import type { Section } from "./Sections";
import { SortableSubSectionItem } from "./SortableSubSectionItem";

export function SubSectionList({
   section,
   collection,
}: {
   section: Section;
   collection: Collection | undefined;
}) {
   const fetcher = useFetcher();

   const disabled = isProcessing(fetcher.state);

   const [isSubSectionChanged, setIsSubSectionChanged] = useState(false);

   const savingUpdateSubSection = isAdding(fetcher, "updateSubSection");

   const [allSubSections, setSubSections] = useState(section?.subSections);
   const [activeId, setActiveId] = useState<string | null>(null);

   const activeSubSection = section?.subSections?.find(
      (x) => "id" in x && x.id === activeId,
   );

   function handleDragStart(event: DragStartEvent) {
      if (event.active) {
         setActiveId(event.active.id as string);
      }
   }

   function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      if (active.id !== over?.id) {
         const oldIndex = allSubSections?.findIndex((x) => x.id == active.id);
         const newIndex = allSubSections?.findIndex((x) => x.id == over?.id);
         // @ts-ignore
         setSubSections((items) => {
            //@ts-ignore
            return arrayMove(items, oldIndex, newIndex);
         });
         setIsSubSectionChanged(true);
      }
      setActiveId(null);
   }

   useEffect(() => {
      if (!savingUpdateSubSection) {
         setSubSections(section?.subSections);
         setIsSubSectionChanged(false);
      }
   }, [savingUpdateSubSection, section?.subSections]);

   return (
      <div className="relative">
         <div className="text-xs pb-3 font-semibold flex items-center gap-2">
            <Icon
               name="columns-2"
               className="text-zinc-400 dark:text-zinc-500"
               size={16}
            />
            <span className="pt-0.5">Subsections</span>
         </div>
         {isSubSectionChanged && (
            <div className="flex items-center gap-3 !absolute -top-2 right-0">
               <button
                  type="button"
                  onClick={() => {
                     setIsSubSectionChanged(false);
                     setSubSections(section?.subSections);
                  }}
               >
                  <Icon
                     title="Reset"
                     size={14}
                     name="refresh-ccw"
                     className="dark:text-zinc-500"
                  />
               </button>
               <Button
                  disabled={disabled}
                  type="button"
                  color="blue"
                  className="!text-xs !h-7"
                  onClick={() => {
                     fetcher.submit(
                        {
                           sectionId: section?.id ?? "",
                           collectionId: collection?.id ?? "",
                           subSections: JSON.stringify(allSubSections),
                           intent: "updateSubSectionOrder",
                        },
                        {
                           method: "POST",
                           action: "/collections/sections",
                        },
                     );
                  }}
               >
                  Save
               </Button>
            </div>
         )}
         <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
            collisionDetection={closestCenter}
         >
            <SortableContext
               //@ts-ignore
               items={allSubSections}
               strategy={verticalListSortingStrategy}
            >
               <div className="divide-y bg-2-sub divide-color-sub mb-4 -mx-5 border-y border-color-sub">
                  {allSubSections?.map((row) => (
                     <SortableSubSectionItem
                        key={row.id}
                        subSection={row}
                        sectionId={section.id}
                        fetcher={fetcher}
                        collectionId={collection?.id}
                     />
                  ))}
               </div>
            </SortableContext>
            <DragOverlay adjustScale={false}>
               {activeSubSection && (
                  <SortableSubSectionItem
                     fetcher={fetcher}
                     subSection={activeSubSection}
                     sectionId={section.id}
                     collectionId={collection?.id}
                  />
               )}
            </DragOverlay>
         </DndContext>
      </div>
   );
}
