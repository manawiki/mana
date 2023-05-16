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
import type { Enemies } from "payload/generated-types";

import { Stats } from "~/_custom/components/enemies/Stats";
import { Resistances } from "~/_custom/components/enemies/Resistances";
import { Skills } from "~/_custom/components/enemies/Skills";
import { Drops } from "~/_custom/components/enemies/Drops";
import { AdditionalData } from "~/_custom/components/enemies/AdditionalData";

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
   })) as Enemies;

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

export default function CharacterEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   const { defaultData } = useLoaderData<typeof loader>();

   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            {/* Image */}
            <Stats pageData={defaultData} />

            {/* Skill List */}
            <h2>Skills</h2>
            <Skills pageData={defaultData} />

            {/* Resistances */}
            <h2>Resistances</h2>
            <Resistances pageData={defaultData} />

            {/* Drop Rewards */}
            <h2>Drops</h2>
            <Drops pageData={defaultData} />

            {/* Additional Data */}
            <h2>Additional Data</h2>
            <AdditionalData pageData={defaultData} />
         </EntryContent>
      </EntryParent>
   );
}
