import { useLoaderData, useParams } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import { EntryHeader, getDefaultEntryData, meta } from "~/modules/collections";
import { AdminOrStaffOrOwner } from "~/modules/auth";
import { SoloEditor } from "~/routes/editors+/SoloEditor";
import { nanoid } from "nanoid";
import { z } from "zod";
import { zx } from "zodix";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params, request });
   const { siteId, entryId } = zx.parseParams(params, {
      siteId: z.string(),
      entryId: z.string(),
   });

   const embed = await payload.find({
      collection: "embeds",
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

export const initialValue = [
   {
      id: nanoid(),
      type: "paragraph",
      children: [{ text: "" }],
   },
];

export default function CollectionEntryWiki() {
   const { entryDefault, embed } = useLoaderData<typeof loader>();
   const { siteId, entryId, collectionId } = useParams();

   return (
      <>
         <EntryHeader entry={entryDefault} />
         <AdminOrStaffOrOwner>
            <div className="">
               <SoloEditor
                  siteId={siteId ?? ""}
                  collectionEntity={collectionId ?? ""}
                  pageId={entryId ?? ""}
                  defaultValue={embed ?? initialValue}
               />
            </div>
         </AdminOrStaffOrOwner>
      </>
   );
}
