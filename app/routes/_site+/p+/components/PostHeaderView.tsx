import { PostAuthorHeader } from "./PostAuthorHeader";
import type { PostData } from "../utils/fetchPostWithSlug.server";

export function PostHeaderView({ post }: { post: PostData }) {
   return (
      <section className="max-w-[728px] w-full mx-auto">
         <h1 className="font-header text-3xl !leading-[3rem] laptop:text-4xl pb-2.5">
            {post.name}
         </h1>
         <PostAuthorHeader post={post} />
         {post.subtitle && (
            <div className="text-1 mb-5 border-b border-color-secondary pb-3 text-sm font-semibold">
               {post.subtitle}
            </div>
         )}
      </section>
   );
}
