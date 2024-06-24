import {
   Chart as ChartJS,
   LinearScale,
   CategoryScale,
   BarElement,
   PointElement,
   LineElement,
   Legend,
   Tooltip,
   LineController,
   BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
   LinearScale,
   CategoryScale,
   BarElement,
   PointElement,
   LineElement,
   Legend,
   Tooltip,
   LineController,
   BarController,
);

// pities always from 1 to 80
const labels = Array.from({ length: 80 }, (_, i) => i + 1).map(String);

const options = {
   responsive: true,
   interaction: {
      mode: "index" as const,
      intersect: false,
   },
   stacked: false,
   plugins: {
      title: {
         display: true,
         text: "Pity Tracker",
      },
   },
   scales: {
      x: {
         grid: {
            color: "rgba(200,200,200,0.5)",
         },
      },
      y: {
         type: "linear" as const,
         display: true,
         position: "left" as const,
         ticks: {
            callback: function (value: number) {
               return value + "%"; // append a "%" sign to the value
            },
         },
         grid: {
            color: "rgba(200,200,200,0.5)",
         },
      },
      y1: {
         type: "linear" as const,
         display: true,
         position: "right" as const,
         grid: {
            drawOnChartArea: false,
         },
         ticks: {
            stepSize: 1, // increments of 1 for each tick
         },
         min: 0,
         suggestedMax: 10,
      },
   },
};

export function PitiesChart({ pities }: { pities: Record<string, number> }) {
   // labels might be missing dates, fill in the gaps
   // [2021-01-01, 2021-01-03] => [2021-01-01, 2021-01-02, 2021-01-03]

   const barData = labels.map((pity) => pities[pity] || 0);

   const total = Object.values(pities).reduce((acc, cur) => acc + cur, 0);

   // line chart is a value from 0 to 100% of the total
   const lineData = [Math.round((barData[0]! / total) * 100)] as number[];

   barData.reduce((acc, cur) => {
      acc += cur;
      lineData.push(Math.round((acc / total) * 100));
      return acc;
   });

   // console.log({ barData, lineData });

   const data = {
      labels,
      datasets: [
         {
            type: "line" as const,
            label: "Chance%",
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 2,
            fill: false,
            data: lineData,
            yAxisID: "y",
            pointRadius: 1,
         },
         {
            type: "bar" as const,
            label: "5* Convene",
            backgroundColor: "yellow",
            data: barData,
            borderWidth: 2,
            yAxisID: "y1",
         },
      ],
   };

   return <Chart type="bar" options={options} data={data} />;
}
