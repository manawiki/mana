import type { Agent as AgentType } from "payload/generated-custom-types";
import { Disclosure } from "@headlessui/react";
import { Image } from "~/components/Image";
import { useState } from "react";

export function Main({ data: char }: { data: AgentType }) {
   const [level, setLevel] = useState(0);

   const mainImage = char?.icon_full?.url;
   const mainName = char?.name;
   const mainStatDisplay = [
      {
         label: "Rarity",
         value: char?.rarity?.name,
         icon: char?.rarity?.icon?.url,
      },
      {
         label: "Type",
         value: char?.damage_type?.[0]?.name,
         icon: char?.damage_type?.[0]?.icon?.url,
      },
      {
         label: "Element",
         value: char?.damage_element?.[0]?.name,
         icon: char?.damage_element?.[0]?.icon?.url,
      },
      {
         label: "Faction",
         value: char?.character_camp?.name,
         icon: char?.character_camp?.icon?.url,
      },
   ];

   const statDisplay = [
      {
         label: "HP",
         value: char?.hp,
         icon: "https://static.mana.wiki/zzz/IconHpMax.png",
      },
      {
         label: "DEF",
         value: char?.def,
         icon: "https://static.mana.wiki/zzz/IconDef.png",
      },
      {
         label: "CRIT Rate",
         value: char?.crit,
         icon: "https://static.mana.wiki/zzz/IconCrit.png",
         percent: true,
      },
      {
         label: "PEN Ratio",
         value: 0,
         icon: "https://static.mana.wiki/zzz/IconPenRatio.png",
         percent: true,
      },

      {
         label: "Energy Regen",
         value: 1.2,
         icon: "https://static.mana.wiki/zzz/IconSpRecover.png",
      },
      {
         label: "ATK",
         value: char?.atk,
         icon: "https://static.mana.wiki/zzz/IconAttack.png",
      },
      {
         label: "Impact",
         value: char?.impact,
         icon: "https://static.mana.wiki/zzz/IconBreakStun.png",
      },
      {
         label: "Crit DMG",
         value: char?.crit_damage,
         icon: "https://static.mana.wiki/zzz/IconCritDam.png",
         percent: true,
      },
      {
         label: "PEN",
         value: 0,
         icon: "https://static.mana.wiki/zzz/IconPenValue.png",
      },
      {
         label: "Attribute Mastery",
         value: char?.attribute_mastery,
         icon: "https://static.mana.wiki/zzz/IconAddedElementAccumulationRatio.png",
      },
   ];

   return (
      <>
         <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4">
            <section>
               <div className="flex items-center justify-center shadow-sm shadow-1 border border-color-sub rounded-lg dark:bg-dark350 bg-zinc-50 h-full p-3">
                  <Image
                     height={320}
                     className="object-contain"
                     url={
                        mainImage ??
                        "https://static.mana.wiki/zzz/Run2_00016.png"
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
                     <div className="px-3 py-1 justify-between flex items-center gap-2">
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
                           ) : null}
                        </div>
                     </div>
                  ))}
               </div>
            </section>
         </div>

         <H2 text="Stats (Base)" />
         <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4 mt-1 mb-3">
            {/* First row of extra attributes */}
            <section>
               <div
                  className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
               >
                  {statDisplay
                     ?.filter((v: any, i: any) => i < 5)
                     .map((attr: any) => {
                        return <StatBlock attr={attr} />;
                     })}
               </div>
            </section>

            {/* Second row of extra attributes */}
            <section>
               <div
                  className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
               >
                  {statDisplay
                     ?.filter((v: any, i: any) => i >= 5)
                     .map((attr: any) => {
                        return <StatBlock attr={attr} />;
                     })}
               </div>
            </section>
         </div>
      </>
   );
}

const StatBlock = ({ attr }: any) => {
   const attr_icon = attr?.icon;
   const attr_name = attr?.label;
   const attr_val = attr?.value;
   const attr_perc = attr?.percent;

   return (
      <>
         <div className="py-1 px-3 justify-between flex items-center gap-2">
            <div className="flex items-center gap-2">
               {attr_icon ? (
                  <>
                     <div className="items-center inline-block align-middle justify-center h-full mr-1 invert-[0.3]">
                        <Image
                           height={30}
                           className="object-contain"
                           url={attr_icon}
                           options="height=30"
                           alt={attr_name ?? "Icon"}
                        />
                     </div>
                  </>
               ) : null}
               <span className="font-semibold text-sm inline-block align-middle">
                  {attr_name}
               </span>
            </div>
            <div className="text-sm font-semibold">
               <span className="inline-block align-middle">
                  {attr_perc ? attr_val / 100 + "%" : attr_val}
               </span>
            </div>
         </div>
      </>
   );
};
