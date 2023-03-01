import { useFetcher, useActionData } from "@remix-run/react";
import { formatDistanceStrict, format } from "date-fns";
import { Loader2, ImageMinus, Upload } from "lucide-react";
import type { Post } from "payload/generated-types";
import { useState, useEffect } from "react";
import { useZorm } from "react-zorm";
import { Err } from "~/components/Forms";
import { useDebouncedValue, useIsMount } from "~/hooks";
import type { FormResponse } from "~/utils";
import { isAdding } from "~/utils";
import { Image } from "~/components/Image";
import { postSchema } from "./postSchema";

export const PostHeaderEdit = ({ post }: { post: Post }) => {
   //Update title logic
   const fetcher = useFetcher();
   const [titleValue, setTitleValue] = useState("");
   const debouncedTitle = useDebouncedValue(titleValue, 500);
   const isMount = useIsMount();

   const isTitleAdding = isAdding(fetcher, "updateTitle");
   const isBannerDeleting = isAdding(fetcher, "deleteBanner");
   const isBannerAdding = isAdding(fetcher, "updateBanner");

   const formResponse = useActionData<FormResponse>();

   const zo = useZorm("newPost", postSchema, {
      //@ts-ignore
      customIssues: formResponse?.serverIssues,
   });

   useEffect(() => {
      if (!isMount) {
         fetcher.submit(
            { title: debouncedTitle, intent: "updateTitle" },
            { method: "patch" }
         );
      }
   }, [debouncedTitle]);

   return (
      <>
         <section className="max-w-[728px] mx-auto max-desktop:px-3">
            <div className="relative mb-3 flex items-center gap-3">
               <input
                  className="mt-0 w-full rounded-sm border-0 bg-transparent p-0 font-header text-3xl 
                   laptop:text-4xl font-semibold !ring-zinc-200
                   !ring-offset-4 !ring-offset-white hover:bg-white hover:ring-2 focus:bg-white 
                   focus:ring-2 dark:!ring-zinc-600
                 dark:!ring-offset-zinc-700 dark:hover:bg-zinc-700 dark:focus:bg-zinc-700"
                  name={zo.fields.title()}
                  type="text"
                  defaultValue={post.title}
                  onChange={(event) => setTitleValue(event.target.value)}
                  placeholder="Add a title..."
               />
               {isTitleAdding ? (
                  <Loader2 className="absolute right-2 mx-auto h-6 w-6 animate-spin text-emerald-500" />
               ) : null}
               {zo.errors.title((err) => (
                  <Err>{err.message}</Err>
               ))}
            </div>

            <div className="pb-6 pt-1 flex items-center gap-3 rounded-md">
               <div className="bg-1 h-9 w-9 overflow-hidden rounded-full">
                  {/* @ts-expect-error */}
                  {post?.author?.avatar ? (
                     <Image /* @ts-expect-error */
                        url={post.author.avatar.url}
                        options="fit=crop,width=60,height=60 ,gravity=auto"
                        /* @ts-expect-error */
                        alt={post?.author?.username}
                     />
                  ) : null}
               </div>
               <div className="space-y-0.5">
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
         </section>
         <section className="max-w-[800px] mx-auto">
            {post.banner ? (
               <div className="relative mb-5">
                  <div
                     className="bg-1 border-color flex aspect-[1.91/1] desktop:border 
                         laptop:rounded-none laptop:border-x-0 desktop:rounded-md
                         items-center justify-center overflow-hidden tablet:rounded-md
                         shadow-sm"
                  >
                     <img
                        alt="Post Banner"
                        className="h-full w-full object-cover"
                        //@ts-ignore
                        src={`https://mana.wiki/cdn-cgi/image/fit=crop,height=440,gravity=auto/${post?.banner?.url}`}
                     />
                  </div>
                  <button
                     className="absolute right-2.5 top-2.5 flex h-10 w-10 items-center
                   justify-center rounded-md bg-white/60 dark:bg-zinc-800/50"
                     onClick={() =>
                        fetcher.submit(
                           { intent: "deleteBanner" },
                           { method: "delete" }
                        )
                     }
                  >
                     {isBannerDeleting ? (
                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-red-200" />
                     ) : (
                        <ImageMinus
                           className="text-red-500 dark:text-red-300"
                           size={20}
                        />
                     )}
                  </button>
               </div>
            ) : (
               <fetcher.Form
                  className="mb-8"
                  method="patch"
                  encType="multipart/form-data"
                  replace
                  onChange={(event) => {
                     fetcher.submit(event.currentTarget, { method: "patch" });
                  }}
               >
                  <label className="cursor-pointer">
                     <div
                        className="bg-1 border-color flex aspect-[1.91/1] desktop:border 
                         laptop:rounded-none laptop:border-x-0 desktop:rounded-md
                         items-center justify-center overflow-hidden tablet:rounded-md
                         shadow-sm border-y tablet:border hover:border-dashed hover:border-4"
                     >
                        <div className="text-1 space-y-2">
                           {isBannerAdding ? (
                              <Loader2
                                 size={36}
                                 className="mx-auto animate-spin"
                              />
                           ) : (
                              <Upload className="mx-auto" size={36} />
                           )}

                           <div className="text-center font-bold">
                              Click to upload banner
                           </div>
                           <div className="text-center text-sm">
                              JPEG, PNG, JPG or WEBP (MAX. 5MB)
                           </div>
                        </div>
                     </div>
                     <input
                        // @ts-ignore
                        name={zo.fields.banner()}
                        type="file"
                        className="hidden"
                     />
                     {zo.errors.banner((err) => (
                        <Err>{err.message}</Err>
                     ))}
                  </label>
                  <input type="hidden" name="intent" value="updateBanner" />
               </fetcher.Form>
            )}
         </section>
      </>
   );
};
