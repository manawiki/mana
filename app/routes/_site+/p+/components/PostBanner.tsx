import { useState } from "react";

import { useFetcher } from "@remix-run/react";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { ImageUploader } from "~/components/ImageUploader";
import type { Post } from "~/db/payload-types";
import { isAdding, isProcessing } from "~/utils/form";

export function PostBanner({
   post,
   isShowBanner,
}: {
   post: Post;
   isShowBanner: boolean;
}) {
   const fetcher = useFetcher();

   const disabled = isProcessing(fetcher.state);

   const isBannerAdding = isAdding(fetcher, "updateBanner");

   const postBanner = post.banner?.url;

   console.log("postBanner", post);
   const [preparedPostBannerFile, setPreparedPostBannerFile] = useState();
   const [previewPostBannerImage, setPreviewPostBannerImage] = useState("");
   const isBannerDeleting = isAdding(fetcher, "deleteBanner");

   // Append the images to the form data if they exist
   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const $form = event.currentTarget;

      const formData = new FormData($form);

      preparedPostBannerFile &&
         formData.set("postBanner", preparedPostBannerFile);

      fetcher.submit(formData, {
         method: "POST",
         encType: "multipart/form-data",
      });
   }
   return post.banner ? (
      <div className="relative mb-5 rounded-lg overflow-hidden laptop:max-w-[800px] mx-auto">
         <div className="bg-1 border-color flex aspect-[1.91/1] items-center tablet:rounded-lg justify-center overflow-hidden shadow-sm mb-5">
            <Image
               alt="Post Banner"
               className="h-full w-full object-cover"
               options="crop=1200,630&aspect_ratio=1.9:1"
               url={post?.banner?.url}
            />
         </div>
         <div className="absolute right-3 top-3 !size-10 !p-0">
            <fetcher.Form method="POST">
               <Button
                  className="!size-10 !p-0"
                  color="red"
                  name="intent"
                  value="deleteBanner"
                  type="submit"
               >
                  <input type="hidden" name="postId" value={post.id} />
                  <input type="hidden" name="bannerId" value={post.banner.id} />
                  {isBannerDeleting ? (
                     <Icon
                        name="loader-2"
                        size={20}
                        className="mx-auto animate-spin"
                     />
                  ) : (
                     <Icon name="image-minus" size={20} />
                  )}
               </Button>
            </fetcher.Form>
         </div>
      </div>
   ) : isShowBanner ? (
      <div className="relative mb-5 rounded-lg overflow-hidden laptop:max-w-[800px] mx-auto">
         <fetcher.Form
            method="POST"
            encType="multipart/form-data"
            onSubmit={preparedPostBannerFile && handleSubmit}
         >
            <ImageUploader
               type="rectangle"
               icon={postBanner}
               previewImage={previewPostBannerImage}
               setPreparedFile={setPreparedPostBannerFile}
               setPreviewImage={setPreviewPostBannerImage}
               aspect={1.91 / 1}
            />
            <input type="hidden" name="postId" value={post.id} />
            <input type="hidden" name="siteId" value={post.site.id} />
            <input type="hidden" name="intent" value="updateBanner" />
            {preparedPostBannerFile && (
               <div className="absolute top-3 w-full flex items-center justify-center z-10">
                  <Button
                     disabled={disabled}
                     color="green"
                     type="submit"
                     className="shadow shadow-1"
                  >
                     {isBannerAdding ? (
                        <Icon
                           name="loader-2"
                           size={16}
                           className="animate-spin"
                        />
                     ) : (
                        <Icon name="upload" size={16} />
                     )}
                     Upload Post Banner
                  </Button>
               </div>
            )}
         </fetcher.Form>
      </div>
   ) : null;
}
