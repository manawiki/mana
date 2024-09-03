import { Image } from "~/components/Image";
import type { Post } from "~/db/payload-types";

export function PostBannerView({ post }: { post: Post }) {
   return (
      post?.banner && (
         <div
            className="relative tablet:rounded-xl overflow-hidden max-tablet:-mx-3 max-w-[800px] 
            mx-auto my-6 border-y tablet:border border-color-sub shadow-sm shadow-1"
         >
            <Image
               alt="Post Banner"
               className="h-full w-full object-cover"
               width="800"
               options="aspect_ratio=1.9:1"
               url={post?.banner?.url}
            />
         </div>
      )
   );
}
