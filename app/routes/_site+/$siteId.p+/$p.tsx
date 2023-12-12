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
import { request as gqlRequest } from "graphql-request";
import { jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import type { Payload } from "payload";
import { select } from "payload-query";
import {
   jsonWithError,
   jsonWithSuccess,
   redirectWithSuccess,
} from "remix-toast";
import type { Descendant } from "slate";
import invariant from "tiny-invariant";
import urlSlug from "url-slug";
import { z } from "zod";
import { zx } from "zodix";

import type { Post, User } from "payload/generated-types";
import customConfig from "~/_custom/config.json";
import { isSiteOwnerOrAdmin } from "~/access/site";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components";
import { Icon } from "~/components/Icon";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/src/functions";
import {
   EditorCommandBar,
   command_button,
} from "~/routes/_editor+/core/components/EditorCommandBar";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { ManaEditor } from "~/routes/_editor+/editor";
import {
   assertIsDelete,
   assertIsPatch,
   assertIsPost,
   getMultipleFormData,
   gqlEndpoint,
   uploadImage,
} from "~/utils";
import { cacheThis, gqlRequestWithCache } from "~/utils/cache.server";

import { CommentHeader, Comments } from "./components/Comments";
import { PostActionBar } from "./components/PostActionBar";
import { PostDeleteModal } from "./components/PostDeleteModal";
import { PostHeaderEdit } from "./components/PostHeaderEdit";
import { PostHeaderView } from "./components/PostHeaderView";
import { PostTableOfContents } from "./components/PostTableOfContents";
import { PostUnpublishModal } from "./components/PostUnpublishModal";
import { mainContainerStyle } from "../$siteId+/_index";
import { AdPlaceholder, AdUnit } from "../$siteId+/src/components";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const siteId = params?.siteId ?? customConfig?.siteId;

   const { page } = zx.parseQuery(request, {
      page: z.coerce.number().optional(),
   });

   const { p } = zx.parseParams(params, {
      p: z.string(),
   });

   const comments = fetchPostComments({
      p,
      payload,
      siteId,
      user,
   });

   const { post, postContent, isChanged, versions } = await fetchPost({
      p,
      page,
      siteId,
      payload,
      user,
   });

   return defer({
      post,
      postContent,
      comments,
      isChanged,
      versions,
      siteId,
   });
}

