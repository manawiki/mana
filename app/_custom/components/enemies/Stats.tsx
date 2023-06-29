import { useState } from "react";

import type { Enemy } from "payload/generated-custom-types";
import { CSVStats } from "../CSVStats";
import { LazyStatsGraph, type StatsType } from "../LazyStatsGraph";

export const Stats = ({
   pageData,
   version,
}: {
   pageData: Enemy;
   version: number;
}) => {
   // Usestate Variable Settings
   const [levelSliderValue, setLevelSliderValue] = useState(80);

   // Update pagedata to use the active version's data:
   const enemyData = pageData?.enemy_variations?.[version];

   const stats = enemyData?.stats as StatsType;

   let imgurl = pageData.image_full?.url;

   // let imgurl = pageData.image_full?.url;
   // let pathurl = pageData.path?.icon?.url;
   // let pathsmall = pageData.path?.icon_small?.url;
   // let rarityurl = pageData.rarity?.icon?.url;
   // let pathname = pageData.path?.name;

   const statsList = ["HP", "ATK", "DEF", "Speed", "Break"];
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

      let statIndex = levels?.indexOf(levelSliderValue.toString());

      if (!statTable || !statIndex || !levels) return "";

      return formatStat(stat, parseFloat(statTable[statIndex]));
   }

   return (
      <>
         <div className="grid gap-3 laptop:grid-cols-2">
            {/* ======================== */}
            {/* 1) Character Image div */}
            {/* ======================== */}
            <div>
               <div className="relative w-full rounded-md bg-gray-100 text-center dark:bg-neutral-900">
                  <div className="relative inline-block h-96 w-full text-center">
                     {/* Main Image */}
                     {imgurl ? (
                        <img
                           src={imgurl}
                           alt={pageData.name}
                           className="absolute h-96 w-full object-contain"
                        />
                     ) : null}
                  </div>
               </div>
            </div>

            {/* ======================== */}
            {/* 2) Enemy Stat Block Section */}
            {/* ======================== */}
            <div>
               <div className="mb-3 flex rounded-md border bg-gray-50 p-3 dark:border-neutral-700 dark:bg-neutral-900">
                  <div className="flex flex-grow items-center space-x-2">
                     Weaknesses
                  </div>
                  <div className="flex flex-grow items-center space-x-2">
                     {enemyData?.elemental_weaknesses?.map((elem) => (
                        <div
                           key={elem?.name}
                           className="relative h-10 w-10 rounded-full bg-gray-800"
                        >
                           <img
                              className="relative inline-block object-contain text-white"
                              src={elem?.icon?.url}
                              alt={elem?.name}
                           />
                        </div>
                     ))}
                  </div>
               </div>

               <div className="divide-y overflow-hidden rounded-md border dark:divide-neutral-700 dark:border-neutral-700">
                  {statobj.map((stat, index) => (
                     <div
                        className={`
                      /*2b) Alternating background stats for 5 or 6 stats depending on bonus stat */
                      ${
                         stat.colormod
                            ? "relative block bg-gray-50 dark:bg-neutral-800"
                            : "relative block bg-gray-100 dark:bg-neutral-900"
                      } flex items-center p-2`}
                        key={index}
                     >
                        {/* 2bi) Stat Icon */}
                        <div className="flex flex-grow items-center space-x-2">
                           <div>
                              {stat.hash ? (
                                 <div
                                    className="relative inline-flex h-6 w-6 items-center 
                          justify-center rounded-full bg-gray-600 align-middle"
                                 >
                                    <img
                                       src={stat.hash ?? "no_image_42df124128"}
                                       alt={stat.stat}
                                       className="h-full w-full object-contain"
                                    />
                                 </div>
                              ) : null}
                           </div>
                           <div>{stat.stat}</div>
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
                  ))}
               </div>
            </div>
         </div>
         {/* ======================== */}
         {/* Stats Slider and additional top info block */}
         {/* ======================== */}
         {/* 2a) Header for Adjusting Level and Slider */}
         {/* ======================== */}
         <div className="relative w-full">
            <div className="my-3 block rounded-md border border-solid bg-gray-50 py-4 font-bold dark:border-neutral-700 dark:bg-neutral-900 tablet:px-3 tablet:py-0">
               <div className="w-full justify-between text-center ">
                  {/* Level Label */}
                  <div className="inline-flex justify-between pr-0.5 align-middle">
                     Lvl
                  </div>
                  {/* Level Input Box */}
                  <input
                     className="scale-20 level-input-box ml-1 mr-2 inline-flex w-9 justify-center
      rounded border px-0 py-1 text-center align-middle dark:border-neutral-700 dark:bg-neutral-800"
                     type="number"
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

                  {/* Slider */}
                  <input
                     className="level-slider my-8 inline-flex w-4/5 justify-end rounded-lg align-middle"
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
            {enemyData?.stats && <CSVStats statsCSV={enemyData?.stats_csv} />}

            {/* 2e) Collapsible Tab for link to Detailed BinOutput (JSON describing detailed parameters for character skills and attacks) */}
            {/* <BinOutputLink charData={charData} /> */}
         </div>
      </>
   );
};

// =====================================
// Performs Rounding for Stats as Integers or as Percentages as necessary
// =====================================
function formatStat(type: string, stat: number) {
   // These are stats that should be formatted as an Integer.
   let intlist = ["HP", "ATK", "DEF", "Speed", "BaseAggro", "Break"];

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
