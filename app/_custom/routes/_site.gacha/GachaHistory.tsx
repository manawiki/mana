import { useLoaderData } from "@remix-run/react";

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

   return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-4">
         <h3 className="text-lg font-bold">Gacha History</h3>
         {gacha?.data.map((roll, int) => <ResultFrame roll={roll} key={int} />)}
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

function ResultFrame({ roll }: { roll: RollData }) {
   switch (roll.resourceType) {
      case "Weapons":
         return <WeaponFrame roll={roll} />;
      case "Resonators":
         return <ResonatorFrame roll={roll} />;
      default:
         return <div>Unknown Resource Type</div>;
   }
}

function WeaponFrame({ roll }: { roll: RollData }) {
   const { weapons } = useLoaderData<typeof loader>();

   const weapon = weapons?.find((w) => w.id == roll.resourceId);
   return (
      <div className="flex gap-x-2">
         <span className="font-bold">Weapon:</span>
         {weapon && <ItemFrame entry={weapon} />}
      </div>
   );
}

function ResonatorFrame({ roll }: { roll: RollData }) {
   const { resonators } = useLoaderData<typeof loader>();
   const resonator = resonators?.find((r) => r.id == roll.resourceId);
   return (
      <div className="flex gap-x-2">
         <span className="font-bold">Resonator:</span>
         {resonator && <ItemFrame entry={resonator} />}
      </div>
   );
}

// Roll Result Frame
// const ResultFrame = ({ entry, type }: any) => {
//    var customcolor = "";
//    switch (entry?.rarity?.display_number) {
//       case "5":
//          customcolor = "bg-orange-500 bg-opacity-10 font-bold";
//          break;
//       case "4":
//          customcolor = "bg-purple-500 bg-opacity-10 font-bold";
//          break;
//       default:
//    }
//    return (
//       <>
//          <a href={`/c/${type}/${entry?.id}`}>
//             <div
//                className={`relative m-1 w-full rounded-md border p-2 dark:border-gray-700 ${customcolor}`}
//             >
//                <ItemFrame entry={entry} type={type} />
//                <div className="mx-1 inline-block align-middle">
//                   {entry?.rarity?.display_number}*
//                </div>
//                <div className="mx-1 inline-block align-middle">
//                   {entry?.name}
//                </div>
//             </div>
//          </a>
//       </>
//    );
// };

// // ====================================
// // 0a) GENERIC: Item Icon Frame
// // ------------------------------------
// // * PROPS (Arguments) accepted:
// // - entry: Any that contains a rarity, icon, and name field.
// // - type: string denoting type of item for link
// // ====================================
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
