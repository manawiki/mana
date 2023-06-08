import type { CollectionConfig } from "payload/types";
import { isStaffFieldLevel } from "../../access/user";
import type { User } from "payload/generated-types";
import { canMutateAsSiteAdmin } from "../../access/site";

export const postsslug = "posts";
export const Posts: CollectionConfig = {
   slug: postsslug,
   admin: {
      useAsTitle: "name",
   },
   access: {
      create: canMutateAsSiteAdmin("posts"),
      read: () => {
         return {
            _status: {
               equals: "published",
            },
         };
      },
      update: canMutateAsSiteAdmin("posts"),
      delete: canMutateAsSiteAdmin("posts"),
      readVersions: canMutateAsSiteAdmin("posts"),
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
      },
      {
         name: "subtitle",
         type: "text",
      },
      {
         name: "publishedAt",
         type: "date",
      },
      {
         name: "content",
         type: "json",
      },
      {
         name: "author",
         type: "relationship",
         relationTo: "users",
         required: true,
         defaultValue: ({ user }: { user: User }) => user.id,
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
         name: "banner",
         type: "upload",
         relationTo: "images",
      },
   ],
   versions: {
      drafts: true,
      maxPerDoc: 60,
   },
};
