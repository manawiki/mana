import { useState } from "react";

import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   arrayMove,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { Collection } from "~/db/payload-types";

import { SortableCollectionItem } from "./SortableCollectionItem";

export function CollectionList({
   setDnDCollections,
   dndCollections,
   setIsChanged,
}: {
   setDnDCollections: (collections: any) => void;
   dndCollections: Collection[] | undefined | null;
   setIsChanged: (value: boolean) => void;
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
         const oldIndex = dndCollections?.findIndex((x) => x.id == active.id);
         const newIndex = dndCollections?.findIndex((x) => x.id == over?.id);
         setDnDCollections((items: any) => {
            //@ts-ignore
            return arrayMove(items, oldIndex, newIndex);
         });

         setIsChanged(true);
      }
   }

   const activeCollection = dndCollections?.find(
      (x) => "id" in x && x.id === activeId,
   );

   return (
      <>
         <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
            collisionDetection={closestCorners}
         >
            <SortableContext
               //@ts-ignore
               items={dndCollections}
               strategy={verticalListSortingStrategy}
            >
               <div className="space-y-2.5 pb-5">
                  {dndCollections?.map((collection) => (
                     <SortableCollectionItem
                        key={collection.id}
                        collection={collection}
                     />
                  ))}
               </div>
            </SortableContext>
            <DragOverlay adjustScale={false}>
               {activeCollection && (
                  <SortableCollectionItem collection={activeCollection} />
               )}
            </DragOverlay>
         </DndContext>
      </>
   );
}
