import { Link, NavLink, useLocation } from "@remix-run/react";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "~/components/Icon";
import { Avatar } from "~/components/Avatar";
import clsx from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import {
   Dropdown,
   DropdownButton,
   DropdownMenu,
   DropdownItem,
} from "~/components/Dropdown";

export function SideMenuSectionNestedLink({
   nestedSection,
}: {
   nestedSection: any;
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

   return (
      <div
         ref={setNodeRef}
         className={clsx(
            pathname === nestedSection.path && "bg-zinc-200/40 dark:bg-dark350",
            "relative group/nestedLink flex items-center gap-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-dark350 py-1 pl-2 pr-1",
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
      >
         <Link
            to={nestedSection.path}
            className="flex items-center w-full justify-between gap-2"
         >
            <span className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400 truncate">
               {nestedSection.name}
            </span>
            <Avatar
               initials={nestedSection.name.charAt(0)}
               src={nestedSection.icon}
               className="size-6 flex-none group-hover/nestedLink:hidden"
               options="aspect_ratio=1:1&height=120&width=120"
            />
         </Link>
         <div className="items-center gap-0.5 group-hover/nestedLink:flex hidden">
            <Dropdown>
               <DropdownButton
                  className="text-1 !size-6 !rounded-full !p-0 !flex-none"
                  plain
                  aria-label="Options"
               >
                  <Icon
                     size={14}
                     name="ellipsis"
                     title="Options"
                     className="text-1 mx-auto"
                  />
               </DropdownButton>
               <DropdownMenu className="z-50" anchor="bottom">
                  <div className="flex items-center justify-between">
                     <DropdownItem className="!size-8 !p-0 flex-none justify-center">
                        <Icon
                           size={14}
                           name="pencil"
                           title="Edit"
                           className="text-blue-400"
                        />
                     </DropdownItem>
                     <DropdownItem className="!size-8 !p-0 flex-none justify-center">
                        <Icon
                           size={18}
                           name="list-tree"
                           title="Add"
                           className="text-green-400"
                        />
                     </DropdownItem>
                     <DropdownItem className="!size-8 !p-0 flex-none justify-center">
                        <Icon
                           size={14}
                           name="trash"
                           title="Delete"
                           className="text-red-400"
                        />
                     </DropdownItem>
                  </div>
               </DropdownMenu>
            </Dropdown>
            <div
               className="touch-none cursor-grab hover:bg-zinc-200 dark:hover:bg-dark500 rounded py-1 px-0.5"
               aria-label="Drag to reorder"
               ref={setActivatorNodeRef}
               {...listeners}
            >
               <Icon name="grip-vertical" title="Drag to reorder" size={14} />
            </div>
         </div>
      </div>
   );
}
