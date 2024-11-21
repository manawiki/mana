import { Fragment, Suspense, useEffect, useState } from "react";

import {
   Popover,
   PopoverButton,
   PopoverPanel,
   Transition,
} from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import { Await, Link, useFetcher, useLocation } from "@remix-run/react";
import clsx from "clsx";
import { Editable, Slate } from "slate-react";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import type { Comment } from "~/db/payload-types";
import { LoggedIn } from "~/routes/_auth+/components/LoggedIn";
import { LoggedOut } from "~/routes/_auth+/components/LoggedOut";
import { EditorBlocks } from "~/routes/_editor+/core/components/EditorBlocks";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { Leaf } from "~/routes/_editor+/core/components/Leaf";
import { Toolbar } from "~/routes/_editor+/core/components/Toolbar";
import { useEditor } from "~/routes/_editor+/core/plugins";
import { initialValue } from "~/routes/_editor+/core/utils";
import { isAdding, isProcessing } from "~/utils/form";
import { useRootLoaderData } from "~/utils/useSiteLoaderData";
import { Loading } from "~/components/Loading";
import { DotLoader } from "~/components/DotLoader";

export function Comments({
   comments,
   siteId,
   parentId,
   parentSlug,
   totalComments,
   isCustomSite = false,
}: {
   comments: Comment[] | null | Promise<Comment[]>;
   siteId: string;
   parentId: string | number;
   parentSlug: string;
   totalComments: number;
   isCustomSite?: boolean;
}) {
   const { user } = useRootLoaderData();

   let location = useLocation();

   return (
      <>
         <Suspense fallback={<Loading />}>
            <Await resolve={comments} errorElement={<Loading />}>
               {(comments) => (
                  <div className="max-tablet:px-3 mx-auto max-w-[728px] laptop:w-[728px] py-6 laptop:pb-40 pt-5">
                     <div className="flex items-center gap-3 pt-2 pb-4">
                        <div className="text-base font-header flex items-center gap-1 flex-none">
                           {totalComments > 0 ? (
                              <>
                                 <span className="font-bold">
                                    {totalComments}
                                 </span>
                                 <span className="text-1">
                                    {`Comment${totalComments > 1 ? "s" : ""}`}
                                 </span>
                              </>
                           ) : (
                              <>
                                 <Icon name="message-circle" size={16} />
                                 <span className="text-1">
                                    Start a discussion
                                 </span>
                              </>
                           )}
                        </div>
                        <span className="text-1 h-0.5 w-full dark:bg-zinc-700 bg-zinc-200/70 rounded-full" />
                     </div>
                     <LoggedOut>
                        <div>
                           <div className="mb-3 text-sm">
                              <Link
                                 className="underline font-bold pr-1 hover:text-blue-500"
                                 to={`/login?redirectTo=${location.pathname}`}
                              >
                                 Login
                              </Link>
                              <span className="text-1">
                                 to leave a comment...
                              </span>
                           </div>
                        </div>
                     </LoggedOut>
                     <CommentsEditor
                        isCustomSite={isCustomSite}
                        parentSlug={parentSlug}
                        parentId={parentId}
                        siteId={siteId}
                     />

                     {comments && comments.length > 0
                        ? comments.map((comment, index) => (
                             <CommentRow
                                key={comment?.id}
                                userId={user?.id}
                                comment={comment}
                                comments={comments}
                                topLevelIndex={index}
                                parentId={parentId}
                                parentSlug={parentSlug}
                                isCustomSite={isCustomSite}
                                siteId={siteId}
                             />
                          ))
                        : undefined}
                  </div>
               )}
            </Await>
         </Suspense>
      </>
   );
}

