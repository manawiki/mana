import { Link } from "@remix-run/react";
import clsx from "clsx";
import { Component } from "lucide-react";
import { Node } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";

import { Image } from "~/components";

import type { GroupElement, GroupItemElement } from "../../core/types";

export function BlockGroupItemView({ element }: { element: GroupItemElement }) {
   const editor = useSlateStatic();
   const path = ReactEditor.findPath(editor, element);
   const parent = Node.parent(editor, path) as GroupElement;
   const viewMode = parent.itemsViewMode;

   return (
      <>
         {viewMode == "list" && (
            <Link
               reloadDocument={element?.isCustomSite ?? false}
               key={element?.id}
               to={element?.path ?? ""}
               prefetch="intent"
               className="bg-2 group relative flex items-center gap-2 p-2.5"
            >
               <div
                  className="shadow-1 border-color flex h-8 w-8 items-center
                  justify-between overflow-hidden rounded-full border-2 shadow-sm"
               >
                  {element?.iconUrl ? (
                     <Image
                        height={80}
                        width={80}
                        url={element?.iconUrl}
                        options="aspect_ratio=1:1&height=80&width=80"
                        alt={element?.name ?? "Icon"}
                     />
                  ) : (
                     <Component className="text-1 mx-auto" size={18} />
                  )}
               </div>
               <span className="text-1 flex-grow truncate text-sm font-bold group-hover:underline">
                  {element?.name}
               </span>
               {element.label && (
                  <div
                     style={{
                        backgroundColor: `${element?.labelColor}33`,
                     }}
                     className="flex h-6 w-20 items-center justify-center rounded-full border-0 text-center text-[10px] font-bold uppercase"
                  >
                     {element.label}
                  </div>
               )}
            </Link>
         )}
         {viewMode == "grid" && (
            <Link
               reloadDocument={element?.isCustomSite ?? false}
               key={element?.id}
               to={element?.path ?? ""}
               prefetch="intent"
               className="border-color-sub shadow-1 group relative flex items-center justify-center rounded-lg border bg-zinc-50 p-3 shadow-sm dark:bg-dark350"
            >
               <div className="block truncate">
                  {element.label && (
                     <div className="flex items-center justify-center">
                        <div
                           className="flex h-5 w-20 items-center justify-center rounded-full 
                   border-0 text-center text-[10px] font-bold uppercase"
                           style={{
                              backgroundColor: `${element?.labelColor}33`,
                           }}
                        >
                           {element.label}
                        </div>
                     </div>
                  )}
                  <div
                     className="shadow-1 border-color mx-auto mt-2 flex h-[60px] w-[60px]
                items-center overflow-hidden rounded-full border-2 shadow"
                  >
                     {element?.iconUrl ? (
                        <Image
                           height={80}
                           width={80}
                           url={element?.iconUrl}
                           options="aspect_ratio=1:1&height=120&width=120"
                           alt={element?.name ?? "Icon"}
                        />
                     ) : (
                        <Component className="text-1 mx-auto" size={18} />
                     )}
                  </div>
                  <div className="text-1 truncate pt-1 text-center text-sm font-bold group-hover:underline">
                     {element?.name}
                  </div>
               </div>
            </Link>
         )}
      </>
   );
}

export function BlockGroupView({
   element,
   children,
}: {
   element: GroupElement;
   children: any;
}) {
   return (
      <section
         className={clsx(
            element.itemsViewMode == "list"
               ? `border-color divide-color shadow-1 relative
                  mb-2.5 divide-y overflow-hidden rounded-lg border shadow-sm`
               : "",
            element.itemsViewMode == "grid"
               ? "grid grid-cols-2 gap-3 pb-2.5 tablet:grid-cols-3 laptop:grid-cols-2 desktop:grid-cols-4"
               : "",
            "my-3",
         )}
      >
         {children}
      </section>
   );
}
