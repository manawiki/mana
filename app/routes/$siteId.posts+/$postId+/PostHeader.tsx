import { formatDistanceStrict, format } from "date-fns";
import type { Post } from "payload/generated-types";
import { Image } from "~/components/Image";

export const PostHeader = ({ post }: { post: Post }) => {
   return (
      <div className="my-5 py-3 flex items-center gap-3 border-color border-y">
         <div className="bg-1 h-11 w-11 border-color border-2 overflow-hidden rounded-full">
            {/* @ts-expect-error */}
            {post?.author?.avatar ? (
               <Image /* @ts-expect-error */
                  url={post.author.avatar.url}
                  options="fit=crop,width=80,height=80 ,gravity=auto"
                  /* @ts-expect-error */
                  alt={post?.author?.username}
               />
            ) : null}
         </div>
         <div>
            {/* @ts-expect-error */}
            <div className="font-bold">{post?.author?.username}</div>
            <div className="flex items-center gap-3">
               <time
                  className="text-1 flex items-center gap-1.5 text-sm"
                  dateTime={post?.updatedAt}
               >
                  {formatDistanceStrict(
                     new Date(post?.updatedAt as string),
                     new Date(),
                     {
                        addSuffix: true,
                     }
                  )}
               </time>
               {post?.publishedAt && (
                  <>
                     <span className="h-1 w-1 rounded-full bg-zinc-300"></span>
                     <time
                        className="text-1 flex items-center gap-1.5 text-sm"
                        dateTime={post?.publishedAt}
                     >
                        {format(new Date(post?.publishedAt), "MMM dd")}
                     </time>
                  </>
               )}
            </div>
         </div>
      </div>
   );
};
