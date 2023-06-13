import { formatDistanceStrict } from "date-fns";
import type { Post } from "payload/generated-types";
import { Image } from "~/components/Image";

const dateFormat = (dateString: string) =>
   new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "America/Los_Angeles",
   }).format(new Date(dateString));

export const PostHeader = ({ post }: { post: Post }) => {
   return (
      <section>
         <div className="border-color mb-3 mt-1 flex items-center gap-3 border-y border-zinc-100 py-3 laptop:mt-4">
            <div className="bg-1 border-color shadow-1 h-10 w-10 overflow-hidden rounded-full border-2 shadow-sm">
               {/* @ts-expect-error */}
               {post?.author?.avatar ? (
                  <Image /* @ts-expect-error */
                     url={post.author.avatar.url}
                     options="aspect_ratio=1:1&height=80&width=80"
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
                           {dateFormat(post?.publishedAt)}
                        </time>
                     </>
                  )}
               </div>
            </div>
         </div>
      </section>
   );
};
