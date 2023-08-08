import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { Blessing } from "payload/generated-custom-types";
import { Effects } from "~/_custom/components/blessings/Effects";
import { Header } from "~/_custom/components/blessings/Header";
import {
   EntryParent,
   EntryHeader,
   meta,
   EntryContent,
   getCustomEntryData,
} from "~/modules/collections";
// import { Header } from "~/_custom/components/blessings/Header";
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
      depth: 2,
   })) as Blessing;

   // Remove html tags from entry name
   // `<i><unbreak>12</unbreak> Monkeys and Angry Men</i>` to `12 Monkeys and Angry Men`
   if (entryDefault?.name)
      entryDefault.name = entryDefault?.name?.replace(/(<([^>]+)>)/gi, "");

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

export default function BlessingEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();

   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            {/* Image */}
            <Header pageData={entryDefault} />

            {/* Effect List - Various Levels */}
            <Effects pageData={entryDefault} />
         </EntryContent>
      </EntryParent>
   );
}
