import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

import { AdminOrStaffOrOwner } from "~/routes/_auth+/src/components";

import { getAllEntryData } from "./src/functions";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await getAllEntryData({
      payload,
      params,
      request,
      user,
   });
   console.log(entry);
   return json({ entry });
}

export default function CollectionEntryWiki() {
   return (
      <div className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:pb-12">
         <AdminOrStaffOrOwner>
            <div className=""></div>
         </AdminOrStaffOrOwner>
      </div>
   );
}
