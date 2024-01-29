import { useState } from "react";

import { Icon } from "~/components/Icon";
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
                  className="dark:bg-zinc-700 dark:border-zinc-600 dark:shadow-zinc-950/40 
                  bg-white flex size-9 items-center justify-center rounded-full border-2 shadow-sm 
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
         <main className="max-tablet:px-3 tablet:w-[728px] tablet:mx-auto py-4">
            {children}
         </main>
         <MobileTray onOpenChange={setUserMenuOpen} open={isUserMenuOpen}>
            <menu className="flex h-full flex-col">
               <UserMenuItems />
            </menu>
         </MobileTray>
      </>
   );
}
