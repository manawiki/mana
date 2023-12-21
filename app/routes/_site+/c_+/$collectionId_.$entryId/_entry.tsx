import { json, redirect } from "@remix-run/node";
import type {
   ActionFunction,
   LoaderFunctionArgs,
   MetaFunction,
} from "@remix-run/node";
import { z } from "zod";
import { zx } from "zodix";

import {
   assertIsDelete,
   assertIsPost,
   getMultipleFormData,
   uploadImage,
} from "~/utils";

import { Entry } from "./components/Entry";
import { fetchEntry } from "./utils/fetchEntry.server";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await fetchEntry({
      payload,
      params,
      request,
      user,
   });
   return json({ entry });
}

export const meta: MetaFunction = ({
   matches,
   data,
}: {
   matches: any;
   data: any;
}) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site?.name;

   return [
      {
         title: `${data?.entry.name} | ${data?.entry.collectionName} - ${siteName}`,
      },
   ];
};

export default function CollectionEntry() {
   return <Entry />;
}

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
}) => {
   if (!user || !user.id) return redirect("/login", { status: 302 });

   const { intent } = await zx.parseForm(request, {
      intent: z.enum(["entryUpdateIcon", "entryDeleteIcon"]),
   });

   switch (intent) {
      case "entryUpdateIcon": {
         assertIsPost(request);

         const result = await getMultipleFormData({
            request,
            prefix: "entryIcon",
            schema: z.any(),
         });
         if (result.success) {
            const { image, entityId } = result.data;
            try {
               const upload = await uploadImage({
                  payload,
                  image: image,
                  user,
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
               return json({
                  error: "Something went wrong...unable to add image.",
               });
            }
         }
         // Last resort error message
         return json({
            error: "Something went wrong...unable to add image.",
         });
      }
      case "entryDeleteIcon": {
         assertIsDelete(request);
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
               icon: "" as any,
            },
            overrideAccess: false,
            user,
         });
      }
   }
};
