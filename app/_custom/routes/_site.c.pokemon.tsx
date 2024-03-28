import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { fetchList } from "~/routes/_site+/c_+/$collectionId/utils/fetchList.server";
import { listMeta } from "~/routes/_site+/c_+/$collectionId/utils/listMeta";
import { List } from "~/routes/_site+/c_+/_components/List";

export { listMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entries } = await fetchList({
      params,
      request,
      payload,
      user,
   });
   return json({ entries });
}

export default function ListPage() {
   function Row() {
      return <div></div>;
   }

   return (
      <List RowComponent={Row}>
         <div></div>
      </List>
   );
}
