import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { Recipe } from "payload/generated-custom-types";
import { Header } from "~/_custom/components/recipes/Header";
import { Ingredients } from "~/_custom/components/recipes/Ingredients";
import { Relics } from "~/_custom/components/recipes/Relics";
import { SpecialMats } from "~/_custom/components/recipes/SpecialMats";
import {
   EntryParent,
   EntryHeader,
   meta,
   EntryContent,
   getCustomEntryData,
} from "~/modules/collections";

// import { Header } from "~/_custom/components/blessings/Header";

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
   })) as Recipe;

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

   return json({ entryDefault });
}

export default function RecipeEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            {/* Image */}
            <Header pageData={entryDefault} />

            {/* Relic Results */}
            <Relics pageData={entryDefault} />

            {/* Ingredients */}
            <Ingredients pageData={entryDefault} />

            {/* Special Ingredients */}
            <SpecialMats pageData={entryDefault} />
         </EntryContent>
      </EntryParent>
   );
}
