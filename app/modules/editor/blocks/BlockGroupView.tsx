import { Link } from "@remix-run/react";
import type { GroupElement } from "../types";
import { Image } from "~/components";
import { Component } from "lucide-react";
import Block from "~/modules/editor/blocks/Block";
import Leaf from "~/modules/editor/blocks/Leaf";
import { useCallback, useMemo } from "react";
import { type Descendant, createEditor } from "slate";
import {
   withReact,
   Slate,
   Editable,
   type RenderElementProps,
} from "slate-react";

type Props = {
   element: GroupElement;
};

export default function GroupView({ element }: Props) {
   console.log(element);
   const editor = useMemo(() => withReact(createEditor()), []);

   const groupItems = element.groupItems;
   const viewMode = element.viewMode;
   const itemsViewMode = element.itemsViewMode;
   const content = element.content as Descendant[];
   const renderElement = useCallback((props: RenderElementProps) => {
      return <Block {...props} />;
   }, []);
   return (
      <section className="my-3">
         {groupItems?.length === 0 ? null : itemsViewMode == "list" ? (
            <>
               {viewMode == "1-col" && (
                  <>
                     <div
                        className="border-color divide-color shadow-1 relative
                                 mb-2.5 divide-y overflow-hidden rounded-lg border shadow-sm"
                     >
                        {groupItems?.map((row) => (
                           <Link
                              reloadDocument={row?.isCustomSite ?? false}
                              key={row?.id}
                              to={row?.path ?? ""}
                              prefetch="intent"
                              className="bg-2 relative flex items-center gap-2 p-2.5"
                           >
                              <div
                                 className="shadow-1 border-color flex h-8 w-8 items-center
                                 justify-between overflow-hidden rounded-full border-2 shadow-sm"
                              >
                                 {row?.iconUrl ? (
                                    <Image
                                       height={80}
                                       width={80}
                                       url={row?.iconUrl}
                                       options="aspect_ratio=1:1&height=80&width=80"
                                       alt={row?.name ?? "Icon"}
                                    />
                                 ) : (
                                    <Component
                                       className="text-1 mx-auto"
                                       size={18}
                                    />
                                 )}
                              </div>
                              <span className="text-1 flex-grow truncate text-sm font-bold">
                                 {row?.name}
                              </span>
                              {row.label && (
                                 <div
                                    style={{
                                       backgroundColor: `${row?.labelColor}33`,
                                    }}
                                    className="flex h-6 w-20 items-center justify-center rounded-full border-0 text-center text-[10px] font-bold uppercase"
                                 >
                                    {row.label}
                                 </div>
                              )}
                           </Link>
                        ))}
                     </div>
                  </>
               )}
               {viewMode == "2-col" && (
                  <div className="grid laptop:grid-cols-2 laptop:gap-4">
                     <div>
                        <div
                           className="border-color divide-color shadow-1 relative
                                    mb-2.5 divide-y overflow-hidden rounded-lg border shadow-sm"
                        >
                           {groupItems?.map((row) => (
                              <Link
                                 reloadDocument={row?.isCustomSite ?? false}
                                 key={row?.id}
                                 to={row?.path ?? ""}
                                 prefetch="intent"
                                 className="bg-2 relative flex items-center gap-2 p-2.5"
                              >
                                 <div
                                    className="shadow-1 border-color flex h-8 w-8 items-center
                                                       justify-between overflow-hidden rounded-full border-2 shadow-sm"
                                 >
                                    {row?.iconUrl ? (
                                       <Image
                                          height={80}
                                          width={80}
                                          url={row?.iconUrl}
                                          options="aspect_ratio=1:1&height=80&width=80"
                                          alt={row?.name ?? "Icon"}
                                       />
                                    ) : (
                                       <Component
                                          className="text-1 mx-auto"
                                          size={18}
                                       />
                                    )}
                                 </div>
                                 <span className="text-1 flex-grow truncate text-sm font-bold">
                                    {row?.name}
                                 </span>
                                 {row.label && (
                                    <div
                                       style={{
                                          backgroundColor: `${row?.labelColor}33`,
                                       }}
                                       className="flex h-6 w-20 items-center justify-center rounded-full 
                                       border-0 text-center text-[10px] font-bold uppercase"
                                    >
                                       {row.label}
                                    </div>
                                 )}
                              </Link>
                           ))}
                        </div>
                     </div>
                     {content && (
                        <div>
                           <Slate editor={editor} value={content}>
                              <Editable
                                 renderElement={renderElement}
                                 renderLeaf={Leaf}
                                 readOnly={true}
                              />
                           </Slate>
                        </div>
                     )}
                  </div>
               )}
            </>
         ) : (
            <>
               {viewMode == "1-col" && (
                  <>
                     <div className="grid grid-cols-2 gap-3 pb-2.5 tablet:grid-cols-3 laptop:grid-cols-2 desktop:grid-cols-4">
                        {groupItems?.map((row) => (
                           <Link
                              reloadDocument={row?.isCustomSite ?? false}
                              key={row?.id}
                              to={row?.path ?? ""}
                              prefetch="intent"
                              className="bg-2 border-color shadow-1 relative flex items-center justify-center rounded-lg border p-3 shadow-sm"
                           >
                              <div className="block truncate">
                                 {row.label && (
                                    <div className="flex items-center justify-center">
                                       <div
                                          className="flex h-5 w-20 items-center justify-center rounded-full 
                                       border-0 text-center text-[10px] font-bold uppercase"
                                          style={{
                                             backgroundColor: `${row?.labelColor}33`,
                                          }}
                                       >
                                          {row.label}
                                       </div>
                                    </div>
                                 )}
                                 <div
                                    className="shadow-1 border-color mx-auto mt-2 flex h-[60px] w-[60px]
                                    items-center overflow-hidden rounded-full border-2 shadow"
                                 >
                                    {row?.iconUrl ? (
                                       <Image
                                          height={80}
                                          width={80}
                                          url={row?.iconUrl}
                                          options="aspect_ratio=1:1&height=120&width=120"
                                          alt={row?.name ?? "Icon"}
                                       />
                                    ) : (
                                       <Component
                                          className="text-1 mx-auto"
                                          size={18}
                                       />
                                    )}
                                 </div>
                                 <div className="text-1 truncate pt-1 text-center text-sm font-bold">
                                    {row?.name}
                                 </div>
                              </div>
                           </Link>
                        ))}
                     </div>
                  </>
               )}
               {viewMode == "2-col" && (
                  <div className="grid laptop:grid-cols-2 laptop:gap-4">
                     <div>
                        <div className="grid grid-cols-2 gap-3 pb-2.5">
                           {groupItems?.map((row) => (
                              <Link
                                 reloadDocument={row?.isCustomSite ?? false}
                                 key={row?.id}
                                 to={row?.path ?? ""}
                                 prefetch="intent"
                                 className="bg-2 border-color shadow-1 relative flex items-center justify-center rounded-lg border p-3 shadow-sm"
                              >
                                 <div className="block truncate">
                                    {row.label && (
                                       <div className="flex items-center justify-center">
                                          <div
                                             className="flex h-5 w-20 items-center justify-center rounded-full 
                                       border-0 text-center text-[10px] font-bold uppercase"
                                             style={{
                                                backgroundColor: `${row?.labelColor}33`,
                                             }}
                                          >
                                             {row.label}
                                          </div>
                                       </div>
                                    )}
                                    <div
                                       className="shadow-1 border-color mx-auto mt-2 flex h-[60px] w-[60px]
                                    items-center overflow-hidden rounded-full border-2 shadow"
                                    >
                                       {row?.iconUrl ? (
                                          <Image
                                             height={80}
                                             width={80}
                                             url={row?.iconUrl}
                                             options="aspect_ratio=1:1&height=120&width=120"
                                             alt={row?.name ?? "Icon"}
                                          />
                                       ) : (
                                          <Component
                                             className="text-1 mx-auto"
                                             size={18}
                                          />
                                       )}
                                    </div>
                                    <div className="text-1 truncate pt-1 text-center text-sm font-bold">
                                       {row?.name}
                                    </div>
                                 </div>
                              </Link>
                           ))}
                        </div>
                     </div>
                     {content && (
                        <div>
                           <Slate editor={editor} value={content}>
                              <Editable
                                 renderElement={renderElement}
                                 renderLeaf={Leaf}
                                 readOnly={true}
                              />
                           </Slate>
                        </div>
                     )}
                  </div>
               )}
            </>
         )}
      </section>
   );
}
