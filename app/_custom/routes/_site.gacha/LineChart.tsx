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
import { Line } from "react-chartjs-2";

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
);

export function LineChart({ dates }: { dates: Record<string, number> }) {
   const data = {
      labels: Object.keys(dates),
      datasets: [
         {
            label: "Convenes by Day",
            data: Object.values(dates),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
         },
      ],
   };

   return <Line data={data} />;
}
