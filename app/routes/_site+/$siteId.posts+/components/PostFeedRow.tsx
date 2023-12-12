import { Link } from "@remix-run/react";
import dt from "date-and-time";

import type { Post } from "payload/generated-types";
import { Image } from "~/components";

export function PostFeedRow({ post, siteId }: { post: Post; siteId: string }) {
   return (
      <>
         <Link
            className="relative block py-4 group"
            prefetch="intent"
            to={`/${siteId}/p/${post.slug}`}
            key={post.id}
         >
            <div className="flex w-full items-center justify-between gap-3 pb-3 text-sm text-gray-500 dark:text-gray-400">
               <div className="flex items-center gap-2.5">
                  <div className="h-5 w-5 overflow-hidden rounded-full">
                     {post?.author.avatar?.url ? (
                        <Image
                           width={20}
                           height={20}
                           alt={post.name}
                           options="aspect_ratio=1:1&height=80&width=80"
                           className="w-full object-cover laptop:rounded"
                           url={post?.author.avatar?.url}
                        />
                     ) : (
                        <div className="bg-1 border-color shadow-1 h-6 w-6 overflow-hidden rounded-full border-2 shadow-sm"></div>
                     )}
                  </div>
                  <div className="font-bold">{post.author.username}</div>
               </div>
               {post?.publishedAt && (
                  <time
                     className="text-1 flex items-center gap-1.5 text-xs"
                     dateTime={post?.publishedAt}
                  >
                     {dt.format(new Date(post?.publishedAt), "MMM D, YYYY")}
                  </time>
               )}
            </div>
            <div className="flex items-start gap-5">
               <div className="relative flex-grow">
                  <div className="pb-2 font-header text-xl font-bold group-hover:underline">
                     {post.name}
                  </div>
                  <div className="text-1 text-sm max-laptop:line-clamp-2">
                     {post.subtitle}
                  </div>
               </div>
               {post.banner && (
                  <div className="w-32 flex-none overflow-hidden rounded">
                     <Image
                        alt={post.name}
                        options="height=140"
                        height={200}
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
}
