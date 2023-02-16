import type { LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
   Form,
   Link,
   useLoaderData,
   useSearchParams,
   useTransition,
} from "@remix-run/react";
import { zx } from "zodix";
import { z } from "zod";
import { ChevronRight, Loader2, Plus, SearchIcon } from "lucide-react";
import { format, formatDistanceStrict } from "date-fns";
import type { Post } from "payload/generated-types";
import { Image } from "~/components/Image";
import { PencilIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { useDebouncedValue } from "~/hooks";
import { isLoading } from "~/utils";

export async function loader({
   context: { payload, user },
   params,
   request,
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

   const { q } = zx.parseQuery(request, {
      q: z.string().optional(),
   });

   const publishedPosts = await payload.find({
      collection: "posts",
      user,
      depth: 2,
      where: {
         title: q ? { contains: q } : {},
         isPublished: {
            equals: true,
         },
         site: {
            equals: siteId,
         },
      },
      sort: "-publishedAt",
   });
   return json({ q, posts, publishedPosts });
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
                  <div className="text-1 max-laptop:text-sm max-laptop:line-clamp-2">
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                     sed do eiusmod tempor incididunt ut labore et dolore magna
                     aliqua.
                  </div>
               </div>
               {post.banner && (
                  <div className="aspect-[1.4/1] w-32 flex-none overflow-hidden rounded laptop:w-40">
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
   const { posts, publishedPosts, q } = useLoaderData<typeof loader>();
   const [query, setQuery] = useState(q);
   const debouncedValue = useDebouncedValue(query, 500);
   const transition = useTransition();
   const isSearching = isLoading(transition);
   const [searchParams, setSearchParams] = useSearchParams({});

   useEffect(() => {
      if (debouncedValue) {
         return setSearchParams({ q: debouncedValue });
      } else {
         return setSearchParams({});
      }
   }, [debouncedValue]);
   console.log(searchParams.get("q"));

   return (
      <div className="mx-auto max-w-[728px] px-3 py-10 tablet:px-0 laptop:px-3 desktop:px-0">
         <h1 className="border-color mb-7 flex items-center gap-3 border-b-2 pb-4 text-3xl font-bold">
            <PencilSquareIcon className="h-7 w-7 text-emerald-500" />
            Posts
         </h1>
         <h2 className="text-1 pb-3 text-sm font-bold uppercase">
            Create a new post
         </h2>
         <section className="pb-9">
            <div
               className="border-color flex items-center justify-between rounded-lg border
            bg-emerald-50/30 py-4 pl-5 pr-3 dark:bg-emerald-900/10"
            >
               <div className="flex items-center gap-4">
                  <div className="text-sm font-bold">Blank post</div>
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                  <span className="text-t text-xs">Start from scratch...</span>
               </div>
               <Form method="post" className="flex items-center">
                  <button
                     name="intent"
                     className="flex h-10 items-center gap-2 rounded-full bg-emerald-500 px-4 text-white"
                     value="createPost"
                     type="submit"
                  >
                     <PencilIcon className="h-3.5 w-3.5 text-white" />
                     <span className="text-sm font-bold">New Post</span>
                  </button>
               </Form>
            </div>
         </section>
         <div className="flex items-center justify-between pb-3">
            <h2 className="text-1 text-sm font-bold uppercase">My Posts</h2>
            <div className="text-1 flex items-center gap-3 text-xs uppercase">
               <span>Drafts</span>
               <span>Published</span>
               <span className="font-bold underline decoration-emerald-500 underline-offset-2 dark:text-white">
                  All
               </span>
            </div>
         </div>
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
                     <div className="flex flex-none items-center gap-3">
                        {posts.isPublished ? (
                           <span className="h-2 w-2 rounded-full bg-green-500" />
                        ) : (
                           <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                        )}
                        <span className="truncate group-hover:underline">
                           {posts.title}
                        </span>
                     </div>
                     {posts.updatedAt && (
                        <time
                           className="text-1 flex items-center gap-1.5 text-sm"
                           dateTime={posts?.updatedAt}
                        >
                           {format(new Date(posts?.updatedAt), "MMM dd")}
                        </time>
                     )}
                  </Link>
               ))
            )}
         </section>
         <h2 className="text-1 pb-3 pt-12 text-sm font-bold uppercase">
            Latest
         </h2>
         <div className="border-color flex items-center gap-2 border-t">
            {isSearching ? (
               <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            ) : (
               <SearchIcon className="text-emerald-500" />
            )}
            <input
               type="search"
               placeholder="Search or create a post..."
               className="h-14 w-full !border-0 bg-transparent focus:!outline-none"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
            />
         </div>
         <section className="border-color divide-y overflow-hidden border-y dark:divide-zinc-700">
            {publishedPosts?.docs.length === 0 ? (
               <div className="flex items-center justify-between py-5 text-sm">
                  <div className="flex items-center gap-1">
                     <span className="text-1">
                        No results... Create new post with title
                     </span>
                     <span className="font-bold">
                        "{searchParams.get("q")}"
                     </span>
                  </div>
                  <Form method="post" className="flex items-center">
                     <button
                        name="intent"
                        className="group flex items-center gap-1"
                        value="createWithTitle"
                        type="submit"
                     >
                        <input
                           type="hidden"
                           value={searchParams.get("q") ?? ""}
                           name="title"
                        />
                        <span className="font-bold text-emerald-500 underline-offset-2 group-hover:underline">
                           New Post
                        </span>
                        <ChevronRight className="text-zinc-400" size={18} />
                     </button>
                  </Form>
               </div>
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

   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   switch (intent) {
      case "createWithTitle": {
         const { title } = await zx.parseForm(request, {
            title: z.string(),
         });
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
               title,
               author: user?.id,
               notes: [note.id],
               site: siteId,
            },
            user,
            overrideAccess: false,
         });
         return redirect(`/${siteId}/posts/${post.id}/edit/${note.id}`);
      }
      case "createPost": {
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
      }
   }
};
