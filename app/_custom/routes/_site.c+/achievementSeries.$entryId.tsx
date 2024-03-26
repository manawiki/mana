import { useState, useEffect } from "react";

import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { settings } from "mana-config";
import type { Achievement as AchievementType } from "payload/generated-custom-types";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";
import { fetchWithCache } from "~/utils/cache.server";

export { entryMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await fetchEntry({
      payload,
      params,
      request,
      user,
   });

   // ======================
   // Pull Achievement list for this Series
   // ======================

   const url = `http://localhost:4000/api/achievements?limit=100&depth=3&where[achievement_series][equals]=${entry?.id}`;
   const achievementRaw = await fetchWithCache(url);
   const achievementData = achievementRaw.docs as AchievementType[];

   // Get the image URL reference for the Stellar Jade icon lol.
   const sjurl = `http://localhost:4000/api/images/ItemIcon_900001`;
   const sjRaw = await fetchWithCache(sjurl);
   const stellarJadeURL = sjRaw?.url;

   return json({ entry, achievementData, stellarJadeURL });
}

export default function CharacterEntry() {
   const { achievementData, stellarJadeURL } = useLoaderData<typeof loader>();

   return (
      <Entry>
         <div className="space-y-1 pb-3 pl-1">
            <div className="font-bold">
               Track Achievement Progress using the Checkboxes below!
            </div>
            <div className="text-1 text-sm">
               Requires LocalStorage to be enabled
            </div>
         </div>
         <Achievements
            pageData={achievementData}
            stellarJadeURL={stellarJadeURL}
         />
      </Entry>
   );
}

function Achievements({
   pageData,
   stellarJadeURL,
}: {
   pageData: AchievementType[];
   stellarJadeURL: string;
}) {
   return (
      <section className="divide-color-sub shadow-1 bg-2-sub border-color-sub divide-y overflow-hidden rounded-lg border shadow-sm">
         {pageData?.map((a: any) => (
            <Achievement
               a={a}
               key={a?.data_key}
               stellarJadeURL={stellarJadeURL}
            />
         ))}
      </section>
   );
}

function Achievement({
   a,
   stellarJadeURL,
}: {
   a: AchievementType;
   stellarJadeURL: string;
}) {
   const [checked, setChecked] = useState(false);

   useEffect(() => {
      //We're saving achievement to local stage, so read initial value from local state
      setChecked(
         JSON.parse(
            localStorage.getItem("HSR_manawiki_achievement-" + a?.data_key) ??
               "false",
         ),
      );
   }, [a?.data_key]);

   return (
      <>
         <div className="flex items-start justify-between gap-4 p-3 pl-3">
            {/* Checkbox section */}
            <div
               className={`shadow-1 flex h-8 w-8 flex-none cursor-pointer items-center
                  justify-center rounded-lg border shadow shadow-1 bg-white dark:bg-dark500 hover:bg-green-50 dark:hover:bg-dark400 ${
                     checked
                        ? "border-green-300 dark:border-green-800"
                        : "border-zinc-200 dark:border-zinc-500"
                  }`}
               onClick={() => {
                  localStorage.setItem(
                     "HSR_manawiki_achievement-" + a?.data_key,
                     JSON.stringify(!checked),
                  );

                  setChecked(!checked);
               }}
            >
               {checked ? (
                  <Icon name="check" className="text-green-500" size={16} />
               ) : (
                  <></>
               )}
            </div>

            {/* Achievement Description section */}
            <div className="flex-grow space-y-0.5 text-sm">
               <div className="font-bold">{a.name}</div>
               <div
                  className="text-1"
                  dangerouslySetInnerHTML={{ __html: a?.description ?? "" }}
               ></div>
            </div>

            {/* Achievement Reward section */}
            {/* TODO(dim): This pattern works for now but should use the Quest reward instead! */}
            <div className="flex items-center gap-1">
               <JadeReward
                  qty={
                     a.rarity === "Mid"
                        ? 10
                        : a.rarity === "Low"
                          ? 5
                          : a.rarity === "High"
                            ? 20
                            : 0
                  }
                  stellarJadeURL={stellarJadeURL}
               />
            </div>
         </div>
      </>
   );
}

function JadeReward({
   qty,
   stellarJadeURL,
}: {
   qty: number;
   stellarJadeURL: string;
}) {
   return (
      <div className="relative inline-block text-center" key="900001">
         <Link to="/c/materials/900001">
            <div className="relative h-8 w-8">
               <Image
                  url={stellarJadeURL}
                  className={`color-rarity-5 material-frame object-contain`}
                  alt="Stellar Jade"
                  loading="lazy"
                  width="32"
                  height="23"
               />
            </div>
            <div className="relative w-full rounded-b-sm border-b border-gray-700 bg-bg1Dark align-middle text-xs text-white">
               {qty}
            </div>
         </Link>
      </div>
   );
}
