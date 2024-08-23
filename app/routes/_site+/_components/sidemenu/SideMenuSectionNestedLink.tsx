import { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link, useLocation } from "@remix-run/react";
import clsx from "clsx";
import { nanoid } from "nanoid";

import { Avatar } from "~/components/Avatar";
import { Icon } from "~/components/Icon";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";

export function SideMenuSectionNestedLink({
   sectionId,
   nestedSection,
   setMenu,
   index,
}: {
   sectionId: string;
   nestedSection: any;
   setMenu: any;
   index?: number;
}) {
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
   const { pathname } = useLocation();

   const [editMode, setEditMode] = useState(false);

   const [linkName, setLinkName] = useState(nestedSection.name);
   const [linkPath, setLinkPath] = useState(nestedSection.path);

   return (
      <div
         ref={setNodeRef}
         className={clsx(
            pathname === nestedSection.path && "bg-zinc-200/40 dark:bg-dark350",
            editMode ? "p-1.5" : "pl-2 pr-1 py-1",
            "relative group/nestedLink flex items-center gap-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-dark350",
         )}
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
            setLinkName(nestedSection.name);
            setLinkPath(nestedSection.path);
            setEditMode(false);
         }}
      >
         {/* Insert top */}
         {!editMode && (
            <Tooltip>
               <TooltipTrigger
                  type="button"
                  className="justify-center flex w-full items-start left-0 top-0 h-2 absolute opacity-0 hover:opacity-100"
                  onClick={() =>
                     setMenu((existingMenuItems: any[]) => {
                        const updatedMenu = existingMenuItems?.map(
                           (menuRow: any) => {
                              const getLink = menuRow?.links?.find(
                                 //@ts-ignore
                                 (x: any) => x.id === sectionId,
                              );
                              if (getLink) {
                                 const newNestedLink = {
                                    id: nanoid(),
                                    name: "Untilted",
                                    path: "/",
                                    icon: "",
                                 };
                                 const newNestedLinks = [
                                    ...(getLink?.nestedLinks || []),
                                 ];
                                 //@ts-ignore
                                 newNestedLinks.splice(index, 0, newNestedLink); // insert newNestedLink at index

                                 return {
                                    ...menuRow,
                                    links: menuRow?.links?.map(
                                       (linkItem: any) =>
                                          linkItem.id === sectionId
                                             ? {
                                                  ...linkItem,
                                                  nestedLinks: newNestedLinks,
                                               }
                                             : linkItem,
                                    ),
                                 };
                              }
                              return { ...menuRow };
                           },
                        );
                        return updatedMenu;
                     })
                  }
               >
                  <div className="size-3 rounded-full flex items-center justify-center dark:bg-dark500 bg-white border dark:border-transparent absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                     <Icon name="plus" title="Add menu above" size={8} />
                  </div>
                  <div className="dark:bg-dark450 bg-zinc-300 flex items-center justify-center h-0.5 rounded-b-sm w-4/5"></div>
               </TooltipTrigger>
               <TooltipContent>Add menu above</TooltipContent>
            </Tooltip>
         )}
         {/* Menu section area */}
         <div className="relative flex items-center justify-between w-full gap-1.5">
            {editMode ? (
               <div className="space-y-1">
                  <div className="flex items-center gap-1.5 relative">
                     <div className="relative group">
                        <Avatar
                           initials={linkName.charAt(0)}
                           className="size-6 mx-auto flex-none"
                           src={nestedSection.icon}
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
                   dark:ring-zinc-500 dark:bg-dark450 rounded text-[13px] border border-zinc-300 
                     font-semibold text-zinc-500 dark:text-zinc-300 focus:outline-none px-1 dark:border-zinc-600"
                     />
                  </div>
                  <input
                     type="text"
                     placeholder="Link URL"
                     value={linkPath}
                     onChange={(e) => setLinkPath(e.target.value)}
                     className="bg-transparent w-full max-w-full focus:ring-1 bg-white ring-zinc-300
                dark:ring-zinc-500 dark:bg-dark450 rounded text-[13px] border border-zinc-300 
                  font-semibold text-zinc-500 dark:text-zinc-300 focus:outline-none px-1 dark:border-zinc-600"
                  />
               </div>
            ) : (
               <>
                  <Link
                     to={nestedSection.path}
                     className="flex items-center w-full justify-between gap-2 truncate h-6"
                  >
                     <span className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                        {nestedSection.name}
                     </span>
                     <Avatar
                        initials={
                           !nestedSection.icon && nestedSection.name.charAt(0)
                        }
                        src={nestedSection.icon}
                        className="size-6 flex-none group-hover/nestedLink:hidden"
                        options="aspect_ratio=1:1&height=120&width=120"
                     />
                  </Link>
               </>
            )}
            <div className="items-center hidden group-hover/nestedLink:flex flex-none gap-1">
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
                                          nestedLinks:
                                             linkItem.nestedLinks?.map(
                                                (nestedLink: any) =>
                                                   nestedLink.id ===
                                                   nestedSection.id
                                                      ? {
                                                           ...nestedLink,
                                                           name: linkName,
                                                           path: linkPath,
                                                        }
                                                      : nestedLink,
                                             ),
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
                     hover:border-red-200 size-5 flex items-center justify-center group"
                        onClick={() =>
                           setMenu((existingMenuItems: any[]) => {
                              const updatedMenu = existingMenuItems.map(
                                 (menuRow: any) => {
                                    const getLink = menuRow?.links?.find(
                                       (x: any) => x.id === sectionId,
                                    );
                                    console.log(getLink);
                                    if (getLink) {
                                       const newNestedLinks = [
                                          ...(getLink?.nestedLinks || []),
                                       ];
                                       //@ts-ignore
                                       newNestedLinks.splice(index, 1);
                                       console.log(newNestedLinks);
                                       return {
                                          ...menuRow,
                                          links: menuRow?.links?.map(
                                             (linkItem: any) =>
                                                linkItem.id === sectionId
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
                              ); //Remove empty sections
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
         </div>
         {/* Insert bottom */}
         {!editMode && (
            <Tooltip placement="bottom">
               <TooltipTrigger
                  type="button"
                  className="justify-center flex w-full items-end left-0 bottom-0 h-2 absolute opacity-0 hover:opacity-100"
                  onClick={() =>
                     setMenu((existingMenuItems: any[]) => {
                        const updatedMenu = existingMenuItems?.map(
                           (menuRow: any) => {
                              const getLink = menuRow?.links?.find(
                                 //@ts-ignore
                                 (x: any) => x.id === sectionId,
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
                                          linkItem.id === sectionId
                                             ? {
                                                  ...linkItem,
                                                  nestedLinks: newNestedLinks,
                                               }
                                             : linkItem,
                                    ),
                                 };
                              }
                              return { ...menuRow };
                           },
                        );
                        return updatedMenu;
                     })
                  }
               >
                  <div className="size-3 rounded-full flex items-center justify-center dark:bg-dark500 bg-white border dark:border-transparent absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                     <Icon name="plus" title="Add menu below" size={8} />
                  </div>
                  <div className="dark:bg-dark450 bg-zinc-300 flex items-center justify-center h-0.5 rounded-t-sm w-4/5"></div>
               </TooltipTrigger>
               <TooltipContent>Add menu below</TooltipContent>
            </Tooltip>
         )}
      </div>
   );
}
