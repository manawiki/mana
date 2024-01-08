import type { CraftEssence as CraftEssenceType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";

export function Main({ data: ce }: { data: CraftEssenceType }) {
   const mainStatDisplay = [
      {
         label: "ID",
         value: ce.library_number,
      },
      {
         label: "Cost",
         value: ce.cost,
      },
      {
         label: "Rarity",
         value: ce._rarity?.name + "★",
      },
      {
         label: "Base HP",
         value: ce.base_hp,
      },
      {
         label: "Max HP",
         value: ce.max_hp,
      },
      {
         label: "Base ATK",
         value: ce.base_atk,
      },
      {
         label: "Max ATK",
         value: ce.max_atk,
      },
   ];

   return (
      <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4">
         <section>
            <div className="flex items-center h-80 justify-center">
               <Image
                  height={320}
                  className="object-contain"
                  url={ce?.image?.url}
                  options="height=320"
                  alt={ce?.name}
               />
            </div>
         </section>
         <section>
            <div
               className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
         mb-3 [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
            >
               {mainStatDisplay?.map((row) => (
                  <div className="p-3 justify-between flex items-center gap-2">
                     <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                           {row.label}
                        </span>
                     </div>
                     <div className="text-sm font-semibold">{row.value}</div>
                  </div>
               ))}
            </div>
         </section>
      </div>
   );
}
