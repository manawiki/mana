import { CSS } from "@dnd-kit/utilities";
import { Icon } from "~/components/Icon";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";
import { useState } from "react";
import {
   DndContext,
   DragEndEvent,
   DragOverlay,
   DragStartEvent,
   closestCenter,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   useSortable,
   arrayMove,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SideMenuLink } from "./SideMenuLink";

export function SideMenuSection({
   menuSection,
   setMenu,
}: {
   menuSection: any;
   setMenu: any;
}) {
   const [activeId, setActiveId] = useState<string | null>(null);

   const activeSection = menuSection?.links?.find(
      (x: any) => "id" in x && x.id === activeId,
   );

   function handleDragStart(event: DragStartEvent) {
      if (event.active) {
         setActiveId(event.active.id as string);
      }
   }

   function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      if (active.id !== over?.id) {
         const oldIndex = menuSection?.links?.findIndex(
            (x: any) => x.id == active.id,
         );
         const newIndex = menuSection?.links?.findIndex(
            (x: any) => x.id == over?.id,
         );
         //@ts-ignore
         setMenu((existingMenuItems) => {
            const updatedArray = arrayMove(
               menuSection.links,
               oldIndex,
               newIndex,
            );

            const updatedMenu = existingMenuItems?.map((menuRow: any) => {
               return {
                  ...menuRow,
                  links:
                     menuSection.id === menuRow.id
                        ? updatedArray
                        : menuRow.links,
               };
            });
            return updatedMenu;
         });
      }
      setActiveId(null);
   }

   const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      isSorting,
      transition,
      isDragging,
      setActivatorNodeRef,
   } = useSortable({ id: menuSection.id });

   return (
      <menu
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
         className="px-2 pt-4"
      >
         <div className="pl-2 pb-1 dark:text-zinc-400 flex items-center justify-between relative group">
            <input
               type="text"
               placeholder="Section Name"
               value={menuSection.name}
               onChange={(e) => {
                  setMenu((existingMenuItems: any) => {
                     const updatedMenu = existingMenuItems?.map(
                        (menuRow: any) => {
                           return {
                              ...menuRow,
                              name:
                                 menuSection.id === menuRow.id
                                    ? e.target.value
                                    : menuRow.name,
                           };
                        },
                     );
                     return updatedMenu;
                  });
               }}
               className="text-sm bg-transparent font-semibold focus:outline-none dark:focus:bg-dark350 focus:bg-white p-0.5 rounded"
            />
            <div
               className="touch-none hidden group-hover:block -left-1.5 top-0 cursor-grab hover:bg-zinc-200 dark:hover:bg-dark500 rounded py-1 px-0.5"
               aria-label="Drag to reorder"
               ref={setActivatorNodeRef}
               {...listeners}
            >
               <Icon name="grip-vertical" title="Drag to reorder" size={14} />
            </div>
         </div>
         <div className="space-y-0.5">
            <DndContext
               onDragStart={handleDragStart}
               onDragEnd={handleDragEnd}
               modifiers={[restrictToVerticalAxis]}
               collisionDetection={closestCenter}
            >
               <SortableContext
                  //@ts-ignore
                  items={menuSection.links}
                  strategy={verticalListSortingStrategy}
               >
                  {menuSection.links?.map((link: any, index: number) => (
                     <SideMenuLink
                        key={link.id}
                        link={link}
                        setMenu={setMenu}
                        index={index}
                     />
                  ))}
               </SortableContext>
               <DragOverlay adjustScale={false}>
                  {activeSection && (
                     <SideMenuLink link={activeSection} setMenu={setMenu} />
                  )}
               </DragOverlay>
            </DndContext>
         </div>
      </menu>
   );
}
