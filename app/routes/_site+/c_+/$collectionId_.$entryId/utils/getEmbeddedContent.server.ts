import type { Params } from "@remix-run/react";
import type { Payload } from "payload";
import { select } from "payload-query";

import { isSiteOwnerOrAdmin } from "~/db/collections/sites/access";
import { cacheThis } from "~/utils/cache.server";

export async function getEmbeddedContent({
   id,
   user,
   payload,
   siteSlug,
   request,
}: {
   id: string;
   siteSlug: string;
   user: any;
   payload: Payload;
   params: Params;
   request: any;
}) {
   //We can't use param since it won't exist on a custom site
   const url = new URL(request.url).pathname;
   const collectionId = url.split("/")[2];

   const { docs: publishedEmbed } = await cacheThis(
      () =>
         payload.find({
            collection: "contentEmbeds",
            where: {
               "site.slug": {
                  equals: siteSlug,
               },
               "collectionEntity.slug": {
                  equals: collectionId,
               },
               relationId: {
                  equals: id,
               },
            },
            depth: 0,
            overrideAccess: false,
            user,
         }),
      `contentEmbeds-${siteSlug}-${collectionId}-${id}`,
   );

   if (!user) {
      return publishedEmbed.map((item) => ({
         isChanged: false,
         id: item.id,
         content: item.content,
         subSectionId: item.subSectionId,
      }));
   }
   //If user is logged in, check if they have access to the site
   const site = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteSlug,
         },
      },
      depth: 0,
      overrideAccess: false,
      user,
   });

   if (user) {
      const hasAccess = isSiteOwnerOrAdmin(user?.id, site.docs[0]);

      if (hasAccess) {
         const { docs: draftEmbed } = await payload.find({
            collection: "contentEmbeds",
            where: {
               "site.slug": {
                  equals: siteSlug,
               },
               "collectionEntity.slug": {
                  equals: collectionId,
               },
               relationId: {
                  equals: id,
               },
            },
            draft: true,
            depth: 0,
            overrideAccess: false,
            user,
         });

         const result = await Promise.all(
            draftEmbed.map(async (item) => {
               //Pull published embeds to compare if an update is needed
               const publishedEmbed = await payload.findByID({
                  collection: "contentEmbeds",
                  id: item.id,
                  depth: 0,
                  overrideAccess: false,
                  user,
               });
               const versionData = await payload.findVersions({
                  collection: "contentEmbeds",
                  depth: 0,
                  where: {
                     parent: {
                        equals: item.id,
                     },
                  },
                  limit: 20,
                  user,
               });
               const versions = versionData.docs
                  .filter((doc) => doc.version._status === "published")
                  .map((doc) => {
                     const versionRow = select(
                        { id: true, updatedAt: true },
                        doc,
                     );
                     const version = select(
                        {
                           id: false,
                           content: true,
                           _status: true,
                        },
                        doc.version,
                     );

                     //Combine final result
                     const result = {
                        ...versionRow,
                        version,
                     };

                     return result;
                  });

               const isChanged =
                  JSON.stringify(publishedEmbed.content) !=
                     JSON.stringify(item.content) || versions.length == 0;

               return {
                  id: item.id,
                  content: item.content,
                  subSectionId: item.subSectionId,
                  isChanged,
                  versions,
               };
            }),
         );
         return result;
      }

      //If no access, return content field from original query
      return publishedEmbed.map((item) => ({
         isChanged: false,
         id: item.id,
         content: item.content,
         subSectionId: item.subSectionId,
      }));
   }
}
