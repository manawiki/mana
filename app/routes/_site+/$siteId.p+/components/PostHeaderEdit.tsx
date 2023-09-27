import type { FormEvent } from "react";
import { useState, useEffect, Fragment } from "react";

import { Menu, Popover, Transition } from "@headlessui/react";
import { useFetcher, useActionData, Link, useParams } from "@remix-run/react";
import dt from "date-and-time";
import {
   Loader2,
   ImageMinus,
   Upload,
   EyeOff,
   MoreVertical,
   Trash2,
   ChevronUp,
   ExternalLink,
   History,
   Copy,
   Share2,
   Image as ImageIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import TextareaAutosize from "react-textarea-autosize";
import { useZorm } from "react-zorm";

import { settings } from "mana-config";
import type { Post } from "payload/generated-types";
import { DotLoader } from "~/components/DotLoader";
import { Image } from "~/components/Image";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import { useDebouncedValue, useIsMount } from "~/hooks";
import { AdminOrStaffOrOwner } from "~/modules/auth";
import { isProcessing, isAdding, type FormResponse } from "~/utils";

import { PostDeleteModal } from "./PostDeleteModal";
import { PostUnpublishModal } from "./PostUnpublishModal";
import { PostVersionModal } from "./PostVersionModal";
import { PostHeader } from "./PostHeader";
import { postSchema } from "../utils/postSchema";

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "post",
};

