import { Fragment, useState } from "react";

import { offset, shift } from "@floating-ui/react";
import { Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import { json, redirect } from "@remix-run/node";
import type {
   ActionFunctionArgs,
   LoaderFunctionArgs,
   MetaFunction,
} from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import type { Payload } from "payload";
import { select } from "payload-query";
import type { Descendant } from "slate";
import { useSlate } from "slate-react";
import invariant from "tiny-invariant";
import urlSlug from "url-slug";
import { z } from "zod";
import { zx } from "zodix";

import type { Post, Site, User } from "payload/generated-types";
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
   commitSession,
   getMultipleFormData,
   getSession,
   setErrorMessage,
   setSuccessMessage,
   uploadImage,
} from "~/utils";

import { Comments } from "./components/Comments";
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

   const { post, isChanged, versions } = await fetchPost({
      p,
      page,
      payload,
      siteId,
      user,
   });

   return await json({ post, isChanged, versions, siteId });
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

   const postTitle = data?.post?.name;
   const postStatus = data?.post?._status;
   const postBannerUrl = data?.post?.banner?.url;
   const postBanner = `${postBannerUrl}?crop=1200,630&aspect_ratio=1.9:1`;
   const postDescription = data?.post?.subtitle;
   const postSlug = data?.post?.slug;

   const site = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/$siteId+/_layout",
   )?.data?.site;

   //todo this is producing bad canonical urls
   // const postUrl = site.domain
   //    ? `https://${site.domain}/p/${site.slug}`
   //    : `https://mana.wiki/p/${postSlug}`;

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
      { property: "og:site_name", content: site.name },
      ...(postDescription
         ? [
              { property: "description", content: postDescription },
              { property: "og:description", content: postDescription },
           ]
         : []),
      ...(postBannerUrl ? [{ property: "og:image", content: postBanner }] : []),
      // ...(postUrl ? [{ property: "og:url", content: postUrl }] : []),
   ];
};

