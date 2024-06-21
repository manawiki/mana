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

type WuwaFiltersType = {
   startDate?: string;
   endDate?: string;
   resourceId?: string;
};

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
      x: {
         grid: {
            color: "rgba(200,200,200,0.5)",
         },
      },
      y: {
         ticks: { stepSize: 1 },
         suggestedMax: 10,
         min: 0,
         grid: {
            color: "rgba(200,200,200,0.5)",
         },
      },
   },
};

export function DatesChart({
   dates,
   filters,
}: {
   dates: Record<string, number>;
   filters?: WuwaFiltersType;
}) {
   const labels = generateDatesLabels({ dates, filters });

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

function generateDatesLabels({
   dates,
   filters,
}: {
   dates: Record<string, number>;
   filters?: WuwaFiltersType;
}) {
   // sort dates
   let dateArray = Object.keys(dates).sort();
   let startDate = filters?.startDate || dateArray[0]!;
   let endDate = filters?.endDate || dateArray[dateArray.length! - 1]!;

   console.log({ startDate, endDate, filters, dates });

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

export function DateFilters({
   versions,
   filters,
   setFilters,
}: {
   versions: { version: string; startDate: string; endDate: string }[];
   filters: WuwaFiltersType;
   setFilters: (filters: WuwaFiltersType) => void;
}) {
   return (
      <div className="">
         <input
            type="date"
            name="startDate"
            className="dark:text-zinc-100 px-1 dark:bg-dark400 bg-zinc-50  shadow-sm dark:shadow-zinc-800/70 border-zinc-200/70
      font-header  text-lg  rounded-l rounded-r-md overflow-hidden border shadow-zinc-50 dark:border-zinc-700 "
            value={filters.startDate}
            onChange={(e) =>
               setFilters({ ...filters, startDate: e.target.value })
            }
         />
         to
         <input
            type="date"
            name="endDate"
            className="dark:text-zinc-100 px-1 dark:bg-dark400 bg-zinc-50  shadow-sm dark:shadow-zinc-800/70 border-zinc-200/70
font-header  text-lg  rounded-l rounded-r-md overflow-hidden border shadow-zinc-50 dark:border-zinc-700 "
            value={filters.endDate}
            onChange={(e) =>
               setFilters({ ...filters, endDate: e.target.value })
            }
         />
         {versions.map((v) => (
            <button
               key={v.version}
               className="relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border text-base/6 font-semibold px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] tablet:px-[calc(theme(spacing.3)-1px)] tablet:py-[calc(theme(spacing[1.5]))] tablet:text-tablet/6 focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-[--btn-icon] [&>[data-slot=icon]]:tablet:my-1 [&>[data-slot=icon]]:tablet:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-[hover]:[--btn-icon:ButtonText] border-zinc-950/10 text-zinc-950 data-[active]:bg-zinc-950/[2.5%] data-[hover]:bg-zinc-950/[2.5%] dark:border-white/15 dark:text-white dark:[--btn-bg:transparent] dark:data-[active]:bg-white/5 dark:data-[hover]:bg-white/5 [--btn-icon:theme(colors.zinc.500)] data-[active]:[--btn-icon:theme(colors.zinc.700)] data-[hover]:[--btn-icon:theme(colors.zinc.700)] dark:data-[active]:[--btn-icon:theme(colors.zinc.400)] dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)] cursor-pointer"
               onClick={() =>
                  setFilters({
                     ...filters,
                     startDate: v.startDate,
                     endDate: v.endDate,
                  })
               }
            >
               {v.version}
            </button>
         ))}
      </div>
   );
}
