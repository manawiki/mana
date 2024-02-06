import { nanoid } from "nanoid";
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
                     id: nanoid(),
                     type: "paragraph",
                     children: [
                        {
                           text: "This page was automatically generated during site creation. Feel free to edit it.",
                        },
                     ],
                  },
                  {
                     id: nanoid(),
                     type: "updates",
                     children: [
                        {
                           text: "",
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
