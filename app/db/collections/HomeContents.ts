import payload from "payload";
import type {CollectionBeforeChangeHook , CollectionConfig} from "payload/types";

import type { User } from "payload/generated-types";

import { canMutateAsSiteAdmin, canRead } from "../../access/site";

// Automatically replaces the lastEditedBy field before a change is submitted in order to allow us to determine which user made a specific document version
const replaceLastEditedBy: CollectionBeforeChangeHook = async ({ data, req, operation, originalDoc }) => {
   try {
      if(operation == "update") {
          data.user = req.user.id;
      }
      return data;
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};

export const HomeContents: CollectionConfig = {
   slug: "homeContents",
   access: {
      create: canMutateAsSiteAdmin("homeContents"),
      read: canRead("homeContents"),
      update: canMutateAsSiteAdmin("homeContents"),
      delete: canMutateAsSiteAdmin("homeContents"),
      readVersions: canMutateAsSiteAdmin("homeContents"),
   },
   fields: [
      {
         name: "content",
         type: "json",
      },
      {
         name: "user",
         type: "relationship",
         relationTo: "users",
         maxDepth: 3,
         required: false,
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         hasMany: false,
         required: true,
         maxDepth: 1,
      },
   ],
   hooks: {
      beforeChange: [replaceLastEditedBy],
   },
   versions: {
      drafts: {
         autosave: true,
      },
      maxPerDoc: 20,
   },
};
