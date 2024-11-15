import { Suspense, useState } from "react";

import { defer, json, redirect } from "@remix-run/node";
import type {
   ActionFunctionArgs,
   LoaderFunctionArgs,
   MetaFunction,
} from "@remix-run/node";
import { Await, useFetcher, useLoaderData } from "@remix-run/react";
import {
   jsonWithSuccess,
   redirectWithSuccess,
   jsonWithError,
} from "remix-toast";
import type { Descendant } from "slate";
import invariant from "tiny-invariant";
import urlSlug from "url-slug";
import { z } from "zod";
import { zx } from "zodix";

import type { Post } from "payload/generated-types";
import { Icon } from "~/components/Icon";
import { Loading } from "~/components/Loading";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import { useIsStaffSiteAdminOwnerContributor } from "~/routes/_auth+/components/AdminOrStaffOrOwnerOrContributor";
import {
   EditorCommandBar,
   command_button,
} from "~/routes/_editor+/core/components/EditorCommandBar";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { ManaEditor } from "~/routes/_editor+/editor";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { cache } from "~/utils/cache.server";
import {
   assertIsDelete,
   assertIsPatch,
   assertIsPost,
} from "~/utils/http.server";
import {
   getMultipleFormData,
   uploadImage,
} from "~/utils/upload-handler.server";

