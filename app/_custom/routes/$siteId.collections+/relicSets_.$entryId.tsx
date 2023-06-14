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

import { RelicsInSet } from "~/_custom/components/relicSets/RelicsInSet";
import { SetEffect } from "~/_custom/components/relicSets/SetEffect";

import { zx } from "zodix";
import { z } from "zod";
import { H2 } from "~/_custom/components/custom";

import type { Entry } from "payload/generated-types";
import type { RelicSet, Relic } from "payload/generated-custom-types";

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
   })) as RelicSet;

   //Feel free to query for more data here

   // ======================
   // Pull Skill Tree data for character
   // ======================
   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });

   const url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/relics?limit=50&depth=4&where[relicset_id][equals]=${entryId}`;
   const relicRaw = await (await fetch(url)).json();
   const relicData = relicRaw.docs as Relic[];

   return json({ entryDefault, defaultData, relicData });
}

export default function CharacterEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   const { defaultData } = useLoaderData<typeof loader>();
   const { relicData } = useLoaderData<typeof loader>();

   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            <H2 text="Set Effect" />
            <SetEffect pageData={defaultData} />
            {/* Relics in set should have a clickable information pop up (with first selected by default) */}
            {/* Need to collapse all of the same relic (which can have to 5 entries for each rarity) */}
            {/* Tabs contain info: */}
            {/* - Name + Image */}
            {/* - Possible Main and Sub stat distributions per level */}
            {/* - Additional Lore / etc. for that relic */}
            <RelicsInSet pageData={defaultData} relicData={relicData} />

            {/* Relic set's flavor text */}
         </EntryContent>
      </EntryParent>
   );
}
