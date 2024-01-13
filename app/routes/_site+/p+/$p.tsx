import { Suspense, useState } from "react";

import { offset, shift } from "@floating-ui/react";
import { Float } from "@headlessui-float/react";
import { defer, json, redirect } from "@remix-run/node";
import type {
   ActionFunctionArgs,
   LoaderFunctionArgs,
   MetaFunction,
} from "@remix-run/node";
import { Await, useFetcher, useLoaderData } from "@remix-run/react";
import { jsonWithSuccess, redirectWithSuccess } from "remix-toast";
import type { Descendant } from "slate";
import invariant from "tiny-invariant";
import urlSlug from "url-slug";
import { z } from "zod";
import { zx } from "zodix";

import type { Post } from "payload/generated-types";
import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/utils/useIsStaffSiteAdminOwner";
import {
   EditorCommandBar,
   command_button,
} from "~/routes/_editor+/core/components/EditorCommandBar";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { ManaEditor } from "~/routes/_editor+/editor";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import {
   assertIsDelete,
   assertIsPatch,
   assertIsPost,
} from "~/utils/http.server";
import {
   getMultipleFormData,
   uploadImage,
} from "~/utils/upload-handler.server";

import { CommentHeader, Comments } from "./components/Comments";
import { PostActionBar } from "./components/PostActionBar";
import { PostDeleteModal } from "./components/PostDeleteModal";
import { PostHeaderEdit } from "./components/PostHeaderEdit";
import { PostHeaderView } from "./components/PostHeaderView";
import { PostTableOfContents } from "./components/PostTableOfContents";
import { PostUnpublishModal } from "./components/PostUnpublishModal";
import { fetchPost } from "./utils/fetchPost.server";
import { fetchPostComments } from "./utils/fetchPostComments.server";
import { fetchPostWithSlug } from "./utils/fetchPostWithSlug.server";
import { AdPlaceholder, AdUnit } from "../_components/Ramp";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);

   const { page } = zx.parseQuery(request, {
      page: z.coerce.number().optional(),
   });

   const { p } = zx.parseParams(params, {
      p: z.string(),
   });

   const comments = fetchPostComments({
      p,
      payload,
      siteSlug,
      user,
   });

   const { post, postContent, isChanged, versions } = await fetchPost({
      p,
      page,
      siteSlug,
      payload,
      user,
   });

   return defer({
      postPath: request.url,
      post,
      postContent,
      comments,
      isChanged,
      versions,
      siteSlug,
   });
}

