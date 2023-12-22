import type { DiskDriveSet as DiskDriveSetType } from "payload/generated-custom-types";
import { Disclosure } from "@headlessui/react";
import { Image } from "~/components/Image";
import { useState } from "react";

export function Main({ data: char }: { data: DiskDriveSetType }) {
   const [level, setLevel] = useState(0);

   const mainImage = char?.icon?.url;
   const mainName = char?.name;
   const mainDescFlavor = char?.desc;
   const mainStatDisplay = [
      {
         label: "Rarity",
         value: "",
         icon: char.rarity_possible?.map((a: any) => a?.icon_item?.url),
      },
   ];

   return (
      <>
         <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4">
            <section>
               <div className="flex items-center justify-center shadow-sm shadow-1 border border-color-sub rounded-lg dark:bg-dark350 bg-zinc-50 p-3">
                  <Image
                     height={280}
                     className="object-contain"
                     url={
                        mainImage ??
                        "https://static.mana.wiki/zzz/Run2_00016.png"
                     }
                     options="height=280"
                     alt={mainName ?? "Icon"}
                  />
               </div>
            </section>
            <section>
               <div
                  className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg h-full 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
               >
                  {mainStatDisplay?.map((row) => (
                     <div className="px-3 py-2 justify-between flex items-center gap-2">
                        <div className="flex items-center gap-2">
                           <span className="font-semibold text-sm">
                              {row.label}
                           </span>
                        </div>
                        <div className="text-sm font-semibold">
                           <span className="inline-block align-middle">
                              {row.value}
                           </span>
                           {row.icon ? (
                              <>
                                 <div className="items-center inline-block align-middle justify-center h-full ml-2">
                                    {row.icon.map((iconurl: any) => {
                                       return (
                                          <>
                                             <div className="rounded-md dark:bg-dark350 bg-zinc-600 mx-1">
                                                <Image
                                                   width={30}
                                                   className="object-contain"
                                                   url={iconurl}
                                                   options="width=30"
                                                   alt={mainName ?? "Icon"}
                                                />
                                             </div>
                                          </>
                                       );
                                    })}
                                 </div>
                              </>
                           ) : null}
                        </div>
                     </div>
                  ))}

                  {/* Description Flavor */}
                  <div className="px-3 py-2 justify-between flex items-center gap-2 text-sm italic text-zinc-500">
                     {mainDescFlavor}
                  </div>
               </div>
            </section>
         </div>
      </>
   );
}
