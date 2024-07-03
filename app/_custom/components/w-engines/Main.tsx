import { useState } from "react";
import { Input } from "~/components/Input";

import { calculateEngineMainstat, calculateEngineSubstat } from "~/_custom/utils/formulas";

import type { WEngine as WEngineType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { formatValue } from "~/_custom/utils/valueFormat";
import { stat } from "fs";

export function Main({ data }: { data: WEngineType }) {
   const [level, setLevel] = useState(60);
   const [levelAscensionCheck, setLevelAscensionCheck] = useState(true);

   const char = data.entry?.data?.WEngine;

   const mainImage = char?.icon_full?.url;
   const mainName = char?.name;
   const mainStatDisplay = [
      {
         label: "Rarity",
         value: "",
         icon: char.rarity?.icon_item?.url,
      },
   ];

   const asc_index =
      Math.floor(level / 10) +
      ((!levelAscensionCheck && level / 10 == Math.floor(level / 10)) ||
      level == 60
         ? -1
         : 0);

   const dispasc = asc_index + 1;

   const wlevel = data.wLevelData?.find(
      (j: any) => j.id == "WeaponLevelTemplateTb",
   )?.json;
   const wstar = data.wLevelData?.find(
      (j: any) => j.id == "WeaponStarTemplateTb",
   )?.json;

   const level_growth = wlevel?.find(
      (w: any) => w.rarity == char?.rarity?.id && w.level == level,
   )?.growth;
   const star_growth = wstar?.filter(
      (w: any) => w.rarity == char?.rarity?.id,
   )?.[asc_index]?.growth;
   const secondary_growth = wstar?.filter(
      (w: any) => w.rarity == char?.rarity?.id,
   )?.[asc_index]?.second_stat_mod;

   console.log(secondary_growth);

   const basicStatDisplay = [
      {
         label: char?.stat_primary?.stat?.name?.replace("Base ", ""),
         value: formatValue(
            char?.stat_primary?.stat,
            calculateEngineMainstat(
               char?.stat_primary?.value,
               level_growth,
               star_growth,
            )
         ),
         // they look ugly lol
         //icon: char?.stat_primary?.stat?.icon?.url,
      },
      {
         label: char?.stat_secondary?.stat?.name,
         value: formatValue(
            char?.stat_secondary?.stat,
            calculateEngineSubstat(
               char?.stat_secondary?.value,
               secondary_growth,
            ) / char?.stat_secondary?.stat?.divisor
         ),
         //icon: char?.stat_secondary?.stat?.icon?.url,
      },
   ];

   return (
      <>
         <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4">
            <section>
               <div className="flex items-center justify-center shadow-sm shadow-1 border border-color-sub rounded-lg dark:bg-dark350 bg-zinc-50 h-full p-3">
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
                  className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg
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

                  {basicStatDisplay?.map((stat) => (
                     <StatBlock attr={stat} />
                  ))}
               </div>
            </section>
         </div>

         {/* ======================== */}
         {/* W-Engine description */}
         {/* ======================== */}
         <div
            className="my-2 flex items-center gap-2 px-3 py-2.5 bg-2-sub
            rounded-lg shadow-sm shadow-1 border border-color-sub italic"
         >
            {char?.desc}
         </div>

         {/* ======================== */}
         {/* Stats Slider and additional top info block */}
         {/* ======================== */}
         {/* 2a) Header for Adjusting Level and Slider */}
         {/* ======================== */}
         <div className="bg-2-sub shadow-1 border-color-sub my-3 rounded-lg border px-6 py-3 font-bold shadow-sm">
            <div className="flex w-full items-center justify-between text-center">
               <div className="flex items-center gap-3">
                  {/* Level Label */}
                  <div className="inline-flex justify-between align-middle">
                     Lvl
                  </div>
                  {/* Level Input Box */}
                  <Input
                     className="!w-16 flex-none"
                     type="number"
                     aria-label="Level"
                     value={level}
                     onChange={(event) => {
                        const numonly = /^[0-9\b]+$/;
                        const maxval = 60;

                        // Only set the level slider value if the entered value is not blank or a Number. Parseint as well so leading 0s are removed.
                        if (numonly.test(event.target.value)) {
                           let input = parseInt(event.target.value);
                           if (input > maxval) {
                              input = maxval;
                           } else if (input < 1) {
                              input = 1;
                           }
                           setLevel(input);
                        }
                     }}
                  />
                  {/* ◇ ◆ ☆ ★ Symbols */}
                  <div className="flex text-md font-bold px-1 items-center self-center rounded-full bg-zinc-500 h-6">
                     {[2, 3, 4, 5, 6].map((stg: any) => (
                        <div
                           className={`inline-block text-sm align-middle drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)] ${
                              dispasc >= stg ? "text-white" : "text-black"
                           }`}
                        >
                           ★
                        </div>
                        // <Image
                        //   height={15}
                        //   className={`object-contain inline-block align-middle drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)] ${
                        //     dispasc >= stg ? "invert-[0.10]" : "invert-[0.90]"
                        //   }`}
                        //   url={"https://static.mana.wiki/endfield/icon_breakmark_01.png"}
                        //   options="height=15"
                        //   alt={">"}
                        // />
                     ))}
                  </div>
                  {/* Asc Label */}
                  <div className="inline-flex justify-between align-middle text-sm">
                     Asc
                  </div>
                  {/* Ascension Checkbox */}
                  <input
                     className="mr-2 inline-flex h-6 w-6 flex-shrink-0 items-center
                     justify-between rounded-sm align-middle text-zinc-500"
                     type="checkbox"
                     aria-label="Ascension"
                     disabled={
                        // [20, 40, 60, 70, 80, 90].indexOf(levelSliderValue) < -1
                        ["10", "20", "30", "40", "50"].indexOf(
                           level.toString(),
                        ) > -1
                           ? false
                           : true
                     }
                     checked={levelAscensionCheck}
                     onChange={(event) =>
                        setLevelAscensionCheck(event.target.checked)
                     }
                  ></input>
               </div>
               {/* Slider */}
               <input
                  aria-label="Level Slider"
                  className="flex-grow"
                  type="range"
                  min="1"
                  max="60"
                  value={level}
                  onChange={(event) => setLevel(parseInt(event.target.value))}
               ></input>
            </div>
         </div>
      </>
   );
}

const StatBlock = ({ attr }: any) => {
   const attr_icon = attr?.icon;
   const attr_name = attr?.label;
   const attr_val = attr?.value;

   return (
      <>
         <div className="px-3 py-2 justify-between flex items-center gap-2">
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
                  {attr_val}
               </span>
            </div>
         </div>
      </>
   );
};

