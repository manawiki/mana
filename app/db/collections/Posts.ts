import type {
   CollectionAfterDeleteHook,
   CollectionConfig,
} from "payload/types";

import type { User } from "payload/generated-types";

import { canMutateAsSiteAdmin } from "../../access/canMutateAsSiteAdmin";
import { canReadPost } from "../../access/post";
import { isStaffFieldLevel } from "../../access/user";

const afterDeleteHook: CollectionAfterDeleteHook = async ({
   req: { payload, user },
   id,
   doc,
}) => {
   try {
      await payload.delete({
         collection: "postContents",
         id,
         overrideAccess: true,
         user,
      });
      const bannerId = doc.banner.id;

      if (bannerId) {
         await payload.delete({
            collection: "images",
            id: bannerId,
            overrideAccess: false,
            user,
         });
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};

export const Posts: CollectionConfig = {
   slug: "posts",
   admin: {
      useAsTitle: "name",
   },
   access: {
      create: canMutateAsSiteAdmin("posts"),
      read: canReadPost(),
      update: canMutateAsSiteAdmin("posts"),
      delete: canMutateAsSiteAdmin("posts"),
      readVersions: canMutateAsSiteAdmin("posts"),
   },
   hooks: {
      afterDelete: [afterDeleteHook],
   },
   fields: [
      {
         name: "name",
         type: "text",
         required: true,
      },
      {
         name: "id",
         type: "text",
      },
      {
         name: "slug",
         type: "text",
         index: true,
      },
      {
         name: "subtitle",
         type: "text",
      },
      {
         name: "publishedAt",
         type: "date",
         index: true,
      },
      {
         name: "content",
         type: "relationship",
         relationTo: "postContents",
         required: true,
         hasMany: false,
      },
      {
         name: "author",
         type: "relationship",
         relationTo: "users",
         required: true,
         defaultValue: ({ user }: { user: User }) => user?.id,
         access: {
            update: isStaffFieldLevel,
         },
         maxDepth: 2,
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         required: true,
         maxDepth: 1,
      },
      {
         name: "tags",
         type: "relationship",
         relationTo: "postTags",
         hasMany: true,
      },
      {
         name: "banner",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "totalComments",
         type: "number",
      },
      {
         name: "totalBookmarks",
         type: "number",
      },
      {
         name: "maxCommentDepth",
         type: "number",
         defaultValue: 1,
         min: 1,
      },
   ],
};
