import { Link, useRouteLoaderData } from "@remix-run/react";

import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

import { DatesChart } from "./DatesChart";
import { type GachaSummaryType } from "./getSummary";
import type { loader, RollData } from "./route";

export function average(arr: Array<number>) {
   return arr.reduce((acc, curr) => acc + curr ?? 0, 0) / arr.length;
}

export function GachaSummary({
   summary,
   images,
}: {
   summary: GachaSummaryType;
   images: any;
}) {
   // display five star percentage in shape of #.##%
   const fiveStarPercentage = (
      (summary.fiveStars.length / summary.total) *
      100
   ).toFixed(2);
   const fourStarPercentage = (
      (summary.fourStars.length / summary.total) *
      100
   ).toFixed(2);

   // set average pity rate as fiveStarPity, which is average of roll.pity in summary.fiveStars
   const fiveStarPity =
      Math.floor(average(summary.fiveStars.map((roll) => roll.pity!))) || 10;

   // set average pity rate as fourStarPity, which is average of roll.pity in summary.fourStars
   const fourStarPity =
      Math.floor(average(summary.fourStars.map((roll) => roll.pity!))) || 10;

   const display_columns_1 = [
      {
         title: "Convenes Total",
         value: summary.total.toLocaleString(),
      },
      {
         title: "Resonators",
         value: summary.resonators.toLocaleString(),
      },
      {
         title: "5★ Convenes",
         value:
            summary.fiveStars.length.toLocaleString() +
            ` (${fiveStarPercentage}%)`,
      },
      {
         title: "5★ Current Pity",
         value: summary.pity5,
      },
      {
         title: "5★ Avg Pity",
         value: fiveStarPity,
      },
   ];

   const display_columns_2 = [
      {
         title: "Currency",
         value: (summary.total * 160).toLocaleString(),
         icon: images?.find((a) => a.id == "3")?.icon?.url, // Astrite image id=3
      },
      {
         title: "Weapons",
         value: summary.weapons.toLocaleString(),
      },
      {
         title: "4★ Convenes",
         value:
            summary.fourStars.length.toLocaleString() +
            ` (${fourStarPercentage}%)`,
      },
      {
         title: "4★ Current Pity",
         value: summary.pity4,
      },
      {
         title: "4★ Avg Pity",
         value: fourStarPity,
      },
   ];

   return (
      <>
         <H2 text="Account Stats" />
         <div className="bg-white dark:bg-neutral-900 rounded-lg">
            <div //two columns
               className="laptop:grid laptop:grid-cols-2 gap-x-4 mb-3"
            >
               <InfoColumn disp_cols={display_columns_1} />
               <InfoColumn disp_cols={display_columns_2} />
            </div>

            <DatesChart dates={summary.dates} />
            <FiveStars summary={summary} />
         </div>
      </>
   );
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
               key={`gacha_summary_account_info_${col.title}`}
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

function FiveStars({ summary }: { summary: GachaSummaryType }) {
   return (
      <div className="flex flex-col gap-y-1">
         <H2 text="5★ Convenes" />
         <div className="relative inline-block text-center align-middle">
            <div className="relative m-1 w-full rounded-md border p-2 dark:border-gray-700">
               {summary.fiveStars
                  .map((roll, int) => <WarpFrame roll={roll} key={int} />)
                  .reverse()}
            </div>
         </div>
      </div>
   );
}

function WarpFrame({ roll }: { roll: RollData }) {
   const { weapons, resonators } = useRouteLoaderData<typeof loader>(
      "_custom/routes/_site.convene-tracker.($convene)/route",
   )!;

   let entry: any;

   switch (roll.resourceType) {
      case "Weapons":
         entry = weapons?.find((w) => w.id == roll.resourceId);
         return (
            <Link to={`/c/weapons/${entry?.slug}`}>
               <ItemFrame entry={entry} roll={roll} />
            </Link>
         );
      case "Resonators":
         entry = resonators?.find((w) => w.id == roll.resourceId);
         return (
            <Link to={`/c/resonators/${entry?.slug}`}>
               <ItemFrame entry={entry} roll={roll} />
            </Link>
         );
      default:
         return <div>Unknown Resource Type</div>;
   }
}

function ItemFrame({ entry, roll }: any) {
   // mat holds material information
   return (
      <div
         className="relative inline-block text-center align-middle"
         key={entry?.id}
      >
         <div className="relative mx-0.5 inline-block h-16 w-16 align-middle text-xs">
            <Image
               url={entry?.icon?.url ?? "/favicon.ico"}
               className={`object-contain color-rarity-${
                  `1`
                  // mat?.rarity?.display_number ?? "1"
               } material-frame`}
               alt={entry?.name}
            />
            <div className="absolute top-0 right-0 bg-zinc-200/50 dark:bg-zinc-100/50 text-black p-1 text-xs rounded-md">
               {roll.pity}
            </div>
         </div>
      </div>
   );
}
