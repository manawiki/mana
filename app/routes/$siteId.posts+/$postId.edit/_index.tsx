import { useLoaderData, useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import type { V2_MetaFunction } from "@remix-run/node";
import {
   type ActionArgs,
   type LoaderArgs,
   json,
   redirect,
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
   slugify,
} from "~/utils";
import { z } from "zod";
import { zx } from "zodix";
import { createCustomIssues } from "react-zorm";
import { ForgeEditor } from "~/modules/editor/Editor";
import { postSchema } from "../utils/postSchema";
import { toast } from "~/components";
import { LiveList } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "~/liveblocks.config";
import { nanoid } from "nanoid";
import type { CustomElement } from "~/modules/editor/types";
import { BlockType } from "~/modules/editor/types";
import { PostSkeletonLoader } from "~/components/PostSkeletonLoader";
import { PostHeaderEdit } from "./components/PostHeaderEdit";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const { postId, siteId } = zx.parseParams(params, {
      postId: z.string(),
      siteId: z.string(),
   });
   if (!user)
      throw redirect(`/login?redirectTo=/${siteId}/posts/${postId}/edit`);

   const post = await payload.findByID({
      collection: "posts",
      id: postId,
      overrideAccess: false,
      user,
      depth: 2,
   });

   const { page } = zx.parseQuery(request, {
      page: z.coerce.number().optional(),
   });

   //We disable perms since ID is not a paramater we can use, if above perms pass, we pull versions.
   const versions = await payload.findVersions({
      collection: "posts",
      depth: 2,
      where: {
         parent: {
            equals: postId,
         },
      },
      limit: 20,
      user,
      page: page ?? 1,
   });
   return { post, versions };
}

export const handle = {
   i18n: "post",
};

export const meta: V2_MetaFunction = ({ data, matches }) => {
   const siteName = matches.find(({ id }) => id === "routes/$siteId+/_layout")
      ?.data?.site.name;
   const postTitle = data?.post?.name ?? "";

   return [
      {
         title: `Edit | ${postTitle} - ${siteName}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

const initialValue: CustomElement[] = [
   {
      id: nanoid(),
      type: BlockType.Paragraph,
      children: [
         {
            text: "",
         },
      ],
   },
];

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

   const { post, versions } = useLoaderData<typeof loader>();

   return (
      <main
         className="relative min-h-screen
         max-laptop:pb-20 max-laptop:pt-10 laptop:pt-14"
      >
         <RoomProvider
            key={post.id}
            id={post.id}
            initialStorage={{
               blocks: new LiveList(initialValue as any) as any,
            }}
            initialPresence={{
               selectedBlockId: null,
            }}
         >
            <ClientSideSuspense fallback={<PostSkeletonLoader />}>
               {() => (
                  <>
                     <PostHeaderEdit versions={versions} post={post} />
                     <ForgeEditor />
                  </>
               )}
            </ClientSideSuspense>
         </RoomProvider>
      </main>
   );
}

export async function action({
   context: { payload, user },
   request,
   params,
}: ActionArgs) {
   const { siteId, postId } = zx.parseParams(params, {
      siteId: z.string(),
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
            const { name } = result.data;
            const slug = slugify(name ?? "");
            try {
               return await payload.update({
                  collection: "posts",
                  id: postId,
                  data: {
                     name,
                     slug,
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
      case "updateSubtitle": {
         assertIsPatch(request);
         const result = await zx.parseFormSafe(request, postSchema);
         if (result.success) {
            const { subtitle } = result.data;
            try {
               return await payload.update({
                  collection: "posts",
                  id: postId,
                  data: {
                     subtitle,
                  },
                  overrideAccess: false,
                  user,
               });
            } catch (error) {
               console.log(error);
               return json({
                  error: "Something went wrong...unable to update subtitle.",
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
            error: "Something went wrong...unable to update subtitle.",
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
               const upload = await uploadImage({
                  payload,
                  image: banner,
                  user,
               });
               return await payload.update({
                  collection: "posts",
                  id: postId,
                  draft: true,
                  data: {
                     banner: upload.id,
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
            draft: true,
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
            draft: true,
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
         const postTitle = post?.name;
         setSuccessMessage(session, `"${postTitle}" successfully deleted`);
         return redirect(`/${siteId}/posts`, {
            headers: { "Set-Cookie": await commitSession(session) },
         });
      }

      case "versionUpdate": {
         const { versionId } = await zx.parseForm(request, {
            versionId: z.string(),
         });
         return await payload.restoreVersion({
            collection: "posts",
            id: versionId,
            overrideAccess: false,
            user,
         });
      }

      case "updateCollabStatus": {
         const { collabStatus } = await zx.parseForm(request, {
            collabStatus: zx.BoolAsString,
         });
         //toggle status
         return await payload.update({
            collection: "posts",
            id: postId,
            data: {
               collaboration: collabStatus,
            },
            overrideAccess: false,
            user,
         });
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

         return await payload.update({
            collection: "posts",
            id: postId,
            data: {
               _status: "published",
               content: data,
               publishedAt: new Date().toISOString(),
            },
            overrideAccess: false,
            user,
         });
      }

      case "unpublish": {
         return await payload.update({
            collection: "posts",
            id: postId,
            data: {
               _status: "draft",
               publishedAt: "",
            },
            overrideAccess: false,
            user,
         });
      }

      default:
         return null;
   }
}
