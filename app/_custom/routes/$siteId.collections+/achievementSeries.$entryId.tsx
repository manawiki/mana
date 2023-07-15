import { useLoaderData } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import {
   EntryParent,
   EntryHeader,
   meta,
   EntryContent,
   getCustomEntryData,
} from "~/modules/collections";

import { Achievements } from "~/_custom/components/achievementSeries/Achievements";
import { Header } from "~/_custom/components/achievementSeries/Header";

import { zx } from "zodix";
import { z } from "zod";

import type {
   Achievement,
   AchievementSery,
} from "payload/generated-custom-types";
import { fetchWithCache } from "~/utils/cache.server";
import { settings } from "mana-config";

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

   // ======================
   // ======================

   return json({ entryDefault, achievementData });
}

export default function CharacterEntry() {
   const { entryDefault, achievementData } = useLoaderData<typeof loader>();

   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            {/* Header */}
            <Header pageData={entryDefault} />

            {/* Achievement List with Checkbox */}
            <Achievements pageData={achievementData} />
         </EntryContent>
      </EntryParent>
   );
}
