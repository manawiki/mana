import type { Note } from "payload-types";
import {
   type ActionArgs,
   type LoaderArgs,
   json,
   redirect,
} from "@remix-run/node";
import {
   Form,
   Link,
   Outlet,
   useLoaderData,
   useNavigation,
   useFetcher,
   useActionData,
} from "@remix-run/react";
import { Fragment, Suspense, useEffect, useState } from "react";
import { z } from "zod";
import { zx } from "zodix";
import { NoteViewer } from "~/modules/note/components/NoteViewer";
import {
   CopyIcon,
   EyeOff,
   ImageMinus,
   Loader2,
   MoreVertical,
   Plus,
   Trash2,
   Upload,
   X,
} from "lucide-react";
import {
   type FormResponse,
   assertIsPatch,
   getMultipleFormData,
   uploadImage,
   commitSession,
   getSession,
   setSuccessMessage,
   assertIsDelete,
   isAdding,
   isProcessing,
} from "~/utils";
import { formatDistanceStrict } from "date-fns";
import { AdminOrOwner, useIsAdminOrOwner } from "~/modules/auth";
import { createCustomIssues, useZorm } from "react-zorm";
import { Menu, Transition } from "@headlessui/react";
import { Modal } from "~/components/Modal";
import { useTranslation } from "react-i18next";
import { toast } from "~/components/Toaster";
import { Err } from "~/components/Forms";
import { useDebouncedValue, useIsMount } from "~/hooks";
import { Image } from "~/components/Image";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/20/solid";

type Mode = "edit" | "preview";

const PostSchema = z.object({
   title: z
      .string()
      .min(3, "Title is too short.")
      .max(200, "Title is too long.")
      .optional(),
   banner: z
      .any()
      .refine((file) => file?.size <= 5000000, `Max image size is 5MB.`)
      .refine(
         (file) =>
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
               file?.type
            ),
         "Only .jpg, .jpeg, .png and .webp formats are supported."
      )
      .optional(),
});

//get notes list from payload
export async function loader({
   context: { payload, user },
   params,
}: LoaderArgs) {
   const { postId } = zx.parseParams(params, {
      postId: z.string(),
   });

   //ideally, we grab post and notes in one query, but I don't know how to grab the draft notes yet
   const post = await payload.findByID({
      collection: "posts",
      id: postId,
      overrideAccess: false,
      user,
      depth: 2,
   });

   let notes = [] as Note[];

   const authorId =
      typeof post.author === "string" ? post.author : post.author.id;

   //pass in draft docs if the user is the author
   if (authorId === user?.id)
      notes = await Promise.all(
         post?.notes?.map((note) =>
            payload.findByID({
               collection: "notes",
               id: typeof note === "string" ? note : note.id,
               draft: true,
               overrideAccess: false,
               user,
            })
         )
      );

   return { post, notes };
}

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "post",
};

