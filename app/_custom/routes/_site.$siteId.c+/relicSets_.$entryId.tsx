import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { settings } from "mana-config";
import type { Relic } from "payload/generated-custom-types";
import { RelicsInSet } from "~/_custom/components/relicSets/RelicsInSet";
import { SetEffect } from "~/_custom/components/relicSets/SetEffect";
import { H2Default } from "~/components";
import { Entry } from "~/routes/_site+/$siteId.c_+/src/components";
import {
   customEntryMeta,
   fetchEntry,
} from "~/routes/_site+/$siteId.c_+/src/functions";
import { fetchWithCache } from "~/utils/cache.server";

export { customEntryMeta as meta };

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

   const url = `https://${settings.siteId}-db.${settings.domain}/api/relics?limit=50&depth=4&where[relicset_id][equals]=${entry.id}`;
   const relicRaw = await fetchWithCache(url);
   const relicData = relicRaw.docs as Relic[];

   return json({ entry, relicData });
}

export default function CharacterEntry() {
   const { entry } = useLoaderData<typeof loader>();
   const { relicData } = useLoaderData<typeof loader>();

   return (
      <Entry>
         <H2Default text="Set Effect" />
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