function CommentRow({
   comment,
   comments,
   userId,
   isNested,
   topLevelIndex,
   parentId,
   parentSlug,
   siteId,
   isCustomSite = false,
}: {
   comment: Comment;
   comments: Comment[];
   userId: string | undefined;
   isNested?: Boolean;
   topLevelIndex?: number;
   parentId: string | number;
   parentSlug: string;
   siteId: string;
   isCustomSite?: boolean;
}) {
   const [isReplyOpen, setReplyOpen] = useState(false);
   const [isCommentExpanded, setCommentExpanded] = useState(true);

   const fetcher = useFetcher({ key: "comments" });

   //Hide the comment field after submission
   useEffect(
      function resetFormOnSuccess() {
         //@ts-ignore
         if (fetcher.state === "idle" && fetcher.data?.message == "ok") {
            return setReplyOpen(false);
         }
      },
      [fetcher.state, fetcher.data],
   );

   const isDeleted = comment.isDeleted == true;

   const isDeleting = isAdding(fetcher, "deleteComment");

   return (
      <>
         <div
            id={comment.id}
            className={clsx(
               isNested
                  ? `relative before:content-[''] before:absolute before:left-3 
          before:dark:bg-zinc-700 before:bg-[#ededed] before:-z-0 before:h-full before:w-[1px] rounded-full`
                  : "mb-3",
            )}
         >
            <div className="flex items-center gap-2 relative">
               <div
                  className="dark:border-zinc-600 bg-zinc-50 border dark:bg-zinc-700 justify-center shadow-sm shadow-1 
                         flex h-6 w-6 flex-none items-center overflow-hidden rounded-full"
               >
                  {isDeleted ? (
                     <></>
                  ) : comment.author?.avatar?.url ? (
                     <Image
                        width={50}
                        height={50}
                        alt="Avatar"
                        options="aspect_ratio=1:1&height=80&width=80"
                        url={comment.author.avatar.url ?? ""}
                     />
                  ) : (
                     <Icon name="user" className="text-1 mx-auto" size={13} />
                  )}
               </div>
               <div
                  className={clsx(
                     isDeleted
                        ? "text-sm italic text-1"
                        : "text-sm font-bold underline underline-offset-2 dark:decoration-zinc-600 decoration-zinc-300",
                  )}
               >
                  {isDeleted ? "Deleted" : comment.author.username}
               </div>
               <span className="w-1 h-1 bg-zinc-500 rounded-full" />
               <div className="text-xs text-1">
                  {new Date(comment.createdAt).toLocaleTimeString("en-US", {
                     month: "short",
                     day: "numeric",
                     hour: "numeric",
                     minute: "numeric",
                     timeZone: "America/Los_Angeles",
                  })}
               </div>
            </div>
            <div
               className={clsx(
                  !isNested
                     ? `relative before:content-[''] before:absolute before:left-0 rounded-full
                      before:dark:bg-zinc-700 before:bg-[#ededed] before:-z-0 before:h-full before:w-[1px]`
                     : "",
                  "mb-4 ml-3 pl-5 relative",
               )}
            >
               {comment?.replies && comment?.replies?.length > 0 && (
                  <button
                     onClick={() => setCommentExpanded(!isCommentExpanded)}
                     className="absolute -left-[8.5px] bottom-0 bg-zinc-100 dark:bg-dark450 border shadow-sm shadow-1 
                    dark:border-zinc-600 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                  >
                     {isCommentExpanded ? (
                        <Icon name="chevron-up" size={10} />
                     ) : (
                        <Icon name="chevron-down" size={10} />
                     )}
                  </button>
               )}
               <div className="pt-2.5">
                  {comment.comment && <EditorView data={comment.comment} />}
               </div>
               <div className="pt-3 flex items-center">
                  <div className="flex items-center gap-2">
                     <button
                        onClick={() =>
                           fetcher.submit(
                              //@ts-ignore
                              {
                                 commentId: comment?.id,
                                 userId,
                                 intent: "upVoteComment",
                              },
                              { method: "post", action: "/comments" },
                           )
                        }
                        className="border shadow-sm shadow-emerald-100 dark:shadow-emerald-950/50 active:border-emerald-300 group
                         hover:dark:border-emerald-600/70 dark:hover:bg-emerald-950 border-emerald-300/60 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-950/10
                       dark:border-emerald-700/50 w-5 h-5 rounded-md flex items-center justify-center dark:active:border-emerald-600"
                     >
                        <Icon
                           name="triangle"
                           title="Up Vote"
                           className="text-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                           size={8}
                        />
                     </button>
                     <div className="text-xs font-bold">
                        {comment.upVotesStatic ?? 0}
                     </div>
                  </div>
                  <LoggedIn>
                     <span className="w-1 h-1 dark:bg-zinc-600 bg-zinc-300 rounded-full mx-3" />
                     <button
                        onClick={() => setReplyOpen(!isReplyOpen)}
                        className="shadow-sm dark:shadow-zinc-800 flex items-center gap-0.5 border dark:border-zinc-600/50 mr-1
                      dark:hover:border-zinc-500/50 rounded-full dark:bg-dark350 pl-1 pr-2.5 bg-zinc-50 hover:border-zinc-300"
                     >
                        <div className="w-5 h-5 rounded text-1 flex items-center justify-center">
                           {isReplyOpen ? (
                              <Icon title="Close" name="chevron-up" size={14} />
                           ) : (
                              <Icon title="Reply" name="reply" size={14} />
                           )}
                        </div>
                        <div className="text-[10px] font-bold">Reply</div>
                     </button>
                     <Popover>
                        {({ open }) => (
                           <>
                              <Float
                                 as={Fragment}
                                 enter="transition ease-out duration-200"
                                 enterFrom="opacity-0 translate-y-1"
                                 enterTo="opacity-100 translate-y-0"
                                 leave="transition ease-in duration-150"
                                 leaveFrom="opacity-100 translate-y-0"
                                 leaveTo="opacity-0 translate-y-1"
                                 placement="bottom-end"
                                 offset={7}
                              >
                                 <PopoverButton className="flex focus:outline-none items-center text-zinc-400 dark:text-zinc-500 justify-center rounded-full w-5 h-5">
                                    {open ? (
                                       <Icon
                                          title="Close"
                                          name="chevron-up"
                                          size={14}
                                       />
                                    ) : (
                                       <Icon name="more-vertical" size={14} />
                                    )}
                                 </PopoverButton>
                                 <PopoverPanel
                                    as="div"
                                    className="border-color-sub justify-items-center text-1 bg-3-sub shadow-1 
                                        gap-1 z-30 rounded-lg border p-1 shadow-sm absolute"
                                 >
                                    {comment.isDeleted ? (
                                       <button
                                          className="hover:dark:bg-zinc-700 hover:bg-zinc-100 rounded p-1.5"
                                          onClick={() =>
                                             fetcher.submit(
                                                {
                                                   commentId: comment.id,
                                                   intent: "restoreComment",
                                                },
                                                {
                                                   method: "post",
                                                   action: "/comments",
                                                },
                                             )
                                          }
                                       >
                                          <Icon
                                             title="Restore"
                                             name="archive-restore"
                                             size={12}
                                          />
                                       </button>
                                    ) : (
                                       <button
                                          className="hover:dark:bg-zinc-700 hover:bg-zinc-100 rounded p-1.5"
                                          onClick={() =>
                                             fetcher.submit(
                                                {
                                                   commentId: comment.id,
                                                   intent: "deleteComment",
                                                },
                                                {
                                                   method: "post",
                                                   action: "/comments",
                                                },
                                             )
                                          }
                                       >
                                          {isDeleting ? (
                                             <Icon
                                                name="loader-2"
                                                size={12}
                                                className="animate-spin"
                                             />
                                          ) : (
                                             <Icon
                                                title="Delete"
                                                name="archive"
                                                size={12}
                                             />
                                          )}
                                       </button>
                                    )}
                                 </PopoverPanel>
                              </Float>
                           </>
                        )}
                     </Popover>
                  </LoggedIn>
               </div>
            </div>
            <Transition
               show={isReplyOpen}
               enter="transition ease-out duration-100"
               enterFrom="opacity-0 translate-y-1"
               enterTo="opacity-100 translate-y-0"
               leave="transition ease-in duration-50"
               leaveFrom="opacity-100 translate-y-0"
               leaveTo="opacity-0 translate-y-1"
            >
               <div className="pb-5 pl-8">
                  <CommentsEditor
                     isReply
                     commentParentId={comment.id}
                     //@ts-ignore
                     commentDepth={comment.depth}
                     parentId={parentId}
                     parentSlug={parentSlug}
                     isCustomSite={isCustomSite}
                     siteId={siteId}
                  />
               </div>
            </Transition>
            {comment?.replies && comment?.replies?.length > 0 && (
               <Transition
                  show={isCommentExpanded}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
               >
                  <div className="pl-7">
                     {comment?.replies?.map((comment, index) => (
                        <CommentRow
                           key={comment.id}
                           userId={userId}
                           comment={comment}
                           comments={comments}
                           topLevelIndex={topLevelIndex}
                           parentId={parentId}
                           parentSlug={parentSlug}
                           siteId={siteId}
                           isCustomSite={isCustomSite}
                           isNested
                        />
                     ))}
                  </div>
               </Transition>
            )}
         </div>
         {!isNested && (
            <div className="border-t border-color border-dashed w-full mt-3 mb-4 ml-3" />
         )}
      </>
   );
}

