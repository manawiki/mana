import { redirect } from "@remix-run/react";

import { z } from "zod";
import { zx } from "zodix";
import { ActionFunctionArgs, json } from "@remix-run/server-runtime";
import { authRestFetcher } from "~/utils/fetchers.server";
import { jsonWithSuccess } from "remix-toast";

//1) Comments need an accompanying parent entity, parent entity needs: totalComments, maxCommentDepth

export async function action({
   context: { payload, user },
   params,
   request,
}: ActionFunctionArgs) {
   const { intent } = await zx.parseForm(request, {
      intent: z.enum([
         "createTopLevelComment",
         "createCommentReply",
         "upVoteComment",
         "deleteComment",
         "restoreComment",
      ]),
   });

   if (!user)
      throw redirect("/login", {
         status: 302,
      });

   switch (intent) {
      case "createTopLevelComment": {
         const { comment, siteId, parentId, parentSlug, isCustomSite } =
            await zx.parseForm(request, {
               comment: z.string(),
               siteId: z.string(),
               parentId: z.string(),
               parentSlug: z.string(),
               isCustomSite: z.coerce.boolean(),
            });

         const createComment = await payload.create({
            collection: "comments",
            data: {
               site: siteId as any,
               comment: JSON.parse(comment),
               parentId: parentId,
               parentSlug: parentSlug,
               author: user.id as any,
               isTopLevel: true,
               isCustomSite,
            },
         });
         if (createComment) {
            return json({ message: "ok" });
         }
      }
      case "createCommentReply": {
         const {
            comment,
            commentParentId,
            commentDepth,
            parentId,
            parentSlug,
            siteId,
            isCustomSite,
         } = await zx.parseForm(request, {
            comment: z.string(),
            commentParentId: z.string(),
            commentDepth: z.coerce.number(),
            parentId: z.string(),
            parentSlug: z.string(),
            siteId: z.string(),
            isCustomSite: z.coerce.boolean(),
         });

         const commentReply = await payload.create({
            collection: "comments",
            data: {
               site: siteId as any,
               comment: JSON.parse(comment),
               parentId: parentId,
               parentSlug: parentSlug,
               author: user.id as any,
               isCustomSite,
            },
         });

         const reply = await payload.findByID({
            collection: "comments",
            id: commentParentId,
            depth: 0,
         });

         let existingReplies = reply?.replies || [];

         if (isCustomSite) {
            await authRestFetcher({
               isAuthOverride: true,
               method: "PATCH",
               path: `http://localhost:4000/api/${parentSlug}/${parentId}`,
               body: { maxCommentDepth: commentDepth },
            });
         } else {
            await payload.update({
               collection: parentSlug,
               id: parentId,
               data: {
                  maxCommentDepth: commentDepth,
               },
            });
         }

         //@ts-ignore
         await payload.update({
            collection: "comments",
            id: commentParentId,
            data: {
               //@ts-ignore
               replies: [commentReply.id, ...existingReplies],
            },
         });

         return json({ message: "ok" });
      }
      case "upVoteComment": {
         const { commentId, userId } = await zx.parseForm(request, {
            commentId: z.string(),
            userId: z.string(),
         });

         const comment = await payload.findByID({
            collection: "comments",
            id: commentId,
            depth: 0,
         });

         const existingVoteStatic = comment?.upVotesStatic ?? 0;

         //@ts-ignore
         let existingVotes = (comment?.upVotes as string[]) ?? [];

         //If vote exists, remove instead
         if (existingVotes.includes(userId)) {
            existingVotes.splice(existingVotes.indexOf(userId), 1);
            try {
               return await payload.update({
                  collection: "comments",
                  id: commentId,
                  data: {
                     //@ts-ignore
                     upVotes: existingVotes,
                     //@ts-ignore
                     upVotesStatic: existingVoteStatic - 1,
                  },
               });
            } catch (err: unknown) {
               console.log("ERROR");
               payload.logger.error(`${err}`);
            }
         }
         //@ts-ignore
         return await payload.update({
            collection: "comments",
            id: commentId,
            data: {
               upVotes: [...existingVotes, userId],
               //@ts-ignore
               upVotesStatic: existingVoteStatic + 1,
            },
         });
      }
      case "deleteComment": {
         const { commentId } = await zx.parseForm(request, {
            commentId: z.string(),
         });
         const comment = await payload.findByID({
            collection: "comments",
            id: commentId,
            depth: 0,
         });
         //@ts-ignore
         if (comment.replies && comment?.replies?.length > 0) {
            return await payload.update({
               collection: "comments",
               id: commentId,
               data: {
                  isDeleted: true,
               },
               overrideAccess: false,
               user,
            });
         }
         return await payload.delete({
            collection: "comments",
            id: commentId,
            overrideAccess: false,
            user,
         });
      }
      case "restoreComment": {
         const { commentId } = await zx.parseForm(request, {
            commentId: z.string(),
         });
         return await payload.update({
            collection: "comments",
            id: commentId,
            data: {
               isDeleted: false,
            },
            overrideAccess: false,
            user,
         });
      }
   }
}
