import { Link, useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import { Fragment } from "react";
import { EntryHeader, getDefaultEntryData, meta } from "~/modules/collections";
import { Popover, Transition } from "@headlessui/react";
import { Plus, Type, Component } from "lucide-react";
import { AdminOrStaffOrOwner } from "~/modules/auth";
import { SoloEditor } from "~/modules/editor/SoloEditor";
import { nanoid } from "nanoid";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params, request });
   return json({ entryDefault });
}

export { meta };

export const initialValue = [
   {
      id: nanoid(),
      type: "paragraph",
      children: [{ text: "" }],
   },
];

export default function CollectionEntryWiki() {
   const { entryDefault } = useLoaderData<typeof loader>();
   const fetcher = useFetcher();
   const { siteId, entryId, collectionId } = useParams();

   return (
      <>
         <EntryHeader entry={entryDefault} />
         <AdminOrStaffOrOwner>
            <div className="">
               <SoloEditor defaultValue={initialValue} />
            </div>
         </AdminOrStaffOrOwner>
      </>
   );
}