export default function Post() {
   const data = useLoaderData<typeof loader>();
   const { post } = data;
   const viewModeDefault = useIsAdminOrOwner();
   const [mode, setMode] = useState<Mode>(viewModeDefault ? "edit" : "preview");
   const [isDeleteOpen, setDeleteOpen] = useState(false);
   const [isUnpublishOpen, setUnpublishOpen] = useState(false);
   const { t } = useTranslation(handle?.i18n);
   const fetcher = useFetcher();
   const deleting = isAdding(fetcher, "delete");

   return (
      <div className="relative">
         {/* Delete Modal */}
         <Modal
            onClose={() => {
               setDeleteOpen(false);
            }}
            show={isDeleteOpen}
         >
            <div
               className="border-color bg-1 mx-5 max-w-sm transform rounded-2xl
                                    border-2 py-6 px-8 text-left align-middle shadow-xl transition-all"
            >
               <div className="pb-6">
                  <div className="pb-2 text-center text-lg font-bold">
                     Are you sure you want to delete this post permanently?
                  </div>
                  <div className="text-1 text-center">
                     You cannot undo this action.
                  </div>
               </div>
               <button
                  className="absolute -right-4 -top-4 flex h-8 w-8
                  items-center justify-center rounded-full border-2 border-red-300 bg-white
               hover:bg-red-50 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  onClick={() => setDeleteOpen(false)}
               >
                  <X className="h-5 w-5 text-red-400" />
               </button>
               <div className="grid grid-cols-2 gap-4">
                  <button
                     className="h-10 rounded-md bg-zinc-200 text-sm 
                     font-bold focus:bg-zinc-100 dark:bg-zinc-700 dark:focus:bg-zinc-600"
                     onClick={() => setDeleteOpen(false)}
                  >
                     Cancel
                  </button>
                  <button
                     onClick={() =>
                        fetcher.submit(
                           { intent: "delete" },
                           { method: "delete" }
                        )
                     }
                     className="h-10 w-full rounded-md bg-red-500 text-sm font-bold text-white
                                              focus:bg-red-400 dark:bg-red-600 dark:focus:bg-red-500"
                  >
                     {deleting ? (
                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-red-200" />
                     ) : (
                        t("actions.delete")
                     )}
                  </button>
               </div>
            </div>
         </Modal>
         {/* Unpublish Modal */}
         <Modal
            onClose={() => {
               setUnpublishOpen(false);
            }}
            show={isUnpublishOpen}
         >
            <div
               className="border-color bg-1 mx-5 max-w-md transform rounded-2xl
                                    border-2 py-6 px-8 text-left align-middle shadow-xl transition-all"
            >
               <div className="pb-6">
                  <div className="pb-2 text-center text-lg font-bold">
                     Are you sure you want to unpublish this post?
                  </div>
                  <div className="text-1 text-center">
                     Your post will no longer be publically viewable.
                  </div>
               </div>
               <button
                  className="absolute -right-4 -top-4 flex h-8 w-8
                  items-center justify-center rounded-full border-2 border-red-300 bg-white
               hover:bg-red-50 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  onClick={() => setUnpublishOpen(false)}
               >
                  <X className="h-5 w-5 text-red-400" />
               </button>
               <div className="grid grid-cols-2 gap-4">
                  <button
                     className="h-10 rounded-md bg-zinc-200 text-sm 
                     font-bold focus:bg-zinc-100 dark:bg-zinc-700 dark:focus:bg-zinc-600"
                     onClick={() => setUnpublishOpen(false)}
                  >
                     Cancel
                  </button>
                  <button
                     onClick={() =>
                        fetcher.submit(
                           { intent: "unpublish" },
                           { method: "post" }
                        )
                     }
                     className="h-10 w-full rounded-md bg-zinc-500 text-sm font-bold text-white
                                              focus:bg-zinc-400 dark:bg-zinc-600 dark:focus:bg-zinc-500"
                  >
                     {deleting ? (
                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-red-200" />
                     ) : (
                        "Unpublish"
                     )}
                  </button>
               </div>
            </div>
         </Modal>
         <div
            className="border-color bg-1 max-laptop:w-full max-laptop:border-y fixed top-20 z-30 flex 
            h-14 items-center justify-between border-b px-3 laptop:sticky laptop:top-0"
         >
            <AdminOrOwner>
               {post.isPublished ? (
                  <span
                     className="flex h-7 items-center justify-center rounded-md border border-green-200
                  bg-green-50 px-2 text-xs font-semibold text-green-500 dark:border-green-800 dark:bg-green-900"
                  >
                     Published
                  </span>
               ) : (
                  <span className="rounded bg-zinc-500 py-1 px-2 text-xs font-semibold text-white">
                     Draft
                  </span>
               )}
               <div className="flex cursor-pointer items-center gap-2">
                  <span
                     onClick={() => setMode("edit")}
                     className={`${
                        mode == "edit" &&
                        "bg-blue-500 text-white hover:!bg-blue-500"
                     } rounded-full py-1 px-3 text-sm font-semibold transition 
                        hover:bg-zinc-100 dark:hover:bg-zinc-800`}
                  >
                     Edit
                  </span>
                  <span
                     onClick={() => setMode("preview")}
                     className={`${
                        mode == "preview" &&
                        "bg-blue-500 text-white hover:!bg-blue-500"
                     } rounded-full py-1 px-3 text-sm font-semibold transition 
                        hover:bg-zinc-100 dark:hover:bg-zinc-800`}
                  >
                     Preview
                  </span>
               </div>
               <div className="flex items-center gap-3">
                  <Menu as="div" className="relative">
                     <Menu.Button
                        className="bg-2 flex h-8 w-8 items-center justify-center 
                        rounded-full border-2 text-blue-500 transition
                        duration-300 hover:bg-gray-100 active:translate-y-0.5
                        dark:border-zinc-600 dark:hover:bg-zinc-700"
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
                                        origin-top-right transform transition-all"
                        >
                           <div
                              className="border-color rounded-lg border bg-white p-1.5
                                            shadow dark:bg-zinc-800 dark:shadow-black"
                           >
                              <Menu.Item>
                                 <button
                                    className="text-1 flex w-full items-center gap-3 rounded-lg
                                    py-2 px-2.5 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                 >
                                    <CopyIcon
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
                        <button
                           type="submit"
                           name="intent"
                           value="publish"
                           className="h-8 rounded-full bg-green-500 px-4 text-sm font-bold text-white"
                        >
                           Publish
                        </button>
                     </Form>
                  )}
               </div>
            </AdminOrOwner>
         </div>
         {mode === "edit" ? <PostEdit /> : <PostView />}
         <AdminOrOwner>
            {mode === "edit" && (
               <div
                  className="border-color bg-2 laptop:bg-1 sticky bottom-12 z-20 flex h-20 
                    items-center justify-between 
                    border-t px-3 shadow laptop:bottom-0 laptop:h-14"
               >
                  <div className="mx-auto -mt-14 laptop:-mt-8">
                     <Link to="add" prefetch="intent">
                        <div
                           className="mx-auto flex h-11 w-11 items-center justify-center
                    rounded-full border border-blue-300
                   bg-blue-500 font-semibold text-white dark:border-blue-700 
                   dark:bg-blue-800 "
                        >
                           <Plus className="h-6 w-6" />
                        </div>
                        <div className="pt-1 text-sm font-semibold">
                           Add Section
                        </div>
                     </Link>
                  </div>
               </div>
            )}
         </AdminOrOwner>
         <Outlet />
      </div>
   );
}

