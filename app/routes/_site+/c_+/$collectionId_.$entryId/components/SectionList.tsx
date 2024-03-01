import { useState } from "react";

import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   arrayMove,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { Collection } from "~/db/payload-types";

import { SortableSectionItem } from "./SortableSectionItem";
import type { Section } from "../../_components/List";

export function SectionList({
   setIsChanged,
   collection,
   allSections,
   setAllSections,
}: {
   setIsChanged: (value: boolean) => void;
   collection: Collection | undefined;
   allSections: Section[] | undefined | null;
   setAllSections: (sections: any) => void;
}) {
   const [activeId, setActiveId] = useState<string | null>(null);

   function handleDragStart(event: DragStartEvent) {
      if (event.active) {
         setActiveId(event.active.id as string);
      }
   }

   function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      if (active.id !== over?.id) {
         const oldIndex = allSections?.findIndex((x) => x.id == active.id);
         const newIndex = allSections?.findIndex((x) => x.id == over?.id);
         //@ts-ignore
         setAllSections((items) => {
            // @ts-ignore
            return arrayMove(items, oldIndex, newIndex);
         });
         setIsChanged(true);
      }
      setActiveId(null);
   }

   const activeSection = collection?.sections?.find(
      (x) => "id" in x && x.id === activeId,
   );

   return (
      <DndContext
         onDragStart={handleDragStart}
         onDragEnd={handleDragEnd}
         modifiers={[restrictToVerticalAxis]}
         collisionDetection={closestCenter}
      >
         <SortableContext
            //@ts-ignore
            items={allSections}
            strategy={verticalListSortingStrategy}
         >
            <div
               className="divide-y bg-zinc-50 dark:bg-dark400 divide-color-sub border-y tablet:border
               tablet:rounded-lg dark:border-zinc-600/50 dark:divide-zinc-600/50 mb-4 tablet:shadow-sm dark:shadow-zinc-800/70"
            >
               {allSections?.map((row) => (
                  <SortableSectionItem
                     key={row.id}
                     //@ts-ignore
                     section={row}
                     setAllSections={setAllSections}
                     collection={collection}
                  />
               ))}
            </div>
         </SortableContext>
         <DragOverlay adjustScale={false}>
            {activeSection && (
               <SortableSectionItem
                  //@ts-ignore
                  section={activeSection}
                  setAllSections={setAllSections}
                  collection={collection}
               />
            )}
         </DragOverlay>
      </DndContext>
   );
}
