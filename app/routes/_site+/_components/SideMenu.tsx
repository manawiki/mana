import { NavLink } from "@remix-run/react";
import { Site } from "~/db/payload-types";
import { Image } from "~/components/Image";
import { CSS } from "@dnd-kit/utilities";

import { Icon } from "~/components/Icon";
import { Avatar } from "~/components/Avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";
import clsx from "clsx";
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

export function SideMenu({ site }: { site: Site }) {
   const [activeId, setActiveId] = useState<string | null>(null);

   const [isChanged, setIsChanged] = useState(false);

   const activeSection = site?.menu?.find(
      (x) => "id" in x && x.id === activeId,
   );

   function handleDragStart(event: DragStartEvent) {
      if (event.active) {
         setActiveId(event.active.id as string);
      }
   }

   const [menus, setMenu] = useState(site?.menu);

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
         setIsChanged(true);
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
         <div className="border-t border-color ml-5 mt-3 pt-2 pr-2 flex items-center">
            <button className="flex items-center justify-center gap-1.5 mt-2 mr-1">
               <Icon
                  name="list-plus"
                  className="text-zinc-400 dark:text-zinc-500"
                  size={16}
               />
               <span className="text-xs text-1">Add Menu Section</span>
            </button>
         </div>
      </>
   );
}

function SideMenuSection({
   menuSection,
   setMenu,
}: {
   menuSection: any;
   setMenu: any;
}) {
   const [activeId, setActiveId] = useState<string | null>(null);
   const [isChanged, setIsChanged] = useState(false);

   console.log(menuSection);

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

         setIsChanged(true);
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
         <div className="pl-2 pr-1 pb-1 dark:text-zinc-400 flex items-center justify-between relative group">
            <div
               className={clsx(
                  "touch-none absolute hidden group-hover:block -left-1.5 top-1 cursor-grab",
               )}
               aria-label="Drag to reorder"
               ref={setActivatorNodeRef}
               {...listeners}
            >
               <Icon
                  name="grip-vertical"
                  title="Drag to reorder"
                  size={14}
                  className="dark:text-zinc-500"
               />
            </div>
            <input
               type="text"
               className="text-sm bg-transparent focus:outline-none focus:bg-dark350 p-0.5 rounded"
               defaultValue={menuSection.name}
            />
            <Tooltip placement="top" setDelay={500}>
               <TooltipTrigger
                  title="Add menu link"
                  className="flex items-center justify-center group"
               >
                  <Icon
                     name="plus"
                     title="Add menu link"
                     className="text-zinc-400 dark:text-zinc-500 dark:group-hover:text-zinc-400"
                     size={16}
                  />
               </TooltipTrigger>
               <TooltipContent>Add menu link</TooltipContent>
            </Tooltip>
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
                  {menuSection.links?.map((link: any) => (
                     <SideMenuSectionLink
                        key={link.id}
                        link={link}
                        setMenu={setMenu}
                     />
                  ))}
               </SortableContext>
               <DragOverlay adjustScale={false}>
                  {activeSection && (
                     <SideMenuSectionLink
                        link={activeSection}
                        setMenu={setMenu}
                     />
                  )}
               </DragOverlay>
            </DndContext>
         </div>
      </menu>
   );
}

function SideMenuSectionNestedLink({ nestedSection }: { nestedSection: any }) {
   const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      isSorting,
      transition,
      isDragging,
      setActivatorNodeRef,
   } = useSortable({ id: nestedSection.id });

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
         className="relative group"
         {...attributes}
      >
         <div
            className={clsx(
               "touch-none absolute hidden group-hover:block -left-1.5 top-1 cursor-grab",
            )}
            aria-label="Drag to reorder"
            ref={setActivatorNodeRef}
            {...listeners}
         >
            <Icon
               name="grip-vertical"
               title="Drag to reorder"
               size={14}
               className="dark:text-zinc-500"
            />
         </div>
         <NavLink
            to={nestedSection.path}
            className={({ isActive }) =>
               clsx(
                  isActive && "bg-zinc-100 dark:bg-dark350",
                  "flex items-center justify-between gap-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-dark350 py-1 pl-2 pr-1",
               )
            }
         >
            <span className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400 truncate">
               {nestedSection.name}
            </span>
            <Avatar
               initials={nestedSection.name.charAt(0)}
               src={nestedSection.icon}
               className="size-6 flex-none"
               options="aspect_ratio=1:1&height=120&width=120"
            />
         </NavLink>
      </div>
   );
}