export function PostEdit() {
   const data = useLoaderData<typeof loader>();

   const { post } = data;

   //This is necessary to determine whether the user should see the draft notes or not.
   const notes = (data.notes.length ? data.notes : post.notes) as Note[];

   const formResponse = useActionData<FormResponse>();
   const zo = useZorm("newPost", PostSchema, {
      //@ts-ignore
      customIssues: formResponse?.serverIssues,
   });
   const transition = useNavigation();
   const disabled = isProcessing(transition.state);
   const fetcher = useFetcher();
   const isTitleAdding = isAdding(fetcher, "updateTitle");
   const isBannerDeleting = isAdding(fetcher, "deleteBanner");
   const isBannerAdding = isAdding(fetcher, "updateBanner");
   const isMount = useIsMount();

   useEffect(() => {
      if (fetcher.type === "done") {
         if (fetcher.data?.success) {
            toast.success(fetcher.data?.success);
         }
         if (fetcher.data?.error) {
            toast.error(fetcher.data?.error);
         }
      }
   }, [fetcher.type]);

   const [titleValue, setTitleValue] = useState("");
   const debouncedValue = useDebouncedValue(titleValue, 500);

   useEffect(() => {
      if (!isMount) {
         fetcher.submit(
            { title: debouncedValue, intent: "updateTitle" },
            { method: "patch" }
         );
      }
   }, [debouncedValue]);

   return (
      <div
         className="post-content max-laptop:pt-24 max-laptop:pb-20 relative mx-auto 
      min-h-screen max-w-[728px] px-3 tablet:px-0 laptop:px-3 laptop:py-12 desktop:px-0"
      >
         <div className="relative mb-3 flex items-center gap-3">
            <input
               className="mt-0 w-full rounded-sm border-0 bg-transparent p-0 font-mono text-3xl font-semibold !ring-zinc-200
               !ring-offset-4 !ring-offset-white hover:bg-white hover:ring-2 focus:bg-white focus:ring-2 dark:!ring-zinc-600
               dark:!ring-offset-zinc-700 dark:hover:bg-zinc-700 dark:focus:bg-zinc-700"
               name={zo.fields.title()}
               type="text"
               defaultValue={post.title}
               onChange={(event) => setTitleValue(event.target.value)}
               disabled={disabled}
               placeholder="Add a title..."
            />
            {isTitleAdding ? (
               <Loader2 className="absolute right-2 mx-auto h-6 w-6 animate-spin text-blue-500" />
            ) : null}
            {zo.errors.title((err) => (
               <Err>{err.message}</Err>
            ))}
         </div>
         <div className="flex items-center gap-3 pb-5">
            <time
               className="text-1 flex items-center gap-1.5 text-sm"
               dateTime={post?.updatedAt}
            >
               <PencilSquareIcon className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
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
                     <EyeIcon className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
                     {formatDistanceStrict(
                        new Date(post?.publishedAt as string),
                        new Date(),
                        {
                           addSuffix: true,
                        }
                     )}
                  </time>
               </>
            )}
         </div>
         {post.banner ? (
            <div className="relative">
               <div className="aspect-[1.91/1] overflow-hidden rounded">
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
               method="patch"
               encType="multipart/form-data"
               replace
               onChange={(event) => {
                  fetcher.submit(event.currentTarget, { method: "patch" });
               }}
            >
               <label className="cursor-pointer">
                  <div
                     className="bg-1 border-color flex aspect-[1.91/1] 
                   items-center justify-center overflow-hidden rounded border-2 border-dashed hover:border-4"
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

         <div className="mt-4 mb-5 flex items-center gap-3 rounded-md">
            <div className="bg-1 h-9 w-9 overflow-hidden rounded-full">
               {/* @ts-expect-error */}
               {post?.author?.avatar ? (
                  <Image /* @ts-expect-error */
                     url={post.author.avatar.url}
                     options="fit=crop,width=44,height=44,gravity=auto"
                     className="h-full w-full object-cover"
                     /* @ts-expect-error */
                     alt={post?.author?.username}
                  />
               ) : null}
            </div>
            {/* @ts-expect-error */}
            <div className="font-semibold">{post?.author?.username}</div>
         </div>
         <Suspense fallback={<div>Loading...</div>}>
            {notes.map((note) => (
               <div key={note.id} className="group">
                  <Link
                     to={`edit/${note.id}`}
                     prefetch="intent"
                     className="absolute right-0 hidden rounded bg-blue-500 px-2 py-1 
                     text-xs font-bold text-white group-hover:inline-block"
                  >
                     Edit
                  </Link>
                  <NoteViewer
                     className="post-content outline-1 outline-offset-8 outline-zinc-300 group-hover:cursor-pointer 
                     group-hover:rounded-sm group-hover:outline-dotted dark:outline-zinc-600"
                     note={note}
                     //insert custom components here
                     components={
                        {
                           // h2: (props) => <h2 className="text-2xl" {...props} />,
                        }
                     }
                  />
               </div>
            ))}
         </Suspense>
      </div>
   );
}

