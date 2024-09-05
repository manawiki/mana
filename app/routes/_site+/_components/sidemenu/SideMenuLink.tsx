import { useState } from "react";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   useSortable,
   arrayMove,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link, useLocation } from "@remix-run/react";
import clsx from "clsx";
import { nanoid } from "nanoid";

import { Avatar } from "~/components/Avatar";
import { Icon } from "~/components/Icon";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";

import { SideMenuSectionNestedLink } from "./SideMenuSectionNestedLink";

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

   const hasNestedLinks = link?.nestedLinks?.length > 0;

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

   const [linkName, setLinkName] = useState(link.name);
   const [linkPath, setLinkPath] = useState(link.path);

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
            onMouseLeave={() => {
               setLinkName(link.name);
               setLinkPath(link.path);
               setEditMode(false);
            }}
         >
            {/* Insert top */}
            <div className="justify-center flex w-full items-start left-0 -top-1 h-2 absolute opacity-0 hover:opacity-100 px-4 gap-3">
               <Tooltip placement="top">
                  <TooltipTrigger
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
                                       name: "Untitled",
                                       path: "/",
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
                  >
                     <div
                        className="size-3 rounded-full flex items-center justify-center dark:bg-dark500 bg-white border dark:border-transparent 
                        absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                     >
                        <Icon name="plus" title="Insert above" size={9} />
                     </div>
                     <div className="dark:bg-dark450 bg-zinc-300 flex items-center justify-center h-0.5 rounded-b w-4/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/" />
                  </TooltipTrigger>
                  <TooltipContent>Insert above</TooltipContent>
               </Tooltip>
            </div>
            {link.nestedLinks && link.nestedLinks.length > 0 ? (
               editMode ? (
                  <div>
                     <div className="flex items-center gap-1.5 relative pb-0.5">
                        <div className="relative group">
                           <Avatar
                              initials={link.name.charAt(0)}
                              className="size-6 mx-auto flex-none"
                              src={link.icon}
                              options="aspect_ratio=1:1&height=120&width=120"
                           />
                           <div
                              className="border dark:border-zinc-500 border-zinc-300 rounded-full 
                           hidden group-hover:flex dark:bg-dark500 bg-white border-dashed
                           absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                           size-[26px] items-center justify-center"
                           >
                              <Icon name="upload" size={10} />
                           </div>
                        </div>
                        <input
                           type="text"
                           placeholder="Name"
                           value={linkName}
                           onChange={(e) => setLinkName(e.target.value)}
                           className="bg-transparent w-full max-w-full focus:ring-1 bg-white ring-zinc-300
                        dark:ring-zinc-500 dark:bg-dark450 rounded text-sm border border-zinc-300 
                        font-semibold text-zinc-500 dark:text-zinc-300 focus:outline-none px-1 dark:border-zinc-600"
                        />
                     </div>
                     <input
                        type="text"
                        placeholder="Link URL"
                        value={linkPath}
                        onChange={(e) => setLinkPath(e.target.value)}
                        className="bg-transparent w-full max-w-full focus:ring-1 bg-white ring-zinc-300
                        dark:ring-zinc-500 dark:bg-dark450 rounded text-sm border border-zinc-300 
                        font-semibold text-zinc-500 dark:text-zinc-300 focus:outline-none px-1 dark:border-zinc-600"
                     />
                  </div>
               ) : (
                  <button
                     onClick={() => setSection(!isSectionOpen)}
                     className="flex items-center justify-between gap-2 w-full text-left "
                  >
                     <div className="flex items-center gap-2 truncate">
                        <Avatar
                           initials={!link.icon && link.name.charAt(0)}
                           className="size-6 flex-none"
                           src={link.icon}
                           options="aspect_ratio=1:1&height=120&width=120"
                        />
                        <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 truncate">
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
               <div>
                  <div className="flex items-center gap-1.5 relative pb-0.5">
                     <div className="relative group">
                        <Avatar
                           initials={link.name.charAt(0)}
                           className="size-6 mx-auto flex-none"
                           src={link.icon}
                           options="aspect_ratio=1:1&height=120&width=120"
                        />
                        <div
                           className="border dark:border-zinc-500 border-zinc-300 rounded-full 
                           hidden group-hover:flex dark:bg-dark500 bg-white border-dashed
                           absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                           size-[26px] items-center justify-center"
                        >
                           <Icon name="upload" size={10} />
                        </div>
                     </div>
                     <input
                        type="text"
                        placeholder="Name"
                        value={linkName}
                        onChange={(e) => setLinkName(e.target.value)}
                        className="bg-transparent w-full max-w-full focus:ring-1 bg-white ring-zinc-300
                        dark:ring-zinc-500 dark:bg-dark450 rounded text-sm border border-zinc-300 
                        font-semibold text-zinc-500 dark:text-zinc-300 focus:outline-none px-1 dark:border-zinc-600"
                     />
                  </div>
                  <input
                     type="text"
                     placeholder="Link URL"
                     value={linkPath}
                     onChange={(e) => setLinkPath(e.target.value)}
                     className="bg-transparent w-full max-w-full focus:ring-1 bg-white ring-zinc-300
                        dark:ring-zinc-500 dark:bg-dark450 rounded text-sm border border-zinc-300 
                        font-semibold text-zinc-500 dark:text-zinc-300 focus:outline-none px-1 dark:border-zinc-600"
                  />
               </div>
            ) : (
               <Link className="flex items-center gap-2" to={link.path}>
                  <Avatar
                     initials={!link.icon && link.name.charAt(0)}
                     className="size-6 flex-none"
                     src={link.icon}
                     options="aspect_ratio=1:1&height=120&width=120"
                  />
                  <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                     {link.name}
                  </span>
               </Link>
            )}
            <div className="items-center hidden group-hover/section:flex flex-none gap-1">
               <div className="space-y-1.5">
                  <button
                     className={clsx(
                        editMode
                           ? "bg-green-100 dark:bg-green-950 dark:border-green-900 dark:hover:bg-green-900 dark:hover:border-green-800 border-green-400 hover:bg-green-200 group"
                           : "dark:hover:bg-dark450 hover:bg-white border-transparent",
                        "rounded-md size-5 border flex items-center justify-center group",
                     )}
                     onClick={() => {
                        setMenu((existingMenuItems: any) => {
                           setEditMode(!editMode);
                           const updatedMenu = existingMenuItems?.map(
                              (menuRow: any) => {
                                 return {
                                    ...menuRow,
                                    links: menuRow.links?.map(
                                       (linkItem: any) => ({
                                          ...linkItem,
                                          name:
                                             link.id === linkItem.id
                                                ? linkName
                                                : linkItem.name,
                                          path:
                                             link.id === linkItem.id
                                                ? linkPath
                                                : linkItem.path,
                                       }),
                                    ),
                                 };
                              },
                           );
                           return updatedMenu;
                        });
                     }}
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
                        className="rounded-md border dark:hover:bg-red-900 dark:bg-red-950 
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
                                    (menuRow: any) =>
                                       menuRow?.links?.length > 0,
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
               </div>
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
            <div className="justify-center flex w-full items-end left-0 -bottom-0.5 h-2 absolute opacity-0 hover:opacity-100 px-4 gap-3">
               <Tooltip placement="bottom">
                  <TooltipTrigger
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
                                       name: "Untitled",
                                       path: "/",
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
                     <div className="size-3 rounded-full flex items-center justify-center dark:bg-dark500 bg-white border dark:border-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <Icon name="plus" title="Insert Below" size={9} />
                     </div>
                     <div className="dark:bg-dark450 bg-zinc-300 flex items-center justify-center h-0.5 rounded-t w-4/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/" />
                  </TooltipTrigger>
                  <TooltipContent>Insert below</TooltipContent>
               </Tooltip>
               {/* Insert nested menu */}
               {!hasNestedLinks && !editMode && (
                  <Tooltip placement="bottom">
                     <TooltipTrigger
                        type="button"
                        className="group"
                        asChild
                        onClick={() =>
                           setMenu((existingMenuItems: any[]) => {
                              const updatedMenu = existingMenuItems?.map(
                                 (menuRow: any) => {
                                    const getLink = menuRow?.links?.find(
                                       //@ts-ignore
                                       (x: any) => x.id === link.id,
                                    );
                                    if (getLink) {
                                       const newNestedLink = {
                                          id: nanoid(),
                                          name: "Untitled",
                                          path: "/",
                                          icon: "",
                                       };
                                       const newNestedLinks = [
                                          ...(getLink?.nestedLinks || []),
                                       ];
                                       newNestedLinks.splice(
                                          //@ts-ignore
                                          index + 1,
                                          0,
                                          newNestedLink,
                                       ); // insert newNestedLink at index

                                       return {
                                          ...menuRow,
                                          links: menuRow?.links?.map(
                                             (linkItem: any) =>
                                                linkItem.id === link.id
                                                   ? {
                                                        ...linkItem,
                                                        nestedLinks:
                                                           newNestedLinks,
                                                     }
                                                   : linkItem,
                                          ),
                                       };
                                    }
                                    return { ...menuRow };
                                 },
                              );
                              setSection(true);
                              return updatedMenu;
                           })
                        }
                     >
                        <div className="size-3 flex items-center justify-center  absolute right-4 top-[3px] z-10">
                           <Icon
                              name="corner-down-left"
                              title="Insert Nested Link"
                              className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-500 dark:group-hover:text-zinc-400"
                              size={9}
                           />
                        </div>
                        <div
                           className="dark:bg-zinc-600 bg-zinc-400 group-hover:dark:bg-zinc-500 group-hover:bg-zinc-500 
                           flex items-center justify-center h-0.5 rounded-tr-full w-7 absolute right-2 bottom-0.5"
                        />
                     </TooltipTrigger>
                     <TooltipContent>Add nested link</TooltipContent>
                  </Tooltip>
               )}
            </div>
         </div>
         {isSectionOpen && (
            <div className="pl-1.5 ml-2 space-y-0.5 border-l-2 border-dotted dark:border-dark450 my-1.5">
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
                     {link.nestedLinks?.map((linkRow: any, index: number) => (
                        <SideMenuSectionNestedLink
                           index={index}
                           sectionId={link.id}
                           setMenu={setMenu}
                           key={linkRow.id}
                           nestedSection={linkRow}
                        />
                     ))}
                  </SortableContext>
                  <DragOverlay adjustScale={false}>
                     {activeSection && (
                        <SideMenuSectionNestedLink
                           sectionId={link.id}
                           setMenu={setMenu}
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
