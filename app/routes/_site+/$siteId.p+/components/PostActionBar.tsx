import { Fragment } from "react";

import { Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import { Link } from "@remix-run/react";

import type { Post } from "payload/generated-types";
import { Icon } from "~/components/Icon";

export function PostActionBar({ post }: { post: Post }) {
   return (
      <div className="pb-3 mb-4 border-b border-color border-zinc-100 flex items-center justify-between">
         <Link
            to={`/${post.site.slug}/posts`}
            className="flex items-center hover:underline group gap-2"
         >
            <Icon name="arrow-left" size={16} />
            <div className="font-bold text-sm text-1">Posts</div>
         </Link>
         <div className="flex items-center">
            {post.totalComments && (
               <>
                  <Link
                     to="#comments"
                     className="flex hover:dark:bg-dark350 hover:bg-zinc-100 py-1 px-1.5 rounded-lg items-center gap-1.5 font-bold text-xs"
                  >
                     <Icon
                        name="message-circle"
                        className="text-zinc-400 dark:text-zinc-500"
                        size={15}
                     />
                     <div className="text-1">Comments</div>
                     <div
                        className="rounded-full text-[10px] flex items-center 
                              justify-center dark:bg-dark450 bg-zinc-100 w-5 h-5 ml-0.5"
                     >
                        {post.totalComments}
                     </div>
                  </Link>
                  <Icon
                     name="slash"
                     size={16}
                     className="text-zinc-200/70 text-lg -rotate-[30deg] dark:text-zinc-700"
                  />
               </>
            )}
            <div className="flex items-center gap-1.5 font-bold text-xs px-3">
               <Icon
                  name="folder"
                  className="text-zinc-400 dark:text-zinc-500"
                  size={15}
               />
               <div className="text-1">General</div>
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
                           offset={4}
                        >
                           <Popover.Button className="dark:bg-dark450 bg-zinc-100 ml-0.5 flex items-center justify-center rounded-full w-5 h-5">
                              {open ? (
                                 <Icon name="x" className="text-1" size={14} />
                              ) : (
                                 <Icon
                                    className="pt-[1px]"
                                    name="chevron-down"
                                    size={14}
                                 />
                              )}
                           </Popover.Button>
                           <Popover.Panel
                              className="border-color-sub justify-items-center text-1 bg-3-sub shadow-1 
                                       gap-1 z-30  rounded-lg border p-2 shadow-sm"
                           ></Popover.Panel>
                        </Float>
                     </>
                  )}
               </Popover>
            </div>
            <Icon
               name="slash"
               size={16}
               className="text-zinc-200/70 text-lg -rotate-[30deg] dark:text-zinc-700"
            />
            <button
               className="rounded-md text-[10px] flex items-center shadow-sm shadow-yellow-300 shadow-1 ml-3
                              justify-center dark:bg-dark450 bg-yellow-50/70 w-6 h-6"
            >
               <Icon className="text-yellow-400" name="bookmark" size={14} />
            </button>
         </div>
      </div>
   );
}