export default function Post() {
   const { post, isChanged } = useLoaderData<typeof loader>();
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
                     <div className="pb-3 mb-4 border-b border-color flex items-center justify-between">
                        <Link
                           to={`/${post.site.slug}/posts`}
                           className="flex items-center hover:underline group gap-2"
                        >
                           <Icon name="arrow-left" size={16} />
                           <div className="font-bold text-sm text-1">Posts</div>
                        </Link>
                        <div className="flex items-center gap-2">
                           <div className="flex items-center gap-1.5 font-bold text-xs">
                              <Icon
                                 name="message-circle"
                                 className="text-zinc-400 dark:text-zinc-500"
                                 size={15}
                              />
                              <div className="text-1">Comments</div>
                              <div
                                 className="rounded-full text-[10px] flex items-center 
                              justify-center dark:bg-dark450 bg-zinc-100 w-5 h-5 ml-0.5"
                              >
                                 4
                              </div>
                           </div>
                           <Icon
                              name="slash"
                              size={16}
                              className="text-zinc-200 text-lg -rotate-[30deg] dark:text-zinc-700"
                           />
                           <div className="flex items-center gap-1.5 font-bold text-xs">
                              <Icon
                                 name="folder"
                                 className="text-zinc-400 dark:text-zinc-500"
                                 size={15}
                              />
                              <div className="text-1">General</div>
                              <Popover>
                                 {({ open }) => (
                                    <>
                                       <Float
                                          as={Fragment}
                                          enter="transition ease-out duration-200"
                                          enterFrom="opacity-0 translate-y-1"
                                          enterTo="opacity-100 translate-y-0"
                                          leave="transition ease-in duration-150"
                                          leaveFrom="opacity-100 translate-y-0"
                                          leaveTo="opacity-0 translate-y-1"
                                          placement="bottom-end"
                                          offset={4}
                                       >
                                          <Popover.Button className="dark:bg-dark450 bg-zinc-100 ml-0.5 flex items-center justify-center rounded-full w-5 h-5">
                                             {open ? (
                                                <Icon
                                                   name="x"
                                                   className="text-1"
                                                   size={14}
                                                />
                                             ) : (
                                                <Icon
                                                   className="pt-[1px]"
                                                   name="chevron-down"
                                                   size={14}
                                                />
                                             )}
                                          </Popover.Button>
                                          <Popover.Panel
                                             className="border-color-sub justify-items-center text-1 bg-3-sub shadow-1 
                                       gap-1 z-30 grid grid-cols-9 w-40 rounded-lg border p-2 shadow-sm"
                                          >
                                             Hello
                                          </Popover.Panel>
                                       </Float>
                                    </>
                                 )}
                              </Popover>
                           </div>
                           <Icon
                              name="slash"
                              size={16}
                              className="text-zinc-200 text-lg -rotate-[30deg] dark:text-zinc-700"
                           />
                           <button
                              className="rounded-md text-[10px] flex items-center shadow-sm shadow-1
                              justify-center dark:bg-dark450 bg-zinc-100 w-6 h-6"
                           >
                              <Icon
                                 className="text-zinc-400"
                                 name="bookmark"
                                 size={14}
                              />
                           </button>
                        </div>
                     </div>
                     <PostHeaderEdit post={post} isShowBanner={isShowBanner} />
                     <PostTableOfContents data={post.content} />
                     {enableAds && <AdPlaceholder />}
                     <ManaEditor
                        collectionSlug="posts"
                        fetcher={fetcher}
                        pageId={post.id}
                        defaultValue={post.content as Descendant[]}
                     />
                  </div>
                  <div>
                     <EditorCommandBar
                        collectionSlug="posts"
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
                              {post._status == "published" && (
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
               <Comments />
            </>
         ) : (
            <main className={mainContainerStyle}>
               <PostHeaderView post={post} />
               <PostTableOfContents data={post.content} />
               <AdPlaceholder>
                  <AdUnit
                     enableAds={enableAds}
                     adType="desktopLeaderATF"
                     selectorId="postDesktopLeaderATF"
                     className="flex items-center justify-center [&>div]:py-5"
                  />
               </AdPlaceholder>
               <EditorView data={post.content} />
            </main>
         )}
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

   const { p, siteId } = zx.parseParams(params, {
      p: z.string().length(10),
      siteId: z.string(),
   });

   if (!user) throw redirect("/login", { status: 302 });

   const session = await getSession(request.headers.get("cookie"));

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
            return await payload.update({
               collection: "posts",
               id: p,
               data: {
                  name,
               },
               autosave: true,
               draft: true,
               overrideAccess: false,
               user,
            });
         }
         const errorMessage = JSON.parse(result.error.message)
            .map((item: any) => item.message)
            .join("\n");

         if (errorMessage) setErrorMessage(session, `${errorMessage}`);
         return redirect(`/${siteId}/p/${p}`, {
            headers: { "Set-Cookie": await commitSession(session) },
         });
      }
      case "updateSubtitle": {
         assertIsPatch(request);
         const result = await zx.parseFormSafe(request, {
            subtitle: z.string(),
         });
         if (result.success) {
            const { subtitle } = result.data;
            return await payload.update({
               collection: "posts",
               id: p,
               data: {
                  subtitle,
               },
               autosave: true,
               draft: true,
               overrideAccess: false,
               user,
            });
         }
         const errorMessage = JSON.parse(result.error.message)
            .map((item: any) => item.message)
            .join("\n");

         if (errorMessage) setErrorMessage(session, `${errorMessage}`);
         return redirect(`/${siteId}/p/${p}`, {
            headers: { "Set-Cookie": await commitSession(session) },
         });
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
            return await payload.update({
               collection: "posts",
               id: p,
               draft: true,
               data: {
                  //@ts-expect-error
                  banner: upload.id,
               },
               autosave: true,
               overrideAccess: false,
               user,
            });
         }
         const errorMessage = JSON.parse(result.error.message)
            .map((item: any) => item.message)
            .join("\n");

         if (errorMessage) setErrorMessage(session, `${errorMessage}`);
         return redirect(`/${siteId}/p/${p}`, {
            headers: { "Set-Cookie": await commitSession(session) },
         });
      }
      case "deleteBanner": {
         assertIsDelete(request);
         const post = await payload.findByID({
            collection: "posts",
            id: p,
            draft: true,
            overrideAccess: false,
            user,
            depth: 2,
         });
         const bannerId = post?.banner?.id;
         await payload.delete({
            collection: "images",
            //@ts-expect-error
            id: bannerId,
            overrideAccess: false,
            user,
         });
         return await payload.update({
            collection: "posts",
            id: p,
            draft: true,
            data: {
               //@ts-expect-error
               banner: "",
            },
            autosave: true,
            overrideAccess: false,
            user,
         });
      }
      case "unpublish": {
         assertIsPost(request);
         await payload.update({
            collection: "posts",
            id: p,
            data: {
               _status: "draft",
               publishedAt: "",
            },
            overrideAccess: false,
            user,
         });
         setSuccessMessage(session, "Post successfully unpublished");
         return redirect(`/${siteId}/p/${p}`, {
            headers: { "Set-Cookie": await commitSession(session) },
         });
      }
      case "publish": {
         assertIsPost(request);
         //Pull post name again to generate a slug
         const currentPost = await payload.findByID({
            collection: "posts",
            id: p,
            draft: true,
         });

         const newSlug = urlSlug(currentPost.name);

         //See if duplicate exists on the same site
         const allPosts = await payload.find({
            collection: "posts",
            where: {
               and: [
                  {
                     "site.slug": {
                        equals: siteId,
                     },
                     //Check existing slug or id
                     or: [
                        {
                           slug: {
                              equals: newSlug,
                           },
                        },
                        {
                           id: {
                              equals: newSlug,
                           },
                        },
                     ],
                  },
                  {
                     //We don't want to include the current post when checking
                     id: {
                        not_equals: currentPost.id,
                     },
                  },
               ],
            },
            draft: true,
            overrideAccess: false,
            user,
         });

         //If no collision and it's the first time we are generating the slug, publish with alias.
         //Alias is not updated on subsequent title updates.
         //Otherwise the slug already exists so we just update publishedAt.
         //TODO Feature: Allow user to manually set a url alias at publish
         if (allPosts.totalDocs == 0) {
            const firstSlug = !currentPost.slug && allPosts.totalDocs == 0;
            return await payload.update({
               collection: "posts",
               id: p,
               data: {
                  ...(firstSlug && { slug: newSlug }),
                  ...(firstSlug && { publishedAt: new Date().toISOString() }),
                  _status: "published",
               },
               overrideAccess: false,
               user,
            });
         }
         setErrorMessage(session, "Collision detected, existing alias exists");
         return redirect(`/${siteId}/p/${p}`, {
            headers: { "Set-Cookie": await commitSession(session) },
         });
      }
      case "deletePost": {
         assertIsDelete(request);
         const post = await payload.delete({
            collection: "posts",
            id: p,
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
         setSuccessMessage(session, `"${postTitle}" successfully deleted`);
         return redirect(`/${siteId}/posts`, {
            headers: { "Set-Cookie": await commitSession(session) },
         });
      }
   }
}

