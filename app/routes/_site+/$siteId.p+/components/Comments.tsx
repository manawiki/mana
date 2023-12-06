import { useState } from "react";

import { Transition } from "@headlessui/react";
import { useFetcher } from "@remix-run/react";
import clsx from "clsx";
import dt from "date-and-time";
import { Editable, Slate } from "slate-react";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import type { Comment } from "~/db/payload-types";
import { EditorBlocks } from "~/routes/_editor+/core/components/EditorBlocks";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { Leaf } from "~/routes/_editor+/core/components/Leaf";
import { Toolbar } from "~/routes/_editor+/core/components/Toolbar";
import { useEditor } from "~/routes/_editor+/core/plugins";
import { initialValue } from "~/routes/_editor+/core/utils";
import { isAdding } from "~/utils";

export function Comments({ comments }: { comments: Comment[] }) {
   console.log(comments);
   return (
      <div className="py-6">
         <div className="border-y overflow-hidden border-color bg-zinc-50 shadow dark:bg-dark350/70 relative">
            <div
               className="flex items-center justify-between gap-1.5 font-bold py-3
            mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px]"
            >
               <div className="flex items-center gap-2">
                  <Icon
                     name="message-circle"
                     className="text-zinc-400 dark:text-zinc-500"
                     size={20}
                  />
                  <div className="font-header text-lg">Comments</div>
               </div>
               {/* <div className="flex items-center gap-3">
                  <div className="rounded-full text-[11px] flex items-center justify-center h-7 px-4">
                     Latest
                  </div>
                  <div className="rounded-full text-[11px] flex items-center justify-center dark:bg-dark450 bg-zinc-100 h-7 px-4">
                     Top
                  </div>
               </div> */}
            </div>
            <div
               className="pattern-dots absolute left-0
                   top-0.5 -z-0 h-full
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                     pattern-size-2 dark:pattern-zinc-600 dark:pattern-bg-dark350"
            />
         </div>
         <div className="pt-5 pb-40 border-color">
            <div className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px]">
               <div className="pb-5">
                  <CommentsEditor />
               </div>
               {comments &&
                  comments.map((comment, index) => (
                     <CommentRow
                        key={comment.id}
                        comment={comment}
                        index={index}
                     />
                  ))}
            </div>
         </div>
      </div>
   );
}

function CommentRow({
   comment,
   isNested,
   index,
}: {
   comment: Comment;
   isNested?: Boolean;
   index?: number;
}) {
   const [isReplyOpen, setReplyOpen] = useState(false);
   const [isCommentExpanded, setCommentExpanded] = useState(true);

   return (
      <>
         <div
            className={clsx(
               isNested
                  ? `relative before:content-[''] before:absolute before:left-3 
         before:dark:bg-zinc-700 before:-z-0 before:h-full before:w-[1px] rounded-full`
                  : "mb-3",
            )}
         >
            <div className="flex items-center gap-2 relative">
               <div
                  className="dark:border-zinc-600 border dark:bg-zinc-700 justify-center shadow-sm shadow-1 
                        flex h-6 w-6 flex-none items-center overflow-hidden rounded-full"
               >
                  {comment.author?.avatar?.url ? (
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
                  className="text-sm font-bold underline 
               underline-offset-2 dark:decoration-zinc-600"
               >
                  {comment.author.username}
               </div>
               <span className="w-1 h-1 bg-zinc-500 rounded-full" />
               <div className="text-xs text-1">
                  {dt.format(new Date(comment.createdAt), "MMM D, hh:mm A")}
               </div>
            </div>
            <div
               className={clsx(
                  !isNested
                     ? `relative before:content-[''] before:absolute before:left-0 rounded-full
                     before:dark:bg-zinc-700 before:-z-0 before:h-full before:w-[1px]`
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
               <div className="pt-3 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                     <button
                        className="dark:bg-dark450 border shadow-sm dark:shadow-emerald-950/50
                        hover:dark:border-emerald-600/70
                      dark:border-emerald-700/50 w-5 h-5 rounded-md flex items-center justify-center"
                     >
                        <Icon
                           name="triangle"
                           className="text-emerald-500"
                           size={8}
                        />
                     </button>
                     <div className="text-xs font-bold">
                        {comment.upVotesStatic ?? 0}
                     </div>
                  </div>
                  <span className="w-1 h-1 dark:bg-zinc-600 rounded-full" />
                  <button
                     onClick={() => setReplyOpen(!isReplyOpen)}
                     className="shadow-sm dark:shadow-zinc-800 flex items-center gap-0.5 border dark:border-zinc-600/50 
                     dark:hover:border-zinc-500/50 rounded-full bg-3-sub pl-1 pr-2.5"
                  >
                     <div className="w-5 h-5 rounded text-1 flex items-center justify-center">
                        {isReplyOpen ? (
                           <Icon name="chevron-up" size={14} />
                        ) : (
                           <Icon name="reply" size={14} />
                        )}
                     </div>
                     <div className="text-[10px] font-bold">Reply</div>
                  </button>
               </div>
            </div>
            <Transition
               show={isReplyOpen}
               enter="transition ease-out duration-200"
               enterFrom="opacity-0 translate-y-1"
               enterTo="opacity-100 translate-y-0"
               leave="transition ease-in duration-150"
               leaveFrom="opacity-100 translate-y-0"
               leaveTo="opacity-0 translate-y-1"
            >
               <div className="pb-5 pl-8">
                  <CommentsEditor isReply commentParentId={comment.id} />
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
                     {comment?.replies.map((comment, index) => (
                        <CommentRow
                           key={comment.id}
                           comment={comment}
                           index={index}
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
   isReply,
}: {
   commentParentId?: string;
   isReply?: boolean;
}) {
   const inlineEditor = useEditor();
   const fetcher = useFetcher();
   const creating = isAdding(fetcher, "createComment");

   function createComment() {
      return fetcher.submit(
         {
            comment: JSON.stringify(inlineEditor.children),
            intent: "createComment",
         },
         { method: "post" },
      );
   }
   function createCommentReply() {
      return fetcher.submit(
         //@ts-ignore
         {
            comment: JSON.stringify(inlineEditor.children),
            commentParentId,
            intent: "createCommentReply",
         },
         { method: "post" },
      );
   }

   return (
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
         <div className="absolute right-3.5 bottom-3.5 flex items-center justify-end">
            <button
               onClick={() =>
                  isReply ? createCommentReply() : createComment()
               }
               className="rounded-full text-white bg-zinc-600 dark:bg-zinc-300 
             dark:text-zinc-700 w-20 py-1.5 text-xs font-bold"
            >
               {creating ? (
                  <Icon
                     name="loader-2"
                     className="mx-auto h-4 w-4 animate-spin"
                  />
               ) : (
                  "Comment"
               )}
            </button>
         </div>
      </div>
   );
}
