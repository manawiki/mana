import payload from "payload";
import type {CollectionBeforeChangeHook} from "payload/types";

// Automatically replaces the versionAuthor field before a change is submitted
// in order to allow us to determine which user made a specific document version
export const replaceVersionAuthor: CollectionBeforeChangeHook = async ({
   data,
   req,
   operation,
   originalDoc
}) => {
   try {
      if(operation == "update") {
         data.versionAuthor = req.user.id;
      }
      return data;
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};
