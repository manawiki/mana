import type { FormEvent } from "react";
import { useState, useEffect } from "react";

import { useFetcher } from "@remix-run/react";
import TextareaAutosize from "react-textarea-autosize";

import type { Post } from "payload/generated-types";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { isAdding, useDebouncedValue, useIsMount } from "~/utils";

import { PostAuthorHeader } from "./PostAuthorHeader";

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "post",
};

export function PostHeaderEdit({
   post,
   isShowBanner,
}: {
   post: Post;
   isShowBanner: boolean;
}) {
   const fetcher = useFetcher();
   const [titleValue, setTitleValue] = useState("");
   const [subtitleValue, setsubtitleValue] = useState("");

   const debouncedTitle = useDebouncedValue(titleValue, 500);
   const debouncedSubtitle = useDebouncedValue(subtitleValue, 500);

   const isMount = useIsMount();

   const isBannerDeleting = isAdding(fetcher, "deleteBanner");
   const isBannerAdding = isAdding(fetcher, "updateBanner");

   useEffect(() => {
      if (!isMount) {
         fetcher.submit(
            { name: debouncedTitle, intent: "updateTitle" },
            { method: "patch" },
         );
      }
   }, [debouncedTitle]);

   useEffect(() => {
      if (!isMount) {
         fetcher.submit(
            { subtitle: debouncedSubtitle, intent: "updateSubtitle" },
            { method: "patch" },
         );
      }
   }, [debouncedSubtitle]);

   //Image Upload
   const [dragActive, setDragActive] = useState(false);
   const handleDrop = function (e: any, fetcher: any) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         const formData = new FormData();
         formData.append("intent", "updateBanner");
         formData.append("postBanner", e.dataTransfer.files[0]);
         fetcher.submit(formData, {
            encType: "multipart/form-data",
            method: "patch",
         });
      }
   };
   const handleDrag = function (e: FormEvent) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
         setDragActive(true);
      } else if (e.type === "dragleave") {
         setDragActive(false);
      }
   };

   return (
      <>
         <div className="relative mb-2 flex items-center gap-3">
            <TextareaAutosize
               className="mt-0 min-h-[20px] w-full resize-none overflow-hidden rounded-sm border-0 bg-transparent p-0 
                   font-header text-3xl font-semibold !leading-[3rem] focus:ring-transparent laptop:text-4xl"
               defaultValue={post.name}
               onChange={(event) => setTitleValue(event.target.value)}
               placeholder="Add a title..."
            />
         </div>
         <PostAuthorHeader post={post} />
         <div className="border-color relative mb-6 flex items-center gap-3 border-b border-zinc-100 pb-3">
            <TextareaAutosize
               className="text-1 mt-0 min-h-[20px] w-full resize-none overflow-hidden rounded-sm border-0 bg-transparent 
                  p-0 text-sm font-semibold focus:ring-transparent"
               defaultValue={post.subtitle}
               onChange={(event) => setsubtitleValue(event.target.value)}
               placeholder="Add a subtitle..."
            />
         </div>
         {post.banner ? (
            <div className="relative mb-5">
               <div className="bg-1 border-color -mx-3 tablet:-mx-6 flex aspect-[1.91/1] items-center tablet:rounded-lg justify-center overflow-hidden shadow-sm mb-5">
                  <Image
                     alt="Post Banner"
                     className="h-full w-full object-cover"
                     options="crop=1200,630&aspect_ratio=1.9:1"
                     url={post?.banner?.url}
                  />
               </div>
               <button
                  className="absolute right-0 laptop:-right-3.5 top-2.5 flex h-10 w-10 items-center
                   justify-center rounded-md bg-white/60 dark:bg-zinc-800/50"
                  onClick={() =>
                     fetcher.submit(
                        { intent: "deleteBanner" },
                        { method: "delete" },
                     )
                  }
               >
                  {isBannerDeleting ? (
                     <Icon
                        name="loader-2"
                        className="mx-auto h-5 w-5 animate-spin text-red-200"
                     />
                  ) : (
                     <Icon
                        name="image-minus"
                        className="text-red-500 dark:text-red-300"
                        size={20}
                     />
                  )}
               </button>
            </div>
         ) : isShowBanner ? (
            <div className="relative mb-5 -mx-3 tablet:-mx-6">
               <fetcher.Form
                  method="patch"
                  encType="multipart/form-data"
                  onDragEnter={(e) => handleDrag(e)}
                  onChange={(event) => {
                     fetcher.submit(event.currentTarget, {
                        method: "patch",
                     });
                  }}
               >
                  <label
                     className={`${
                        dragActive
                           ? "dark:bg-dark400 border-4 border-dashed border-zinc-300 bg-white dark:border-zinc-600"
                           : "hover:border-dashed hover:border-zinc-300 dark:hover:border-zinc-600 "
                     } bg-2-sub border-color-sub group flex aspect-[1.91/1] cursor-pointer items-center
                        justify-center overflow-hidden border-y shadow-sm hover:border-2
                        tablet:rounded-md tablet:border laptop:rounded-none 
                        laptop:border-x-0 desktop:rounded-md desktop:border`}
                  >
                     <div className="text-1 space-y-2">
                        {isBannerAdding ? (
                           <Icon
                              name="loader-2"
                              size={30}
                              className="mx-auto animate-spin"
                           />
                        ) : (
                           <Icon name="upload" className="mx-auto" size={30} />
                        )}

                        <div className="text-center font-bold group-hover:underline">
                           Drag or click to upload a banner
                        </div>
                        <div className="text-center text-sm">
                           JPEG, PNG, JPG or WEBP (MAX. 5MB)
                        </div>
                     </div>
                     <input name="postBanner" type="file" className="hidden" />
                  </label>
                  {dragActive && (
                     <div
                        className="absolute bottom-0 left-0 right-0 top-0 h-full w-full"
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={(e) => {
                           handleDrop(e, fetcher);
                        }}
                     />
                  )}
                  <input type="hidden" name="intent" value="updateBanner" />
               </fetcher.Form>
            </div>
         ) : null}
      </>
   );
}