export default function Post() {
   const { post, postContent, isChanged, comments } =
      useLoaderData<typeof loader>();
   const fetcher = useFetcher();
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();
   const [isUnpublishOpen, setUnpublishOpen] = useState(false);
   const [isShowBanner, setIsBannerShowing] = useState(false);
   const [isDeleteOpen, setDeleteOpen] = useState(false);
   const enableAds = post.site.enableAds;

   return (
      <Suspense fallback={<Loading />}>
         {hasAccess ? (
            <>
               <Float
                  middleware={[
                     shift({
                        padding: {
                           top: 80,
                        },
                     }),
                     offset({
                        mainAxis: 50,
                        crossAxis: 0,
                     }),
                  ]}
                  zIndex={20}
                  autoUpdate
                  placement="right-start"
                  show
               >
                  <div className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-6">
                     <PostActionBar post={post} />
                     <PostHeaderEdit post={post} isShowBanner={isShowBanner} />
                     {/* @ts-ignore */}
                     <PostTableOfContents data={postContent} />
                     {enableAds && <AdPlaceholder />}
                     <ManaEditor
                        collectionSlug="postContents"
                        fetcher={fetcher}
                        pageId={post.id}
                        defaultValue={postContent as Descendant[]}
                     />
                  </div>
                  <div>
                     <EditorCommandBar
                        collectionSlug="postContents"
                        pageId={post.id}
                        fetcher={fetcher}
                        isChanged={isChanged}
                     >
                        <EditorCommandBar.PrimaryOptions>
                           <>
                              <Tooltip placement="right">
                                 <TooltipTrigger
                                    onClick={() =>
                                       setIsBannerShowing((v) => !v)
                                    }
                                    className={command_button}
                                 >
                                    {isShowBanner ? (
                                       <Icon name="image-minus" size={14} />
                                    ) : (
                                       <Icon name="image" size={14} />
                                    )}
                                 </TooltipTrigger>
                                 <TooltipContent>Banner</TooltipContent>
                              </Tooltip>
                           </>
                        </EditorCommandBar.PrimaryOptions>
                        <EditorCommandBar.SecondaryOptions>
                           <>
                              {post.publishedAt && (
                                 <button
                                    className="text-1 flex w-full items-center gap-2 rounded-lg px-2
                                    py-1.5 text-sm font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                    onClick={() => setUnpublishOpen(true)}
                                 >
                                    <Icon
                                       name="eye-off"
                                       className="text-zinc-400"
                                       size={12}
                                    />
                                    <span className="text-xs">Unpublish</span>
                                 </button>
                              )}
                              <button
                                 className="text-1 flex w-full items-center gap-2 rounded-lg
                                              px-2 py-1.5 text-sm font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                 onClick={() => setDeleteOpen(true)}
                              >
                                 <Icon
                                    name="trash-2"
                                    className="text-red-400"
                                    size={12}
                                 />
                                 <span className="text-xs">Delete</span>
                              </button>
                           </>
                        </EditorCommandBar.SecondaryOptions>
                     </EditorCommandBar>
                     <PostDeleteModal
                        isDeleteOpen={isDeleteOpen}
                        setDeleteOpen={setDeleteOpen}
                     />
                     <PostUnpublishModal
                        isUnpublishOpen={isUnpublishOpen}
                        setUnpublishOpen={setUnpublishOpen}
                     />
                  </div>
               </Float>
            </>
         ) : (
            <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-6">
               <PostActionBar post={post} />
               <PostHeaderView post={post} />
               {/* @ts-ignore */}
               <PostTableOfContents data={postContent} />
               <AdPlaceholder>
                  <AdUnit
                     enableAds={enableAds}
                     adType="desktopLeaderATF"
                     selectorId="postDesktopLeaderATF"
                     className="flex items-center justify-center [&>div]:py-5"
                  />
               </AdPlaceholder>
               <EditorView data={postContent} />
            </main>
         )}
         <div className="pt-10">
            <CommentHeader totalComments={post.totalComments ?? undefined} />
            <Suspense fallback={<Loading />}>
               <Await resolve={comments}>
                  {(comments) => <Comments comments={comments} />}
               </Await>
            </Suspense>
         </div>
      </Suspense>
   );
}

const Loading = () => (
   <div className="flex items-center justify-center py-10">
      <Icon
         name="loader-2"
         size={20}
         className="animate-spin dark:text-zinc-500 text-zinc-400"
      />
   </div>
);

