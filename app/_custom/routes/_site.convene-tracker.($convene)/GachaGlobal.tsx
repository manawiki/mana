import { useState } from "react";

import type { SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";

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

   // display five star percentage in shape of #.##%
   const fiveStarPercentage = summary.fiveStar
      ? ((summary.fiveStar / summary.total) * 100).toFixed(2)
      : 0;
   const fourStarPercentage = summary.fourStar
      ? ((summary.fourStar / summary.total) * 100).toFixed(2)
      : 0;

   // console.log({ dates, pities });

   return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-4">
         <div //two columns
            className="columns-2"
         >
            <div className="flex flex-col gap-y-1">
               <div className="flex gap-x-2">
                  <span>{summary.players.toLocaleString()}</span>
                  <span className="font-bold">Rovers logged</span>
               </div>
               <div className="flex gap-x-2">
                  <span>{summary.total.toLocaleString()}</span>
                  <span className="font-bold">Convenes rolled</span>
               </div>
               <div className="flex gap-x-2">
                  <span>{(summary.total * 160).toLocaleString()}</span>
                  <span className="font-bold">Gems used</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">5★ Convenes:</span>
                  <span>{summary.fiveStar}</span>
                  <span>({fiveStarPercentage}%)</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">4★ Convenes:</span>
                  <span>{summary.fourStar}</span>
                  <span>({fourStarPercentage}%)</span>
               </div>
            </div>
         </div>
         <FiveStars
            fiveStars={summary.fiveStars}
            resourceId={resourceId}
            setResourceId={setResourceId}
         />
         {dates && <DatesChart dates={dates} />}
         {pities && <PitiesChart pities={pities} />}
         {/* {pities && <LineandBarChart pities={pities} />} */}
      </div>
   );
}

function FiveStars({
   fiveStars,
   resourceId,
   setResourceId,
}: {
   fiveStars: Record<
      string,
      { pities: Record<string, number>; dates: Record<string, number> }
   >;
   resourceId: string | null;
   setResourceId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
   return (
      <div className="flex flex-col gap-y-1">
         <div className="relative inline-block text-center align-middle">
            <div className="relative m-1 w-full rounded-md border p-2 dark:border-gray-700">
               {Object.entries(fiveStars)
                  .map(([id, { pities }]) => (
                     <WarpFrame
                        id={id}
                        key={id}
                        pities={pities}
                        resourceId={resourceId}
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
   id,
   resourceId,
   setResourceId,
   pities,
}: {
   id: string;
   resourceId: string | null;
   setResourceId: React.Dispatch<React.SetStateAction<string | null>>;
   pities: Record<string, number>;
}) {
   const { weapons, resonators } = useRouteLoaderData<typeof loader>(
      "_custom/routes/_site.convene-tracker.($convene)/route",
   )!;

   // sum of pities
   const total = Object.values(pities).reduce((a, b) => a + b, 0);

   let entry =
      weapons?.find((w) => w.id == id) ??
      resonators?.find((w) => w.id == id) ??
      null;

   // console.log({ resourceId, id });

   return entry ? (
      <Button
         onClick={() => setResourceId((oldId) => (oldId === id ? null : id))}
         outline
         className={resourceId === id ? "bg-orange-500/10" : ""}
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
         <div className="relative mx-0.5 inline-block h-16 w-16 align-middle text-xs color-rarity-1">
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
