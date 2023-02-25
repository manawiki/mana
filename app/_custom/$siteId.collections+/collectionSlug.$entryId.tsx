import { useLoaderData } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";

import {
   meta,
   handle,
   getDefaultEntryData,
} from "../../modules/defaults/entry";

export { meta, handle };

export async function loader({ context: { payload }, params }: LoaderArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params });
   return json({ entryDefault });
}

export default function CollectionEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   return (
      <>
         <h1 className="text-3xl font-bold">{entryDefault.name}</h1>
         <div>Entry Template</div>
      </>
   );
}
