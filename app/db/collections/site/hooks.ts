import type { CollectionAfterChangeHook } from "payload/types";

export const afterCreateSite: CollectionAfterChangeHook = async ({
   doc,
   req: { payload },
   operation, // name of the operation i.e. 'create', 'update'
}) => {
   try {
      // On site creation, create a default homeContents entry
      if (operation === "create") {
         const siteId = doc.slug;
         await payload.create({
            collection: "homeContents",
            data: {
               site: siteId,
               _status: "published",
               content: [
                  {
                     id: "viwnxpInwb-HSLnwixmaU",
                     type: "h2",
                     children: [
                        {
                           text: "Welcome to Mana",
                        },
                     ],
                  },
                  {
                     id: "jsowPnsUbN-UmsYfOpFtY",
                     type: "paragraph",
                     children: [
                        {
                           text: "This page was automatically generated during site creation, and it looks like it hasn't been replaced yet.",
                        },
                     ],
                  },
               ],
            },
         });
      }
   } catch (err: unknown) {
      console.log("ERROR");
      payload.logger.error(`${err}`);
   }

   return doc;
};
