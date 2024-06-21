import { useState } from "react";

import type { SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";

import { Image } from "~/components/Image";

import { addAandB } from "./addToGlobal";
import { DateFilters, DatesChart } from "./DatesChart";
import { PitiesChart } from "./PitiesChart";
import type { loader } from "./route";

type WuwaFiltersType = {
   startDate?: string;
   endDate?: string;
   resourceId?: string;
};

// we'll hardcode the version dates for now
const versions = [
   { version: "v1.0", startDate: "2024-05-22", endDate: "2024-06-28" },
   { version: "v1.1", startDate: "2024-06-28", endDate: "2024-07-25" },
];

export function GachaGlobal({
   summary,
   images,
}: {
   summary: SerializeFrom<typeof loader>["globalSummary"];
   images: any;
}) {
   const [filters, setFilters] = useState<WuwaFiltersType>({});

   if (!summary) return null;

   const { pities, resourceIds } = getPities({ summary, filters });

   // console.log({ pities, resourceIds });

   // display five star percentage in shape of #.##%
   const fiveStarPercentage = summary.fiveStar
      ? ((summary.fiveStar / summary.total) * 100).toFixed(2)
      : 0;
   const fourStarPercentage = summary.fourStar
      ? ((summary.fourStar / summary.total) * 100).toFixed(2)
      : 0;

   const fivePityAverage = getAveragePity(pities);

   const display_columns_1 = [
      {
         title: "Rovers logged",
         value: summary.players.toLocaleString(),
      },
      {
         title: "Convenes rolled",
         value: summary.total.toLocaleString(),
      },
      {
         title: "Astrite used",
         value: (summary.total * 160).toLocaleString(),
         icon: images?.find((a) => a.id == "3")?.icon?.url, // Astrite image id=3
      },
   ];
   const display_columns_2 = [
      {
         title: "5★ Convenes",
         value: summary.fiveStar + ` (${fiveStarPercentage}%)`,
      },
      {
         title: "4★ Convenes",
         value: summary.fourStar + ` (${fourStarPercentage}%)`,
      },
      {
         title: "Average 5★ Pity",
         value: (fivePityAverage ? fivePityAverage.toFixed(0) : "?") + " /80",
      },
   ];

   return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-4">
         <div //two columns
            className="laptop:grid laptop:grid-cols-2 gap-x-4 mb-3"
         >
            <InfoColumn disp_cols={display_columns_1} />
            <InfoColumn disp_cols={display_columns_2} />
         </div>
         <DatesChart dates={summary.dates} filters={filters} />
         <DateFilters
            versions={versions}
            filters={filters}
            setFilters={setFilters}
         />
         {pities && <PitiesChart pities={pities} />}
         <FiveStars
            resourceIds={resourceIds}
            resourceId={filters.resourceId}
            onClick={(e) =>
               setFilters({
                  ...filters,
                  resourceId:
                     e.currentTarget.value === filters.resourceId
                        ? undefined
                        : e.currentTarget.value,
               })
            }
         />
      </div>
   );
}

function getAveragePity(pities: Record<string, number>) {
   let pityTotal = 0;
   let pityCount = 0;

   Object.entries(pities).forEach(([pity, count]) => {
      pityTotal += parseInt(pity) * count;
      pityCount += count;
   });

   return pityTotal / pityCount;
}

const InfoColumn = ({ disp_cols }: any) => {
   return (
      <div
         className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
      >
         {disp_cols.map((col) => (
            <div
               className="px-3 py-1.5 justify-between flex items-center gap-2"
               key={`gacha_global_info_${col.title}`}
            >
               <span className="font-bold">{col.title}:</span>
               <span>
                  <div className="inline-flex align-middle">{col.value}</div>
                  {col.icon ? (
                     <div className="inline-flex h-full align-middle">
                        <Image
                           height={24}
                           className="object-contain"
                           url={col.icon}
                           options="height=24"
                           alt={"Icon"}
                        />
                     </div>
                  ) : null}
               </span>
            </div>
         ))}
      </div>
   );
};

