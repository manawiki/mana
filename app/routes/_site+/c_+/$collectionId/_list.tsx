import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";

import { fetchListCore } from "./utils/fetchListCore.server";
import { listMeta } from "./utils/listMeta";
import { AddEntry } from "../_components/AddEntry";
import { List } from "../_components/List";

export { listMeta as meta };

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);

   const { entries } = await fetchListCore({
      request,
      payload,
      siteSlug,
      user,
   });

   return json({ entries });
}

export default function CollectionList() {
   return (
      <List>
         <AddEntry />
      </List>
   );
}
