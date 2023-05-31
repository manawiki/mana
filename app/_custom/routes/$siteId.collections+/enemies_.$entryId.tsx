import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
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

import { Selector } from "~/_custom/components/enemies/Selector";
import { Stats } from "~/_custom/components/enemies/Stats";
import { Resistances } from "~/_custom/components/enemies/Resistances";
import { Skills } from "~/_custom/components/enemies/Skills";
import { Drops } from "~/_custom/components/enemies/Drops";
import { AdditionalData } from "~/_custom/components/enemies/AdditionalData";

import { H2 } from "~/_custom/components/custom";

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

   const [version, setVersion] = useState(0);

   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            {/* Selector for Enemy Version */}
            <Selector
               pageData={defaultData}
               version={version}
               setVersion={setVersion}
            />

            {/* Image */}
            <Stats pageData={defaultData} version={version} />

            {/* Skill List */}
            <H2 text="Skills" />
            <Skills pageData={defaultData} version={version} />

            {/* Resistances */}
            <H2 text="Resistances" />
            <Resistances pageData={defaultData} version={version} />

            {/* Drop Rewards */}
            <H2 text="Drops" />
            <Drops pageData={defaultData} version={version} />

            {/* Additional Data */}
            <H2 text="Additional Data" />
            <AdditionalData pageData={defaultData} version={version} />
         </EntryContent>
      </EntryParent>
   );
}
