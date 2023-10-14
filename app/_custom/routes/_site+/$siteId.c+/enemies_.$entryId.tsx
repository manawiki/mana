import { useState } from "react";

import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Enemy } from "payload/generated-custom-types";

import { AdditionalData } from "~/_custom/components/enemies/AdditionalData";
import { Drops } from "~/_custom/components/enemies/Drops";
import { Resistances } from "~/_custom/components/enemies/Resistances";
import { Selector } from "~/_custom/components/enemies/Selector";
import { Skills } from "~/_custom/components/enemies/Skills";
import { Stats } from "~/_custom/components/enemies/Stats";
import { H2Default } from "~/components/H2";
import { Entry } from "~/routes/_site+/$siteId.c_+/src/components";
import {
   getAllEntryData,
   getCustomEntryData,
   meta,
} from "~/routes/_site+/$siteId.c_+/src/functions";
export { meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await getAllEntryData({
      payload,
      params,
      request,
      user,
   });

   const entryDefault = (await getCustomEntryData({
      payload,
      params,
      request,
      depth: 3,
      entryId: entry.id,
   })) as Enemy;

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

export default function CharacterEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();

   const [version, setVersion] = useState(0);

   return (
      <Entry>
         {/* Selector for Enemy Version */}
         <Selector
            pageData={entryDefault}
            version={version}
            setVersion={setVersion}
         />

         {/* Image */}
         <Stats pageData={entryDefault} version={version} />

         {/* Skill List */}
         <H2Default text="Skills" />
         <Skills pageData={entryDefault} version={version} />

         {/* Resistances */}
         <H2Default text="Resistances" />
         <Resistances pageData={entryDefault} version={version} />

         {/* Drop Rewards */}
         <H2Default text="Drops" />
         <Drops pageData={entryDefault} version={version} />

         {/* Additional Data */}
         <H2Default text="Additional Data" />
         <AdditionalData pageData={entryDefault} version={version} />
      </Entry>
   );
}
