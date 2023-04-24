import { Link, useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import { Fragment } from "react";
import { EntryHeader, getDefaultEntryData, meta } from "~/modules/collections";
import { Popover, Transition } from "@headlessui/react";
import { Plus, Type, Component } from "lucide-react";
import { AdminOrStaffOrOwner } from "~/modules/auth";

export async function loader({
   context: { payload, user },
   params,
}: LoaderArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params });

   return json({ entryDefault });
}

export { meta };

export default function CollectionEntryWiki() {
   const { entryDefault } = useLoaderData<typeof loader>();
   const fetcher = useFetcher();
   const { siteId, entryId, collectionId } = useParams();

   return (
      <>
         <EntryHeader entry={entryDefault} />
         <AdminOrStaffOrOwner>
            <div
               className="bg-2 border-color sticky bottom-12 z-30 mb-12 mt-60 
                    flex h-12 items-center justify-between
                    border-y px-3 laptop:bottom-0 laptop:h-14"
            ></div>
         </AdminOrStaffOrOwner>
      </>
   );
}
