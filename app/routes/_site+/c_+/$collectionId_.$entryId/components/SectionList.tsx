import { useEffect, useState } from "react";

import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   arrayMove,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFetcher } from "@remix-run/react";

import type { Collection } from "~/db/payload-types";
import { isAdding } from "~/utils/form";

import { SortableSectionItem } from "./SortableSectionItem";

export function SectionList({
   collection,
}: {
   collection: Collection | undefined;
}) {
   const fetcher = useFetcher({ key: "section" });

   const [allSections, setAllSections] = useState(collection?.sections);
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
         setAllSections((items) => {
            // @ts-ignore
            return arrayMove(items, oldIndex, newIndex);
         });
         fetcher.submit(
            {
               collectionId: collection?.id ?? "",
               activeId: active?.id,
               overId: over?.id ?? "",
               intent: "updateSectionOrder",
            },
            {
               method: "POST",
               action: "/collections/sections",
            },
         );
      }
      setActiveId(null);
   }

   const activeSection = collection?.sections?.find(
      (x) => "id" in x && x.id === activeId,
   );

   const saving = isAdding(fetcher, "addSection");

   useEffect(() => {
      if (!saving) {
         setAllSections(collection?.sections);
      }
   }, [saving, collection?.sections]);

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
            <div className="divide-y bg-2-sub divide-color-sub border rounded-lg border-color-sub mb-4 shadow-sm shadow-1">
               {allSections?.map((row) => (
                  <SortableSectionItem
                     key={row.id}
                     //@ts-ignore
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
                  //@ts-ignore
                  section={activeSection}
                  collectionId={collection?.id}
               />
            )}
         </DragOverlay>
      </DndContext>
   );
}
