import { useState } from "react";

import { Icon } from "~/components/Icon";
import { handleLogout } from "~/routes/_auth+/utils/handleLogout.client";
import { MobileTray } from "~/routes/_site+/_components/MobileTray";

import { UserMenuItems } from "./UserMenuItems";

export function UserContainer({
   title,
   children,
}: {
   title: string;
   children: React.ReactNode;
}) {
   const [isUserMenuOpen, setUserMenuOpen] = useState(false);

   return (
      <>
         <div
            className="border-b border-color-sub w-full py-2.5 relative flex items-center
            bg-zinc-50 dark:bg-dark400 shadow-sm shadow-zinc-100 dark:shadow-zinc-800/50"
         >
            <div className="max-tablet:px-3 w-full tablet:w-[728px] mx-auto text-lg flex items-center justify-between z-10 relative">
               <div className="text-xl font-header">{title}</div>
               <button
                  className="dark:bg-zinc-700 dark:border-zinc-600 dark:shadow-zinc-800/50 
                  bg-white flex size-9 items-center justify-center rounded-xl border-2 shadow-sm 
                  transition duration-300 active:translate-y-0.5 laptop:hidden"
                  onClick={() => setUserMenuOpen(true)}
               >
                  <Icon name="menu" size={16} />
               </button>
            </div>
            <div
               className="pattern-dots absolute inset-0 z-0 h-full
          w-full pattern-bg-white pattern-zinc-500 pattern-opacity-10 
          pattern-size-1 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
            />
         </div>
         <main className="max-tablet:px-3 tablet:w-[728px] tablet:mx-auto py-5">
            {children}
         </main>
         <MobileTray onOpenChange={setUserMenuOpen} open={isUserMenuOpen}>
            <menu className="flex min-h-[calc(100vh-7rem)] gap-8 flex-col justify-between">
               <UserMenuItems />
               <button
                  onClick={() => {
                     handleLogout();
                  }}
                  type="submit"
                  className="bg-zinc-100 group px-4 py-2.5
               dark:bg-dark400 text-left text-sm font-bold gap-4 flex items-center rounded-lg"
               >
                  <div className="font-bold flex-grow">Logout</div>
                  <Icon
                     name="log-out"
                     size={16}
                     className="text-zinc-400 dark:group-hover:text-zinc-300 group-hover:text-zinc-500"
                  />
               </button>
            </menu>
         </MobileTray>
      </>
   );
}
