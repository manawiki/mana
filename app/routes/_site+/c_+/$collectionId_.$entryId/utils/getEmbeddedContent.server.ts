import type { Params } from "@remix-run/react";
import type { Payload } from "payload";
import { select } from "payload-query";

import { isSiteOwnerOrAdmin } from "~/db/collections/site/access";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { cacheThis } from "~/utils/cache.server";

export async function getEmbeddedContent({
   id,
   user,
   payload,
   request,
}: {
   id: string;
   user: any;
   payload: Payload;
   params: Params;
   request: any;
}) {
   const { siteSlug } = getSiteSlug(request);

   //We can't use param since it won't exist on a custom site
   const url = new URL(request.url).pathname;
   const collectionId = url.split("/")[2];

   if (user) {
      const { docs } = await payload.find({
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
         depth: 1,
         overrideAccess: false,
         user,
      });

      const hasAccess = isSiteOwnerOrAdmin(user?.id, docs[0]?.site);

      if (hasAccess) {
         const result = await Promise.all(
            docs.map(async (item) => {
               //Pull Embed drafts to compare if an update is needed
               const draftEmbed = await payload.findByID({
                  collection: "contentEmbeds",
                  id: item.id,
                  depth: 0,
                  draft: true,
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
                  JSON.stringify(draftEmbed.content) !=
                     JSON.stringify(item.content) || versions.length == 0;

               return {
                  id: item.id,
                  content: draftEmbed.content,
                  subSectionId: item.subSectionId,
                  isChanged,
                  versions,
               };
            }),
         );
         return result;
      }

      //If no access, return content field from original query
      return docs.map((item) => ({
         isChanged: false,
         id: item.id,
         content: item.content,
         subSectionId: item.subSectionId,
      }));
   }

   if (!user) {
      const { docs } = await cacheThis(
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
               depth: 1,
               overrideAccess: false,
               user,
            }),
         `contentEmbeds-${siteSlug}-${collectionId}-${id}`,
      );
      return docs.map((item) => ({
         isChanged: false,
         id: item.id,
         content: item.content,
         subSectionId: item.subSectionId,
      }));
   }
}
