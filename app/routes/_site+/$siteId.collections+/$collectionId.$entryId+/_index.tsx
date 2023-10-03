import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { nanoid } from "nanoid";
import { z } from "zod";
import { zx } from "zodix";

import { AdminOrStaffOrOwner } from "~/modules/auth";
import { EntryHeader, getDefaultEntryData, meta } from "~/modules/collections";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params, request });
   const { siteId, entryId } = zx.parseParams(params, {
      siteId: z.string(),
      entryId: z.string(),
   });

   const embed = await payload.find({
      collection: "contentEmbeds",
      where: {
         "site.slug": {
            equals: siteId,
         },
         relationId: {
            equals: entryId,
         },
      },
      draft: true,
      overrideAccess: false,
      user,
   });

   return json({ entryDefault, embed: embed?.docs[0]?.content });
}

export { meta };

export default function CollectionEntryWiki() {
   const { entryDefault, embed } = useLoaderData<typeof loader>() || {};
   const { siteId, entryId, collectionId } = useParams();
   const fetcher = useFetcher();

   return (
      <>
         <EntryHeader entry={entryDefault} />
         <AdminOrStaffOrOwner>
            <div className="">
               {/* <ManaEditor
                  siteId={siteId ?? ""}
                  fetcher={fetcher}
                  collectionEntity={collectionId ?? ""}
                  pageId={entryId ?? ""}
                  defaultValue={embed ?? initialValue}
               /> */}
            </div>
         </AdminOrStaffOrOwner>
      </>
   );
}
