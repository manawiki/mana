import { Form } from "@remix-run/react";

import { Icon } from "~/components/Icon";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/src/components";

export function PostListHeader() {
   return (
      <div className="relative flex items-center pb-5">
         <h1 className="font-header text-3xl font-bold pr-3">Posts</h1>
         <span className="dark:bg-zinc-700 bg-zinc-100 rounded-l-full flex-grow h-0.5" />
         <AdminOrStaffOrOwner>
            <Form method="post">
               <button
                  className="flex py-2.5 items-center text-xs font-bold gap-2 dark:border-zinc-600 dark:hover:border-zinc-500
                border border-zinc-200 rounded-full hover:border-zinc-300 bg-zinc-50 dark:bg-dark450 px-4 shadow-sm shadow-1"
                  name="intent"
                  value="createPost"
                  type="submit"
               >
                  <Icon name="pen-square" className="text-zinc-400" size={13} />
                  New Post
               </button>
            </Form>
         </AdminOrStaffOrOwner>
      </div>
   );
}