export function PostView() {
   const data = useLoaderData<typeof loader>();

   const { post } = data;

   //This is necessary to determine whether the user should see the draft notes or not.
   const notes = (data.notes.length ? data.notes : post.notes) as Note[];

   return (
      <div
         className="post-content max-laptop:pt-24 max-laptop:pb-20 relative mx-auto 
      min-h-screen max-w-[728px] px-3 tablet:px-0 laptop:px-3 laptop:py-12 desktop:px-0"
      >
         <h1 className="pb-3 font-mono text-2xl font-semibold laptop:text-3xl">
            {post?.title}
         </h1>
         <div className="flex items-center gap-3 pb-5">
            <time
               className="text-1 flex items-center gap-1.5 text-sm"
               dateTime={post?.updatedAt}
            >
               <PencilSquareIcon className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
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
                     <EyeIcon className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
                     {formatDistanceStrict(
                        new Date(post?.publishedAt as string),
                        new Date(),
                        {
                           addSuffix: true,
                        }
                     )}
                  </time>
               </>
            )}
         </div>
         {post.banner ? (
            <div className="aspect-[1.91/1] overflow-hidden rounded-lg">
               <img
                  alt={post.title}
                  className="h-full w-full object-cover"
                  //@ts-ignore
                  src={`https://mana.wiki/cdn-cgi/image/fit=crop,height=440,gravity=auto/${post?.banner?.url}`}
               />
            </div>
         ) : null}
         <div className="border-color mb-3 flex items-center gap-3 border-b-2 py-4">
            <div className="bg-1 h-9 w-9 overflow-hidden rounded-full">
               {/* @ts-ignore */}
               {post?.author?.avatar ? (
                  <img
                     // @ts-ignore
                     alt={post?.author?.username}
                     className="h-full w-full object-cover"
                     //@ts-ignore
                     src={`${post.author.avatar.url}?aspect_ratio=1:1&height=100`}
                  />
               ) : null}
            </div>
            {/* @ts-ignore */}
            <div>{post?.author?.username}</div>
         </div>
         <Suspense fallback={<div>Loading...</div>}>
            {notes.map((note) => (
               <NoteViewer
                  key={note.id}
                  note={note}
                  //insert custom components here
                  components={
                     {
                        // h2: (props) => <h2 className="text-2xl" {...props} />,
                     }
                  }
               />
            ))}
         </Suspense>
      </div>
   );
}

