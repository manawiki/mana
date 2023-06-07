import { z } from "zod";
import { zx } from "zodix";
import { type ActionArgs, redirect } from "@remix-run/node";

export async function action({
   context: { payload, user },
   request,
}: ActionArgs) {
   const { intent, siteId, pageId, collectionEntity } = await zx.parseForm(
      request,
      {
         intent: z.string(),
         siteId: z.string(),
         pageId: z.string(),
         collectionEntity: z.string().optional(),
      }
   );

   if (!user || !user.id) return redirect("/login", { status: 302 });

   switch (intent) {
      case "updateEmbed": {
         const { content } = await zx.parseForm(request, {
            content: z.string(),
         });

         const slug = await payload.find({
            collection: "sites",
            where: {
               slug: {
                  equals: siteId,
               },
            },
            user,
         });
         const realSiteId = slug?.docs[0]?.id;

         const collectionSlug = await payload.find({
            collection: "collections",
            where: {
               slug: {
                  equals: collectionEntity,
               },
               site: {
                  equals: realSiteId,
               },
            },
            user,
         });

         const realCollectionId = collectionSlug?.docs[0]?.id;

         const embedId = await payload.find({
            collection: "embeds",
            where: {
               site: {
                  equals: realSiteId,
               },
               relationId: {
                  equals: pageId,
               },
               ...(collectionEntity
                  ? {
                       collectionEntity: {
                          equals: realCollectionId,
                       },
                    }
                  : {}),
            },
            overrideAccess: false,
            user,
         });

         //If existing embed doesn't exist, create a new one.
         if (embedId.totalDocs == 0) {
            return await payload.create({
               collection: "embeds",
               data: {
                  content: JSON.parse(content),
                  relationId: pageId,
                  site: realSiteId as any,
                  collectionEntity: realCollectionId as any,
               },
               draft: true,
               overrideAccess: false,
               user,
            });
         }

         //Otherwise update the existing document
         return await payload.update({
            collection: "embeds",
            id: embedId.docs[0].id,
            data: {
               content: JSON.parse(content),
            },
            autosave: true,
            draft: true,
            overrideAccess: false,
            user,
         });
      }

      case "publish": {
         const embedId = await payload.find({
            collection: "embeds",
            where: {
               site: {
                  equals: siteId,
               },
               relationId: {
                  equals: pageId,
               },
            },
            overrideAccess: false,
            user,
         });

         return await payload.update({
            collection: "embeds",
            id: embedId.docs[0].id,
            data: {
               _status: "published",
            },
            overrideAccess: false,
            user,
         });
      }

      default:
         return null;
   }
}
