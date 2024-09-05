import { redirect, json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { z } from "zod";
import { zx } from "zodix";

import { initialValue } from "~/routes/_editor+/core/utils";
import type { loader as siteLayoutLoader } from "~/routes/_site+/_layout";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { safeNanoID } from "~/utils/nanoid";

import { MyPosts } from "./components/MyPosts";
import { PostListHeader } from "./components/PostListHeader";
import { PublishedPosts } from "./components/PublishedPosts";
import { fetchMyPosts } from "./utils/fetchMyPosts.server";
import { fetchPublishedPosts } from "./utils/fetchPublishedPosts";

export const meta: MetaFunction<
   null,
   {
      "routes/_site+/_layout": typeof siteLayoutLoader;
   }
> = ({ matches }) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site.name;
   return [
      {
         title: `Posts - ${siteName}`,
      },
   ];
};

export const PostsAllSchema = z.object({
   q: z.string().optional(),
   status: z.union([z.literal("draft"), z.literal("published")]).optional(),
   page: z.coerce.number().optional(),
});

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);

   const { q, status, page } = zx.parseQuery(request, PostsAllSchema);

   const publishedPosts = await fetchPublishedPosts({
      q,
      payload,
      page,
      siteSlug,
      user,
   });

   const myPosts = await fetchMyPosts({
      status,
      page,
      payload,
      siteSlug,
      user,
   });

   return json({ q, myPosts, publishedPosts, siteSlug });
}

export default function PostList() {
   return (
      <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-3 laptop:pt-6">
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

   const { siteSlug } = await getSiteSlug(request, payload, user);

   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   const slug = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteSlug,
         },
      },
      user,
   });
   const site = slug?.docs[0];

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
            return redirect(`/p/${post.id}`);
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
               depth: 0,
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
               depth: 0,
               user,
               overrideAccess: false,
            });
            return redirect(`/p/${postId}`);
         } catch (err: unknown) {
            payload.logger.error(err);
            payload.logger.error(`Error creating post`);
         }
      }
   }
};
