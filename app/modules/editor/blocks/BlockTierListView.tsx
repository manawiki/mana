import { Link } from "@remix-run/react";
import type { TierElement } from "../types";
import { Image } from "~/components";
import { Component } from "lucide-react";

type Props = {
   element: TierElement;
};

export default function BlockTierListView({ element }: Props) {
   const tierItems = element.tierItems;
   return (
      <section className="my-6">
         <div
            className="shadow-1 mb-2 inline-block rounded-lg
            border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm
            font-bold shadow-sm dark:border-emerald-900 dark:bg-emerald-950/20"
         >
            {element.tierLabel}
         </div>
         <div className="border-color bg-2 divide-color relative divide-y overflow-hidden rounded-lg border">
            {tierItems?.map((row) => (
               <Link
                  key={row?.id}
                  to={row?.path ?? ""}
                  prefetch="intent"
                  className="bg-2 flex items-center gap-3 p-2 hover:underline"
               >
                  <div
                     className="border-color shadow-1 flex h-8 w-8 flex-none items-center
                                 justify-between overflow-hidden rounded-full border-2 shadow-sm"
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
