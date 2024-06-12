import { Link, useLoaderData } from "@remix-run/react";

import { Image } from "~/components/Image";

import { type GachaSummary } from "./getSummary";
import { PieChart } from "./Pie";
import type { loader, RollData } from "./route";

export function GachaSummary({ summary }: { summary: GachaSummary }) {
   return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-4">
         <FiveStarWarps summary={summary} />
         <div //two columns
            className="columns-2"
         >
            <div className="flex flex-col gap-y-2">
               <div className="flex flex-col gap-y-1">
                  <h2>{summary?.convene?.name}</h2>
               </div>
               <div className="flex flex-col gap-y-1">
                  <div className="flex gap-x-2">
                     <span className="font-bold">Total Convenes:</span>
                     <span>{summary.total}</span>
                  </div>
                  <div className="flex gap-x-2">
                     <span className="font-bold">Cost:</span>
                     <span>{summary.total * 160}</span>
                  </div>
                  <div className="flex gap-x-2">
                     <span className="font-bold">Resonators:</span>
                     <span>{summary.resonators}</span>
                  </div>
                  <div className="flex gap-x-2">
                     <span className="font-bold">Weapons:</span>
                     <span>{summary.weapons}</span>
                  </div>
                  <div className="flex gap-x-2">
                     <span className="font-bold">5* Convenes:</span>
                     <span>{summary.fiveStars.length}</span>
                  </div>
                  <div className="flex gap-x-2">
                     <span className="font-bold">4* Convenes:</span>
                     <span>{summary.fourStars.length}</span>
                  </div>
                  <div className="flex gap-x-2">
                     <span className="font-bold">Avg 5* Pity:</span>
                     <span>{summary.fiveStarPity}</span>
                  </div>
                  <div className="flex gap-x-2">
                     <span className="font-bold">Avg 4* Pity:</span>
                     <span>{summary.fourStarPity}</span>
                  </div>
               </div>
               <div className="flex flex-col gap-y-1">
                  <PieChart
                     data={{
                        "3*":
                           summary.total -
                           summary.fiveStars.length -
                           summary.fourStars.length,
                        "4*": summary.fourStars.length,
                        "5*": summary.fiveStars.length,
                     }}
                     title="Rarity"
                  />
               </div>
            </div>
         </div>
      </div>
   );
}

function FiveStarWarps({ summary }: { summary: GachaSummary }) {
   return (
      <div className="flex flex-col gap-y-1">
         <div className="relative inline-block text-center align-middle">
            <h2 className="font-bold">5* Convenes:</h2>
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
   const { weapons, resonators } = useLoaderData<typeof loader>();

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
               {roll.pity}
            </div>
         </div>
      </div>
   );
}
