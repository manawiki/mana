import { EntryHeader } from "./EntryHeader";
import { useLoaderData } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import { getDefaultEntryData, meta } from "./entryDefaults";
import { EntryParent } from "./EntryWrappers";

export { meta };

export async function loader({ context: { payload }, params }: LoaderArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params });
   return json({ entryDefault });
}

export default function CollectionEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
      </EntryParent>
   );
}
