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
import type { Blessings } from "payload/generated-types";

import { Header } from "~/_custom/components/blessings/Header";
import { Effects } from "~/_custom/components/blessings/Effects";
// import { Header } from "~/_custom/components/blessings/Header";
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
      depth: 2,
   })) as Blessings;

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

export default function BlessingEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   const { defaultData } = useLoaderData<typeof loader>();

   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            {/* Image */}
            <Header pageData={defaultData} />

            {/* Effect List - Various Levels */}
            <Effects pageData={defaultData} />
         </EntryContent>
      </EntryParent>
   );
}
