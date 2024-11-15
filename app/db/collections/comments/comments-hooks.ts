import type {
   CollectionAfterChangeHook,
   CollectionAfterDeleteHook,
} from "payload/types";

function authRestFetcher({
   path,
   method,
   body,
   isAuthOverride = false,
}: {
   path: string;
   method: "PATCH" | "GET" | "DELETE" | "POST";
   body?: any;
   isAuthOverride?: boolean;
}) {
   try {
      return fetch(path, {
         method,
         ...(isAuthOverride &&
            process.env.MANA_APP_KEY &&
            !process.env.CUSTOM_DB_APP_KEY && {
               headers: {
                  Authorization: `users API-Key ${process.env.MANA_APP_KEY}`,
                  "Content-Type": "application/json",
               },
            }),
         ...(isAuthOverride &&
            process.env.CUSTOM_DB_APP_KEY &&
            !process.env.MANA_APP_KEY && {
               headers: {
                  Authorization: `users API-Key ${process.env.CUSTOM_DB_APP_KEY}`,
                  "Content-Type": "application/json",
               },
            }),
         ...(body &&
            (method == "PATCH" || method == "POST") && {
               body: JSON.stringify({
                  ...body,
               }),
            }),
      }).then((res) => res.json());
   } catch (err) {
      console.log(err);
   }
}

export const updateCommentCount: CollectionAfterChangeHook = async ({
   doc,
   req: { payload },
   operation,
}) => {
   try {
      if (operation == "create") {
         const parentId = doc?.parentId;
         const parentSlug = doc?.parentSlug;
         const isCustomSite = doc?.isCustomSite;
         if (isCustomSite) {
            const currentCommentCount = (await authRestFetcher({
               isAuthOverride: true,
               method: "GET",
               path: `http://localhost:4000/api/${parentSlug}/${parentId}?depth=0`,
            })) as any;

            //@ts-ignore
            const updatedTotalComments = currentCommentCount?.totalComments
               ? //@ts-ignore
                 currentCommentCount?.totalComments + 1
               : 1;

            await authRestFetcher({
               isAuthOverride: true,
               method: "PATCH",
               path: `http://localhost:4000/api/${parentSlug}/${parentId}`,
               body: { totalComments: updatedTotalComments },
            });
         } else {
            const currentCommentCount = await payload.findByID({
               collection: parentSlug,
               id: parentId,
               depth: 0,
            });
            //@ts-ignore
            const updatedTotalComments = currentCommentCount?.totalComments
               ? //@ts-ignore
                 currentCommentCount?.totalComments + 1
               : 1;

            await payload.update({
               collection: parentSlug,
               id: parentId,
               data: {
                  totalComments: updatedTotalComments,
               },
            });
         }
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};

export const updateCommentCountAfterDelete: CollectionAfterDeleteHook = async ({
   doc,
   req: { payload },
}) => {
   try {
      const parentId = doc.parentId;
      const parentSlug = doc.parentSlug;
      const isCustomSite = doc?.isCustomSite;

      if (isCustomSite) {
         const currentCommentCount = await authRestFetcher({
            isAuthOverride: true,
            method: "GET",
            path: `http://localhost:4000/api/${parentSlug}/${parentId}?depth=0`,
         });

         //@ts-ignore
         const updatedTotalComments = currentCommentCount?.totalComments
            ? //@ts-ignore
              currentCommentCount?.totalComments - 1
            : 1;

         await authRestFetcher({
            isAuthOverride: true,
            method: "PATCH",
            path: `http://localhost:4000/api/${parentSlug}/${parentId}`,
            body: { totalComments: updatedTotalComments },
         });
      } else {
         const currentCommentCount = await payload.findByID({
            collection: parentSlug,
            id: parentId,
            depth: 0,
         });

         //@ts-ignore
         const updatedTotalComments = currentCommentCount?.totalComments
            ? //@ts-ignore
              currentCommentCount?.totalComments - 1
            : 1;

         await payload.update({
            collection: parentSlug,
            id: parentId,
            data: {
               totalComments: updatedTotalComments,
            },
         });
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};
