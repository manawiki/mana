import { useLoaderData } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import {
   EntryParent,
   EntryHeader,
   getDefaultEntryData,
   meta,
   EntryContent,
   getCustomEntryData,
} from "~/modules/collections";
import type {
   Achievement,
   AchievementSery,
} from "payload/generated-custom-types";

import { Achievements } from "~/_custom/components/achievementSeries/Achievements";
import { Header } from "~/_custom/components/achievementSeries/Header";

import { zx } from "zodix";
import { z } from "zod";
import type { Entry } from "payload/generated-types";

export { meta };

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   const entryDefault = (await getDefaultEntryData({
      payload,
      params,
      request,
   })) as Entry;
   const defaultData = (await getCustomEntryData({
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

   const url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/achievements?limit=100&depth=3&where[achievement_series][equals]=${entryId}`;
   const achievementRaw = await (await fetch(url)).json();
   const achievementData = achievementRaw.docs as Achievement[];

   // ======================
   // ======================

   return json({ entryDefault, defaultData, achievementData });
}

export default function CharacterEntry() {
   const { entryDefault, defaultData, achievementData } =
      useLoaderData<typeof loader>();

   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            {/* Header */}
            <Header pageData={defaultData} />

            {/* Achievement List with Checkbox */}
            <Achievements pageData={achievementData} />
         </EntryContent>
      </EntryParent>
   );
}
