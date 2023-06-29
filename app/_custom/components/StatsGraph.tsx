import { useState } from "react";
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

// =====================================
// 2ci) Character Stat Graph
// =====================================
export type StatsType = Array<{ label: string; data: string[] }>;
export const StatsGraph = ({
   stats,
   statsList = ["HP", "ATK", "DEF"],
}: {
   stats: StatsType;
   statsList: string[]; // List of stats to display in the dropdown
}) => {
   const [graphStat, setGraphStat] = useState("HP");

   let tooltipsuffix = "";

   // Processing Graph Data for display
   const rawdata = stats.find((a) => a.label == graphStat)?.data;

   let processdata = [];
   if (rawdata) {
      for (let j = 0; j < rawdata.length; j++) {
         processdata[j] = formatStat(graphStat, parseFloat(rawdata[j]));
         // If a % exists in the output, remove it but set up the tooltipsuffix so a % displays.
         if (processdata[j].indexOf("%") > -1) {
            processdata[j] = processdata[j].replace("%", "");
            tooltipsuffix = "%";
         }
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
   const labels = stats?.find((a) => a.label == "Lv")?.data;

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
               label: function (context: any) {
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
               callback: function (value: any) {
                  return value + tooltipsuffix;
               },
            },
         },
         x: {
            grid: {
               tickLength: 2,
               // Only show vertical grid where a showlabel value is
               color: function (context: any) {
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
               callback: function (val: any) {
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

   return (
      <div className="bg-2 border-color rounded-md border px-4 py-3 text-center text-sm">
         <div className="inline-block px-2 font-bold">Display Stat: </div>
         {/* Stat Select Drop Down */}
         <select
            className="bg-1 border-color inline-block rounded-lg border"
            name="stats"
            value={graphStat}
            onChange={(event) => setGraphStat(event.target.value)}
         >
            {statsList.map((stat) => {
               return (
                  <option value={stat} key={stat}>
                     {stat}
                  </option>
               );
            })}
         </select>
         <Line options={options} data={graphdata} height={"auto"} />
      </div>
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