export async function action({
   context: { payload, user },
   request,
   params,
}: ActionFunctionArgs) {
   const { intent } = await zx.parseForm(request, {
      intent: z.enum([
         "updateField",
         "unpublish",
         "publish",
         "deletePost",
         "updateTitle",
         "updateSubtitle",
         "updateBanner",
         "deleteBanner",
         "createTopLevelComment",
         "createCommentReply",
         "deleteComment",
         "updateComment",
         "upVoteComment",
         "restoreComment",
      ]),
      field: z.enum(["title"]).optional(),
   });

   const { p } = zx.parseParams(params, {
      p: z.string(),
   });

   const { siteSlug } = await getSiteSlug(request, payload, user);

   if (!user) throw redirect("/login", { status: 302 });

   switch (intent) {
      case "updateTitle": {
         assertIsPatch(request);
         const { name } = await zx.parseForm(request, {
            name: z
               .string()
               .min(3, "Title is too short.")
               .max(200, "Title is too long."),
         });

         const { postData } = await fetchPostWithSlug({
            p,
            payload,
            siteSlug,
            user,
         });

         await payload.update({
            collection: "posts",
            id: postData.id,
            data: {
               name,
            },
            overrideAccess: false,
            user,
         });
         return jsonWithSuccess(null, "Title updated");
      }
      case "updateSubtitle": {
         assertIsPatch(request);
         const { subtitle } = await zx.parseForm(request, {
            subtitle: z.string(),
         });
         const { postData } = await fetchPostWithSlug({
            p,
            payload,
            siteSlug,
            user,
         });
         await payload.update({
            collection: "posts",
            id: postData.id,
            data: {
               //@ts-ignore
               subtitle,
            },
            overrideAccess: false,
            user,
         });
         return jsonWithSuccess(null, "Subtitle updated");
      }

      case "updateBanner": {
         assertIsPatch(request);
         const bannerSchema = z.object({
            postBanner: z
               .any()
               .refine((file) => file?.size <= 500000, `Max image size is 5MB.`)
               .refine(
                  (file) =>
                     [
                        "image/jpeg",
                        "image/jpg",
                        "image/png",
                        "image/webp",
                     ].includes(file?.type),
                  "Only .jpg, .jpeg, .png and .webp formats are supported.",
               )
               .optional(),
         });

         const result = await getMultipleFormData({
            request,
            prefix: "postBanner",
            schema: bannerSchema,
         });
         if (result.success) {
            const { postBanner } = result.data;
            const upload = await uploadImage({
               payload,
               image: postBanner,
               user,
            });
            const { postData } = await fetchPostWithSlug({
               p,
               payload,
               siteSlug,
               user,
            });

            await payload.update({
               collection: "posts",
               id: postData.id,
               data: {
                  //@ts-expect-error
                  banner: upload.id,
               },
               overrideAccess: false,
               user,
            });
            return jsonWithSuccess(null, "Banner updated");
         }
      }
      case "deleteBanner": {
         assertIsDelete(request);

         const { postData } = await fetchPostWithSlug({
            p,
            payload,
            siteSlug,
            user,
         });
         const bannerId = postData?.banner?.id;
         await payload.delete({
            collection: "images",
            //@ts-expect-error
            id: bannerId,
            overrideAccess: false,
            user,
         });
         await payload.update({
            collection: "posts",
            id: postData.id,
            data: {
               //@ts-expect-error
               banner: "",
            },
            overrideAccess: false,
            user,
         });
         return jsonWithSuccess(null, "Banner deleted");
      }
      case "unpublish": {
         assertIsPost(request);
         const { postData } = await fetchPostWithSlug({
            p,
            payload,
            siteSlug,
            user,
         });
         await payload.update({
            collection: "posts",
            id: postData.id,
            data: {
               publishedAt: null,
            },
            overrideAccess: false,
            user,
         });
         return jsonWithSuccess(null, "Post unpublished");
      }
      case "publish": {
         assertIsPost(request);
         //Pull post name again to generate a slug
         const { postData } = await fetchPostWithSlug({
            p,
            payload,
            siteSlug,
            user,
         });

         //TODO Feature: Allow user to manually set a url alias at publish

         //Alias is not updated on subsequent title updates.
         //If slug is same as post id, it's the first time a slug is being set
         //@ts-ignore
         if (postData?.slug == postData.id) {
            const newSlug = urlSlug(postData.name);

            const existingPostsWithSlug = await payload.find({
               collection: "posts",
               where: {
                  "site.slug": {
                     equals: siteSlug,
                  },
                  slug: {
                     equals: newSlug,
                  },
                  id: {
                     not_equals: postData?.id,
                  },
               },
               overrideAccess: false,
               user,
            });

            //If no collision and it's the first time we are generating the slug, publish with alias.
            if (existingPostsWithSlug.totalDocs == 0) {
               //@ts-ignore
               const updatedPost = await payload.update({
                  collection: "posts",
                  id: postData.id,
                  data: {
                     slug: newSlug,
                     publishedAt: new Date().toISOString(),
                  },
                  overrideAccess: false,
                  user,
               });
               if (updatedPost)
                  return redirectWithSuccess(
                     //@ts-ignore
                     `/p/${updatedPost.slug}`,
                     `"${postData.name}" successfully published`,
                  );
            }
         }
         //Update the postContents collection to published
         await payload.update({
            collection: "postContents",
            id: postData.id,
            data: {
               _status: "published",
            },
            overrideAccess: false,
            user,
         });
         // if the slug is already generated, and publishedAt is null, we need to update the publishedAt field too
         //@ts-ignore
         if (postData?.slug != postData.id && postData.publishedAt == null) {
            await payload.update({
               collection: "posts",
               id: postData.id,
               data: {
                  _status: "published",
                  //@ts-ignore
                  publishedAt: new Date().toISOString(),
               },
               overrideAccess: false,
               user,
            });
         }
         return jsonWithSuccess(null, "Latest update published");
      }
      case "deletePost": {
         assertIsDelete(request);
         const { postData } = await fetchPostWithSlug({
            p,
            payload,
            siteSlug,
            user,
         });

         const post = await payload.delete({
            collection: "posts",
            id: postData?.id,
            overrideAccess: false,
            user,
         });

         const postTitle = post?.name;

         return redirectWithSuccess(
            `/posts`,
            `"${postTitle}" successfully deleted`,
         );
      }
      case "createTopLevelComment": {
         const { comment } = await zx.parseForm(request, {
            comment: z.string(),
         });
         const { postData } = await fetchPostWithSlug({
            p,
            payload,
            siteSlug,
            user,
         });

         return await payload.create({
            collection: "comments",
            data: {
               site: postData?.site.id as any,
               comment: JSON.parse(comment),
               postParent: postData.id as any,
               author: user.id as any,
               isTopLevel: true,
            },
         });
      }
      case "createCommentReply": {
         const { comment, commentParentId, commentDepth } = await zx.parseForm(
            request,
            {
               comment: z.string(),
               commentParentId: z.string(),
               commentDepth: z.coerce.number(),
            },
         );

         const { postData } = await fetchPostWithSlug({
            p,
            payload,
            siteSlug,
            user,
         });

         invariant(postData, "Post doesn't exist");

         const commentReply = await payload.create({
            collection: "comments",
            data: {
               site: postData?.site.id as any,
               comment: JSON.parse(comment),
               postParent: postData.id as any,
               author: user.id as any,
            },
         });

         const reply = await payload.findByID({
            collection: "comments",
            id: commentParentId,
            depth: 0,
         });

         let existingReplies = reply?.replies || [];

         await payload.update({
            collection: "posts",
            id: postData.id,
            data: {
               maxCommentDepth: commentDepth,
            },
         });

         //@ts-ignore
         await payload.update({
            collection: "comments",
            id: commentParentId,
            data: {
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

export const meta: MetaFunction<typeof loader, any> = ({ data, matches }) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site.name;

   invariant(data?.post);

   const { name, subtitle, slug } = data?.post;

   const postBannerUrl = data?.post?.banner?.url;
   const postBanner = `${postBannerUrl}?crop=1200,630&aspect_ratio=1.9:1`;
   const postUrl = `${data.postPath}/p/${slug}`;

   return [
      {
         title: `${name} - ${siteName}`,
      },
      {
         property: "og:title",
         content: `${name} - ${siteName}`,
      },
      { property: "og:site_name", content: siteName },
      ...(subtitle
         ? [
              { property: "description", content: subtitle },
              { property: "og:description", content: subtitle },
           ]
         : []),
      ...(postBannerUrl ? [{ property: "og:image", content: postBanner }] : []),
      ...(postUrl ? [{ property: "og:url", content: postUrl }] : []),
   ];
};
