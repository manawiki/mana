import {
   useFetcher,
   useActionData,
   Form,
   useNavigation,
} from "@remix-run/react";
import {
   Loader2,
   ImageMinus,
   Upload,
   Copy,
   EyeOff,
   MoreVertical,
   Trash2,
   ChevronUp,
} from "lucide-react";
import type { Post } from "payload/generated-types";
import { useState, useEffect, Fragment } from "react";
import { useZorm } from "react-zorm";
import { useDebouncedValue, useIsMount } from "~/hooks";
import type { FormResponse } from "~/utils";
import { isProcessing } from "~/utils";
import { isAdding } from "~/utils";
import { postSchema } from "../postSchema";
import { Image as ImageIcon } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { DotLoader } from "~/components/DotLoader";
import { AdminOrOwner } from "~/modules/auth";
import { useTranslation } from "react-i18next";
import { PostDeleteModal } from "./PostDeleteModal";
import { PostUnpublishModal } from "./PostUnpublishModal";
import { PostHeader } from "../PostHeader";

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "post",
};

export const PostHeaderEdit = ({ post }: { post: Post }) => {
   //Update title logic
   const fetcher = useFetcher();
   const [titleValue, setTitleValue] = useState("");
   const debouncedTitle = useDebouncedValue(titleValue, 500);
   const isMount = useIsMount();

   const isTitleAdding = isAdding(fetcher, "updateTitle");
   const isBannerDeleting = isAdding(fetcher, "deleteBanner");
   const isBannerAdding = isAdding(fetcher, "updateBanner");

   const [isShowBanner, setIsBannerShowing] = useState(false);
   const formResponse = useActionData<FormResponse>();
   const transition = useNavigation();
   const isPublishing = isAdding(transition, "publish");
   const disabled = isProcessing(transition.state);

   const [isDeleteOpen, setDeleteOpen] = useState(false);
   const [isUnpublishOpen, setUnpublishOpen] = useState(false);
   const { t } = useTranslation(handle?.i18n);

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
         <PostDeleteModal
            isDeleteOpen={isDeleteOpen}
            setDeleteOpen={setDeleteOpen}
         />
         <PostUnpublishModal
            isUnpublishOpen={isUnpublishOpen}
            setUnpublishOpen={setUnpublishOpen}
         />
         <section className="max-w-[728px] mx-auto max-desktop:px-3">
            <AdminOrOwner>
               <div className="flex items-center justify-between pb-6">
                  <div className="">
                     <button
                        onClick={() => setIsBannerShowing((v) => !v)}
                        className="flex bg-2 items-center shadow-sm shadow-1 border px-2.5 py-2 border-color rounded-lg gap-2"
                     >
                        {isShowBanner ? (
                           <ChevronUp className="text-1" size={16} />
                        ) : (
                           <ImageIcon className="text-emerald-500" size={16} />
                        )}
                        <span className="text-1 font-bold text-xs">
                           Add banner
                        </span>
                     </button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                     <Menu as="div" className="relative">
                        <Menu.Button
                           className="bg-2 flex h-9 w-9 items-center justify-center 
                        rounded-full border-2 text-1 transition border-color
                        duration-300 active:translate-y-0.5 shadow-1 shadow-sm"
                        >
                           <MoreVertical className="h-5 w-5" />
                        </Menu.Button>
                        <Transition
                           as={Fragment}
                           enter="transition ease-out duration-100"
                           enterFrom="transform opacity-0 scale-95"
                           enterTo="transform opacity-100 scale-100"
                           leave="transition ease-in duration-75"
                           leaveFrom="transform opacity-100 scale-100"
                           leaveTo="transform opacity-0 scale-95"
                        >
                           <Menu.Items
                              className="absolute right-0 mt-1.5 w-full min-w-[200px] max-w-md
                                        origin-top-right transform transition-all z-10"
                           >
                              <div className="border-color rounded-lg border bg-2 p-1.5 shadow shadow-1">
                                 <Menu.Item>
                                    <button
                                       className="text-1 flex w-full items-center gap-3 rounded-lg
                                    py-2 px-2.5 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                    >
                                       <Copy
                                          className="text-blue-400"
                                          size="18"
                                       />
                                       Clone
                                    </button>
                                 </Menu.Item>
                                 <Menu.Item>
                                    <button
                                       className="text-1 flex w-full items-center gap-3 rounded-lg
                                    py-2 px-2.5 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                       onClick={() => setUnpublishOpen(true)}
                                    >
                                       <EyeOff
                                          className="text-zinc-400"
                                          size="18"
                                       />
                                       Unpublish
                                    </button>
                                 </Menu.Item>
                                 <Menu.Item>
                                    <button
                                       className="text-1 flex w-full items-center gap-3 rounded-lg
                                    py-2 px-2.5 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                       onClick={() => setDeleteOpen(true)}
                                    >
                                       <Trash2
                                          className="text-red-400"
                                          size="18"
                                       />
                                       Delete
                                    </button>
                                 </Menu.Item>
                              </div>
                           </Menu.Items>
                        </Transition>
                     </Menu>
                     {post.isPublished ? null : (
                        <Form method="post">
                           {isPublishing ? (
                              <div className="h-9 w-24 rounded-full border-2 border-color flex items-center justify-center bg-2">
                                 <DotLoader />
                              </div>
                           ) : (
                              <button
                                 disabled={disabled}
                                 type="submit"
                                 name="intent"
                                 value="publish"
                              >
                                 <div
                                    className="group shadow-sm shadow-1 inline-flex justify-center h-9 items-center rounded-full bg-emerald-500 
                              w-24 font-bold text-white text-sm transition hover:bg-emerald-600 dark:hover:bg-emerald-400"
                                 >
                                    {t("actions.publish")}
                                    <svg
                                       className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
                                       fill="none"
                                       width="12"
                                       height="12"
                                       viewBox="0 0 12 12"
                                       aria-hidden="true"
                                    >
                                       <path
                                          className="opacity-0 transition group-hover:opacity-100"
                                          d="M0 5h7"
                                       ></path>
                                       <path
                                          className="transition group-hover:translate-x-[3px]"
                                          d="M1 1l4 4-4 4"
                                       ></path>
                                    </svg>
                                 </div>
                              </button>
                           )}
                        </Form>
                     )}
                  </div>
               </div>
            </AdminOrOwner>
            <div className="relative mb-3 flex items-center gap-3">
               <input
                  className="mt-0 w-full rounded-sm border-0 bg-transparent p-0 font-header text-3xl 
                   laptop:text-4xl font-semibold focus:ring-transparent"
                  name={zo.fields.title()}
                  type="text"
                  defaultValue={post.title}
                  onChange={(event) => setTitleValue(event.target.value)}
                  placeholder="Add a title..."
               />
               {isTitleAdding ? (
                  <Loader2 className="absolute right-2 mx-auto h-6 w-6 animate-spin text-emerald-500" />
               ) : null}
            </div>
            <PostHeader post={post} />
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
            ) : isShowBanner ? (
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
                        className="bg-2 border-color flex aspect-[1.91/1] desktop:border 
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
                  </label>
                  <input type="hidden" name="intent" value="updateBanner" />
               </fetcher.Form>
            ) : null}
         </section>
      </>
   );
};
