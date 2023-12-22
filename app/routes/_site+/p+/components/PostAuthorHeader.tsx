import dt from "date-and-time";

import type { Post } from "payload/generated-types";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import { timeAgo } from "~/utils/time-ago";

export function PostAuthorHeader({ post }: { post: Post }) {
   return (
      <section>
         <div className="border-color mb-3 flex items-center gap-3 border-y border-zinc-100 py-3">
            <div className="bg-1 border-color shadow-1 h-10 w-10 overflow-hidden rounded-full border-2 shadow-sm">
               {post?.author?.avatar ? (
                  <Image
                     url={post.author.avatar.url}
                     options="aspect_ratio=1:1&height=80&width=80"
                     alt={post?.author?.username}
                  />
               ) : null}
            </div>
            <div>
               <div className="font-bold pb-1">{post?.author?.username}</div>
               <div className="flex items-center gap-3">
                  <Tooltip placement="top" setDelay={800}>
                     <TooltipTrigger
                        contentEditable={false}
                        className="flex items-center gap-1"
                     >
                        <Icon
                           name="pen-line"
                           size={12}
                           className="dark:text-zinc-500 text-zinc-300"
                        />
                        <time
                           className="text-1 flex items-center gap-1.5 text-xs"
                           dateTime={post?.updatedAt}
                        >
                           {timeAgo(new Date(post?.updatedAt))}
                        </time>
                     </TooltipTrigger>
                     <TooltipContent>Last Updated</TooltipContent>
                  </Tooltip>
                  {post?.publishedAt && (
                     <>
                        <span className="h-1 w-1 rounded-full bg-zinc-300"></span>
                        <Tooltip placement="top" setDelay={800}>
                           <TooltipTrigger
                              contentEditable={false}
                              className="flex items-center gap-1"
                           >
                              <time
                                 className="text-1 flex items-center gap-1.5 text-xs"
                                 dateTime={post?.publishedAt}
                              >
                                 {dt.format(
                                    new Date(post?.publishedAt),
                                    "MMM D, YYYY",
                                 )}
                              </time>
                           </TooltipTrigger>
                           <TooltipContent>Published</TooltipContent>
                        </Tooltip>
                     </>
                  )}
               </div>
            </div>
         </div>
      </section>
   );
}
