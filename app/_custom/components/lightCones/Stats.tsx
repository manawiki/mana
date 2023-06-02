import { Disclosure, Popover, Tab } from "@headlessui/react";
import React, { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { Image } from "~/components";

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
import { BarChart2, ChevronDown, Binary } from "lucide-react";

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
         <div className="gap-3 laptop:flex">
            {/* ======================== */}
            {/* 1) Character Image div */}
            {/* ======================== */}
            <div
               className="bg-2 shadow-1 border-color relative flex items-center justify-center overflow-hidden rounded-md 
                  border text-center shadow-sm max-laptop:mb-3 laptop:w-72"
            >
               {/* Rarity */}
               <div className="absolute bottom-3 left-3 z-20 h-8 rounded-full bg-black bg-opacity-40 px-1">
                  <Image className="" url={rarityurl} alt={"Rarity"} />
               </div>
               {/* Main Image */}
               {imgurl ? (
                  <Image
                     className="max-tablet:w-full laptop:w-72"
                     options="height=500"
                     alt="Character Primary Image"
                     url={imgurl}
                  />
               ) : null}
            </div>

            {/* ======================== */}
            {/* 2) Character Stat Block Section */}
            {/* ======================== */}
            <div className="flex-grow">
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
                  {statobj.map((stat: any, index) => {
                     return (
                        <div
                           className={`
                      /*2b) Alternating background stats for 5 or 6 stats depending on bonus stat */
                      ${
                         stat.colormod
                            ? "bg-2 relative block"
                            : "bg-1 relative block"
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
                                       <Image
                                          options="aspect_ratio=1:1&height=40&width=40"
                                          alt="Icon"
                                          url={
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
                                               "" +
                                                  levelSliderValue.toString() +
                                                  (levelAscensionCheck &&
                                                  [
                                                     "20",
                                                     "30",
                                                     "40",
                                                     "50",
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
            <div className="bg-2 shadow-1 border-color my-3 rounded-lg border px-6 py-3 font-bold shadow-sm">
               <div className="flex w-full items-center justify-between text-center">
                  {/* Level Label */}
                  <div className="inline-flex justify-between pr-0.5 align-middle">
                     Lv.
                  </div>
                  {/* Level Input Box */}
                  <input
                     className="scale-20 level-input-box border-color bg-1 ml-1 mr-2 inline-flex
                     w-9 justify-center rounded-lg border px-0 py-1 text-center align-middle"
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
                  <div className="inline-flex justify-between pr-2 align-middle text-sm">
                     Asc
                  </div>
                  {/* Ascension Checkbox */}
                  <input
                     className="mr-2 inline-flex h-6 w-6 flex-shrink-0 items-center 
                     justify-between rounded-sm align-middle text-yellow-500"
                     type="checkbox"
                     disabled={
                        // [20, 40, 60, 70, 80, 90].indexOf(levelSliderValue) < -1
                        ["20", "30", "40", "50", "60", "70"].indexOf(
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
                           className="border-color bg-2 shadow-1 mb-2 flex w-full items-center
                           gap-3 rounded-lg border px-4 py-3 font-bold shadow-sm"
                        >
                           <BarChart2 size={20} className="text-yellow-500" />
                           Stat Graph
                           <div
                              className={`${
                                 open ? "font-bol rotate-180 transform " : ""
                              } ml-auto inline-block `}
                           >
                              <ChevronDown size={28} />
                           </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className="mb-5">
                           <div className="bg-2 border-color rounded-md border px-4 py-3 text-center text-sm">
                              <div className="inline-block px-2 font-bold">
                                 Display Stat:{" "}
                              </div>
                              {/* Stat Select Drop Down */}
                              <select
                                 className="bg-1 border-color inline-block rounded-lg border"
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
   const data = charData;
   if (data.stats != undefined && data.stats.length != 0) {
      return (
         <>
            <Disclosure>
               {({ open }) => (
                  <>
                     <Disclosure.Button
                        className="border-color bg-2 shadow-1 mb-2 flex w-full items-center
                        gap-3 rounded-lg border px-4 py-3 font-bold shadow-sm"
                     >
                        <Binary size={20} className="text-yellow-500" />
                        Raw Stats for all Levels
                        <div
                           className={`${
                              open ? "font-bol rotate-180 transform " : ""
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
                           className="border-color bg-2 h-24 overflow-y-scroll rounded-md border px-4 py-3 font-mono"
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
      stat = "" + Math.floor(Math.round(stat * 100) / 100);
   } else {
      stat =
         (Math.floor(Math.round(stat * 100000) / 10) / 100).toFixed(1) + "%";
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
