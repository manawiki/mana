import { useState } from "react";

import { Link, useRouteLoaderData } from "@remix-run/react";

import { Checkbox } from "~/components/Checkbox";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

import type { GachaSummaryType } from "./getSummary";
import type { loader, RollData } from "./route";

type GachaToggles = {
   fourStar: boolean;
   fiveStar: boolean;
   weapons: boolean;
   resonators: boolean;
};

export function GachaHistory({ summary }: { summary: GachaSummaryType }) {
   const [toggles, setToggles] = useState<GachaToggles>({
      fourStar: true,
      fiveStar: true,
      weapons: true,
      resonators: true,
   });

   const gacha = getGacha({ summary, toggles });

   return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-4">
         <H2 text="Gacha History" />
         <div className="grid grid-cols-4 gap-x-2">
            <Checkbox
               checked={toggles.fiveStar}
               onChange={() =>
                  setToggles((t) => ({ ...t, fiveStar: !t.fiveStar }))
               }
            >
               5★ Convenes
            </Checkbox>
            <Checkbox
               checked={toggles.fourStar}
               onChange={() =>
                  setToggles((t) => ({ ...t, fourStar: !t.fourStar }))
               }
            >
               4★ Convenes
            </Checkbox>
            <Checkbox
               checked={toggles.resonators}
               onChange={() =>
                  setToggles((t) => ({ ...t, resonators: !t.resonators }))
               }
            >
               Resonators
            </Checkbox>
            <Checkbox
               checked={toggles.weapons}
               onChange={() =>
                  setToggles((t) => ({ ...t, weapons: !t.weapons }))
               }
            >
               Weapons
            </Checkbox>
         </div>
         {gacha?.map((roll, int) => (
            <ResultFrame roll={roll} key={int} />
         ))}
      </div>
   );
}

// return a RollData[] array based on the toggles from summary
function getGacha({
   summary,
   toggles,
}: {
   summary: GachaSummaryType;
   toggles: GachaToggles;
}) {
   let gacha: RollData[] = [];
   if (toggles.fourStar) gacha = gacha.concat(summary.fourStars);
   if (toggles.fiveStar) gacha = gacha.concat(summary.fiveStars);
   if (!toggles.resonators)
      gacha = gacha.filter((r) => r.resourceType !== "Resonators");
   if (!toggles.weapons)
      gacha = gacha.filter((r) => r.resourceType !== "Weapons");

   // sort gacha by date, most recent first
   gacha.sort((a, b) => (a.time > b.time ? -1 : a.time < b.time ? 1 : 0));
   return gacha;
}

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
   const { weapons } = useRouteLoaderData<typeof loader>(
      "_custom/routes/_site.convene-tracker.($convene)/route",
   )!;

   const entry = weapons?.find((w) => w.id == roll.resourceId);

   return (
      <Link to={`/c/weapons/${entry?.slug ?? entry?.id ?? ""}`}>
         <div
            className={` m-1 w-full flex rounded-md border p-2 items-center dark:border-gray-700 ${customColor(
               roll.qualityLevel,
            )}`}
         >
            {entry && <ItemFrame entry={entry} />}
            <div className="mx-1">{roll.qualityLevel}★ </div>
            <div className="mx-1 w-full">{roll.name}</div>
            <div className="mx-1 text-right">{roll.time}</div>
            <div className="mx-1 text-center">
               <div className="text-xs opacity-60 right-0">Pity</div>
               {roll.pity}
            </div>
         </div>
      </Link>
   );
}

function ResonatorFrame({ roll }: { roll: RollData }) {
   const { resonators } = useRouteLoaderData<typeof loader>(
      "_custom/routes/_site.convene-tracker.($convene)/route",
   )!;

   const entry = resonators?.find((r) => r.id == roll.resourceId);
   return (
      <Link to={`/c/resonators/${entry?.slug ?? entry?.id ?? ""}`}>
         <div
            className={` m-1 w-full flex rounded-md items-center border p-2 dark:border-gray-700 ${customColor(
               roll.qualityLevel,
            )}`}
         >
            {entry && <ItemFrame entry={entry} />}
            <div className="mx-1">{roll.qualityLevel}★ </div>
            <div className="mx-1 w-full">{roll.name}</div>
            <div className="mx-1 text-right">{roll.time}</div>
            <div className="mx-1 text-center">
               <div className="text-xs opacity-60 right-0">Pity</div>
               {roll.pity}
            </div>
         </div>
      </Link>
   );
}

function customColor(rarity?: number) {
   switch (rarity) {
      case 5:
         return "bg-orange-500 bg-opacity-10 font-bold";
      case 4:
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
