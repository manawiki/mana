import { Link } from "@remix-run/react";
import { formatDistanceStrict } from "date-fns";
import type { Post } from "payload/generated-types";
import { Image } from "~/components/Image";

export const FeedItem = ({ post }: { post: Post }) => {
   return (
      <>
         <Link
            className="relative block py-4"
            prefetch="intent"
            to={`${post.id}/${post.url}`}
            key={post.id}
         >
            <div className="flex w-full items-center justify-between gap-3 pb-4 text-sm text-gray-500 dark:text-gray-400">
               <div className="flex items-center gap-3">
                  <div className="h-6 w-6 overflow-hidden rounded-full">
                     {/* @ts-ignore */}
                     {post?.author.avatar?.url ? (
                        <Image
                           width={20}
                           height={20}
                           alt={post.name}
                           options="fit=crop,height=50,width=50,gravity=auto"
                           className="w-full object-cover laptop:rounded"
                           //@ts-ignore
                           url={post?.author.avatar?.url}
                        />
                     ) : (
                        <div className="bg-1 border-color shadow-1 h-6 w-6 overflow-hidden rounded-full border-2 shadow-sm"></div>
                     )}
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
                  <div className="pb-2 font-header text-xl font-bold">
                     {post.name}
                  </div>
                  <div className="text-1 text-sm max-laptop:line-clamp-2">
                     {post.subtitle}
                  </div>
               </div>
               {post.banner && (
                  <div className="aspect-[1.4/1] w-32 flex-none overflow-hidden rounded laptop:w-40">
                     <Image
                        alt={post.name}
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
