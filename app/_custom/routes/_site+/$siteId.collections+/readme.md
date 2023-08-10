## Entry Template

`collectionSlug.$entryId.c.tsx` in this (`$siteId.collections+`) directory

```
import { useLoaderData } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import { EntryHeader } from "~/routes/$siteId.collections+/$collectionId.$entryId/EntryHeader";
import {
   EntryContent,
   EntryParent,
} from "~/routes/$siteId.collections+/$collectionId.$entryId/EntryWrappers";
import {
   getDefaultEntryData,
   meta,
} from "~/routes/$siteId.collections+/$collectionId.$entryId/entryDefaults";

export { meta };

export async function loader({ context: { payload }, params }: LoaderArgs) {
   // Get custom data here
   const entryDefault = await getDefaultEntryData({ payload, params });
   return json({ entryDefault });
}

export default function CollectionEntry() {
   //Load custom data here
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
   return <div>This is the header</div>;
};

const Stats = () => {
   return <div>This is the stats</div>;
};
```