function getPities({
   summary,
   filters,
}: {
   summary: SerializeFrom<typeof loader>["globalSummary"];
   filters: WuwaFiltersType;
}) {
   // console.log(filters, summary);
   let pities: Record<string, number> = {};
   let resourceIds: Record<string, number> = {};
   let { resourceId, startDate, endDate } = filters;

   if (!summary) return { pities, resourceIds };

   let start = startDate ? new Date(startDate) : null;
   let end = endDate ? new Date(endDate) : null;

   Object.entries(summary.fiveStars).forEach(([date, resources]) => {
      const currentDate = new Date(date);

      if (start && currentDate <= start) return;
      if (end && currentDate >= end) return;

      Object.entries(resources).forEach(([id, current]) => {
         if (!resourceId || resourceId === id)
            pities = addAandB(pities, current);

         // sum of pities
         let total = Object.values(current).reduce((a, b) => a + b, 0);
         resourceIds[id] = resourceIds[id] ? resourceIds[id] + total : total;
      });
   });

   return { pities, resourceIds };
}

function FiveStars({
   resourceIds,
   resourceId,
   onClick,
}: {
   resourceIds: Record<string, number>;
   resourceId?: string;
   onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
   return (
      <div className="flex flex-col gap-y-1">
         <div className="relative inline-block text-center align-middle">
            <div className="relative m-1 w-full rounded-md border p-2 dark:border-gray-700">
               {Object.entries(resourceIds)
                  .map(([id, total]) => (
                     <WarpFrame
                        id={id}
                        key={id}
                        total={total}
                        resourceId={resourceId}
                        onClick={onClick}
                     />
                  ))
                  .reverse()}
            </div>
         </div>
      </div>
   );
}

function WarpFrame({
   id,
   resourceId,
   onClick,
   total,
}: {
   id: string;
   resourceId?: string;
   onClick: React.MouseEventHandler<HTMLButtonElement>;
   total: number;
}) {
   const { weapons, resonators } = useRouteLoaderData<typeof loader>(
      "_custom/routes/_site.convene-tracker.($convene)/route",
   )!;

   let entry =
      weapons?.find((w) => w.id == id) ??
      resonators?.find((w) => w.id == id) ??
      null;

   // console.log({ resourceId, id });

   return entry ? (
      <button
         onClick={onClick}
         value={id}
         className={`relative isolate inline-flex items-center justify-center mx-0.5 gap-x-2 rounded-lg border text-base/6 font-semibold px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] tablet:px-[calc(theme(spacing.3)-1px)] tablet:py-[calc(theme(spacing[1.5]))] tablet:text-tablet/6 focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-[--btn-icon] [&>[data-slot=icon]]:tablet:my-1 [&>[data-slot=icon]]:tablet:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-[hover]:[--btn-icon:ButtonText] border-zinc-950/10 text-zinc-950 data-[active]:bg-zinc-950/[2.5%] data-[hover]:bg-zinc-950/[2.5%] dark:border-white/15 dark:text-white dark:[--btn-bg:transparent] dark:data-[active]:bg-white/5 dark:data-[hover]:bg-white/5 [--btn-icon:theme(colors.zinc.500)] data-[active]:[--btn-icon:theme(colors.zinc.700)] data-[hover]:[--btn-icon:theme(colors.zinc.700)] dark:data-[active]:[--btn-icon:theme(colors.zinc.400)] dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)] cursor-pointer ${
            resourceId === id && "bg-orange-500/10"
         }`}
      >
         <ItemFrame entry={entry} total={total} />
      </button>
   ) : null;
}

function ItemFrame({ entry, total }: any) {
   // mat holds material information
   return (
      <div
         className="relative inline-block text-center align-middle"
         key={entry?.id}
      >
         <div className="relative inline-block h-16 w-16 align-middle text-xs color-rarity-1">
            <Image
               url={entry?.icon?.url ?? "no_image_42df124128"}
               className={`object-contain color-rarity-${
                  `1`
                  // mat?.rarity?.display_number ?? "1"
               } material-frame`}
               alt={entry?.name}
            />
            <div className="absolute bottom-0 right-0 bg-white/50 text-black p-1 text-xs rounded-md ">
               x{total}
            </div>
         </div>
      </div>
   );
}
