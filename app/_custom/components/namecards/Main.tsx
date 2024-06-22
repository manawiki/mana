import type { Item as ItemType } from "payload/generated-custom-types";
import { Disclosure } from "@headlessui/react";
import { Image } from "~/components/Image";
import { useState } from "react";

export function Main({ data: fulldata }: { data: ItemType }) {
   const char = fulldata;

   const mainImage = char?.icon?.url;
   const mainBanner = char?.image?.url;
   const mainName = char?.name;
   const mainDesc = char?.desc;
   const mainStatDisplay = [
      {
         label: "Rarity",
         value: char.rarity?.id,
      },
   ];

   return (
      <>
         <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4">
            <section>
               <div className="flex items-center justify-center shadow-sm shadow-1 border border-color-sub rounded-lg dark:bg-dark350 bg-zinc-50 h-full p-3">
                  <Image
                     height={280}
                     width={280}
                     className="object-contain"
                     url={
                        mainImage ??
                        "https://static.mana.wiki/zzz/Run2_00016.png"
                     }
                     alt={mainName ?? "Icon"}
                  />
               </div>
            </section>
            <section>
               <div
                  className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
               >
                  <div className="flex items-center justify-center shadow-sm shadow-1 dark:bg-dark350 bg-zinc-50 h-full p-3">
                     <Image
                        height={280}
                        width={280}
                        className="object-contain"
                        url={
                           mainBanner ??
                           "https://static.mana.wiki/zzz/Run2_00016.png"
                        }
                        alt={mainName ?? "Icon"}
                     />
                  </div>
                  {mainStatDisplay?.map((row) => (
                     <div
                        className="px-3 py-2 justify-between flex items-center gap-2"
                        key={row.label}
                     >
                        <div className="flex items-center gap-2">
                           <span className="font-semibold text-sm">
                              {row.label}
                           </span>
                        </div>
                        <div className="text-sm font-semibold">
                           <span className="inline-block align-middle">
                              {row.value}
                           </span>
                           {/* {row.icon ? (
                    <>
                      <div className="items-center inline-block align-middle rounded-md justify-center dark:bg-dark350 bg-zinc-600 h-full ml-2">
                        <Image
                          width={30}
                          className="object-contain"
                          url={row?.icon}
                          options="width=30"
                          alt={mainName ?? "Icon"}
                        />
                      </div>
                    </>
                  ) : null} */}
                        </div>
                     </div>
                  ))}

                  {/* Description */}
                  {mainDesc == "" ? null : (
                     <div className="px-3 py-2 justify-between flex items-center gap-2 text-sm">
                        {mainDesc}
                     </div>
                  )}
               </div>
            </section>
         </div>
      </>
   );
}
