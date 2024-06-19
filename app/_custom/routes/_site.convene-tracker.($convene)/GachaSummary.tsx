import { Link, useRouteLoaderData } from "@remix-run/react";

import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

import { DatesChart } from "./DatesChart";
import { type GachaSummaryType } from "./getSummary";
import type { loader, RollData } from "./route";

export function average(arr: Array<number>) {
   return arr.reduce((acc, curr) => acc + curr ?? 0, 0) / arr.length;
}

export function GachaSummary({ summary }: { summary: GachaSummaryType }) {
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

   return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-4">
         <div //two columns
            className="columns-2"
         >
            <div className="flex flex-col gap-y-1">
               <div className="flex gap-x-2">
                  <span className="font-bold">Convenes Total:</span>
                  <span>{summary.total}</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">Resonators:</span>
                  <span>{summary.resonators}</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">Worth:</span>
                  <span>{summary.total * 160}</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">Weapons:</span>
                  <span>{summary.weapons}</span>
               </div>
            </div>
         </div>
         <div //two columns
            className="columns-2"
         >
            <div className="flex flex-col gap-y-1">
               <div className="flex gap-x-2">
                  <span className="font-bold">5★ Convenes:</span>
                  <span>{summary.fiveStars.length}</span>
                  <span>({fiveStarPercentage}%)</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">5★ Current Pity:</span>
                  <span>{summary.pity5}</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">5★ Avg Pity:</span>
                  <span>{fiveStarPity}</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">4★ Convenes:</span>
                  <span>{summary.fourStars.length}</span>
                  <span>({fourStarPercentage}%)</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">4★ Current Pity:</span>
                  <span>{summary.pity4}</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">4★ Avg Pity:</span>
                  <span>{fourStarPity}</span>
               </div>
            </div>
         </div>
         <DatesChart dates={summary.dates} />
         <FiveStars summary={summary} />
      </div>
   );
}

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
               url={entry?.icon?.url ?? "no_image_42df124128"}
               className={`object-contain color-rarity-${
                  `1`
                  // mat?.rarity?.display_number ?? "1"
               } material-frame`}
               alt={entry?.name}
            />
            <div className="absolute top-0 right-0 bg-white/50 text-black p-1 text-xs rounded-md ">
               #{roll.pity}
            </div>
         </div>
      </div>
   );
}