async function fetchPost({
   p,
   payload,
   siteId,
   user,
   page = 1,
}: {
   p: string;
   payload: Payload;
   siteId: Site["slug"];
   user?: User;
   page: number | undefined;
}) {
   //Determine the real post Id from the post slug
   const { docs: postsAll } = await payload.find({
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

   if (!user) {
      //If anon and data exists, return post data now
      if (post) {
         return { post };
      }
      //Attempt to fetch with ID
      if (!post) {
         const postById = await payload.findByID({
            collection: "posts",
            id: p,
         });

         if (!postById) throw redirect("/404", 404);

         //Post exists, we received the ID as a URL param and want to redirect to the canonical path instead.
         throw redirect(`/${postById.site.slug}/p/${postById.slug}`, 301);
      }
   }

   invariant(user, "Not logged in");

   //If post is not falsy, then we know the page was accessed with a canonical, as a site admin, we want to use the "/p/$p" path instead
   if (post) {
      throw redirect(`/${post.site.slug}/p/${post.id}`);
   }

   const authPost = await payload.findByID({
      collection: "posts",
      id: p,
      draft: true,
      user,
      overrideAccess: false,
   });

   const hasAccess = isSiteOwnerOrAdmin(user?.id, authPost.site);

   if (hasAccess) {
      const livePost = await payload.findByID({
         collection: "posts",
         id: p,
         user,
         overrideAccess: false,
      });
      const versionData = await payload.findVersions({
         collection: "posts",
         depth: 2,
         where: {
            parent: {
               equals: authPost.id,
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

      const isChanged = JSON.stringify(authPost) != JSON.stringify(livePost);

      return { post: authPost, isChanged, versions };
   }
   return { post: authPost, isChanged: false };
}
