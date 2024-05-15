import { Link, NavLink, useLocation } from "@remix-run/react";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "~/components/Icon";
import { Avatar } from "~/components/Avatar";
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
import { SideMenuSectionNestedLink } from "./SideMenuSectionNestedLink";
import { nanoid } from "nanoid";

export function SideMenuLink({
   link,
   setMenu,
   index,
}: {
   link: any;
   setMenu: any;
   index?: number;
}) {
   const { pathname } = useLocation();

   const nestedLinkActive = link?.nestedLinks?.find(
      (x: any) => x.path === pathname,
   );

   const [isSectionOpen, setSection] = useState(nestedLinkActive ?? false);

   const [activeId, setActiveId] = useState<string | null>(null);

   const activeSection = link?.nestedLinks?.find(
      (x: any) => "id" in x && x.id === activeId,
   );

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
                  links: menuRow.links?.map((linkItem: any) => ({
                     ...linkItem,
                     nestedLinks:
                        link.id === linkItem.id
                           ? updatedArray
                           : linkItem.nestedLinks,
                  })),
               };
            });

            return updatedMenu;
         });
      }
      setActiveId(null);
   }

   const [editMode, setEditMode] = useState(false);

   return (
      <>
         <div
            className={clsx(
               pathname === link.path && "bg-zinc-200/40 dark:bg-dark350",
               "relative group/section hover:bg-zinc-200/40 dark:hover:bg-dark350 rounded-lg p-1.5 flex items-center justify-between gap-2",
            )}
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
            onMouseLeave={() => setEditMode(false)}
         >
            {/* Insert top */}
            <div className="-top-[1px] left-0 w-full h-2 rounded-t-lg absolute opacity-0 hover:opacity-100">
               <button
                  type="button"
                  onClick={() =>
                     setMenu((existingMenuItems: any[]) => {
                        const updatedMenu = existingMenuItems?.map(
                           (menuRow: any) => {
                              const getLink = menuRow?.links?.find(
                                 (x: any) => x.id === link.id,
                              );
                              if (getLink) {
                                 const newItem = {
                                    id: nanoid(),
                                    name: "New Link",
                                    path: "/link",
                                    icon: "",
                                    nestedLinks: [],
                                 };
                                 const newMenuItems = [...menuRow?.links];
                                 //@ts-ignore
                                 newMenuItems.splice(index, 0, newItem);
                                 return {
                                    ...menuRow,
                                    links: newMenuItems,
                                 };
                              }
                              return { ...menuRow };
                           },
                        );
                        return updatedMenu;
                     })
                  }
                  className="px-0.5 justify-between flex w-full items-center -mt-1.5 rounded-t"
               >
                  <div className="rounded-full border dark:border-transparent bg-white border-zinc-300 dark:bg-black size-3 flex items-center justify-center">
                     <Icon
                        size={10}
                        name="chevron-up"
                        className="dark:text-white text-light -mt-[1px]"
                        title="Add above"
                     />
                  </div>
                  <div className="text-[10px] border-t border-dashed border-zinc-300 dark:border-zinc-500 flex-grow" />
                  <div className="border bg-zinc-50 border-zinc-300 dark:border-zinc-600 rounded-full dark:bg-dark500 p-0.5">
                     <Icon size={8} name="plus" title="Add above" />
                  </div>
                  <div className="text-[10px] border-t border-dashed border-zinc-300 dark:border-zinc-500 flex-grow" />
                  <div className="rounded-full border dark:border-transparent bg-white border-zinc-300 dark:bg-black size-3 flex items-center justify-center">
                     <Icon
                        size={10}
                        name="chevron-up"
                        className="dark:text-white text-light -mt-[1px]"
                        title="Add above"
                     />
                  </div>
               </button>
            </div>
            {link.nestedLinks && link.nestedLinks.length > 0 ? (
               editMode ? (
                  <div className="flex items-center gap-2">
                     <Avatar
                        initials={link.name.charAt(0)}
                        className="size-6 flex-none"
                        src={link.icon}
                        options="aspect_ratio=1:1&height=120&width=120"
                     />
                     <input
                        autoFocus
                        type="text"
                        defaultValue={link.name}
                        className="bg-transparent w-full max-w-full focus:ring-1 bg-white ring-zinc-300
                   dark:ring-zinc-600 dark:bg-dark450 rounded text-[13px] 
                     font-semibold text-zinc-500 dark:text-zinc-400 focus:outline-none px-1"
                     />
                  </div>
               ) : (
                  <button
                     onClick={() => setSection(!isSectionOpen)}
                     className="flex items-center justify-between gap-2 w-full text-left "
                  >
                     <div className="flex items-center gap-2">
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
                     </div>
                  </button>
               )
            ) : editMode ? (
               <div className="flex items-center gap-2">
                  <Avatar
                     initials={link.name.charAt(0)}
                     className="size-6 flex-none"
                     src={link.icon}
                     options="aspect_ratio=1:1&height=120&width=120"
                  />
                  <input
                     autoFocus
                     type="text"
                     defaultValue={link.name}
                     className="bg-transparent w-full max-w-full focus:ring-1 bg-white ring-zinc-300
                     dark:ring-zinc-600 dark:bg-dark450 rounded text-[13px] 
                     font-semibold text-zinc-500 dark:text-zinc-400 focus:outline-none px-1"
                  />
               </div>
            ) : (
               <Link className="flex items-center gap-2" to={link.path}>
                  <Avatar
                     initials={link.name.charAt(0)}
                     className="size-6 flex-none"
                     src={link.icon}
                     options="aspect_ratio=1:1&height=120&width=120"
                  />
                  <span className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                     {link.name}
                  </span>
               </Link>
            )}
            <div className="items-center hidden flex group-hover/section:flex flex-none gap-1">
               <button
                  className={clsx(
                     editMode
                        ? "bg-green-50 dark:bg-green-950 dark:border-green-900 dark:hover:bg-green-900 dark:hover:border-green-800 border-green-300 hover:bg-green-100 group"
                        : "dark:hover:bg-dark450 hover:bg-white border-transparent",
                     "rounded-md size-5 border flex items-center justify-center group",
                  )}
                  onClick={() => setEditMode(!editMode)}
               >
                  {editMode ? (
                     <Icon
                        size={12}
                        name="check"
                        title="Done editing"
                        className="text-green-500 group-hover:text-green-600 dark:group-hover:text-green-400"
                     />
                  ) : (
                     <Icon
                        size={12}
                        name="pencil"
                        title="Edit"
                        className="dark:text-zinc-500 text-zinc-400 dark:group-hover:text-zinc-400 group-hover:text-zinc-500"
                     />
                  )}
               </button>
               {/* Remove Link */}
               {editMode && (
                  <button
                     className="rounded-l-full border border-r-0 dark:hover:bg-red-900 dark:bg-red-950 
                     dark:border-red-900 border-red-200 bg-red-50 hover:bg-red-100 dark:hover:border-red-800
                     hover:border-red-200 size-5 flex items-center justify-center group -mr-3.5"
                     onClick={() =>
                        setMenu((existingMenuItems: any[]) => {
                           const updatedMenu = existingMenuItems
                              .map((menuRow: any) => {
                                 const getLink = menuRow?.links?.find(
                                    (x: any) => x.id === link.id,
                                 );

                                 if (getLink) {
                                    const newMenuItems = [...menuRow?.links];
                                    //@ts-ignore
                                    newMenuItems.splice(index, 1);

                                    return {
                                       ...menuRow,
                                       links: newMenuItems,
                                    };
                                 }

                                 return { ...menuRow };
                              })
                              //Remove empty sections
                              .filter(
                                 (menuRow: any) => menuRow?.links?.length > 0,
                              );
                           return updatedMenu;
                        })
                     }
                  >
                     <Icon
                        size={10}
                        name="trash"
                        title="Delete"
                        className="text-red-400 group-hover:text-red-500 dark:group-hover:text-red-300"
                     />
                  </button>
               )}
               {!editMode && (
                  <div
                     className="touch-none cursor-grab 
                  hover:bg-zinc-200 dark:hover:bg-dark500 rounded py-1 px-0.5"
                     aria-label="Drag to reorder"
                     ref={setActivatorNodeRef}
                     {...listeners}
                  >
                     <Icon
                        name="grip-vertical"
                        className="text-1"
                        title="Drag to reorder"
                        size={14}
                     />
                  </div>
               )}
            </div>
            {/* Insert bottom */}
            <div className="-bottom-[1px] left-0 w-full h-2 rounded-t-lg absolute opacity-0 hover:opacity-100">
               <button
                  className="px-0.5 justify-between flex w-full items-center -mb-1.5 rounded-t"
                  onClick={() =>
                     setMenu((existingMenuItems: any[]) => {
                        const updatedMenu = existingMenuItems?.map(
                           (menuRow: any) => {
                              const getLink = menuRow?.links?.find(
                                 (x: any) => x.id === link.id,
                              );
                              if (getLink) {
                                 const newItem = {
                                    id: nanoid(),
                                    name: "New Link",
                                    path: "/link",
                                    icon: "",
                                    nestedLinks: [],
                                 };
                                 const newMenuItems = [...menuRow?.links];
                                 //@ts-ignore
                                 newMenuItems.splice(index + 1, 0, newItem);
                                 return {
                                    ...menuRow,
                                    links: newMenuItems,
                                 };
                              }
                              return { ...menuRow };
                           },
                        );
                        return updatedMenu;
                     })
                  }
               >
                  <div className="rounded-full border dark:border-transparent bg-white border-zinc-300 dark:bg-black size-3 flex items-center justify-center">
                     <Icon
                        size={10}
                        name="chevron-down"
                        className="dark:text-white text-light -mb-[1px]"
                        title="Add above"
                     />
                  </div>
                  <div className="text-[10px] border-t border-dashed dark:border-zinc-500 flex-grow" />
                  <div className="border bg-zinc-50 border-zinc-300 dark:border-zinc-600 rounded-full dark:bg-dark500 p-0.5">
                     <Icon size={8} name="plus" title="Add above" />
                  </div>
                  <div className="text-[10px] border-t border-dashed dark:border-zinc-500 flex-grow" />
                  <div className="rounded-full border dark:border-transparent bg-white border-zinc-300 dark:bg-black size-3 flex items-center justify-center">
                     <Icon
                        size={10}
                        name="chevron-down"
                        className="dark:text-white text-light -mb-[1px]"
                        title="Add above"
                     />
                  </div>
               </button>
            </div>
         </div>
         {isSectionOpen && (
            <div className="pl-1 space-y-0.5">
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
                        <SideMenuSectionNestedLink
                           key={link.id}
                           nestedSection={link}
                        />
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
   );
}
