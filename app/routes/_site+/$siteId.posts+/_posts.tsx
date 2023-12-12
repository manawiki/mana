import { redirect, json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { useSearchParams } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";

import { initialValue } from "~/routes/_editor+/core/utils";
import { safeNanoID } from "~/utils";

import { MyPosts } from "./components/MyPosts";
import { PostListHeader } from "./components/PostListHeader";
import { PublishedPosts } from "./components/PublishedPosts";
import { fetchMyPosts } from "./functions/fetchMyPosts";
import { fetchPublishedPosts } from "./functions/fetchPublishedPosts";
import { mainContainerStyle } from "../$siteId+/_index";

export const meta: MetaFunction = ({ matches }: { matches: any }) => {
   const site = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/$siteId+/_layout",
   );
   const siteName = site?.data?.site.name;
   return [
      {
         title: `Posts - ${siteName}`,
      },
   ];
};

export type setSearchParamsType = ReturnType<typeof useSearchParams>[1];

export const handle = {};

export const PostsAllSchema = z.object({
   q: z.string().optional(),
   status: z.union([z.literal("draft"), z.literal("published")]).optional(),
   page: z.coerce.number().optional(),
});

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });

   const { q, status, page } = zx.parseQuery(request, PostsAllSchema);

   const publishedPosts = await fetchPublishedPosts({
      q,
      payload,
      siteId,
      user,
   });

   const myPosts = await fetchMyPosts({
      status,
      page,
      payload,
      siteId,
      user,
   });

   return json({ q, myPosts, publishedPosts, siteId });
}

export default function PostList() {
   return (
      <main className={mainContainerStyle}>
         <PostListHeader />
         <MyPosts />
         <PublishedPosts />
      </main>
   );
}

export const action = async ({
   context: { payload, user },
   request,
   params,
}: LoaderFunctionArgs) => {
   if (!user || !user.id) throw redirect("/login", { status: 302 });

   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });

   const slug = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteId,
         },
      },
      user,
   });
   const site = slug?.docs[0];

   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   switch (intent) {
      case "createWithTitle": {
         const { name } = await zx.parseForm(request, {
            name: z.string(),
         });
         const postId = safeNanoID();
         try {
            const postContent = await payload.create({
               collection: "postContents",
               data: {
                  id: postId,
                  //@ts-ignore
                  site: site?.id,
                  content: initialValue(),
               },
               user,
               draft: true,
               overrideAccess: false,
            });
            const post = await payload.create({
               collection: "posts",
               data: {
                  id: postId,
                  name,
                  //@ts-ignore
                  author: user?.id,
                  //@ts-ignore
                  site: site.id,
                  //@ts-ignore
                  slug: postId,
                  //@ts-ignore
                  content: postContent.id,
               },
               user,
               overrideAccess: false,
            });
            return redirect(`/${siteId}/p/${post.id}`);
         } catch (err: unknown) {
            payload.logger.error(err);
            payload.logger.error(`Error creating post with title`);
         }
      }
      case "createPost": {
         const postId = safeNanoID();
         try {
            await payload.create({
               collection: "postContents",
               data: {
                  id: postId,
                  //@ts-ignore
                  site: site?.id,
                  content: initialValue(),
               },
               user,
               draft: true,
               overrideAccess: false,
            });
            await payload.create({
               collection: "posts",
               data: {
                  id: postId,
                  name: "Untitled",
                  //@ts-ignore
                  author: user?.id,
                  //@ts-ignore
                  site: site.id,
                  //@ts-ignore
                  slug: postId,
                  //@ts-ignore
                  content: postId,
               },
               user,
               overrideAccess: false,
            });
            return redirect(`/${siteId}/p/${postId}`);
         } catch (err: unknown) {
            payload.logger.error(err);
            payload.logger.error(`Error creating post`);
         }
      }
   }
};
