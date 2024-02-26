import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { nanoid } from "nanoid";
import {
   jsonWithError,
   jsonWithSuccess,
   redirectWithSuccess,
} from "remix-toast";
import { z } from "zod";
import { zx } from "zodix";

import {
   getMultipleFormData,
   uploadImage,
} from "~/utils/upload-handler.server";

import { EntrySchemaUpdateSchema } from "../c_+/$collectionId_.$entryId/utils/EntrySchema";

export const EntrySchema = z.object({
   name: z.string(),
   collectionId: z.string(),
   siteId: z.string(),
});

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
}) => {
   if (!user || !user.id) return redirect("/login", { status: 302 });

   const { intent } = await zx.parseForm(request, {
      intent: z.enum([
         "addEntry",
         "updateEntry",
         "deleteEntry",
         "entryUpdateIcon",
         "entryDeleteIcon",
      ]),
   });

   switch (intent) {
      case "addEntry": {
         try {
            const { name, collectionId, siteId } = await zx.parseForm(
               request,
               EntrySchema,
            );
            const entryId = nanoid(12);
            return await payload.create({
               collection: "entries",
               data: {
                  name,
                  id: entryId,
                  author: user?.id as any,
                  collectionEntity: collectionId as any,
                  site: siteId as any,
                  slug: entryId as any,
               },
               user,
               overrideAccess: false,
            });
         } catch (error) {
            return jsonWithError(
               null,
               "Something went wrong...unable to add entry.",
            );
         }
      }
      case "updateEntry": {
         const results = await zx.parseForm(request, EntrySchemaUpdateSchema);
         try {
            await payload.update({
               collection: "entries",
               id: results.entryId,
               data: {
                  ...results,
               },
               user,
               overrideAccess: false,
            });
            return jsonWithSuccess(null, "Entry updated");
         } catch (error) {
            return jsonWithError(
               null,
               "Something went wrong...unable to update entry",
            );
         }
      }
      case "deleteEntry": {
         try {
            const { entryId } = await zx.parseForm(request, {
               entryId: z.string(),
            });
            const deletedEntry = await payload.delete({
               collection: "entries",
               id: entryId,
               user,
               overrideAccess: false,
               depth: 1,
            });
            if (deletedEntry) {
               return redirectWithSuccess(
                  `/c/${deletedEntry?.collectionEntity?.slug}`,
                  "Entry deleted",
               );
            }
         } catch (error) {
            payload.logger.error(`${error}`);
            return jsonWithError(
               null,
               "Something went wrong...unable to delete collection",
            );
         }
      }
      case "entryUpdateIcon": {
         const result = await getMultipleFormData({
            request,
            prefix: "entryIcon",
            schema: z.any(),
         });
         if (result.success) {
            const { image, entityId, siteId } = result.data;
            try {
               const upload = await uploadImage({
                  payload,
                  image: image,
                  user,
                  siteId,
               });
               return await payload.update({
                  collection: "entries",
                  id: entityId,
                  data: {
                     icon: upload.id as any,
                  },
                  overrideAccess: false,
                  user,
               });
            } catch (error) {
               return jsonWithError(
                  null,
                  "Something went wrong...unable to add image.",
               );
            }
         }
      }
      case "entryDeleteIcon": {
         const { imageId, entityId } = await zx.parseForm(request, {
            imageId: z.string(),
            entityId: z.string(),
         });
         await payload.delete({
            collection: "images",
            id: imageId,
            overrideAccess: false,
            user,
         });
         return await payload.update({
            collection: "entries",
            id: entityId,
            data: {
               icon: null,
            },
            overrideAccess: false,
            user,
         });
      }
   }
};
