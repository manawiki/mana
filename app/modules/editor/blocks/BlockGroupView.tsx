import { Link } from "@remix-run/react";
import type { GroupElement } from "../types";
import { Image } from "~/components";
import { Component } from "lucide-react";

type Props = {
   element: GroupElement;
};

export default function GroupView({ element }: Props) {
   const groupItems = element.groupItems;
   return (
      <section className="my-6">
         <div className="flex items-center gap-3 pb-2.5 font-header text-2xl font-bold">
            <span
               className="h-7 w-1 rounded-full"
               style={{
                  backgroundColor: element.color,
               }}
            />
            {element.groupLabel}
         </div>
         <div className="border-color bg-2 divide-color relative divide-y overflow-hidden rounded-lg border">
            {groupItems?.map((row) => (
               <Link
                  key={row?.id}
                  to={row?.path ?? ""}
                  prefetch="intent"
                  className="bg-2 flex items-center gap-3 p-2 hover:underline"
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
      </section>
   );
}