function SideMenuSectionLink({ link, setMenu }: { link: any; setMenu: any }) {
   const [isSectionOpen, setSection] = useState(false);

   const [activeId, setActiveId] = useState<string | null>(null);

   const activeSection = link?.nestedLinks?.find(
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
         const oldIndex = link?.nestedLinks?.findIndex(
            (x: any) => x.id == active.id,
         );
         const newIndex = link?.nestedLinks?.findIndex(
            (x: any) => x.id == over?.id,
         );
         setMenu((existingMenuItems: any) => {
            const updatedArray = arrayMove(
               link?.nestedLinks,
               oldIndex,
               newIndex,
            );

            const updatedMenu = existingMenuItems?.map((menuRow: any) => {
               return {
                  ...menuRow,
                  links: {
                     ...menuRow.links,
                     nestedLinks:
                        menuRow.links.id === link.id
                           ? updatedArray
                           : menuRow.nestedLinks,
                  },
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
   } = useSortable({ id: link.id });

   return (
      <div
         className="relative group"
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
      >
         <div
            className={clsx(
               "touch-none absolute hidden group-hover:block -left-1.5 top-1 cursor-grab",
            )}
            aria-label="Drag to reorder"
            ref={setActivatorNodeRef}
            {...listeners}
         >
            <Icon
               name="grip-vertical"
               title="Drag to reorder"
               size={14}
               className="dark:text-zinc-500"
            />
         </div>
         {link.nestedLinks && link.nestedLinks.length > 0 ? (
            <>
               <button
                  onClick={() => setSection(!isSectionOpen)}
                  className="flex items-center gap-2 rounded-lg dark:hover:bg-dark350 p-2 py-1.5 px-2 w-full text-left"
               >
                  <Avatar
                     initials={link.name.charAt(0)}
                     className="size-6 flex-none"
                     src={link.icon}
                     options="aspect_ratio=1:1&height=120&width=120"
                  />
                  <span className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                     {link.name}
                  </span>
                  <Icon
                     name="chevron-right"
                     className={`${
                        isSectionOpen ? "rotate-90" : ""
                     } transform transition duration-300 ease-in-out text-zinc-400 dark:text-zinc-500`}
                     size={14}
                  />
               </button>
               {isSectionOpen && (
                  <div className="pl-1 ml-2 space-y-0.5 border-l border-color border-dashed">
                     <DndContext
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                        collisionDetection={closestCenter}
                     >
                        <SortableContext
                           items={link.nestedLinks}
                           strategy={verticalListSortingStrategy}
                        >
                           {link.nestedLinks?.map((link: any) => (
                              <SideMenuSectionNestedLink nestedSection={link} />
                           ))}
                        </SortableContext>
                        <DragOverlay adjustScale={false}>
                           {activeSection && (
                              <SideMenuSectionNestedLink
                                 nestedSection={activeSection}
                              />
                           )}
                        </DragOverlay>
                     </DndContext>
                  </div>
               )}
            </>
         ) : (
            <NavLink
               to={link.path}
               className={({ isActive }) =>
                  clsx(
                     isActive && "bg-zinc-100 dark:bg-dark350",
                     "flex items-center gap-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-dark350 py-1.5 px-2",
                  )
               }
            >
               <Avatar
                  initials={link.name.charAt(0)}
                  className="size-6 flex-none"
                  src={link.icon}
                  options="aspect_ratio=1:1&height=120&width=120"
               />
               <span className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                  {link.name}
               </span>
            </NavLink>
         )}
      </div>
   );
}
