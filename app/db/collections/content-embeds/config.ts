import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import {
   canCreateContentEmbed,
   canDeleteContentEmbed,
   canReadContentEmbed,
   canUpdateContentEmbed,
} from "./access";
import { isStaffFieldLevel } from "../users/access";

export const ContentEmbeds: CollectionConfig = {
   slug: "contentEmbeds",
   access: {
      create: canCreateContentEmbed,
      read: canReadContentEmbed,
      update: canUpdateContentEmbed,
      delete: canDeleteContentEmbed,
   },
   fields: [
      {
         name: "content",
         type: "json",
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
         name: "relationId",
         type: "text",
      },
      {
         name: "subSectionId",
         type: "text",
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         required: true,
         maxDepth: 1,
      },
      {
         name: "collectionEntity",
         type: "relationship",
         relationTo: "collections",
         hasMany: false,
      },
   ],
   versions: {
      drafts: {
         autosave: true,
      },
      maxPerDoc: 20,
   },
};
