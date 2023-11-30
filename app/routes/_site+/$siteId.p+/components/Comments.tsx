import { Editable, Slate } from "slate-react";

import { Icon } from "~/components/Icon";
import { EditorBlocks } from "~/routes/_editor+/core/components/EditorBlocks";
import { Leaf } from "~/routes/_editor+/core/components/Leaf";
import { Toolbar } from "~/routes/_editor+/core/components/Toolbar";
import { useEditor } from "~/routes/_editor+/core/plugins";
import { initialValue } from "~/routes/_editor+/core/utils";

export function Comments({ value }: { value: any }) {
   return (
      <div className="py-6">
         <div className="border-t border-color bg-dark350/70">
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
               <div className="flex items-center gap-3">
                  <div className="rounded-full text-[11px] flex items-center justify-center h-7 px-4">
                     Latest
                  </div>
                  <div className="rounded-full text-[11px] flex items-center justify-center dark:bg-dark450 bg-zinc-100 h-7 px-4">
                     Top
                  </div>
               </div>
            </div>
         </div>
         <div className="pt-5 pb-40 border-t border-color">
            <div className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px]">
               <CommentsEditor value={value} />
               <CommentsList />
            </div>
         </div>
      </div>
   );
}

export function CommentsEditor({ value }: { value: any }) {
   const inlineEditor = useEditor();

   return (
      <div className="relative bg-2-sub rounded-xl mb-5 p-4 pb-1 pr-3 border dark:border-zinc-700 dark:focus-within:border-zinc-600">
         <Slate editor={inlineEditor} initialValue={value ?? initialValue()}>
            <Toolbar />
            <Editable
               className="focus:outline-none"
               placeholder="Start typing..."
               renderElement={EditorBlocks}
               renderLeaf={Leaf}
            />
         </Slate>
         <div className="absolute right-3.5 bottom-3.5 flex items-center justify-end">
            <button className="rounded-full dark:bg-zinc-300 dark:text-zinc-700 px-3.5 py-1.5 text-xs font-bold">
               Comment
            </button>
         </div>
      </div>
   );
}

export function CommentsList() {
   return (
      <>
         <div className="border-t border-color py-6">
            <div className="flex items-center gap-2">
               <div className="w-5 h-5 rounded-full dark:bg-zinc-500"></div>
               <div className="text-xs font-bold">Pogseal</div>
               <span className="w-1 h-1 bg-zinc-500 rounded-full" />
               <div className="text-xs">3h ago</div>
            </div>
            <div className="pt-2.5 text-1">
               Nisi nostra nunc quam lobortis morbi netus non sem himenaeos,
               varius natoque ornare tempor risus curabitur arcu dis. Nisi
               nostra nunc quam lobortis morbi netus non sem himenaeos, varius
               natoque ornare tempor risus curabitur arcu dis.
            </div>
            <div className="pt-3 flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className="dark:bg-dark450 border shadow-sm shadow-1 dark:border-zinc-600/60 w-6 h-6 rounded-full flex items-center justify-center">
                     <Icon name="triangle" size={10} />
                  </div>
                  <div className="text-xs font-bold">4</div>
               </div>
               <span className="w-1 h-1 dark:bg-zinc-600 rounded-full" />
               <div className="shadow-sm shadow-1 flex items-center gap-1.5 border border-color-sub py-0.5 rounded-full bg-3-sub pl-1.5 pr-3">
                  <div className="w-5 h-5 rounded text-1 flex items-center justify-center">
                     <Icon name="reply" size={16} />
                  </div>
                  <div className="text-[10px] font-bold">Reply</div>
               </div>
            </div>
         </div>
         <div className="border-t border-color py-6">
            <div className="flex items-center gap-2">
               <div className="w-5 h-5 rounded-full dark:bg-zinc-500"></div>
               <div className="text-xs font-bold">Pogseal</div>
               <span className="w-1 h-1 bg-zinc-500 rounded-full" />
               <div className="text-xs">3h ago</div>
            </div>
            <div className="pt-2.5 text-1">
               Nisi nostra nunc quam lobortis morbi netus non sem himenaeos,
               varius natoque ornare tempor risus curabitur arcu dis. Nisi
               nostra nunc quam lobortis morbi netus non sem himenaeos, varius
               natoque ornare tempor risus curabitur arcu dis.
            </div>
            <div className="pt-3 flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className="dark:bg-dark450 border shadow-sm shadow-1 dark:border-zinc-600/60 w-6 h-6 rounded-full flex items-center justify-center">
                     <Icon name="triangle" size={10} />
                  </div>
                  <div className="text-xs font-bold">4</div>
               </div>
               <span className="w-1 h-1 dark:bg-zinc-600 rounded-full" />
               <div className="shadow-sm shadow-1 flex items-center gap-1.5 border border-color-sub py-0.5 rounded-full bg-3-sub pl-1.5 pr-3">
                  <div className="w-5 h-5 rounded text-1 flex items-center justify-center">
                     <Icon name="reply" size={16} />
                  </div>
                  <div className="text-[10px] font-bold">Reply</div>
               </div>
            </div>
         </div>
         <div className="border-t border-color py-6">
            <div className="flex items-center gap-2">
               <div className="w-5 h-5 rounded-full dark:bg-zinc-500"></div>
               <div className="text-xs font-bold">Pogseal</div>
               <span className="w-1 h-1 bg-zinc-500 rounded-full" />
               <div className="text-xs">3h ago</div>
            </div>
            <div className="pt-2.5 text-1">
               Nisi nostra nunc quam lobortis morbi netus non sem himenaeos,
               varius natoque ornare tempor risus curabitur arcu dis. Nisi
               nostra nunc quam lobortis morbi netus non sem himenaeos, varius
               natoque ornare tempor risus curabitur arcu dis.
            </div>
            <div className="pt-3 flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className="dark:bg-dark450 border shadow-sm shadow-1 dark:border-zinc-600/60 w-6 h-6 rounded-full flex items-center justify-center">
                     <Icon name="triangle" size={10} />
                  </div>
                  <div className="text-xs font-bold">4</div>
               </div>
               <span className="w-1 h-1 dark:bg-zinc-600 rounded-full" />
               <div className="shadow-sm shadow-1 flex items-center gap-1.5 border border-color-sub py-0.5 rounded-full bg-3-sub pl-1.5 pr-3">
                  <div className="w-5 h-5 rounded text-1 flex items-center justify-center">
                     <Icon name="reply" size={16} />
                  </div>
                  <div className="text-[10px] font-bold">Reply</div>
               </div>
            </div>
         </div>
      </>
   );
}
