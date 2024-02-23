import { useState } from "react";

import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   arrayMove,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { Site } from "~/db/payload-types";

import { SortableCollectionItem } from "./SortableCollectionItem";

export function CollectionList({
   site,
   setDnDCollections,
   dndCollections,
   setIsChanged,
}: {
   site: Site;
   setDnDCollections: (collections: any) => void;
   dndCollections: string[];
   setIsChanged: (value: boolean) => void;
}) {
   const [activeId, setActiveId] = useState<string | null>(null);

   const [allCollections, setAllCollections] = useState(site?.collections);

   function handleDragStart(event: DragStartEvent) {
      if (event.active) {
         setActiveId(event.active.id as string);
      }
   }

   function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;

      if (active.id !== over?.id) {
         const oldIndex = dndCollections.indexOf(active?.id as string);
         const newIndex = dndCollections.indexOf(over?.id as string);
         setDnDCollections((items: any) => {
            return arrayMove(items, oldIndex, newIndex);
         });
         setAllCollections((items) => {
            //@ts-ignore
            return arrayMove(items, oldIndex, newIndex);
         });
         setIsChanged(true);
      }
   }

   const activeCollection = site?.collections?.find(
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
               items={dndCollections}
               strategy={verticalListSortingStrategy}
            >
               <div className="space-y-2.5 pb-5">
                  {allCollections?.map((collection) => (
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
