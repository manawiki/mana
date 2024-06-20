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

const options = {
   responsive: true,
   scales: {
      y: {
         ticks: { stepSize: 1 },
         suggestedMax: 10,
         min: 0,
      },
   },
};

export function DatesChart({ dates }: { dates: Record<string, number> }) {
   const labels = generateDatesLabels(dates);

   // labels might be missing dates, fill in the gaps
   // [2021-01-01, 2021-01-03] => [2021-01-01, 2021-01-02, 2021-01-03]

   const data = {
      labels,
      datasets: [
         {
            label: "Convenes by Day",
            data: labels.map((date) => dates[date] || 0),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
         },
      ],
   };

   return <Line data={data} options={options} />;
}

function generateDatesLabels(dates: Record<string, number>) {
   let dateArray = Object.keys(dates);
   let startDate = dateArray[0]!;
   let endDate = dateArray[dateArray.length! - 1]!;

   try {
      let start = new Date(startDate);
      let end = new Date(endDate);

      // if (start === end) end.setDate(start.getDate() + 14);

      dateArray = [];

      for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
         dateArray.push(dt.toISOString().split("T")[0]!);
      }

      return dateArray;
   } catch (error) {
      console.log(error);
      return dateArray;
   }
}
