import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { zx } from "zodix";
import { z } from "zod";
import { Plus } from "lucide-react";
import { formatDistanceStrict } from "date-fns";
import type { Post } from "payload/generated-types";
import { Image } from "~/components/Image";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

export async function loader({
   context: { payload, user },
   params,
}: LoaderArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string().length(10),
   });
   const posts = await payload.find({
      collection: "posts",
      user,
      where: {
         site: {
            equals: siteId,
         },
      },
      sort: "-updatedAt",
   });

   const publishedPosts = await payload.find({
      collection: "posts",
      user,
      depth: 2,
      where: {
         and: [
            {
               isPublished: {
                  equals: true,
               },
               site: {
                  equals: siteId,
               },
            },
         ],
      },
      sort: "-updatedAt",
   });

   return { posts, publishedPosts };
}

export const FeedItem = ({ post }: { post: Post }) => {
   return (
      <>
         <Link
            className="relative block py-4"
            prefetch="intent"
            to={post.id}
            key={post.id}
         >
            <div className="flex w-full items-center justify-between gap-3 pb-4 text-sm text-gray-500 dark:text-gray-400">
               <div className="flex items-center gap-3">
                  <div className="h-6 w-6 overflow-hidden rounded-full">
                     <Image
                        width={20}
                        height={20}
                        alt={post.title}
                        options="fit=crop,height=50,width=50,gravity=auto"
                        className="w-full object-cover laptop:rounded"
                        //@ts-ignore
                        url={post?.author.avatar?.url}
                     />
                  </div>
                  {/* @ts-ignore */}
                  <div className="font-bold">{post.author.username}</div>
               </div>
               <div className="text-xs font-bold uppercase">
                  {post.publishedAt &&
                     formatDistanceStrict(
                        new Date(post.updatedAt ?? ""),
                        new Date(),
                        {
                           addSuffix: true,
                        }
                     )}
               </div>
            </div>
            <div className="flex items-start gap-5">
               <div className="relative flex-grow">
                  <div className="pb-2 text-xl font-bold">{post.title}</div>
               </div>
               {post.banner && (
                  <div className="aspect-[1.4/1] w-32 overflow-hidden rounded laptop:w-40">
                     <Image
                        alt={post.title}
                        options="fit=crop,height=200,gravity=auto"
                        className="w-full rounded object-cover"
                        //@ts-ignore
                        url={post?.banner?.url}
                     />
                  </div>
               )}
            </div>
         </Link>
      </>
   );
};

export default function PostsIndex() {
   const { posts, publishedPosts } = useLoaderData<typeof loader>();
   return (
      <div className="mx-auto max-w-[728px] px-3 pt-8 tablet:px-0 laptop:px-3 laptop:pt-10 desktop:px-0">
         <h1 className="border-color mb-7 flex items-center gap-3 border-b-2 pb-2.5 text-3xl font-bold">
            <PencilSquareIcon className="h-7 w-7 text-emerald-500" />
            Posts
         </h1>
         <h2 className="text-1 pb-3 text-sm font-bold uppercase">
            Create a new post
         </h2>
         <section className="pb-8">
            <div
               className="border-color flex items-center justify-between rounded-xl border 
            bg-neutral-100 px-4 py-3 dark:bg-neutral-800"
            >
               <div className="flex items-center gap-4">
                  <div className="text-sm font-bold">Blank post</div>
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                  <span className="text-t text-xs">Start from scratch...</span>
               </div>
               <Form method="post" className="flex items-center">
                  <button
                     name="intent"
                     className="flex h-10 w-10 items-center justify-center rounded-full border
                      border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/20"
                     value="createPost"
                     type="submit"
                  >
                     <Plus className="h-6 w-6 text-emerald-500" />
                  </button>
               </Form>
            </div>
         </section>
         <h2 className="text-1 pb-3 text-sm font-bold uppercase">My Posts</h2>
         <section className="border-color divide-y overflow-hidden border-y dark:divide-zinc-700">
            {posts?.docs.length === 0 ? (
               <div className="py-3 text-sm ">No posts...</div>
            ) : (
               posts.docs.map((posts) => (
                  <Link
                     prefetch="intent"
                     to={posts.id}
                     key={posts.id}
                     className="group flex items-center justify-between gap-2 py-3"
                  >
                     <span className="truncate group-hover:underline">
                        {posts.title}
                     </span>
                     {posts.updatedAt ? (
                        <div className="flex items-center gap-3">
                           <time
                              className="text-1 flex items-center gap-1.5 text-sm"
                              dateTime={posts?.updatedAt}
                           >
                              {formatDistanceStrict(
                                 new Date(posts?.updatedAt as string),
                                 new Date(),
                                 {
                                    addSuffix: true,
                                 }
                              )}
                           </time>
                           {posts.isPublished ? (
                              <span className="h-2 w-2 rounded-full bg-green-500" />
                           ) : (
                              <span className="h-2 w-2 rounded-full bg-zinc-500" />
                           )}
                        </div>
                     ) : (
                        <span></span>
                     )}
                  </Link>
               ))
            )}
         </section>
         <h2 className="text-1 pb-3 pt-12 text-sm font-bold uppercase">
            Latest
         </h2>
         <section className="border-color divide-y overflow-hidden border-y dark:divide-zinc-700">
            {publishedPosts?.docs.length === 0 ? (
               <div className="py-3 text-sm ">No posts...</div>
            ) : (
               publishedPosts.docs.map((post) => (
                  <FeedItem key={post.id} post={post} />
               ))
            )}
         </section>
      </div>
   );
}

export const action = async ({
   context: { payload, user },
   request,
   params,
}: LoaderArgs) => {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string().length(10),
   });

   if (!user || !user.id) return redirect("/login", { status: 302 });

   const note = await payload.create({
      collection: "notes",
      data: { mdx: "", data: [], ui: "textarea", author: user?.id },
      user,
      overrideAccess: false,
      draft: true,
   });

   const post = await payload.create({
      collection: "posts",
      data: {
         title: "Untitled",
         author: user?.id,
         notes: [note.id],
         site: siteId,
      },
      user,
      overrideAccess: false,
   });

   return redirect(`/${siteId}/posts/${post.id}/edit/${note.id}`);
};
