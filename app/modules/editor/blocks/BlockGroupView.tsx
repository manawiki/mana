import { Link } from "@remix-run/react";
import type { GroupElement } from "../types";
import { Image } from "~/components";
import { Component, LayoutGrid, List } from "lucide-react";
import { RadioGroup } from "@headlessui/react";
import { useState } from "react";
import { Tooltip } from "../components";

type Props = {
   element: GroupElement;
};

export default function GroupView({ element }: Props) {
   const groupItems = element.groupItems;
   const [viewMode, setViewMode] = useState(element.viewMode);

   return (
      <section className="my-6">
         <div className="flex items-center justify-between pb-2">
            <h2 className="m-0 p-0">{element.groupLabel}</h2>
            <RadioGroup
               className="flex cursor-pointer items-center gap-1"
               value={viewMode}
               onChange={setViewMode}
            >
               <RadioGroup.Option value="list">
                  {({ checked }) => (
                     <Tooltip
                        id="group-list-view"
                        side="top"
                        content="List View"
                     >
                        <div
                           className={`${
                              checked ? "bg-zinc-100 dark:bg-zinc-700" : ""
                           }
                                 flex h-7 w-7 items-center justify-center rounded`}
                        >
                           <List
                              style={{
                                 color: element?.color,
                              }}
                              size={16}
                           />
                        </div>
                     </Tooltip>
                  )}
               </RadioGroup.Option>
               <RadioGroup.Option value="grid">
                  {({ checked }) => (
                     <Tooltip
                        id="group-grid-view"
                        side="top"
                        content="Gird View"
                     >
                        <div
                           className={`${
                              checked ? "bg-zinc-100 dark:bg-zinc-700" : ""
                           }
                           flex h-7 w-7 items-center justify-center rounded`}
                        >
                           <LayoutGrid
                              style={{
                                 color: element?.color,
                              }}
                              size={16}
                           />
                        </div>
                     </Tooltip>
                  )}
               </RadioGroup.Option>
            </RadioGroup>
         </div>
         {viewMode == "list" ? (
            <div className="border-color bg-2 divide-color shadow-1 relative divide-y overflow-hidden rounded-lg border shadow-sm">
               {groupItems?.map((row) => (
                  <Link
                     reloadDocument={row?.isCustomSite ?? false}
                     key={row?.id}
                     to={row?.path ?? ""}
                     prefetch="intent"
                     className="bg-2 flex items-center gap-3 p-2.5 hover:underline"
                  >
                     <div
                        style={{
                           borderColor: element?.color,
                        }}
                        className="shadow-1 flex h-8 w-8 items-center
                     justify-between overflow-hidden rounded-full border-2 shadow-sm"
                     >
                        {row?.iconUrl ? (
                           <Image
                              url={row?.iconUrl}
                              options="aspect_ratio=1:1&height=80&width=80"
                              alt={row?.name ?? "Icon"}
                           />
                        ) : (
                           <Component className="text-1 mx-auto" size={18} />
                        )}
                     </div>
                     <div className="text-1 truncate text-sm font-bold">
                        {row?.name}
                     </div>
                  </Link>
               ))}
            </div>
         ) : viewMode == "grid" ? (
            <div className="grid grid-cols-2 gap-3 tablet:grid-cols-3 desktop:grid-cols-4">
               {groupItems?.map((row) => (
                  <Link
                     reloadDocument={row?.isCustomSite ?? false}
                     key={row?.id}
                     to={row?.path ?? ""}
                     prefetch="intent"
                     className="bg-2 border-color shadow-1 relative rounded-md border p-3 shadow-sm"
                  >
                     <div
                        style={{
                           borderColor: element?.color,
                        }}
                        className="shadow-1 mx-auto mb-1.5 flex h-14 w-14
               items-center overflow-hidden rounded-full border-2 shadow-sm"
                     >
                        {row?.iconUrl ? (
                           <Image
                              url={row?.iconUrl}
                              options="aspect_ratio=1:1&height=80&width=80"
                              alt={row?.name ?? "Icon"}
                           />
                        ) : (
                           <Component className="text-1 mx-auto" size={18} />
                        )}
                     </div>
                     <div className="text-1 truncate text-center text-xs font-bold">
                        {row?.name}
                     </div>
                  </Link>
               ))}
            </div>
         ) : null}
      </section>
   );
}