export const PostHeaderEdit = ({
   post,
   versions,
}: {
   post: Post;
   versions: any;
}) => {
   //Update title logic
   const fetcher = useFetcher();
   const [titleValue, setTitleValue] = useState("");
   const [subtitleValue, setsubtitleValue] = useState("");

   const debouncedTitle = useDebouncedValue(titleValue, 500);
   const debouncedSubtitle = useDebouncedValue(subtitleValue, 500);

   const isMount = useIsMount();

   const isBannerDeleting = isAdding(fetcher, "deleteBanner");
   const isBannerAdding = isAdding(fetcher, "updateBanner");
   const isPublishing = isAdding(fetcher, "publish");
   const disabled = isProcessing(fetcher.state);

   const [isShowBanner, setIsBannerShowing] = useState(false);
   const formResponse = useActionData<FormResponse>();
   const [isDeleteOpen, setDeleteOpen] = useState(false);
   const [isVersionModalOpen, setVersionModal] = useState(false);
   const [isUnpublishOpen, setUnpublishOpen] = useState(false);
   // const [collabStatus, setCollabStatus] = useState(post?.collaboration);

   const { t } = useTranslation(handle?.i18n);

   const { siteId } = useParams();

   const zo = useZorm("newPost", postSchema, {
      //@ts-ignore
      customIssues: formResponse?.serverIssues,
   });

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

   const postFullUrl = `${settings.domainFull}/${siteId}/posts/${post.id}/${post.slug}`;

   //Image Upload
   const [dragActive, setDragActive] = useState(false);
   const handleDrop = function (e: any, fetcher: any) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         const formData = new FormData();
         formData.append("intent", "updateBanner");
         formData.append("banner", e.dataTransfer.files[0]);
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
         <PostDeleteModal
            isDeleteOpen={isDeleteOpen}
            setDeleteOpen={setDeleteOpen}
         />
         <PostUnpublishModal
            isUnpublishOpen={isUnpublishOpen}
            setUnpublishOpen={setUnpublishOpen}
         />
         <section className="mx-auto max-w-[728px]">
            <AdminOrStaffOrOwner>
               <div className="flex items-center justify-between pb-6">
                  <div className="flex items-center justify-between gap-3 desktop:-ml-11">
                     <Menu as="div" className="relative">
                        <Menu.Button
                           className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-200 
                        bg-emerald-50 transition duration-300 active:translate-y-0.5
                        dark:border-emerald-700 dark:bg-emerald-900"
                        >
                           <MoreVertical
                              className="text-emerald-500"
                              size={20}
                           />
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
                              className="absolute left-0 z-10 mt-2.5 w-full
                                        min-w-[220px] origin-top-left transform transition-all"
                           >
                              <div className="border-color bg-2 shadow-1 space-y-1 rounded-lg border p-2 shadow">
                                 {/* <Menu.Item>
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
                                 </Menu.Item> */}
                                 {/* <Menu.Item>
                                    <div className="flex items-center justify-between">
                                       <div className="text-1 flex w-full items-center gap-3 px-2.5 py-2 text-sm font-bold">
                                          <Users
                                             className="text-blue-500"
                                             size="18"
                                          />
                                          Collaboration
                                       </div>
                                       <Tooltip
                                          id="collaboration-toggle"
                                          side="right"
                                          content={`${
                                             collabStatus
                                                ? "Disable Collaboration"
                                                : "Enable Collaboration"
                                          }`}
                                          className="flex items-center justify-center"
                                       >
                                          <Switch
                                             checked={collabStatus}
                                             onChange={handleToggleState}
                                             className={`${
                                                collabStatus
                                                   ? "bg-emerald-500"
                                                   : "bg-zinc-300 dark:bg-zinc-700"
                                             }
                                                relative mr-1 inline-flex h-5 w-9 shrink-0 cursor-pointer 
                                                rounded-full border-2 border-transparent transition-colors 
                                                duration-200 ease-in-out focus:outline-none focus-visible:ring-2  
                                              focus-visible:ring-white focus-visible:ring-opacity-75`}
                                          >
                                             <span className="sr-only">
                                                Toggle Collab
                                             </span>
                                             <span
                                                aria-hidden="true"
                                                className={`${
                                                   collabStatus
                                                      ? "translate-x-4"
                                                      : "translate-x-0"
                                                }
                                          pointer-events-none inline-block h-4 w-4 transform rounded-full
                                          bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                             />
                                          </Switch>
                                       </Tooltip>
                                    </div>
                                 </Menu.Item> */}
                                 {post._status == "published" && (
                                    <Menu.Item>
                                       <button
                                          className="text-1 flex w-full items-center gap-3 rounded-lg px-2.5
                                    py-2 text-sm font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                          onClick={() => setUnpublishOpen(true)}
                                       >
                                          <EyeOff
                                             className="text-zinc-400"
                                             size="18"
                                          />
                                          Unpublish
                                       </button>
                                    </Menu.Item>
                                 )}
                                 <Menu.Item>
                                    <button
                                       className="text-1 flex w-full items-center gap-3 rounded-lg
                                    px-2.5 py-2 text-sm font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
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
                     <button
                        onClick={() => setIsBannerShowing((v) => !v)}
                        className="bg-5 text-1 border-color flex h-8 items-center 
                        gap-2 rounded-lg border px-2.5 hover:border-emerald-200 dark:border-zinc-600 dark:hover:border-emerald-800"
                     >
                        {isShowBanner ? (
                           <ChevronUp size={16} />
                        ) : (
                           <ImageIcon className="text-emerald-500" size={16} />
                        )}
                        <span className="text-xs font-bold max-laptop:hidden">
                           Banner
                        </span>
                     </button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                     <Tooltip>
                        <TooltipTrigger>
                           <button
                              className="border-color bg-5 flex h-9 w-9 items-center 
                                 justify-center rounded-full
                                 border hover:border-emerald-200 dark:border-zinc-600 dark:hover:border-emerald-800"
                              onClick={() => setVersionModal(true)}
                           >
                              <History className="text-emerald-500" size={18} />
                           </button>
                        </TooltipTrigger>
                        <TooltipContent>History</TooltipContent>
                     </Tooltip>
                     <Popover className="relative">
                        {({ open }) => (
                           <>
                              <Tooltip>
                                 <TooltipTrigger>
                                    <Popover.Button
                                       className="border-color bg-5 flex h-9 w-9
                                    items-center justify-center
                               rounded-full border hover:border-emerald-200 focus:outline-none dark:border-zinc-600 dark:hover:border-emerald-800"
                                    >
                                       <Share2
                                          size={18}
                                          className="text-emerald-500"
                                       />
                                    </Popover.Button>
                                 </TooltipTrigger>
                                 <TooltipContent>Share</TooltipContent>
                              </Tooltip>
                              <Transition
                                 as={Fragment}
                                 enter="transition ease-out duration-200"
                                 enterFrom="opacity-0 translate-y-1"
                                 enterTo="opacity-100 translate-y-0"
                                 leave="transition ease-in duration-150"
                                 leaveFrom="opacity-100 translate-y-0"
                                 leaveTo="opacity-0 translate-y-1"
                              >
                                 <Popover.Panel
                                    className="border-color bg-2 shadow-1 absolute right-0 z-10
                                    mt-2 w-screen max-w-[300px] transform space-y-1 rounded-lg border 
                                    p-4 shadow"
                                 >
                                    {post._status == "published" ? (
                                       <div className="flex items-center justify-between pb-2">
                                          <div className="space-y-0.5 text-xs">
                                             <div className="text-1">
                                                Last published
                                             </div>
                                             <div className="font-bold">
                                                {dt.format(
                                                   new Date(
                                                      versions?.docs[0]
                                                         .updatedAt as string,
                                                   ),
                                                   "MMMM D, hh:mm A",
                                                )}
                                             </div>
                                          </div>
                                          <Tooltip>
                                             <TooltipTrigger>
                                                <Link
                                                   className="bg-3 shadow-1 flex h-9 w-9 items-center justify-center
                                           gap-2 rounded-xl text-sm font-bold shadow-sm"
                                                   target="_blank"
                                                   to={`/${siteId}/posts/${post.id}/${post.slug}`}
                                                >
                                                   <ExternalLink
                                                      size={18}
                                                      className="text-emerald-500"
                                                   />
                                                </Link>
                                             </TooltipTrigger>
                                             <TooltipContent>
                                                View post
                                             </TooltipContent>
                                          </Tooltip>
                                       </div>
                                    ) : (
                                       <div>
                                          <div className="space-y-0.5 pb-2 text-xs">
                                             <div className="text-1">
                                                Status
                                             </div>
                                             <div className="font-bold">
                                                Unpublished
                                             </div>
                                          </div>
                                       </div>
                                    )}
                                    <div className="bg-3 border-color flex h-10 items-center rounded-md border pr-1">
                                       <input
                                          className="text-1 flex-grow
                                           truncate bg-transparent p-3 text-sm focus:outline-none"
                                          readOnly
                                          value={postFullUrl}
                                       />
                                       <Tooltip>
                                          <TooltipTrigger>
                                             <button
                                                className="active:bg-5 flex h-7 w-7 flex-none 
                                             items-center justify-center rounded-md"
                                                onClick={() =>
                                                   navigator.clipboard.writeText(
                                                      postFullUrl,
                                                   )
                                                }
                                             >
                                                <Copy
                                                   className="text-emerald-500"
                                                   size={18}
                                                />
                                             </button>
                                          </TooltipTrigger>
                                          <TooltipContent>Copy</TooltipContent>
                                       </Tooltip>
                                    </div>
                                 </Popover.Panel>
                              </Transition>
                           </>
                        )}
                     </Popover>
                     {isPublishing ? (
                        <div className="border-color bg-5 flex h-9 w-24 items-center justify-center rounded-full border-2">
                           <DotLoader />
                        </div>
                     ) : (
                        <fetcher.Form method="post">
                           <Tooltip>
                              <TooltipTrigger>
                                 <button
                                    disabled={disabled}
                                    type="submit"
                                    name="intent"
                                    value="publish"
                                    className="
                                          shadow-1 group inline-flex h-9 cursor-pointer items-center
                                          justify-center rounded-full bg-emerald-500 px-4 text-sm font-bold text-white shadow-sm 
                                          transition hover:bg-emerald-600 dark:hover:bg-emerald-400"
                                 >
                                    Publish
                                    <svg
                                       className="-mr-1 ml-2 mt-0.5 stroke-white stroke-2"
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
                                 </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                 Publish New Changes
                              </TooltipContent>
                           </Tooltip>
                        </fetcher.Form>
                     )}
                  </div>
               </div>
            </AdminOrStaffOrOwner>
            <div className="relative mb-3 flex items-center gap-3">
               <TextareaAutosize
                  className="mt-0 min-h-[20px] w-full resize-none overflow-hidden rounded-sm border-0 bg-transparent p-0 
                   font-header text-3xl font-semibold !leading-[3rem] focus:ring-transparent laptop:text-4xl"
                  name={zo.fields.name()}
                  defaultValue={post.name}
                  onChange={(event) => setTitleValue(event.target.value)}
                  placeholder="Add a title..."
               />
            </div>
            <PostHeader post={post} />
            <div className="border-color relative mb-6 flex items-center gap-3 border-b border-zinc-100 pb-3">
               <TextareaAutosize
                  className="text-1 mt-0 min-h-[20px] w-full resize-none overflow-hidden rounded-sm border-0 bg-transparent 
                  p-0 text-sm font-semibold focus:ring-transparent"
                  name={zo.fields.subtitle()}
                  defaultValue={post.subtitle}
                  onChange={(event) => setsubtitleValue(event.target.value)}
                  placeholder="Add a subtitle..."
               />
            </div>
         </section>
         <section className="mx-auto max-w-[800px]">
            {post.banner ? (
               <div>
                  <div className="relative mb-5">
                     <div
                        className="bg-1 border-color flex aspect-[1.91/1] items-center 
                         justify-center overflow-hidden shadow-sm
                         tablet:rounded-md laptop:rounded-none laptop:border-x-0 desktop:rounded-md
                         desktop:border"
                     >
                        <Image
                           alt="Post Banner"
                           className="h-full w-full object-cover"
                           options="height=440"
                           url={post?.banner?.url}
                        />
                     </div>
                     <button
                        className="absolute right-2.5 top-2.5 flex h-10 w-10 items-center
                   justify-center rounded-md bg-white/60 dark:bg-zinc-800/50"
                        onClick={() =>
                           fetcher.submit(
                              { intent: "deleteBanner" },
                              { method: "delete" },
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
               </div>
            ) : isShowBanner ? (
               <div className="relative mb-5">
                  <fetcher.Form
                     method="patch"
                     encType="multipart/form-data"
                     replace
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
                        } bg-2 border-color group flex aspect-[1.91/1] cursor-pointer items-center
                        justify-center overflow-hidden border-y shadow-sm hover:border-2
                        tablet:rounded-md tablet:border laptop:rounded-none 
                        laptop:border-x-0 desktop:rounded-md desktop:border`}
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

                           <div className="text-center font-bold group-hover:underline">
                              Drag or click to upload a banner
                           </div>
                           <div className="text-center text-sm">
                              JPEG, PNG, JPG or WEBP (MAX. 5MB)
                           </div>
                        </div>
                        <input
                           // @ts-ignore
                           name={zo.fields.banner()}
                           type="file"
                           className="hidden"
                        />
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
         </section>
         {versions?.docs?.length === 0 ? null : (
            <>
               <PostVersionModal
                  versions={versions}
                  isVersionModalOpen={isVersionModalOpen}
                  setVersionModal={setVersionModal}
               />
            </>
         )}
      </>
   );
};
