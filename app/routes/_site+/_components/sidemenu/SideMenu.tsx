import { Site } from "~/db/payload-types";
import { Image } from "~/components/Image";

import { Icon } from "~/components/Icon";
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
   arrayMove,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SideMenuSection } from "./SideMenuSection";
import { Button } from "~/components/Button";
import { nanoid } from "nanoid";

export function SideMenu({ site }: { site: Site }) {
   const [activeId, setActiveId] = useState<string | null>(null);

   const activeSection = site?.menu?.find(
      (x) => "id" in x && x.id === activeId,
   );

   function handleDragStart(event: DragStartEvent) {
      if (event.active) {
         setActiveId(event.active.id as string);
      }
   }

   const [menus, setMenu] = useState(site?.menu);

   const isChanged = menus !== site?.menu;

   function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      if (active.id !== over?.id) {
         const oldIndex = menus?.findIndex((x) => x.id == active.id);
         const newIndex = menus?.findIndex((x) => x.id == over?.id);
         //@ts-ignore
         setMenu((items) => {
            //@ts-ignore
            return arrayMove(items, oldIndex, newIndex);
         });
      }
      setActiveId(null);
   }

   return (
      <>
         <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
            collisionDetection={closestCenter}
         >
            <SortableContext
               //@ts-ignore
               items={menus}
               strategy={verticalListSortingStrategy}
            >
               {menus?.map((item) => (
                  <SideMenuSection
                     key={item.id}
                     menuSection={item}
                     setMenu={setMenu}
                  />
               ))}
            </SortableContext>
            <DragOverlay adjustScale={false}>
               {activeSection && (
                  <SideMenuSection
                     menuSection={activeSection}
                     setMenu={setMenu}
                  />
               )}
            </DragOverlay>
         </DndContext>
         {/* Menu controls */}
         <div className="fixed bottom-0 desktop:w-[214px] backdrop-blur-lg pl-2">
            {isChanged && (
               <div className="pl-2 pt-3">
                  <div className="grid grid-cols-2 gap-3">
                     <Button
                        className="!py-1 !px-2 text-xs"
                        color="zinc"
                        onClick={() => setMenu(site?.menu)}
                     >
                        Cancel
                     </Button>
                     <Button className="!py-1 !px-2 text-xs" color="green">
                        Save
                     </Button>
                  </div>
               </div>
            )}
            <div className="mt-3 pb-3 flex items-center">
               <button
                  onClick={() =>
                     //@ts-ignore
                     setMenu((existingMenuItems) => {
                        const newMenuSection = [
                           //@ts-ignore
                           ...existingMenuItems,
                           {
                              id: nanoid(),
                              name: "New Section",
                              links: [{ id: nanoid(), name: "yoo" }],
                           },
                        ];
                        console.log(newMenuSection);
                        return newMenuSection;
                     })
                  }
                  className="flex items-center justify-center gap-1.5 dark:hover:bg-dark350 hover:bg-zinc-100 rounded-lg py-2 px-2.5"
               >
                  <Icon
                     name="list-plus"
                     className="text-zinc-400 dark:text-zinc-600"
                     size={16}
                  />
                  <span className="text-xs text-1 hidden desktop:block">
                     Add Menu Section
                  </span>
               </button>
            </div>
         </div>
      </>
   );
}