export async function action({
   context: { payload, user },
   request,
   params,
}: ActionArgs) {
   const { siteId, postId } = zx.parseParams(params, {
      siteId: z.string().length(10),
      postId: z.string(),
   });

   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   if (!user || !user.id) return redirect("/login", { status: 302 });

   const session = await getSession(request.headers.get("cookie"));
   const issues = createCustomIssues(PostSchema);

   switch (intent) {
      case "updateTitle": {
         assertIsPatch(request);
         const result = await zx.parseFormSafe(request, PostSchema);
         if (result.success) {
            const { title } = result.data;
            try {
               return await payload.update({
                  collection: "posts",
                  id: postId,
                  data: {
                     title,
                  },
                  overrideAccess: false,
                  user,
               });
            } catch (error) {
               console.log(error);
               return json({
                  error: "Something went wrong...unable to update title.",
               });
            }
         }
         //If user input has problems
         if (issues.hasIssues()) {
            return json<FormResponse>(
               { serverIssues: issues.toArray() },
               { status: 400 }
            );
         }
         // Last resort error message
         return json({
            error: "Something went wrong...unable to update title.",
         });
      }
      case "updateBanner": {
         assertIsPatch(request);
         const result = await getMultipleFormData({
            request,
            prefix: "postBanner",
            schema: PostSchema,
         });
         if (result.success) {
            const { banner } = result.data;
            try {
               const bannerId = await uploadImage({
                  payload,
                  image: banner,
                  user,
               });
               return await payload.update({
                  collection: "posts",
                  id: postId,
                  data: {
                     banner: bannerId,
                  },
                  overrideAccess: false,
                  user,
               });
            } catch (error) {
               return json({
                  error: "Something went wrong...unable to update banner.",
               });
            }
         }
         //If user input has problems
         if (issues.hasIssues()) {
            return json<FormResponse>(
               { serverIssues: issues.toArray() },
               { status: 400 }
            );
         }
         // Last resort error message
         return json({
            error: "Something went wrong...unable to update banner.",
         });
      }
      case "deleteBanner": {
         assertIsDelete(request);
         const post = await payload.findByID({
            collection: "posts",
            id: postId,
            overrideAccess: false,
            user,
            depth: 2,
         });
         //@ts-expect-error
         const bannerId = post?.banner?.id;
         await payload.delete({
            collection: "images",
            id: bannerId,
            overrideAccess: false,
            user,
         });
         return await payload.update({
            collection: "posts",
            id: postId,
            data: {
               banner: "",
            },
            overrideAccess: false,
            user,
         });
      }
      case "delete": {
         assertIsDelete(request);
         const post = await payload.delete({
            collection: "posts",
            id: postId,
            overrideAccess: false,
            user,
         });
         //@ts-expect-error
         const bannerId = post?.banner?.id;
         if (bannerId) {
            await payload.delete({
               collection: "images",
               id: bannerId,
               overrideAccess: false,
               user,
            });
         }
         await Promise.all(
            post?.notes?.map((note) =>
               payload.delete({
                  collection: "notes",
                  id: typeof note === "string" ? note : note?.id,
                  overrideAccess: false,
                  user,
               })
            )
         );
         const postTitle = post?.title;
         setSuccessMessage(session, `"${postTitle}" successfully deleted`);
         return redirect(`/${siteId}/posts`, {
            headers: { "Set-Cookie": await commitSession(session) },
         });
      }
      case "unpublish": {
         const post = await payload.update({
            collection: "posts",
            id: postId,
            data: {
               isPublished: false,
            },
            overrideAccess: false,
            user,
         });
         await Promise.all(
            post?.notes?.map((note) =>
               payload.update({
                  collection: "notes",
                  id: typeof note === "string" ? note : note?.id,
                  data: {
                     _status: "draft",
                  },
                  overrideAccess: false,
                  user,
               })
            )
         );
         return redirect(`/${siteId}/posts`);
      }
      case "publish": {
         //Flag post as published
         const post = await payload.update({
            collection: "posts",
            id: postId,
            data: {
               isPublished: true,
            },
            overrideAccess: false,
            user,
         });

         // console.dir(post, { depth: null });

         //publish all notes
         //todo: can we do this in one query?
         await Promise.all(
            post?.notes?.map((note) =>
               payload.update({
                  collection: "notes",
                  id: typeof note === "string" ? note : note?.id,
                  data: {
                     _status: "published",
                  },
                  overrideAccess: false,
                  user,
               })
            )
         );
         await payload.update({
            collection: "posts",
            id: postId,
            data: {
               publishedAt: new Date().toISOString(),
            },
            overrideAccess: false,
            user,
         });

         // console.dir(notes, { depth: null });

         return redirect(`/${siteId}/posts`);
      }
      default:
         return null;
   }
}
