import { useLoaderData } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import {
   EntryParent,
   EntryHeader,
   meta,
   EntryContent,
   getCustomEntryData,
} from "~/modules/collections";
import type { Material } from "payload/generated-custom-types";

import { Header } from "~/_custom/components/materials/Header";

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
   })) as Material;

   //Feel free to query for more data here

   return json({ entryDefault });
}

export default function MaterialsEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();

   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            <Header pageData={entryDefault} />
         </EntryContent>
      </EntryParent>
   );
}

const Stats = () => {
   return <div>This is stats</div>;
};
