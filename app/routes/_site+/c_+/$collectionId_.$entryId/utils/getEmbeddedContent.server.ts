import type { Params } from "@remix-run/react";
import type { Payload } from "payload";

import { isSiteAdmin } from "~/db/access/isSiteAdmin";
import { isSiteContributor } from "~/db/access/isSiteContributor";
import { isSiteOwner } from "~/db/access/isSiteOwner";
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

   const { docs: embeds } = user
      ? await payload.find({
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
        })
      : await cacheThis(
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

   if (!user) {
      return embeds.map((item) => ({
         isChanged: false,
         id: item.id,
         content: item.content,
         subSectionId: item.subSectionId,
      }));
   }

   if (user) {
      const embed = embeds[0];

      const isOwner = isSiteOwner(user?.id, embed?.site?.owner as any);
      const isAdmin = isSiteAdmin(user?.id, embed?.site.admins as any[]);
      const isContributor = isSiteContributor(
         user?.id,
         embed?.site?.contributors as any[],
      );
      const hasAccess = isOwner || isAdmin || isContributor;

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
                  depth: 2,
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
                  .map((doc) => ({
                     id: doc.id,
                     updatedAt: doc.updatedAt,
                     version: {
                        content: doc.version.content,
                        author: {
                           username: doc?.version?.author?.username,
                           avatar: {
                              url: doc?.version?.author?.avatar?.url,
                           },
                        },
                        _status: doc.version._status,
                     },
                  }));

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
      return embeds.map((item) => ({
         isChanged: false,
         id: item.id,
         content: item.content,
         subSectionId: item.subSectionId,
      }));
   }
}
