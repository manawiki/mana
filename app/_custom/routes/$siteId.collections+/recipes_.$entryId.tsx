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
import type { Recipes } from "payload/generated-types";

import { Header } from "~/_custom/components/recipes/Header";
import { Relics } from "~/_custom/components/recipes/Relics";
import { Ingredients } from "~/_custom/components/recipes/Ingredients";
import { SpecialMats } from "~/_custom/components/recipes/SpecialMats";
// import { Header } from "~/_custom/components/blessings/Header";

export { meta };

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params, request });
   const defaultData = (await getCustomEntryData({
      payload,
      params,
      request,
      depth: 3,
   })) as Recipes;

   //Feel free to query for more data here

   // ======================
   // Pull Skill Tree data for character
   // ======================
   // const url = new URL(request.url).pathname;
   // const cid = url.split("/")[4];

   // const skillTreeRaw = await payload.find({
   //    // @ts-ignore
   //    collection: `skillTree-lKJ16E5IhH`,
   //    where: {
   //       character: {
   //          equals: "character-" + cid,
   //       },
   //    },
   //    depth: 3,
   //    limit: 20,
   // });

   // const skillTreeData = skillTreeRaw.docs;

   // ======================
   // ======================

   return json({ entryDefault, defaultData });
}

export default function RecipeEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   const { defaultData } = useLoaderData<typeof loader>();
   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            {/* Image */}
            <Header pageData={defaultData} />

            {/* Relic Results */}
            <Relics pageData={defaultData} />

            {/* Ingredients */}
            <Ingredients pageData={defaultData} />

            {/* Special Ingredients */}
            <SpecialMats pageData={defaultData} />
         </EntryContent>
      </EntryParent>
   );
}
