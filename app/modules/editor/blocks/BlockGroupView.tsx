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
            <div className="flex items-center gap-3 font-header text-2xl font-bold">
               <span
                  className="h-7 w-1 rounded-full"
                  style={{
                     backgroundColor: element.color,
                  }}
               />
               {element.groupLabel}
            </div>
            <RadioGroup
               className="border-color bg-2 flex h-10 cursor-pointer items-center gap-1 rounded-md border px-1.5"
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
                              checked ? "bg-zinc-200 dark:bg-zinc-700" : ""
                           }
                                 flex h-6 w-6 items-center justify-center rounded`}
                        >
                           <List
                              style={{
                                 color: checked == true ? element.color : "",
                              }}
                              size={14}
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
                        content="Gird View (Coming Soon!)"
                     >
                        <div
                           className={`${
                              checked ? "bg-zinc-200 dark:bg-zinc-700" : ""
                           }
                           flex h-6 w-6 items-center justify-center rounded`}
                        >
                           <LayoutGrid
                              style={{
                                 color: checked == true ? element.color : "",
                              }}
                              size={14}
                           />
                        </div>
                     </Tooltip>
                  )}
               </RadioGroup.Option>
            </RadioGroup>
         </div>
         {viewMode == "list" ? (
            <div className="border-color bg-2 divide-color relative divide-y overflow-hidden rounded-lg border">
               {groupItems?.map((row) => (
                  <Link
                     key={row?.id}
                     to={row?.path ?? ""}
                     prefetch="intent"
                     className="bg-2 flex items-center gap-3 p-2.5 hover:underline"
                  >
                     <div
                        style={{
                           borderColor: element.color,
                        }}
                        className="shadow-1 flex h-8 w-8 items-center
                     justify-between overflow-hidden rounded-full border shadow-sm"
                     >
                        {row?.iconUrl ? (
                           <Image
                              url={row?.iconUrl}
                              options="fit=crop,width=60,height=60,gravity=auto"
                              alt={row?.name ?? "Icon"}
                           />
                        ) : (
                           <Component className="text-1 mx-auto" size={18} />
                        )}
                     </div>
                     <div className="truncate">{row?.name}</div>
                  </Link>
               ))}
            </div>
         ) : viewMode == "grid" ? (
            <div className="grid grid-cols-2 gap-3 tablet:grid-cols-3 desktop:grid-cols-4">
               {groupItems?.map((row) => (
                  <Link
                     key={row?.id}
                     to={row?.path ?? ""}
                     prefetch="intent"
                     className="bg-2 border-color relative rounded-md border p-3"
                  >
                     <div
                        style={{
                           borderColor: element.color,
                        }}
                        className="shadow-1 mx-auto mb-1.5 flex h-14 w-14
               items-center overflow-hidden rounded-full border-2 shadow-sm"
                     >
                        {row?.iconUrl ? (
                           <Image
                              url={row?.iconUrl}
                              options="fit=crop,width=60,height=60,gravity=auto"
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
