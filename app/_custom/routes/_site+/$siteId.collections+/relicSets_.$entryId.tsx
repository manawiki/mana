import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";

import { settings } from "mana-config";
import type { RelicSet, Relic } from "payload/generated-custom-types";
import { H2 } from "~/_custom/components/custom";
import { RelicsInSet } from "~/_custom/components/relicSets/RelicsInSet";
import { SetEffect } from "~/_custom/components/relicSets/SetEffect";
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
   })) as RelicSet;

   //Feel free to query for more data here

   // ======================
   // Pull Skill Tree data for character
   // ======================
   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });

   const url = `https://${settings.siteId}-db.${settings.domain}/api/relics?limit=50&depth=4&where[relicset_id][equals]=${entryId}`;
   const relicRaw = await fetchWithCache(url);
   const relicData = relicRaw.docs as Relic[];

   return json({ entryDefault, relicData });
}

export default function CharacterEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   const { relicData } = useLoaderData<typeof loader>();

   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            <H2 text="Set Effect" />
            <SetEffect pageData={entryDefault} />
            {/* Relics in set should have a clickable information pop up (with first selected by default) */}
            {/* Need to collapse all of the same relic (which can have to 5 entries for each rarity) */}
            {/* Tabs contain info: */}
            {/* - Name + Image */}
            {/* - Possible Main and Sub stat distributions per level */}
            {/* - Additional Lore / etc. for that relic */}
            <RelicsInSet pageData={entryDefault} relicData={relicData} />

            {/* Relic set's flavor text */}
         </EntryContent>
      </EntryParent>
   );
}
