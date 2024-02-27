import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import type { Collection } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";

export function SortableCollectionItem({
   collection,
}: {
   collection: Collection;
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
   } = useSortable({ id: collection.id });

   return (
      <div ref={setNodeRef} className="relative" {...attributes}>
         <Link
            style={
               {
                  transition: transition,
                  transform: CSS.Transform.toString(transform),
                  pointerEvents: isSorting ? "none" : undefined,
                  opacity: isDragging ? 0 : 1,
               } as React.CSSProperties /* cast because of css variable */
            }
            className="w-full h-full flex items-center justify-between   shadow-zinc-100 gap-2 dark:bg-dark350 dark:hover:border-zinc-600/70
            group  p-2 border-color-sub shadow-sm dark:shadow-black/20 overflow-hidden rounded-2xl border hover:border-zinc-200 bg-zinc-50"
            prefetch="intent"
            to={`/c/${collection.slug}`}
         >
            <div className="flex items-center flex-grow">
               <AdminOrStaffOrOwner>
                  <div
                     className={clsx(
                        isDragging ? "cursor-grabbing" : "cursor-move",
                        "dark:hover:bg-dark450 hover:bg-white hover:shadow px-0.5 py-1.5 rounded-md mr-1.5 touch-none",
                     )}
                     aria-label="Drag to reorder"
                     ref={setActivatorNodeRef}
                     {...listeners}
                  >
                     <Icon name="grip-vertical" size={16} className="text-1" />
                  </div>
               </AdminOrStaffOrOwner>
               <div
                  className="mr-2 border-color-sub border bg-3-sub justify-center shadow-sm shadow-1 relative
                   flex h-8 w-8 flex-none items-center  rounded-full"
               >
                  <AdminOrStaffOrOwner>
                     <div
                        className={clsx(
                           collection.hiddenCollection
                              ? "dark:bg-dark500 dark:group-hover:bg-zinc-500 bg-zinc-300 group-hover:bg-zinc-400/70"
                              : "bg-green-400 group-hover:bg-green-500 group-hover:dark:bg-green-700 dark:bg-green-800/80",
                           "absolute top-0 left-0 rounded-full  size-2 flex items-center justify-center",
                        )}
                     />
                  </AdminOrStaffOrOwner>
                  {collection.icon?.url ? (
                     <Image
                        width={50}
                        height={50}
                        alt={collection.name ?? "List Icon"}
                        options="aspect_ratio=1:1&height=80&width=80"
                        url={collection?.icon?.url}
                     />
                  ) : (
                     <Icon
                        name="database"
                        className="text-1 mx-auto"
                        size={14}
                     />
                  )}
               </div>
               <span className="truncate text-sm font-bold group-hover:underline dark:decoration-zinc-400">
                  {collection.name}
               </span>
            </div>
            <div className="flex items-center justify-between gap-4">
               <Icon
                  name="chevron-right"
                  size={20}
                  className="flex-none text-1"
               />
            </div>
         </Link>
      </div>
   );
}