export const meta: MetaFunction<typeof loader> = ({
   data,
   matches,
}: {
   data: any;
   matches: any;
}) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/$siteId+/_layout",
   )?.data?.site.name;

   const siteSlug = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/$siteId+/_layout",
   )?.data?.site.slug;

   const postTitle = data?.post?.name;
   const postStatus = data?.post?._status;
   const postBannerUrl = data?.post?.banner?.url;
   const postBanner = `${postBannerUrl}?crop=1200,630&aspect_ratio=1.9:1`;
   const postDescription = data?.post?.subtitle;
   const postSlug = data?.post?.slug;
   const postUrl = `https://mana.wiki/${siteSlug}/p/${postSlug}`;

   return [
      {
         title:
            postStatus == "published"
               ? `${postTitle} - ${siteName}`
               : `Edit | ${postTitle} - ${siteName}`,
      },
      {
         property: "og:title",
         content:
            postStatus == "published"
               ? `${postTitle} - ${siteName}`
               : `Edit | ${postTitle} - ${siteName}`,
      },
      { property: "og:site_name", content: siteName },
      ...(postDescription
         ? [
              { property: "description", content: postDescription },
              { property: "og:description", content: postDescription },
           ]
         : []),
      ...(postBannerUrl ? [{ property: "og:image", content: postBanner }] : []),
      ...(postUrl ? [{ property: "og:url", content: postUrl }] : []),
   ];
};

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
      <>
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
            <main className={mainContainerStyle}>
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
            <Suspense
               fallback={
                  <div className="flex items-center justify-center py-10">
                     <Icon
                        name="loader-2"
                        size={20}
                        className="animate-spin dark:text-zinc-500 text-zinc-400"
                     />
                  </div>
               }
            >
               <Await resolve={comments}>
                  {(comments) => <Comments comments={comments} />}
               </Await>
            </Suspense>
         </div>
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
         "createTopLevelComment",
         "createCommentReply",
         "deleteComment",
         "updateComment",
         "upVoteComment",
         "restoreComment",
      ]),
      field: z.enum(["title"]).optional(),
   });

   const { p, siteId } = zx.parseParams(params, {
      p: z.string(),
      siteId: z.string(),
   });

   const url = new URL(request.url).pathname;

   if (!user) throw redirect(`/login?redirectTo=${url}`, { status: 302 });

   switch (intent) {
      case "updateTitle": {
         assertIsPatch(request);
         const result = await zx.parseFormSafe(request, {
            name: z
               .string()
               .min(3, "Title is too short.")
               .max(200, "Title is too long."),
         });
         if (result.success) {
            const { name } = result.data;

            const { postData } = await fetchPostWithSlug({
               p,
               payload,
               siteId,
               user,
            });

            invariant(postData, "Post doesn't exist");

            return await payload.update({
               collection: "posts",
               id: postData.id,
               data: {
                  name,
               },
               overrideAccess: false,
               user,
            });
         }
         const errorMessage = JSON.parse(result.error.message)
            .map((item: any) => item.message)
            .join("\n");

         return jsonWithError(null, errorMessage);
      }
      case "updateSubtitle": {
         assertIsPatch(request);
         const { subtitle } = await zx.parseForm(request, {
            subtitle: z.string(),
         });
         try {
            const { postData } = await fetchPostWithSlug({
               p,
               payload,
               siteId,
               user,
            });
            invariant(postData, "Post doesn't exist");
            return await payload.update({
               collection: "posts",
               id: postData.id,
               data: {
                  //@ts-ignore
                  subtitle,
               },
               overrideAccess: false,
               user,
            });
         } catch (err: unknown) {
            payload.logger.error(err);
            payload.logger.error("Error updating post sub title");
            return jsonWithError(null, "Error updating post sub title");
         }
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
               siteId,
               user,
            });

            invariant(postData, "Post doesn't exist");

            return await payload.update({
               collection: "posts",
               id: postData.id,
               data: {
                  //@ts-expect-error
                  banner: upload.id,
               },
               overrideAccess: false,
               user,
            });
         }
         const errorMessage = JSON.parse(result.error.message)
            .map((item: any) => item.message)
            .join("\n");

         return jsonWithError(null, errorMessage);
      }
      case "deleteBanner": {
         assertIsDelete(request);

         const { postData } = await fetchPostWithSlug({
            p,
            payload,
            siteId,
            user,
         });

         invariant(postData, "Post doesn't exist");

         const bannerId = postData?.banner?.id;
         await payload.delete({
            collection: "images",
            //@ts-expect-error
            id: bannerId,
            overrideAccess: false,
            user,
         });
         return await payload.update({
            collection: "posts",
            id: postData.id,
            data: {
               //@ts-expect-error
               banner: "",
            },
            overrideAccess: false,
            user,
         });
      }
      case "unpublish": {
         assertIsPost(request);
         const { postData } = await fetchPostWithSlug({
            p,
            payload,
            siteId,
            user,
         });
         invariant(postData, "Post doesn't exist");

         await payload.update({
            collection: "posts",
            id: postData.id,
            data: {
               //@ts-ignore
               publishedAt: "",
            },
            overrideAccess: false,
            user,
         });
         return jsonWithSuccess(
            { result: "Data saved successfully" },
            "Post successfully unpublished",
         );
      }
      case "publish": {
         assertIsPost(request);
         //Pull post name again to generate a slug
         const { postData } = await fetchPostWithSlug({
            p,
            payload,
            siteId,
            user,
         });
         invariant(postData, "Post doesn't exist");

         const newSlug = urlSlug(postData.name);

         //See if duplicate exists on the same site

         try {
            const existingPostsWithSlug = await payload.find({
               collection: "posts",
               where: {
                  "site.slug": {
                     equals: siteId,
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

            //If no collision and it's the first time we are generating the slug, publish with alias.
            //Alias is not updated on subsequent title updates.
            //Otherwise the slug already exists so we just update publishedAt.
            //TODO Feature: Allow user to manually set a url alias at publish
            //If slug is same as post id, it's the first time a slug is being set
            const firstSlug =
               //@ts-ignore
               postData?.slug == postData.id &&
               existingPostsWithSlug.totalDocs == 0;
            if (firstSlug) {
               //@ts-ignore
               await payload.update({
                  collection: "posts",
                  id: postData.id,
                  data: {
                     slug: newSlug,
                     publishedAt: new Date().toISOString(),
                  },
                  overrideAccess: false,
                  user,
               });
            }
            await payload.update({
               collection: "posts",
               id: postData.id,
               data: {
                  //@ts-ignore
                  publishedAt: new Date().toISOString(),
               },
               overrideAccess: false,
               user,
            });
            return jsonWithSuccess(null, "Post successfully published");
         } catch (err: unknown) {
            payload.logger.error(err);
            payload.logger.error(`Error creating post`);
         }
      }
      case "deletePost": {
         assertIsDelete(request);
         const { postData } = await fetchPostWithSlug({
            p,
            payload,
            siteId,
            user,
         });

         invariant(postData, "Post doesn't exist");

         const post = await payload.delete({
            collection: "posts",
            id: postData?.id,
            overrideAccess: false,
            user,
         });

         await payload.delete({
            collection: "postContents",
            id: postData?.id,
            overrideAccess: false,
            user,
         });

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

         return redirectWithSuccess(
            `/${siteId}/posts`,
            `"${postTitle}" successfully deleted`,
         );
      }
      case "createTopLevelComment": {
         const result = await zx.parseFormSafe(request, {
            comment: z.string(),
         });
         if (result.success) {
            const { comment } = result.data;
            const { postData } = await fetchPostWithSlug({
               p,
               payload,
               siteId,
               user,
            });
            invariant(postData, "Post doesn't exist");
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
            siteId,
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
         const result = await zx.parseFormSafe(request, {
            commentId: z.string(),
            userId: z.string(),
         });
         if (result.success) {
            const { commentId, userId } = result.data;
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

/**
 * Get the immutable post Id from post slug.
 * Cache if anon.
 */
async function fetchPostWithSlug({
   p,
   payload,
   siteId,
   user,
}: {
   p: string;
   payload: Payload;
   siteId: string;
   user?: User;
}) {
   const { docs: postsAll } = !user
      ? await cacheThis(
           () =>
              payload.find({
                 collection: "posts",
                 where: {
                    "site.slug": {
                       equals: siteId,
                    },
                    slug: {
                       equals: p,
                    },
                 },
              }),
           `post-${p}`,
        )
      : await payload.find({
           collection: "posts",
           where: {
              "site.slug": {
                 equals: siteId,
              },
              slug: {
                 equals: p,
              },
           },
        });

   const post = postsAll[0];

   return { postData: post };
}

async function fetchPost({
   p,
   payload,
   user,
   siteId,
   page = 1,
}: {
   p: string;
   payload: Payload;
   user?: User;
   siteId: string;
   page: number | undefined;
}) {
   const { postData } = await fetchPostWithSlug({
      p,
      payload,
      siteId,
      user,
   });

   //If can't find post with slug, attempt to findById
   if (!postData) {
      const postById = await payload.findByID({
         collection: "posts",
         id: p,
      });

      if (!postById) throw redirect("/404", 404);

      //Post exists, we received the ID as a URL param and want to redirect to the canonical path instead.
      throw redirect(`/${postById.site.slug}/p/${postById.slug}`, 301);
   }

   if (!user) {
      //If anon and data exists, return post data now
      if (postData) {
         return { post: postData, postContent: postData.content.content };
      }
      //Otherwise post doesn't exist
      if (!postData) {
         throw redirect("/404", 404);
      }
   }

   //Now we handle authenticated querying
   invariant(user, "Not logged in");

   const hasAccess = isSiteOwnerOrAdmin(user?.id, postData.site);

   //If user has access, pull versions
   if (hasAccess) {
      const postContent = await payload.findByID({
         collection: "postContents",
         id: postData.id,
         draft: true,
         user,
         overrideAccess: false,
      });
      const versionData = await payload.findVersions({
         collection: "postContents",
         depth: 2,
         where: {
            parent: {
               equals: postContent.id,
            },
         },
         limit: 20,
         user,
         page,
      });
      const versions = versionData.docs
         .filter((doc) => doc.version._status === "published")
         .map((doc) => {
            const versionRow = select({ id: true, updatedAt: true }, doc);
            const version = select(
               {
                  id: false,
                  versionAuthor: true,
                  content: true,
                  _status: true,
               },
               doc.version,
            );

            //Combine final result
            const result = {
               ...versionRow,
               version,
            };

            return result;
         });

      const isChanged =
         JSON.stringify(postContent.content) !=
            JSON.stringify(postData.content.content) ||
         postData.publishedAt == null;

      return {
         post: postData,
         postContent: postContent.content,
         isChanged,
         versions,
      };
   }
   //return for regular type of user
   return {
      post: postData,
      postContent: postData.content.content,
      isChanged: false,
   };
}

async function fetchPostComments({
   p,
   payload,
   siteId,
   user,
}: {
   p: string;
   payload: Payload;
   siteId: string;
   user?: User;
}) {
   const { postData } = await fetchPostWithSlug({
      p,
      payload,
      siteId,
      user,
   });

   const postDataId = postData?.id;

   const commentDepth = postData?.maxCommentDepth ?? 1;

   function depthAndDeletionDecorator(array: any, depth = 1) {
      return array.map((child: any) =>
         Object.assign(child, {
            depth,
            //Remove content if deleted
            // ...(child.isDeleted == true && { comment: undefined }),
            replies: depthAndDeletionDecorator(child.replies || [], depth + 1),
         }),
      );
   }

   //Recursively generated nested query to get all replies
   function generateNestedJsonObject(depth: number) {
      if (depth === 0) {
         return {};
      } else {
         let object = {
            id: true,
            createdAt: true,
            isDeleted: true,
            comment: true,
            upVotesStatic: true,
            author: {
               username: true,
               avatar: {
                  url: true,
               },
            },
         };
         for (let i = 0; i < depth; i++) {
            //@ts-ignore
            object["replies"] = generateNestedJsonObject(depth - 1);
         }
         return object;
      }
   }

   const nestedJsonObject = generateNestedJsonObject(commentDepth);

   //Construct the query in JSON to then parse to graphql format
   const query = {
      query: {
         __variables: {
            postParentId: "JSON!",
         },
         comments: {
            __aliasFor: "Comments",
            __args: {
               where: {
                  isTopLevel: { equals: true },
                  postParent: { equals: new VariableType("postParentId") },
               },
               sort: "-upVotesStatic",
            },
            docs: {
               id: true,
               createdAt: true,
               isDeleted: true,
               comment: true,
               upVotesStatic: true,
               isTopLevel: true,
               isPinned: true,
               author: {
                  username: true,
                  avatar: {
                     url: true,
                  },
               },
               ...nestedJsonObject,
            },
         },
      },
   };
   const graphql_query = jsonToGraphQLQuery(query, { pretty: true });

   //Cache comments if non
   const fetchComments = !user
      ? await gqlRequestWithCache(gqlEndpoint({}), graphql_query, {
           postParentId: postDataId,
        })
      : await gqlRequest(gqlEndpoint({}), graphql_query, {
           postParentId: postDataId,
        });

   const comments = depthAndDeletionDecorator(
      //@ts-ignore
      fetchComments?.comments?.docs,
      //@ts-ignore
   ) as Comments[];

   return comments ?? null;
}
