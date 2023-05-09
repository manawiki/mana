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
import type { Materials } from "payload/generated-types";
import { Image } from "~/components/Image";

import { Header } from "~/_custom/components/materials/Header";

import { zx } from "zodix";
import { z } from "zod";

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
   })) as Materials;

   //Feel free to query for more data here

   return json({ entryDefault, defaultData });
}

export default function MaterialsEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   const { defaultData } = useLoaderData<typeof loader>();

   // console.log(defaultData);

   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            <Header pageData={defaultData} />
         </EntryContent>
      </EntryParent>
   );
}

const Stats = () => {
   return <div>This is stats</div>;
};
