import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";

import { settings } from "mana-config";
import type {
   Achievement,
   AchievementSery,
} from "payload/generated-custom-types";
import { Achievements } from "~/_custom/components/achievementSeries/Achievements";
import { Header } from "~/_custom/components/achievementSeries/Header";
import {
   EntryParent,
   EntryHeader,
   meta,
   EntryContent,
   getCustomEntryData,
} from "~/modules/collections";
import { fetchWithCache } from "~/utils/cache.server";

export { meta };

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   const entryDefault = (await getCustomEntryData({
      payload,
      params,
      request,
      depth: 3,
   })) as AchievementSery;

   //Feel free to query for more data here

   // ======================
   // Pull Achievement list for this Series
   // ======================
   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });

   const url = `https://${settings.siteId}-db.${settings.domain}/api/achievements?limit=100&depth=3&where[achievement_series][equals]=${entryId}`;
   const achievementRaw = await fetchWithCache(url);
   const achievementData = achievementRaw.docs as Achievement[];

   // Get the image URL reference for the Stellar Jade icon lol.
   const sjurl = `https://${settings.siteId}-db.${settings.domain}/api/images/ItemIcon_900001`;
   const sjRaw = await fetchWithCache(sjurl);
   const stellarJadeURL = sjRaw?.url;

   // ======================
   // ======================

   return json({ entryDefault, achievementData, stellarJadeURL });
}

export default function CharacterEntry() {
   const { entryDefault, achievementData, stellarJadeURL } =
      useLoaderData<typeof loader>();

   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            {/* Header */}
            <Header pageData={entryDefault} />

            {/* Achievement List with Checkbox */}
            <Achievements
               pageData={achievementData}
               stellarJadeURL={stellarJadeURL}
            />
         </EntryContent>
      </EntryParent>
   );
}
