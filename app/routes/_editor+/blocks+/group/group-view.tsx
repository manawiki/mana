import { useState } from "react";

import { Link } from "@remix-run/react";
import clsx from "clsx";
import { Node } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";

import { Avatar } from "~/components/Avatar";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Modal } from "~/components/Modal";

// eslint-disable-next-line import/no-cycle
import { NestedEditor } from "../../core/dnd";
import type { GroupElement, GroupItemElement } from "../../core/types";

export function BlockGroupItemView({ element }: { element: GroupItemElement }) {
   const editor = useSlateStatic();
   const path = ReactEditor.findPath(editor, element);
   const parent = Node.parent(editor, path) as GroupElement;
   const viewMode = parent.itemsViewMode;
   const [modalStatus, setModalStatus] = useState(false);

   return (
      <>
         {viewMode == "list" && (
            <>
               {element.isPost && element.iconUrl ? (
                  <Link
                     reloadDocument={element?.isCustomSite ?? false}
                     key={element?.id}
                     to={element?.path ?? ""}
                     prefetch="intent"
                     className="flex items-center w-full gap-5 group"
                  >
                     {element.iconUrl && (
                        <div className="w-28 flex-none overflow-hidden rounded">
                           <Image
                              alt={element.name}
                              className="w-full rounded object-cover"
                              height={60}
                              options="height=120"
                              url={element?.iconUrl}
                           />
                        </div>
                     )}
                     <div className="relative flex-grow ">
                        {element.name && (
                           <div className="font-header font-bold group-hover:underline">
                              {element.name}
                           </div>
                        )}
                        {element.subtitle && (
                           <div className="text-sm">{element.subtitle}</div>
                        )}
                     </div>
                  </Link>
               ) : (
                  <Link
                     reloadDocument={element?.isCustomSite ?? false}
                     key={element?.id}
                     to={element?.path ?? ""}
                     prefetch="intent"
                     className="flex items-center flex-grow gap-2 p-2.5 group"
                  >
                     <Avatar
                        src={element?.iconUrl}
                        initials={
                           element?.iconUrl ? undefined : element.name.charAt(0)
                        }
                        className="size-8"
                        options="aspect_ratio=1:1&height=80&width=80"
                     />
                     <span className="flex-grow truncate text-sm font-bold group-hover:underline">
                        {element?.name}
                     </span>
                  </Link>
               )}
               {element.groupContent && (
                  <button
                     className="flex group/doc h-7 w-7 items-center justify-center"
                     onClick={() => setModalStatus(true)}
                     aria-label="Add content"
                  >
                     <Icon
                        name="file-text"
                        className="text-zinc-400 dark:text-zinc-500 group-hover/doc:text-zinc-500 group-hover/doc:dark:text-zinc-200"
                        size={14}
                     />
                  </button>
               )}
               {element.label && (
                  <div
                     style={{
                        backgroundColor: `${element?.labelColor}33`,
                     }}
                     className="flex h-6 w-20 items-center justify-center rounded-full border-0 text-center text-[10px] font-bold"
                  >
                     {element.label}
                  </div>
               )}
            </>
         )}
         {viewMode == "grid" && (
            <>
               {element.groupContent && (
                  <button
                     className="flex h-7 w-7 absolute group/doc right-1.5 top-1.5 z-20 items-center justify-center"
                     onClick={() => setModalStatus(true)}
                     aria-label="Add content"
                  >
                     <Icon
                        name="file-text"
                        className="text-zinc-400 dark:text-zinc-500 group-hover/doc:text-zinc-500 group-hover/doc:dark:text-zinc-200"
                        size={14}
                     />
                  </button>
               )}
               <Link
                  reloadDocument={element?.isCustomSite ?? false}
                  key={element?.id}
                  to={element?.path ?? ""}
                  prefetch="intent"
                  className={clsx(
                     element.groupContent ? "" : "w-full",
                     "flex items-center justify-center flex-col p-3 bg-2-sub rounded-lg border border-color-sub shadow-sm shadow-1",
                  )}
               >
                  {element.label && (
                     <div className="flex items-center justify-center mb-2">
                        <div
                           className="flex h-5 w-20 items-center justify-center rounded-full 
                   border-0 text-center text-[10px] font-bold"
                           style={{
                              backgroundColor: `${element?.labelColor}33`,
                           }}
                        >
                           {element.label}
                        </div>
                     </div>
                  )}
                  <Avatar
                     src={element?.iconUrl}
                     initials={
                        element?.iconUrl ? undefined : element.name.charAt(0)
                     }
                     className="size-14 mx-auto"
                     options="aspect_ratio=1:1&height=120&width=120"
                  />
                  <div className="text-center pt-2 text-xs font-bold">
                     {element?.name}
                  </div>
               </Link>
            </>
         )}
         {element.groupContent && (
            <Modal
               onClose={() => {
                  setModalStatus(false);
               }}
               unmount={false}
               show={modalStatus}
            >
               <div className="flex group justify-end pb-2 pr-1">
                  <button
                     className="flex items-center gap-1"
                     onClick={() => setModalStatus(false)}
                  >
                     <span className="text-1 group-hover:underline text-xs">
                        Close
                     </span>
                     <Icon name="x" size={16} />
                  </button>
               </div>
               <div className="bg-3 max-tablet:min-w-[100vw] max-h-[70vh] min-h-[200px] transform tablet:rounded-lg relative text-left align-middle transition-all tablet:w-[760px] overflow-auto">
                  <div className="p-4 flex items-center gap-3">
                     <div className="flex items-center flex-none gap-1.5">
                        <span className="shadow-1 border-color-sub flex h-7 w-7 items-center overflow-hidden rounded-full border shadow-sm">
                           {element?.iconUrl ? (
                              <Image
                                 url={element?.iconUrl}
                                 options="aspect_ratio=1:1&height=120&width=120"
                                 alt={element?.name ?? "Icon"}
                              />
                           ) : (
                              <Icon
                                 name="component"
                                 className="text-1 mx-auto"
                                 size={18}
                              />
                           )}
                        </span>
                        <span className="font-bold font-header text-lg">
                           {element.name}
                        </span>
                     </div>
                     <span className="bg-zinc-100 dark:bg-dark350 rounded-full h-0.5 w-full flex-grow" />
                  </div>
                  <div className="p-4 pb-1.5 pt-0">
                     <NestedEditor
                        field="groupContent"
                        element={element}
                        editor={editor}
                     />
                  </div>
               </div>
            </Modal>
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
               ? `border-color-sub divide-color-sub shadow-1 relative bg-2-sub
                  mb-3 divide-y overflow-hidden rounded-lg border shadow-sm`
               : "",
            element.itemsViewMode == "grid"
               ? "grid grid-cols-2 gap-3 mb-3 tablet:grid-cols-3 laptop:grid-cols-2 desktop:grid-cols-4"
               : "",
         )}
      >
         {children}
      </section>
   );
}
