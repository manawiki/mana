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
      intent: z.enum(["addEntry", "updateEntry", "deleteEntry"]),
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
         try {
            const result = await getMultipleFormData({
               request,
               prefix: "entry-icon",
               schema: EntrySchemaUpdateSchema,
            });
            if (result.success) {
               const {
                  entryId,
                  entryIcon,
                  entryIconId,
                  siteId,
                  ...dataToUpdate
               } = result.data;

               //Upload new entry icon
               if (entryIcon && !entryIconId) {
                  const upload = await uploadImage({
                     payload,
                     image: entryIcon,
                     user,
                     siteId,
                  });

                  await payload.update({
                     collection: "entries",
                     id: entryId,
                     data: {
                        icon: upload?.id as any,
                     },
                     overrideAccess: false,
                     user,
                  });
               }
               //If existing icon, delete it and upload new one
               if (entryIcon && entryIconId) {
                  await payload.delete({
                     collection: "images",
                     id: entryIconId,
                     overrideAccess: false,
                     user,
                  });
                  const upload = await uploadImage({
                     payload,
                     image: entryIcon,
                     user,
                     siteId,
                  });

                  await payload.update({
                     collection: "entries",
                     id: entryId,
                     data: {
                        icon: upload?.id as any,
                     },
                     overrideAccess: false,
                     user,
                  });
               }

               const results = result.data;

               //Slug has changed
               if (results.slug !== results.existingSlug) {
                  //Check if slug already exists
                  const entry = await payload.find({
                     collection: "entries",
                     where: {
                        slug: {
                           equals: results.slug,
                        },
                        site: {
                           equals: results.siteId,
                        },
                        collectionEntity: {
                           equals: results.collectionId,
                        },
                     },
                     user,
                     overrideAccess: false,
                  });
                  if (entry.totalDocs == 0) {
                     const updatedEntry = await payload.update({
                        collection: "entries",
                        id: results.entryId,
                        data: {
                           ...dataToUpdate,
                        },
                        user,
                        overrideAccess: false,
                     });
                     //TODO Add support to update custom site if custom database option is enabled
                     //Redirect to new slug if changed
                     if (updatedEntry.slug !== results.existingSlug) {
                        return redirectWithSuccess(
                           `/c/${updatedEntry.collectionEntity?.slug}/${results.slug}`,
                           "Entry updated",
                        );
                     }
                     return jsonWithSuccess(null, "Entry updated");
                  }
                  return jsonWithError(
                     null,
                     `Entry with "/${results.slug}" path already exists.`,
                  );
               }
               //Slug has not changed
               await payload.update({
                  collection: "entries",
                  id: results.entryId,
                  data: {
                     ...dataToUpdate,
                  },
                  user,
                  overrideAccess: false,
               });
               return jsonWithSuccess(null, "Entry updated");
            }
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
            return jsonWithError(
               null,
               "Something went wrong...unable to delete collection",
            );
         } catch (error) {
            payload.logger.error(`${error}`);
            return jsonWithError(
               null,
               "Something went wrong...unable to delete collection",
            );
         }
      }
   }
};
