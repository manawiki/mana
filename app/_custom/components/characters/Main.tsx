import type { Character as CharacterType } from "payload/generated-custom-types";
import { Image } from "~/components";

export function Main({ data: char }: { data: CharacterType }) {
   const mainImage = char?.image?.url;
   const mainName = char?.eng_name;
   const mainStatDisplay = [
      {
         label: "Rarity",
         value: char.rarity?.name ? char.rarity?.name + "★" : "-",
      },
      {
         label: "Profession",
         value: char?.profession?.id,
      },
      {
         label: "Weapon Type",
         value: char?.weapon_type?.id,
      },
      {
         label: "Energy Shard Type",
         value: char?.energy_shard_type?.id,
      },
   ];

   return (
      <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4 mb-3">
         <section>
            <div className="flex items-center justify-center shadow-sm shadow-1 rounded-lg dark:bg-dark350 bg-zinc-50 border border-color-sub h-full">
               <Image
                  height={320}
                  className="object-contain"
                  url={
                     mainImage ??
                     "https://static.mana.wiki/endfield/common_charhead_blank.png"
                  }
                  options="height=320"
                  alt={mainName ?? "Icon"}
               />
            </div>
         </section>
         <section>
            <div
               className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
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
