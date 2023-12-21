import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { Relic } from "payload/generated-custom-types";
import { RelicsInSet } from "~/_custom/components/relicSets/RelicsInSet";
import { SetEffect } from "~/_custom/components/relicSets/SetEffect";
import { H2 } from "~/components/Headers";
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
      rest: {
         depth: 2,
      },
   });

   //Feel free to query for more data here

   // ======================
   // Pull Skill Tree data for character
   // ======================

   const url = `https://starrail-db.mana.wiki/api/relics?limit=50&depth=4&where[relicset_id][equals]=${entry.id}`;
   const relicRaw = await fetchWithCache(url);
   const relicData = relicRaw.docs as Relic[];

   return json({ entry, relicData });
}

export default function CharacterEntry() {
   const { entry } = useLoaderData<typeof loader>();
   const { relicData } = useLoaderData<typeof loader>();

   return (
      <Entry>
         <H2 text="Set Effect" />
         <SetEffect pageData={entry.data} />
         {/* Relics in set should have a clickable information pop up (with first selected by default) */}
         {/* Need to collapse all of the same relic (which can have to 5 entries for each rarity) */}
         {/* Tabs contain info: */}
         {/* - Name + Image */}
         {/* - Possible Main and Sub stat distributions per level */}
         {/* - Additional Lore / etc. for that relic */}
         <RelicsInSet pageData={entry.data} relicData={relicData} />

         {/* Relic set's flavor text */}
      </Entry>
   );
}
