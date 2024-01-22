import type {
   CollectionAfterDeleteHook,
   CollectionConfig,
} from "payload/types";

import type { User } from "payload/generated-types";

import { canMutateAsSiteAdmin } from "../../access/canMutateAsSiteAdmin";

export const entriesSlug = "entries";

const afterDeleteHook: CollectionAfterDeleteHook = async ({
   req: { payload },
   doc,
}) => {
   try {
      await payload.delete({
         collection: "contentEmbeds",
         where: {
            relationId: { equals: doc.id },
         },
      });
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};

export const Entries: CollectionConfig = {
   slug: entriesSlug,
   admin: {
      useAsTitle: "name",
   },
   hooks: {
      afterDelete: [afterDeleteHook],
   },
   access: {
      create: canMutateAsSiteAdmin("entries"),
      read: (): boolean => true,
      update: canMutateAsSiteAdmin("entries"),
      delete: canMutateAsSiteAdmin("entries"),
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
         name: "site",
         type: "relationship",
         relationTo: "sites",
         hasMany: false,
      },
      {
         name: "collectionEntity",
         type: "relationship",
         relationTo: "collections",
         hasMany: false,
      },
      {
         name: "author",
         type: "relationship",
         relationTo: "users",
         required: true,
         defaultValue: ({ user }: { user: User }) => user?.id,
         maxDepth: 2,
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
   ],
};
