import React from "react";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
);

export function PitiesChart({ pities }: { pities: Record<string, number> }) {
   // pities always from 1 to 80
   const labels = Array.from({ length: 80 }, (_, i) => i + 1).map(String);

   // labels might be missing dates, fill in the gaps
   // [2021-01-01, 2021-01-03] => [2021-01-01, 2021-01-02, 2021-01-03]

   const data = {
      labels,
      datasets: [
         {
            label: "Pity Count",
            data: labels.map((pity) => pities[pity] || 0),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
         },
      ],
   };

   return <Bar data={data} />;
}
