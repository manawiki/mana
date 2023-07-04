import { useState } from "react";

import { Image } from "~/components";
import type { Character } from "payload/generated-custom-types";

import { LazyStatsGraph, type StatsType } from "../LazyStatsGraph.tsx";
import { CSVStats } from "../CSVStats.tsx";

export const CharacterStatBlock = ({ pageData }: { pageData: Character }) => {
   // Cast stats to the correct type
   const stats = pageData.stats as StatsType;

   // Usestate Variable Settings
   const [levelSliderValue, setLevelSliderValue] = useState(80);
   const [levelAscensionCheck, setLevelAscensionCheck] = useState(true);

   const mainurl = pageData.image_draw?.url;
   const elemurl = pageData.element?.icon?.url;
   const pathurl = pageData.path?.icon?.url;
   const pathsmall = pageData.path?.icon_small?.url;
   const rarityurl = pageData.rarity?.icon?.url;
   const pathname = pageData.path?.name;

   const statsList = [
      "HP",
      "ATK",
      "DEF",
      "Speed",
      "CritRate",
      "CritDMG",
      "BaseAggro",
   ];
   // =====================================
   // PREPROCESSING STEPS
   // Create an object that can be iterated through to generate data rows of stat data
   let statobj = statsList.map((stat, i) => ({
      stat: stat,
      // Add stat icons eventually
      hash: null,
      // Alternate coloring every other stat.
      colormod: i % 2,
   }));

   // =====================================
   // End Preprocessing for Stat Block, Output HTML Start
   // =====================================

   // Display value of a stat at a given level
   function getStatValue(stat: string) {
      let statTable = stats.find((a) => a?.label == stat)?.data;

      let levels = stats.find((a) => a?.label == "Lv")?.data;

      // If the level is 20, 40, 60, 70, 80, or 90, then we need to add an "A" to the end of the level to get the correct stat value.
      let statIndex = levels?.indexOf(
         levelSliderValue +
            (levelAscensionCheck &&
            ["20", "30", "40", "50", "60", "70"].indexOf(
               levelSliderValue.toString()
            ) > -1
               ? "A"
               : "")
      );

      if (!statTable || !statIndex || !levels) return "";

      return formatStat(stat, parseFloat(statTable[statIndex]));
   }

   return (
      <>
         <div className="grid gap-3 laptop:grid-cols-2">
            {/* ======================== */}
            {/* 1) Character Image div */}
            {/* ======================== */}
            <section className="bg-2 shadow-1 border-color relative w-full overflow-hidden rounded-md border text-center shadow-sm">
               {/* Element Symbol */}
               <div
                  className="absolute left-3 top-3 z-10 h-10 w-10
                   rounded-full "
               >
                  <Image
                     options="aspect_ratio=1:1&height=100&width=100"
                     alt="Element"
                     url={elemurl}
                     className="object-contain"
                  />
               </div>
               {/* Path + Path Name ? */}
               <div
                  className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center 
                  rounded-full bg-zinc-400 dark:bg-slate-800"
               >
                  <div className="h-6 w-6">
                     <Image
                        options="aspect_ratio=1:1&height=100&width=100"
                        alt="Element"
                        url={pathsmall}
                     />
                  </div>
               </div>
               {/* Rarity */}
               <div className="absolute bottom-4 left-4 z-20 flex h-8 items-center rounded-full bg-zinc-300 px-2 py-1 dark:bg-bg1Dark">
                  <Image options="height=32" alt="Rarity" url={rarityurl} />
               </div>
               <div className="relative h-96">
                  {/* Main Image */}
                  {mainurl ? (
                     <a href={mainurl}>
                        <div className="absolute left-0 top-0 flex h-96 w-full items-center">
                           <Image
                              className="h-84 mx-auto object-contain"
                              options="height=500"
                              alt="Background Image - Main"
                              url={mainurl}
                           />
                        </div>
                     </a>
                  ) : null}
               </div>
            </section>

            {/* ======================== */}
            {/* 2) Character Stat Block Section */}
            {/* ======================== */}
            <section>
               <div className="bg-2 shadow-1 border-color mb-3 flex items-center gap-3 rounded-md border p-3 shadow-sm">
                  <div className="h-10 w-10 flex-none rounded-full bg-bg4Dark">
                     <Image
                        className="relative inline-block object-contain"
                        options="aspect_ratio=1:1&height=80&width=80"
                        alt="Character Stat"
                        url={pathurl}
                     />
                  </div>
                  <div className="font-bold">{pathname}</div>
               </div>

               <div className="divide-color shadow-1 border-color divide-y overflow-hidden rounded-md border shadow-sm">
                  {statobj.map((stat, index) => {
                     return (
                        <div
                           className={`${
                              stat.colormod
                                 ? "bg-2 relative block"
                                 : "bg-1 relative block"
                           } flex items-center px-3 py-2.5`}
                           key={index}
                        >
                           {/* 2bi) Stat Icon */}
                           <div className="flex flex-grow items-center space-x-2">
                              {stat.hash && (
                                 <div
                                    className="relative inline-flex h-6 w-6 items-center 
                                        justify-center rounded-full align-middle"
                                 >
                                    <Image
                                       options="aspect_ratio=1:1&height=24&width=24"
                                       alt="Character Stat"
                                       url={stat.hash ?? "no_image_42df124128"}
                                       className="h-full w-full object-contain"
                                    />
                                 </div>
                              )}
                              <div className="text-1 font-bold">
                                 {stat.stat}
                              </div>
                           </div>
                           {/* 2biii) Stat value */}
                           <div className="">{getStatValue(stat.stat)}</div>

                           {/* 2bii.a) Show bonus icon if stat is Secondary Stat ? */}
                           {/* 
                    {stat.bonus ? (
                      <div className="inline-flex absolute items-center align-middle justify-center rounded-full h-4 w-4 mt-1 right-2/3 bg-gray-400 text-center">
                        <img
                          src="https://res.cloudinary.com/genshinimpact-nalu/image/upload/v1631645303/UI_Icon_Arrow_Point_1a06775238.png"
                          height="15"
                          width="15"
                        ></img>
                      </div>
                    ) : null}
                     */}
                        </div>
                     );
                  })}
               </div>
            </section>
         </div>
         {/* ======================== */}
         {/* Stats Slider and additional top info block */}
         {/* ======================== */}
         {/* 2a) Header for Adjusting Level and Slider */}
         {/* ======================== */}
         <div className="bg-2 shadow-1 border-color my-3 rounded-lg border px-6 py-3 font-bold shadow-sm">
            <div className="flex w-full items-center justify-between text-center">
               <div className="flex items-center gap-1">
                  {/* Level Label */}
                  <div className="inline-flex justify-between pr-0.5 align-middle">
                     Lvl
                  </div>
                  {/* Level Input Box */}
                  <input
                     className="scale-20 level-input-box border-color bg-1 ml-1 mr-2 inline-flex
                     w-9 justify-center rounded-lg border px-0 py-1 text-center align-middle"
                     type="number"
                     aria-label="Level"
                     value={levelSliderValue}
                     onChange={(event) => {
                        const numonly = /^[0-9\b]+$/;
                        const maxval = 80;

                        // Only set the level slider value if the entered value is not blank or a Number. Parseint as well so leading 0s are removed.
                        if (numonly.test(event.target.value)) {
                           let input = parseInt(event.target.value);
                           if (input > maxval) {
                              input = maxval;
                           } else if (input < 1) {
                              input = 1;
                           }
                           setLevelSliderValue(input);
                        }
                     }}
                  ></input>
                  {/* Asc Label */}
                  <div className="inline-flex justify-between pr-2 align-middle text-sm">
                     Asc
                  </div>
                  {/* Ascension Checkbox */}
                  <input
                     className="mr-2 inline-flex h-6 w-6 flex-shrink-0 items-center 
                     justify-between rounded-sm align-middle text-yellow-500"
                     type="checkbox"
                     aria-label="Ascension"
                     disabled={
                        // [20, 40, 60, 70, 80, 90].indexOf(levelSliderValue) < -1
                        ["20", "30", "40", "50", "60", "70"].indexOf(
                           levelSliderValue.toString()
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
                  className="slider-thumb h-1 w-full flex-grow appearance-none justify-end
                   rounded bg-zinc-200 align-middle accent-yellow-500 outline-none dark:bg-zinc-700"
                  type="range"
                  min="1"
                  max="80"
                  value={levelSliderValue}
                  onChange={(event) =>
                     setLevelSliderValue(parseInt(event.target.value))
                  }
               ></input>
            </div>
         </div>

         {/* 2c0) Material Summary - Just shows the Talent Mat(s) [Book + Boss mat(s)] and Ascension Mat(s) [Crystal + Ingredient + Monster Drop] */}
         {/* <MaterialSummaryTop charData={charData} talentData={talentData} /> */}

         {/* 2ci) Character Stat Graph */}
         {/* - Should include a drop down stat selector, shading between pre-post ascension breakpoints */}
         <LazyStatsGraph stats={stats} statsList={statsList} />

         {/* 2d) Collapsible? Tab for Full Stats - We do want to hide this because we wanna make it more work for people to find this? 
        UPDATE: Hidden for now due to slider. CSV version still available for full stat table. */}
         {/* <Stats charData={charData} /> */}

         {pageData?.stats && <CSVStats statsCSV={pageData?.stats_csv} />}

         {/* 2e) Collapsible Tab for link to Detailed BinOutput (JSON describing detailed parameters for character skills and attacks) */}
         {/* <BinOutputLink charData={charData} /> */}
      </>
   );
};

// =====================================
// Performs Rounding for Stats as Integers or as Percentages as necessary
// =====================================
function formatStat(type: string, stat: number) {
   // These are stats that should be formatted as an Integer.
   const intlist = ["HP", "ATK", "DEF", "Speed", "BaseAggro"];

   // Apply correct number formatting: Intlist should be rounded, otherwise *100 and display as Percentage of #.0% format
   if (intlist.indexOf(type) > -1) {
      return "" + Math.floor(Math.round(stat * 100) / 100);
   } else {
      return (
         (Math.floor(Math.round(stat * 100000) / 10) / 100).toFixed(1) + "%"
      );
   }
}

// =====================================
// For rendering Down Icon
// =====================================
export const CaretDownIcon = (props: any) => (
   <svg
      className={props.class}
      width={props.w}
      height={props.h}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <path fill="currentColor" d="M20 8H4L12 16L20 8Z"></path>
   </svg>
);
