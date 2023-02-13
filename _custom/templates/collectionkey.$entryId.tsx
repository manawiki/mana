import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";

import { meta, handle, getDefaultEntryData } from "../defaults";
export { meta, handle };

export async function loader({ context: { payload }, params }: LoaderArgs) {
   const entry = await getDefaultEntryData({ payload, params });
   return json({ entry });
}

export default function CollectionEntry() {
   const { entry } = useLoaderData<typeof loader>();
   return (
      <>
         <h1 className="text-3xl font-bold">{entry.name}</h1>
         <div>Test page</div>
      </>
   );
}
