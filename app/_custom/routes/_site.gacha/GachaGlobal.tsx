import { useState } from "react";

import type { SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Button } from "~/components/Button";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

import { DatesChart } from "./DatesChart";
import { PitiesChart } from "./PitiesChart";
import type { loader } from "./route";

export function GachaGlobal({
   summary,
}: {
   summary: SerializeFrom<typeof loader>["globalSummary"];
}) {
   const [resourceId, setResourceId] = useState<string | null>(null);

   if (!summary) return null;

   const pities = resourceId
      ? summary.fiveStars[resourceId]?.pities
      : summary.pities;

   const dates = resourceId
      ? summary.fiveStars[resourceId]?.dates
      : summary.dates;

   // console.log({ dates, pities });

   return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-4">
         <div className="flex flex-col gap-y-1">
            <H2 text={"Global Stats"} />
         </div>
         <div //two columns
            className="columns-2"
         >
            <div className="flex flex-col gap-y-1">
               <div className="flex gap-x-2">
                  <span className="font-bold">Convenes Total:</span>
                  <span>{summary.total}</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">Worth:</span>
                  <span>{summary.total * 160}</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">Players:</span>
                  <span>{summary.players}</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">Resonators:</span>
                  <span>{summary.resonators}</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">Weapons:</span>
                  <span>{summary.weapons}</span>
               </div>
            </div>
         </div>
         <FiveStars
            fiveStars={summary.fiveStars}
            setResourceId={setResourceId}
         />
         {dates && <DatesChart dates={dates} />}
         {pities && <PitiesChart pities={pities} />}
      </div>
   );
}

function FiveStars({
   fiveStars,
   setResourceId,
}: {
   fiveStars: Record<
      string,
      { pities: Record<string, number>; dates: Record<string, number> }
   >;
   setResourceId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
   return (
      <div className="flex flex-col gap-y-1">
         <div className="relative inline-block text-center align-middle">
            <div className="relative m-1 w-full rounded-md border p-2 dark:border-gray-700">
               {Object.entries(fiveStars)
                  .map(([resourceId, { pities, dates }]) => (
                     <WarpFrame
                        resourceId={resourceId}
                        key={resourceId}
                        pities={pities}
                        setResourceId={setResourceId}
                     />
                  ))
                  .reverse()}
            </div>
         </div>
      </div>
   );
}

function WarpFrame({
   resourceId,
   setResourceId,
   pities,
}: {
   resourceId: string;
   setResourceId: React.Dispatch<React.SetStateAction<string | null>>;
   pities: Record<string, number>;
}) {
   const { weapons, resonators } = useLoaderData<typeof loader>();

   // sum of pities
   const total = Object.values(pities).reduce((a, b) => a + b, 0);

   let entry =
      weapons?.find((w) => w.id == resourceId) ??
      resonators?.find((w) => w.id == resourceId) ??
      null;

   return entry ? (
      <Button
         onClick={() =>
            setResourceId((oldId) => (oldId === resourceId ? null : resourceId))
         }
         outline
      >
         <ItemFrame entry={entry} total={total} />
      </Button>
   ) : null;
}

function ItemFrame({ entry, total }: any) {
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
               {total}
            </div>
         </div>
      </div>
   );
}
