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

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend
);

export const Stats = ({ pageData }: any) => {
   // Usestate Variable Settings
   const [levelSliderValue, setLevelSliderValue] = useState(80);
   const [levelAscensionCheck, setLevelAscensionCheck] = useState(true);
   const [graphStat, setGraphStat] = useState("HP");

   var imgurl = pageData.image_full?.url;
   var pathurl = pageData.path?.icon?.url;
   var pathsmall = pageData.path?.icon_small?.url;
   var rarityurl = pageData.rarity?.icon?.url;
   var pathname = pageData.path?.name;

   var statlist = ["HP", "ATK", "DEF"];
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
               <div className="relative w-full text-center bg-gray-100 dark:bg-neutral-900 rounded-md">
                  {/* Rarity */}
                  <div className="absolute bottom-3 left-20 laptop:left-12 w-20 z-20 h-8">
                     <img
                        className="object-contain w-20 z-20 h-8 rounded-full bg-black bg-opacity-40"
                        src={rarityurl}
                     />
                  </div>

                  <div className="relative inline-block text-center h-96 w-full">
                     {/* Main Image */}
                     {imgurl ? (
                        <img
                           src={imgurl}
                           className="object-contain absolute h-96 w-full"
                        />
                     ) : null}
                  </div>
               </div>
            </div>

            {/* ======================== */}
            {/* 2) Character Stat Block Section */}
            {/* ======================== */}
            <div>
               <div className="flex rounded-md border bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 mb-3 p-3">
                  <div className="flex flex-grow items-center space-x-2">
                     <div className="relative bg-gray-800 rounded-full h-10 w-10">
                        <img
                           className="relative inline-block object-contain"
                           src={pathurl}
                        />
                     </div>
                  </div>
                  <div className="flex flex-grow items-center space-x-2">
                     {pathname}
                  </div>
               </div>

               <div className="border divide-y dark:divide-neutral-700 dark:border-neutral-700 rounded-md overflow-hidden">
                  {statobj.map((stat: any, index) => {
                     return (
                        <div
                           className={`
                      /*2b) Alternating background stats for 5 or 6 stats depending on bonus stat */
                      ${
                         stat.colormod
                            ? "block relative bg-gray-50 dark:bg-neutral-800"
                            : "block relative bg-gray-100 dark:bg-neutral-900"
                      } p-2 flex items-center`}
                           key={index}
                        >
                           {/* 2bi) Stat Icon */}
                           <div className="flex flex-grow items-center space-x-2">
                              <div>
                                 {stat.hash ? (
                                    <div
                                       className="inline-flex relative items-center align-middle justify-center 
                          bg-gray-600 rounded-full h-6 w-6"
                                    >
                                       <img
                                          src={
                                             stat.hash ?? "no_image_42df124128"
                                          }
                                          className="object-contain h-full w-full"
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
                                               "" +
                                                  levelSliderValue.toString() +
                                                  (levelAscensionCheck &&
                                                  [
                                                     "20",
                                                     "40",
                                                     "60",
                                                     "70",
                                                  ].indexOf(
                                                     levelSliderValue.toString()
                                                  ) > -1
                                                     ? "A"
                                                     : "")
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
            <div className="block my-3 font-bold bg-gray-50 dark:bg-neutral-900 py-4 tablet:py-0 tablet:px-3 border rounded-md dark:border-neutral-700 border-solid">
               <div className="w-full text-center justify-between ">
                  {/* Level Label */}
                  <div className="align-middle inline-flex justify-between pr-0.5">
                     Lvl
                  </div>
                  {/* Level Input Box */}
                  <input
                     className="align-middle inline-flex ml-1 mr-2 text-center justify-center rounded
      w-9 border dark:bg-neutral-800 dark:border-neutral-700 scale-20 py-1 px-0 level-input-box"
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
                  {/* Asc Label */}
                  <div className="align-middle inline-flex justify-between text-sm pr-2">
                     Asc
                  </div>
                  {/* Ascension Checkbox */}
                  <input
                     className="align-middle w-7 h-7 inline-flex flex-shrink-0 justify-between items-center mr-2 focus-within:border-blue-100"
                     type="checkbox"
                     disabled={
                        // [20, 40, 60, 70, 80, 90].indexOf(levelSliderValue) < -1
                        ["20", "40", "60", "70"].indexOf(
                           levelSliderValue.toString()
                        ) > -1
                           ? null
                           : true
                     }
                     checked={levelAscensionCheck}
                     onChange={(event) =>
                        setLevelAscensionCheck(event.target.checked)
                     }
                  ></input>
                  {/* Slider */}
                  <input
                     className="level-slider align-middle inline-flex justify-end w-4/5 rounded-lg my-8"
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
const StatGraph = ({ charData, graphStat, setGraphStat }) => {
   var data = charData;
   var statlist = ["HP", "ATK", "DEF"];

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
                           className="font-bold bg-gray-50  dark:bg-neutral-900 dark:border-neutral-700 
				   flex items-center mb-2 w-full border px-3 py-2 rounded-md"
                        >
                           Stat Graph
                           <div
                              className={`${
                                 open
                                    ? "transform rotate-180 text-gray-600 font-bold "
                                    : "text-gray-400"
                              } inline-block ml-auto `}
                           >
                              <CaretDownIcon
                                 class="text-brand_1"
                                 w={28}
                                 h={28}
                              />
                           </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className="mb-5">
                           <div className="border dark:border-neutral-700 text-sm bg-gray-50 dark:bg-neutral-900 px-4 py-3 rounded-md text-center">
                              <div className="inline-block px-2 font-bold">
                                 Display Stat:{" "}
                              </div>
                              {/* Stat Select Drop Down */}
                              <select
                                 className="bg-white inline-block dark:bg-neutral-700"
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
                        className="font-bold bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700
				flex items-center mb-2 w-full border px-3 py-2 rounded-md"
                     >
                        Raw Stats for all Levels
                        <div
                           className={`${
                              open
                                 ? "transform rotate-180 text-gray-600 font-bold "
                                 : "text-gray-400"
                           } inline-block ml-auto `}
                        >
                           <CaretDownIcon class="text-brand_1" w={28} h={28} />
                        </div>
                     </Disclosure.Button>
                     <Disclosure.Panel className="">
                        <div
                           contentEditable="true"
                           dangerouslySetInnerHTML={{
                              __html: data.stats_csv,
                           }}
                           className="h-24 font-mono border overflow-y-scroll dark:border-neutral-700 text-base bg-gray-100 dark:bg-neutral-800 px-4 py-3 rounded-md"
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
   var intlist = ["HP", "ATK", "DEF", "Speed", "BaseAggro"];

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
