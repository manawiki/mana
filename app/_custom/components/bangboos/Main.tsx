import type { Bangboo as BangbooType } from "payload/generated-custom-types";
import { Input } from "~/components/Input";
import { Image } from "~/components/Image";
import { useState } from "react";

import { formatValue } from "~/_custom/utils/valueFormat";
import { calculateStat } from "~/_custom/utils/formulas";

export function Main({ data: char }: { data: BangbooType }) {
   const [level, setLevel] = useState(60);
   const [levelAscensionCheck, setLevelAscensionCheck] = useState(true);

   const mainImage = char?.icon_full?.url;
   const mainName = char?.name;
   const mainDesc = char?.desc;
   const mainStatDisplay = [
      {
         label: "Rarity",
         value: "",
         icon: char.rarity?.icon?.url,
      },
   ];

   // Get the ascension_data array index based on current selected level and ascension checkmark
   const asc_index =
      Math.floor(level / 10) +
      ((!levelAscensionCheck && level / 10 == Math.floor(level / 10)) ||
      level == 60
         ? -1
         : 0);

   const dispasc = char?.ascension_data?.[asc_index]?.asc;
   const basicStatDisplay = char?.stats.map((stat) => {
      let data = {};
      data["label"] = stat?.stat?.name;
      data["value"] = stat?.base / stat?.stat?.divisor;
      if (stat?.growth) {
        data["value"] = formatValue(
          stat?.stat,
          calculateStat(
            level,
            stat?.base,
            char?.ascensions?.[asc_index]?.stat_adv?.find(
              (s) => s.stat?.id === stat?.stat?.id)
              ?.value,
            stat?.growth,
            stat?.stat?.divisor
          )
        );
      } else {
         const add = char?.ascensions?.[asc_index]?.stat_add?.find(
            (s) => s.stat?.id.substring(0, 3) === stat?.stat?.id, // correct?
         )?.value ?? 0;
        data["value"] = formatValue(stat?.stat, (stat?.base + add) / stat?.stat?.divisor);
      }
      data["icon"] = stat?.stat?.icon?.url;
      return data;
    });

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
                                       width={20}
                                       className="object-contain"
                                       url={row?.icon}
                                       options="width=20"
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

                  {/* Description */}
                  <div className="px-3 py-2 justify-between flex items-center gap-2">
                     {mainDesc}
                  </div>
               </div>
            </section>
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
                           height={20}
                           className="object-contain"
                           url={attr_icon}
                           options="height=20"
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