import { PostActionBar } from "./components/PostActionBar";
import { PostBanner } from "./components/PostBanner";
import { PostBannerView } from "./components/PostBannerView";
import { PostDeleteModal } from "./components/PostDeleteModal";
import { PostHeaderEdit } from "./components/PostHeaderEdit";
import { PostHeaderView } from "./components/PostHeaderView";
import { PostTableOfContents } from "./components/PostTableOfContents";
import { PostUnpublishModal } from "./components/PostUnpublishModal";
import { fetchPost } from "./utils/fetchPost.server";
import { fetchComments } from "../../_comments+/utils/fetchComments.server";
import { fetchPostWithSlug } from "./utils/fetchPostWithSlug.server";
import { AdUnit } from "../_components/RampUnit";
import { Comments } from "../../_comments+/components/Comments";

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

   const { post, postContent, isChanged, versions } = await fetchPost({
      p,
      page,
      siteSlug,
      payload,
      user,
   });

   // This won't initiate loading until `fetchPost` is done, this is intended behavior since we rely on post to be fetched first
   const comments = fetchComments({
      maxCommentDepth: post.maxCommentDepth,
      parentId: post.id,
      user,
   });

   return defer({
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
   const hasAccess = useIsStaffSiteAdminOwnerContributor();
   const [isUnpublishOpen, setUnpublishOpen] = useState(false);
   const [isShowBanner, setIsBannerShowing] = useState(false);
   const [isDeleteOpen, setDeleteOpen] = useState(false);
   const enableAds = post.site.enableAds;

   return (
      <>
         <main className="mx-auto pb-3 max-tablet:px-3 pt-3 laptop:pt-6 relative">
            <PostActionBar post={post} />
            {hasAccess ? (
               <>
                  <PostHeaderEdit post={post} />
                  <PostBanner post={post} isShowBanner={isShowBanner} />
               </>
            ) : (
               <>
                  <PostHeaderView post={post} />
                  <PostBannerView post={post} />
               </>
            )}
            <PostTableOfContents data={postContent} />
            <AdUnit
               enableAds={enableAds}
               adType={{
                  desktop: "leaderboard_atf",
                  tablet: "leaderboard_atf",
                  mobile: "med_rect_atf",
               }}
               className="my-4 mx-auto flex items-center justify-center"
               selectorId="postDesktopLeaderATF"
            />
            {hasAccess ? (
               <>
                  <ManaEditor
                     collectionSlug="postContents"
                     fetcher={fetcher}
                     pageId={post.id}
                     defaultValue={postContent as Descendant[]}
                  />
                  <EditorCommandBar
                     collectionSlug="postContents"
                     postId={post.id}
                     fetcher={fetcher}
                     isChanged={isChanged}
                  >
                     <EditorCommandBar.PrimaryOptions>
                        <>
                           <Tooltip placement="right">
                              <TooltipTrigger
                                 title="Banner"
                                 onClick={() => setIsBannerShowing((v) => !v)}
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
                     postId={post.id}
                     isDeleteOpen={isDeleteOpen}
                     setDeleteOpen={setDeleteOpen}
                  />
                  <PostUnpublishModal
                     postId={post.id}
                     isUnpublishOpen={isUnpublishOpen}
                     setUnpublishOpen={setUnpublishOpen}
                  />
               </>
            ) : (
               <EditorView data={postContent} />
            )}
         </main>
         <Comments
            totalComments={post.totalComments}
            comments={comments}
            siteId={post.site.id}
            parentId={post.id}
            parentSlug="posts"
         />
      </>
   );
}

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
         const { name, postId } = await zx.parseForm(request, {
            name: z
               .string()
               .min(3, "Title is too short.")
               .max(200, "Title is too long."),
            postId: z.string(),
         });

         await payload.update({
            collection: "posts",
            id: postId,
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
         const { subtitle, postId } = await zx.parseForm(request, {
            subtitle: z.string(),
            postId: z.string(),
         });

         await payload.update({
            collection: "posts",
            id: postId,
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
         const bannerSchema = z.object({
            postBanner: z.any().optional(),
            siteId: z.string(),
            postId: z.string(),
         });

         const result = await getMultipleFormData({
            request,
            prefix: "postBanner",
            schema: bannerSchema,
         });
         if (result.success) {
            const { postBanner, postId, siteId } = result.data;
            const upload = await uploadImage({
               payload,
               image: postBanner,
               user,
               siteId,
            });
            await payload.update({
               collection: "posts",
               id: postId,
               data: {
                  //@ts-ignore
                  banner: upload.id,
               },
               overrideAccess: false,
               user,
            });
            return jsonWithSuccess(null, "Banner updated");
         }
      }
      case "deleteBanner": {
         const { bannerId, postId } = await zx.parseForm(request, {
            bannerId: z.string(),
            postId: z.string(),
         });
         await payload.delete({
            collection: "images",
            id: bannerId,
            overrideAccess: false,
            user,
         });
         await payload.update({
            collection: "posts",
            id: postId,
            data: {
               banner: null,
            },
            overrideAccess: false,
            user,
         });
         return jsonWithSuccess(null, "Banner deleted");
      }
      case "unpublish": {
         assertIsPost(request);
         const { postId } = await zx.parseForm(request, {
            postId: z.string(),
         });
         await payload.update({
            collection: "posts",
            id: postId,
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

         const { postId } = await zx.parseForm(request, {
            postId: z.string(),
         });
         //Pull post name again to generate a slug
         const { postData } = await fetchPostWithSlug({
            p,
            payload,
            siteSlug,
            user,
         });

         if (postData.name == undefined || postData.name == "Untitled") {
            return jsonWithError(null, "Add a title before publishing");
         }

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
               //Update the postContents collection to published
               const publishedPost = await payload.update({
                  collection: "postContents",
                  id: postData.id,
                  data: {
                     _status: "published",
                  },
                  overrideAccess: false,
                  user,
               });

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

               if (updatedPost && publishedPost)
                  return redirectWithSuccess(
                     //@ts-ignore
                     `/p/${updatedPost.slug}`,
                     `"${postData.name}" successfully published`,
                  );
            }
         }
         //Otherwise this is a regular publish, just update the postContents collection to published
         await payload.update({
            collection: "postContents",
            id: postId,
            data: {
               _status: "published",
            },
            overrideAccess: false,
            user,
         });

         // delete post, cache at fetchPostWithSlug.tsx
         cache.delete(`post-${postData?.slug}`);
         console.log(`deleted cache: post-${postData?.slug}`);

         // if the slug is already generated, and publishedAt is null, we need to update the publishedAt field too
         //@ts-ignore
         if (postData?.slug != postId && postData.publishedAt == null) {
            await payload.update({
               collection: "posts",
               id: postId,
               data: {
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

         const { postId } = await zx.parseForm(request, {
            postId: z.string(),
         });

         const post = await payload.delete({
            collection: "posts",
            id: postId,
            overrideAccess: false,
            user,
         });

         const postTitle = post?.name;

         return redirectWithSuccess(
            `/posts`,
            `"${postTitle}" successfully deleted`,
         );
      }
   }
}

export const meta: MetaFunction<typeof loader, any> = ({ data, matches }) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site.name;
   const siteDomain = matches?.[1]?.data?.site?.domain;
   const siteSlug = matches?.[1]?.data?.site?.slug;
   invariant(data?.post);

   const { name, subtitle, slug } = data?.post;

   const postBannerUrl = data?.post?.banner?.url;
   const postBanner = `${postBannerUrl}?crop=1200,630&aspect_ratio=1.9:1`;

   const canonicalURL = `https://${
      siteDomain ?? `${siteSlug}.mana.wiki`
   }/p/${slug}`;

   return [
      {
         title: `${name} - ${siteName}`,
      },
      {
         property: "og:title",
         content: `${name} - ${siteName}`,
      },
      { tagName: "link", rel: "canonical", href: canonicalURL },
      { property: "og:site_name", content: siteName },
      ...(subtitle
         ? [
              { property: "description", content: subtitle },
              { property: "og:description", content: subtitle },
           ]
         : []),
      ...(postBannerUrl ? [{ property: "og:image", content: postBanner }] : []),
      ...(canonicalURL ? [{ property: "og:url", content: canonicalURL }] : []),
   ];
};