function CommentsEditor({
   commentParentId,
   commentDepth,
   isReply,
   parentId,
   parentSlug,
   siteId,
   isCustomSite = false,
}: {
   commentParentId?: string;
   commentDepth?: number;
   isReply?: boolean;
   parentId: string | number;
   parentSlug: string;
   siteId: string;
   isCustomSite?: boolean;
}) {
   const inlineEditor = useEditor();
   const fetcher = useFetcher({ key: "comments" });
   const creatingTopLevelComment = isAdding(fetcher, "createTopLevelComment");
   const creatingReply = isAdding(fetcher, "createCommentReply");
   const disabled = isProcessing(fetcher.state);

   function createComment() {
      return fetcher.submit(
         {
            comment: JSON.stringify(inlineEditor.children),
            intent: "createTopLevelComment",
            parentId: parentId,
            parentSlug: parentSlug,
            siteId: siteId,
            isCustomSite: isCustomSite ? "true" : "",
         },
         { method: "POST", action: "/comments" },
      );
   }
   function createCommentReply() {
      return fetcher.submit(
         //@ts-ignore
         {
            comment: JSON.stringify(inlineEditor.children),
            commentParentId,
            siteId: siteId,
            parentId: parentId,
            parentSlug: parentSlug,
            commentDepth: commentDepth ? commentDepth + 1 : 1,
            intent: "createCommentReply",
            isCustomSite: isCustomSite ? "true" : "",
         },
         { method: "POST", action: "/comments" },
      );
   }

   return (
      <div>
         <div className="relative bg-2-sub rounded-xl p-4 pb-1 pr-3 border dark:border-zinc-700 dark:focus-within:border-zinc-600 shadow-sm shadow-1">
            <Slate editor={inlineEditor} initialValue={initialValue()}>
               <Toolbar />
               <Editable
                  className="focus:outline-none"
                  placeholder="Start typing..."
                  renderElement={EditorBlocks}
                  renderLeaf={Leaf}
               />
            </Slate>
         </div>
         <div className="flex items-center justify-end -mt-3.5 z-10 relative pr-2.5">
            <button
               disabled={disabled}
               onClick={() =>
                  isReply ? createCommentReply() : createComment()
               }
               className={clsx(
                  disabled ? "dark:bg-zinc-400 " : "",
                  `rounded-full text-white bg-zinc-600 dark:bg-zinc-300 
                   dark:text-zinc-700 w-20 py-1.5 text-xs font-bold`,
               )}
            >
               {creatingTopLevelComment || creatingReply ? (
                  <DotLoader />
               ) : (
                  "Comment"
               )}
            </button>
         </div>
      </div>
   );
}
