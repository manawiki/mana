import { Disclosure, Popover, Tab } from "@headlessui/react";
import React, { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js";
import { ChevronDown } from "lucide-react";

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend
);

export const Stats = ({ pageData, version }: any) => {
   // Usestate Variable Settings
   const [levelSliderValue, setLevelSliderValue] = useState(80);
   const [graphStat, setGraphStat] = useState("HP");

   // Update pagedata to use the active version's data:
   pageData = pageData.enemy_variations[version];

   var imgurl = pageData.image_full?.url;

   var weaknesses = pageData.elemental_weaknesses?.map((elem: any) => {
      return {
         name: elem.name,
         icon: elem?.icon?.url,
      };
   });
   // var imgurl = pageData.image_full?.url;
   // var pathurl = pageData.path?.icon?.url;
   // var pathsmall = pageData.path?.icon_small?.url;
   // var rarityurl = pageData.rarity?.icon?.url;
   // var pathname = pageData.path?.name;

   var statlist = ["HP", "ATK", "DEF", "Speed", "Break"];
   // =====================================
   // PREPROCESSING STEPS
   // Create an object that can be iterated through to generate data rows of stat data
   var statobj = [];
   for (var i = 0; i < statlist.length; i++) {
      statobj[i] = {};
      statobj[i].stat = statlist[i];

      // Pull Stat's Icon image hash
      // var currstat = statData.statTypes.find((a) => a.name == statlist[i]);
      // if (currstat?.icon) {
      //   statobj[i].hash = currstat.icon?.hash ?? "no_image_42df124128";
      // }

      // Alternate coloring every other stat.
      statobj[i].colormod = i % 2;
   }

   // =====================================
   // End Preprocessing for Stat Block, Output HTML Start
   // =====================================

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
                     {weaknesses.map((elem: any) => {
                        return (
                           <>
                              <div className="relative h-10 w-10 rounded-full bg-gray-800">
                                 <img
                                    className="relative inline-block object-contain text-white"
                                    src={elem.icon}
                                    alt={elem.name}
                                 />
                              </div>
                           </>
                        );
                     })}
                  </div>
               </div>

               <div className="divide-y overflow-hidden rounded-md border dark:divide-neutral-700 dark:border-neutral-700">
                  {statobj.map((stat: any, index) => {
                     return (
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
                                          src={
                                             stat.hash ?? "no_image_42df124128"
                                          }
                                          className="h-full w-full object-contain"
                                       />
                                    </div>
                                 ) : null}
                              </div>
                              <div>{stat.stat}</div>
                           </div>
                           {/* 2biii) Stat value */}
                           <div className="">
                              {pageData?.stats.find((a) => a.label == stat.stat)
                                 ? formatStat(
                                      stat.stat,
                                      pageData?.stats.find(
                                         (a) => a.label == stat.stat
                                      ).data[
                                         pageData?.stats
                                            .find((a) => a.label == "Lv")
                                            .data.indexOf(
                                               "" + levelSliderValue.toString()
                                            )
                                      ]
                                   )
                                 : ""}
                           </div>

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
                           var input = parseInt(event.target.value);
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
            <StatGraph
               charData={pageData}
               graphStat={graphStat}
               setGraphStat={setGraphStat}
            />

            {/* 2d) Collapsible? Tab for Full Stats - We do want to hide this because we wanna make it more work for people to find this? 
        UPDATE: Hidden for now due to slider. CSV version still available for full stat table. */}
            {/* <Stats charData={charData} /> */}
            <CSVStats charData={pageData} />

            {/* 2e) Collapsible Tab for link to Detailed BinOutput (JSON describing detailed parameters for character skills and attacks) */}
            {/* <BinOutputLink charData={charData} /> */}
         </div>
      </>
   );
};

// =====================================
// 2ci) Character Stat Graph
// =====================================
const StatGraph = ({ charData, graphStat, setGraphStat }: any) => {
   var data = charData;
   var statlist = ["HP", "ATK", "DEF", "Speed", "Break"];

   var tooltipsuffix = "";

   // Processing Graph Data for display

   const rawdata = data.stats.find((a) => a.label == graphStat).data;
   var processdata = [];
   for (var j = 0; j < rawdata.length; j++) {
      processdata[j] = formatStat(graphStat, rawdata[j]);
      // If a % exists in the output, remove it but set up the tooltipsuffix so a % displays.
      if (processdata[j].indexOf("%") > -1) {
         processdata[j] = processdata[j].replace("%", "");
         tooltipsuffix = "%";
      }
   }

   // Graph configuration start!
   // ==========================
   const showlabels = [
      "1",
      "10",
      "20",
      "30",
      "40",
      "50",
      "60",
      "70",
      "80",
      "90",
   ];
   const labels = data.stats.find((a) => a.label == "Lv").data;

   const options = {
      responsive: true,
      plugins: {
         legend: {
            display: false,
         },
         // title: {
         //   display: true,
         //   text: "Chart.js Line Chart",
         // },
         tooltip: {
            callbacks: {
               label: function (context) {
                  return context.parsed.y + tooltipsuffix;
               },
            },
         },
      },

      scales: {
         y: {
            grid: {
               color: "rgba(150,150,150,0.5)",
            },
            ticks: {
               // Show % tooltip suffix in Y axis if applicable to the stat
               callback: function (value, index, values) {
                  return value + tooltipsuffix;
               },
            },
         },
         x: {
            grid: {
               tickLength: 2,
               // Only show vertical grid where a showlabel value is
               color: function (context) {
                  if (context.tick.label != "") {
                     return "rgba(150,150,150,0.5)";
                  } else {
                     return "rgba(0,0,0,0)"; //transparent
                  }
               },
            },
            ticks: {
               autoSkip: false,
               // For a category axis, only show label if the value matches the "showlabels" array
               callback: function (val, index) {
                  // Hide every non-10th tick label
                  return showlabels.indexOf(this.getLabelForValue(val)) > -1
                     ? this.getLabelForValue(val)
                     : "";
               },
            },
         },
      },
   };

   // END of Graph Configuration

   const graphdata = {
      labels,
      datasets: [
         {
            //label: graphStat,
            data: processdata,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
         },
      ],
   };

   if (data.stats != undefined && data.stats.length != 0) {
      return (
         <>
            <div className="my-1">
               <Disclosure>
                  {({ open }) => (
                     <>
                        <Disclosure.Button
                           className="mb-2 flex  w-full items-center 
				   rounded-md border bg-gray-50 px-3 py-2 font-bold dark:border-neutral-700 dark:bg-neutral-900"
                        >
                           Stat Graph
                           <div
                              className={`${
                                 open
                                    ? "rotate-180 transform font-bold text-gray-600 "
                                    : "text-gray-400"
                              } ml-auto inline-block `}
                           >
                              <CaretDownIcon
                                 class="text-brand_1"
                                 w={28}
                                 h={28}
                              />
                           </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className="mb-5">
                           <div className="rounded-md border bg-gray-50 px-4 py-3 text-center text-sm dark:border-neutral-700 dark:bg-neutral-900">
                              <div className="inline-block px-2 font-bold">
                                 Display Stat:{" "}
                              </div>
                              {/* Stat Select Drop Down */}
                              <select
                                 className="inline-block bg-white dark:bg-neutral-700"
                                 name="stats"
                                 value={graphStat}
                                 onChange={(event) =>
                                    setGraphStat(event.target.value)
                                 }
                              >
                                 {statlist.map((stat: any) => {
                                    return (
                                       <>
                                          <option value={stat}>{stat}</option>
                                       </>
                                    );
                                 })}
                              </select>
                              <Line
                                 options={options}
                                 data={graphdata}
                                 height={"auto"}
                              />
                           </div>
                        </Disclosure.Panel>
                     </>
                  )}
               </Disclosure>
            </div>
         </>
      );
   } else {
      return <></>;
   }
};

// =====================================
// Collapsible CSV Stat Text box
// =====================================
const CSVStats = ({ charData }: any) => {
   var data = charData;
   if (data.stats != undefined && data.stats.length != 0) {
      return (
         <>
            <Disclosure>
               {({ open }) => (
                  <>
                     <Disclosure.Button
                        className="mb-2 flex w-full items-center
				rounded-md border bg-gray-50 px-3 py-2 font-bold dark:border-neutral-700 dark:bg-neutral-900"
                     >
                        Raw Stats for all Levels
                        <div
                           className={`${
                              open
                                 ? "rotate-180 transform font-bold text-gray-600 "
                                 : "text-gray-400"
                           } ml-auto inline-block `}
                        >
                           <ChevronDown size={28} />
                        </div>
                     </Disclosure.Button>
                     <Disclosure.Panel className="">
                        <div
                           contentEditable="true"
                           dangerouslySetInnerHTML={{
                              __html: data.stats_csv,
                           }}
                           className="h-24 overflow-y-scroll rounded-md border bg-gray-100 px-4 py-3 font-mono text-base dark:border-neutral-700 dark:bg-neutral-800"
                        ></div>
                     </Disclosure.Panel>
                  </>
               )}
            </Disclosure>
         </>
      );
   } else {
      return <></>;
   }
};

// =====================================
// Performs Rounding for Stats as Integers or as Percentages as necessary
// =====================================
function formatStat(type: any, stat: any) {
   // These are stats that should be formatted as an Integer.
   var intlist = ["HP", "ATK", "DEF", "Speed", "BaseAggro", "Break"];

   // Apply correct number formatting: Intlist should be rounded, otherwise *100 and display as Percentage of #.0% format
   if (intlist.indexOf(type) > -1) {
      stat = "" + Math.round(stat);
   } else {
      stat = (Math.round(stat * 1000) / 10).toFixed(1) + "%";
   }
   return stat;
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
