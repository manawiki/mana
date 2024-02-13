import { useState } from "react";

import { Link } from "@remix-run/react";
import clsx from "clsx";
import { Node } from "slate";
import {
   ReactEditor,
   type RenderElementProps,
   useSlateStatic,
} from "slate-react";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Modal } from "~/components/Modal";

// eslint-disable-next-line import/no-cycle
import { NestedEditor } from "../../core/dnd";
import type { GroupElement, GroupItemElement } from "../../core/types";

export function BlockGroupItemView({
   element,
   children,
   attributes,
}: RenderElementProps & { element: GroupItemElement }) {
   const editor = useSlateStatic();
   const path = ReactEditor.findPath(editor, element);
   const parent = Node.parent(editor, path) as GroupElement;
   const viewMode = parent.itemsViewMode;
   const [modalStatus, setModalStatus] = useState(false);

   return (
      <>
         {viewMode == "list" && (
            <div
               className="bg-2-sub group relative flex items-center gap-2 p-2.5"
               {...attributes}
            >
               <Link
                  reloadDocument={element?.isCustomSite ?? false}
                  key={element?.id}
                  to={element?.path ?? ""}
                  prefetch="intent"
                  className="flex items-center flex-grow gap-2"
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
                        <Icon
                           name="component"
                           className="text-1 mx-auto"
                           size={18}
                        />
                     )}
                  </div>
                  <span className="text-1 flex-grow truncate text-sm font-bold group-hover:underline">
                     {element?.name}
                  </span>
               </Link>
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
            </div>
         )}
         {viewMode == "grid" && (
            <div
               className="border-color-sub shadow-1 group relative flex items-center justify-center rounded-lg border bg-2-sub shadow-sm"
               {...attributes}
            >
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
                     "block truncate p-3",
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
                  <div
                     className="shadow-1 border-color-sub mx-auto flex h-[60px] w-[60px]
                  items-center overflow-hidden rounded-full border shadow-sm"
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
                        <Icon
                           name="component"
                           className="text-1 mx-auto"
                           size={18}
                        />
                     )}
                  </div>
                  <div className="text-1 truncate pt-0.5 text-center text-sm font-bold">
                     {element?.name}
                  </div>
               </Link>
            </div>
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
         {children}
      </>
   );
}

export function BlockGroupView({
   element,
   children,
   attributes,
}: RenderElementProps & {
   element: GroupElement;
}) {
   return (
      <section
         className={clsx(
            element.itemsViewMode == "list"
               ? `border-color-sub divide-color-sub shadow-1 relative
                  mb-3 divide-y overflow-hidden rounded-lg border shadow-sm`
               : "",
            element.itemsViewMode == "grid"
               ? "grid grid-cols-2 gap-3 mb-3 tablet:grid-cols-3 laptop:grid-cols-2 desktop:grid-cols-4"
               : "",
         )}
         {...attributes}
      >
         {children}
      </section>
   );
}
