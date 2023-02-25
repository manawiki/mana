import { useLoaderData } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import { EntryHeader } from "~/routes/$siteId.collections+/$collectionId.$entryId/EntryHeader";
import {
   EntryContent,
   EntryParent,
} from "~/routes/$siteId.collections+/$collectionId.$entryId/EntryWrappers";
import {
   getCustomEntryData,
   getDefaultEntryData,
   meta,
} from "~/routes/$siteId.collections+/$collectionId.$entryId/entryDefaults";
import type { MaterialsLKJ16E5IhH } from "payload/generated-types";

export { meta };

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params });
   const defaultData = (await getCustomEntryData({
      payload,
      params,
      request,
   })) as MaterialsLKJ16E5IhH;

   //Feel free to query for more data here

   return json({ entryDefault, defaultData });
}

export default function MaterialsEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            <Header />
            <Stats />
         </EntryContent>
      </EntryParent>
   );
}

const Header = () => {
   const { defaultData } = useLoaderData<typeof loader>();
   return <div>{defaultData.story}</div>;
};

const Stats = () => {
   return <div>This is stats</div>;
};
