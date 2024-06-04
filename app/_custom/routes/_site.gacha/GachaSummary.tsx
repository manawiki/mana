import { useLoaderData } from "@remix-run/react";

import { Image } from "~/components/Image";

import type { loader } from "./route";

export function GachaSummary() {
   const { gacha, banner } = useLoaderData<typeof loader>();

   const summary = getSummary();

   console.log(summary);

   return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-4">
         <h3 className="text-lg font-bold">Gacha Summary</h3>
         <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-1">
               <div className="flex gap-x-2">
                  <span className="font-bold">Gacha Name:</span>
                  <span>{banner.name}</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">Gacha Type:</span>
                  <span>{banner.type}</span>
               </div>
            </div>
            <div className="flex flex-col gap-y-1">
               <div className="flex gap-x-2">
                  <span className="font-bold">Total Pulls:</span>
                  <span>{summary.totalPulls}</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">Total 5* Pulls:</span>
                  <span>{summary.fiveStarPulls.length}</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">Total 4* Pulls:</span>
                  <span>{summary.fourStarPulls.length}</span>
               </div>
            </div>
         </div>
         <FiveStarWarps summary={summary} />
      </div>
   );
}

function FiveStarWarps({ summary }: { summary: Summary }) {
   const { gacha } = useLoaderData<typeof loader>();

   return (
      <div className="flex flex-col gap-y-1">
         <div className="relative inline-block text-center align-middle">
            <h2 className="font-bold">5* Warps:</h2>
            <div className="relative m-1 w-full rounded-md border p-2 dark:border-gray-700">
               {summary.fiveStarPulls.map((int) => (
                  <WarpFrame
                     roll={gacha?.data[int]}
                     number={gacha?.data.length - int}
                     key={gacha?.data.length - int}
                  />
               ))}
            </div>
         </div>
      </div>
   );
}

function WarpFrame({ roll, number }: { roll: RollData; number: number }) {
   const { weapons, resonators } = useLoaderData<typeof loader>();

   let entry: any;

   switch (roll.resourceType) {
      case "Weapons":
         entry = weapons?.find((w) => w.id == roll.resourceId);
         return <ItemFrame entry={entry} number={number} />;
      case "Resonators":
         entry = resonators?.find((w) => w.id == roll.resourceId);
         return <ItemFrame entry={entry} number={number} />;
      default:
         return <div>Unknown Resource Type</div>;
   }
}

function ItemFrame({ entry, number }: any) {
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
            <div className="absolute bottom-0 right-0 bg-white/50 text-black p-1 text-xs rounded-md ">
               #{number}
            </div>
         </div>
      </div>
   );
}

type RollData = {
   cardPoolType: string;
   resourceId: number;
   qualityLevel: number;
   resourceType: string;
   name: string;
   count: number;
   time: string;
};

type Summary = {
   banner: {
      name: string;
      type: string;
   };
   totalPulls: number;
   resonators: number;
   weapons: number;
   fiveStarPulls: number[];
   fourStarPulls: number[];
};

function getSummary() {
   const { gacha, banner, weapons, resonators } =
      useLoaderData<typeof loader>();

   const summary: Summary = {
      banner,
      totalPulls: gacha?.data.length ?? 0,
      resonators: 0,
      weapons: 0,
      fiveStarPulls: [],
      fourStarPulls: [],
   };

   gacha?.data.forEach((roll, int) => {
      switch (roll.resourceType) {
         case "Resonators":
            summary.resonators++;
            let resonator = resonators?.find((w) => w.id == roll.resourceId);

            if (resonator?.rarity?.id === "5") summary.fiveStarPulls.push(int);
            if (resonator?.rarity?.id === "4") summary.fourStarPulls.push(int);
            break;
         case "Weapons":
            summary.weapons++;

            let weapon = weapons?.find((w) => w.id == roll.resourceId);

            if (weapon?.rarity?.id === "5") summary.fiveStarPulls.push(int);
            if (weapon?.rarity?.id === "4") summary.fourStarPulls.push(int);

            break;
         default:
            console.log("Unknown Resource Type: ", JSON.stringify(roll));
            break;
      }
   });

   return summary;
}
