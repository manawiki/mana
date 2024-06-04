import { Link, useLoaderData } from "@remix-run/react";

import { Image } from "~/components/Image";

import type { loader } from "./route";

export function GachaHistory() {
   const { gacha } = useLoaderData<typeof loader>();

   //gacha type data: {
   //     cardPoolType: string;
   //     resourceId: number;
   //     qualityLevel: number;
   //     resourceType: string;
   //     name: string;
   //     count: number;
   //     time: string;
   // }[];

   const total = gacha?.data.length!;

   return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-4">
         <h3 className="text-lg font-bold">Gacha History</h3>
         {gacha?.data.map((roll, int) => (
            <ResultFrame roll={roll} key={total - int} number={total - int} />
         ))}
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

function ResultFrame({ roll, number }: { roll: RollData; number: number }) {
   switch (roll.resourceType) {
      case "Weapons":
         return <WeaponFrame roll={roll} number={number} />;
      case "Resonators":
         return <ResonatorFrame roll={roll} number={number} />;
      default:
         return <div>Unknown Resource Type</div>;
   }
}

function WeaponFrame({ roll, number }: { roll: RollData; number: number }) {
   const { weapons } = useLoaderData<typeof loader>();

   const weapon = weapons?.find((w) => w.id == roll.resourceId);
   return (
      <Link to={`/c/weapons/${weapon?.slug!}`}>
         <div
            className={`relative m-1 w-full rounded-md border p-2 dark:border-gray-700 ${customColor(
               weapon?.rarity?.id,
            )}`}
         >
            <ItemFrame entry={weapon} />
            <div className="mx-1 inline-block align-middle">
               {weapon?.rarity?.id}*
            </div>
            <div className="mx-1 inline-block align-middle">{weapon?.name}</div>
            <div className="mx-1 inline-block align-right">#{number}</div>
         </div>
      </Link>
   );
}

function ResonatorFrame({ roll, number }: { roll: RollData; number: number }) {
   const { resonators } = useLoaderData<typeof loader>();
   const resonator = resonators?.find((r) => r.id == roll.resourceId);
   return (
      <Link to={`/c/resonators/${resonator?.slug!}`}>
         <div
            className={`flex m-1 w-full rounded-md border p-2 dark:border-gray-700 ${customColor(
               resonator?.rarity?.id,
            )}`}
         >
            <ItemFrame entry={resonator} />
            <div className="mx-1 inline-block align-middle">
               {resonator?.rarity?.id}*
            </div>
            <div className="mx-1 inline-block align-middle">
               {resonator?.name}
            </div>
            <div className="mx-1 inline-block align-right">#{number}</div>
         </div>
      </Link>
   );
}

function customColor(rarity?: string) {
   switch (rarity) {
      case "5":
         return "bg-orange-500 bg-opacity-10 font-bold";
      case "4":
         return "bg-purple-500 bg-opacity-10 font-bold";
      default:
         return "";
   }
}

function ItemFrame({ entry, type }: any) {
   // mat holds material information

   return (
      <div
         className="relative inline-block text-center align-middle"
         key={entry?.id}
      >
         <div className="relative mx-0.5 inline-block h-11 w-11 align-middle text-xs">
            <Image
               url={entry?.icon?.url ?? "no_image_42df124128"}
               className={`object-contain color-rarity-${
                  `1`
                  // mat?.rarity?.display_number ?? "1"
               } material-frame`}
               alt={entry?.name}
            />
         </div>
      </div>
   );
}
