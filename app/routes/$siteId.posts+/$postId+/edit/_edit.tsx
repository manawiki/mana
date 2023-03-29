import { useLoaderData, useFetcher } from "@remix-run/react";
import { useCallback, useEffect, useMemo } from "react";
import {
   type ActionArgs,
   type LoaderArgs,
   json,
   redirect,
   V2_MetaFunction,
} from "@remix-run/node";
import {
   type FormResponse,
   assertIsPatch,
   getMultipleFormData,
   uploadImage,
   commitSession,
   getSession,
   setSuccessMessage,
   assertIsDelete,
} from "~/utils";

import { z } from "zod";
import { zx } from "zodix";
import { createCustomIssues } from "react-zorm";
import { PostHeaderEdit } from "./PostHeaderEdit";
import { FlowEditor } from "./Editor/Editor";
import { postSchema } from "../postSchema";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { toast } from "~/components";
import { LiveList } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "~/liveblocks.config";

export async function loader({
   context: { payload, user },
   params,
}: LoaderArgs) {
   const { postId } = zx.parseParams(params, {
      postId: z.string(),
   });

   const post = await payload.findByID({
      collection: "posts",
      id: postId,
      overrideAccess: false,
      user,
      depth: 2,
   });
   return { post };
}

export const handle = {
   i18n: "post",
};

export const meta: V2_MetaFunction = ({ data, parentsData }) => {
   const siteName = parentsData["routes/$siteId"].site.name;
   const postTitle = data.post.title;

   return [
      {
         title: `Edit | ${postTitle} - ${siteName}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export default function PostEditPage() {
   const fetcher = useFetcher();

   //Server response toast
   useEffect(() => {
      if (fetcher.type === "done") {
         if (fetcher.data?.success) {
            toast.success(fetcher.data?.success);
         }
         if (fetcher.data?.error) {
            toast.error(fetcher.data?.error);
         }
      }
   }, [fetcher.type]);

   const { post } = useLoaderData<typeof loader>();

   return (
      <main
         className="relative min-h-screen leading-7
         max-laptop:pt-10 max-laptop:pb-20 laptop:pt-6"
      >
         <TooltipProvider>
            <PostHeaderEdit post={post} />
            <RoomProvider
               id={post.id}
               initialStorage={{
                  blocks: new LiveList(post.content as never[]),
               }}
               initialPresence={{
                  selectedBlockId: null,
               }}
            >
               <ClientSideSuspense
                  fallback={
                     <div className="max-w-[728px] max-laptop:mx-3.5 space-y-4 mx-auto">
                        <div
                           className="animate-pulse bg-2  borer-color
                         w-full h-14 rounded-lg"
                        />
                        <div
                           className="animate-pulse bg-2  borer-color
                         w-full h-14 rounded-lg"
                        />
                        <div
                           className="animate-pulse bg-2  borer-color
                         w-full h-14 rounded-lg"
                        />
                     </div>
                  }
               >
                  {() => <FlowEditor />}
               </ClientSideSuspense>
            </RoomProvider>
         </TooltipProvider>
      </main>
   );
}

export async function action({
   context: { payload, user },
   request,
   params,
}: ActionArgs) {
   const { siteId, postId } = zx.parseParams(params, {
      siteId: z.string().length(10),
      postId: z.string(),
   });

   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   if (!user || !user.id) return redirect("/login", { status: 302 });

   const session = await getSession(request.headers.get("cookie"));
   const issues = createCustomIssues(postSchema);

   switch (intent) {
      case "updateTitle": {
         assertIsPatch(request);
         const result = await zx.parseFormSafe(request, postSchema);
         if (result.success) {
            const { title } = result.data;
            try {
               return await payload.update({
                  collection: "posts",
                  id: postId,
                  data: {
                     title,
                  },
                  overrideAccess: false,
                  user,
               });
            } catch (error) {
               console.log(error);
               return json({
                  error: "Something went wrong...unable to update title.",
               });
            }
         }
         //If user input has problems
         if (issues.hasIssues()) {
            return json<FormResponse>(
               { serverIssues: issues.toArray() },
               { status: 400 }
            );
         }
         // Last resort error message
         return json({
            error: "Something went wrong...unable to update title.",
         });
      }
      case "updateBanner": {
         assertIsPatch(request);
         const result = await getMultipleFormData({
            request,
            prefix: "postBanner",
            schema: postSchema,
         });
         if (result.success) {
            const { banner } = result.data;
            try {
               const bannerId = await uploadImage({
                  payload,
                  image: banner,
                  user,
               });
               return await payload.update({
                  collection: "posts",
                  id: postId,
                  data: {
                     banner: bannerId,
                  },
                  overrideAccess: false,
                  user,
               });
            } catch (error) {
               return json({
                  error: "Something went wrong...unable to update banner.",
               });
            }
         }
         //If user input has problems
         if (issues.hasIssues()) {
            return json<FormResponse>(
               { serverIssues: issues.toArray() },
               { status: 400 }
            );
         }
         // Last resort error message
         return json({
            error: "Something went wrong...unable to update banner.",
         });
      }
      case "deleteBanner": {
         assertIsDelete(request);
         const post = await payload.findByID({
            collection: "posts",
            id: postId,
            overrideAccess: false,
            user,
            depth: 2,
         });
         //@ts-expect-error
         const bannerId = post?.banner?.id;
         await payload.delete({
            collection: "images",
            id: bannerId,
            overrideAccess: false,
            user,
         });
         return await payload.update({
            collection: "posts",
            id: postId,
            data: {
               banner: "",
            },
            overrideAccess: false,
            user,
         });
      }
      case "delete": {
         assertIsDelete(request);
         const post = await payload.delete({
            collection: "posts",
            id: postId,
            overrideAccess: false,
            user,
         });
         //@ts-expect-error
         const bannerId = post?.banner?.id;
         if (bannerId) {
            await payload.delete({
               collection: "images",
               id: bannerId,
               overrideAccess: false,
               user,
            });
         }
         const postTitle = post?.title;
         setSuccessMessage(session, `"${postTitle}" successfully deleted`);
         return redirect(`/${siteId}/posts`, {
            headers: { "Set-Cookie": await commitSession(session) },
         });
      }
      case "unpublish": {
         await payload.update({
            collection: "posts",
            id: postId,
            data: {
               isPublished: false,
               publishedAt: "",
            },
            overrideAccess: false,
            user,
         });

         return redirect(`/${siteId}/posts`);
      }

      case "publish": {
         // Get data from liveblocks then save to MongoDB
         const result = await (
            await fetch(
               `https://api.liveblocks.io/v2/rooms/${postId}/storage`,
               {
                  headers: {
                     Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
                  },
               }
            )
         ).json();

         const data = result.data.blocks.data;

         await payload.update({
            collection: "posts",
            id: postId,
            data: {
               content: data,
               isPublished: true,
               publishedAt: new Date().toISOString(),
            },
            overrideAccess: false,
            user,
         });

         return redirect(`/${siteId}/posts`);
      }
      default:
         return null;
   }
}
