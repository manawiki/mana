import { useState } from "react";

import { Dialog } from "~/components/Dialog";
import { Icon } from "~/components/Icon";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";

export function EntryEdit() {
   let [isSettingsOpen, setSettingsOpen] = useState(false);

   return (
      <>
         <AdminOrStaffOrOwner>
            <button
               className="size-7 !p-0 bg-white shadow shadow-1 hover:bg-zinc-100 dark:hover:border-zinc-400/50 absolute -top-9 right-0
            border border-zinc-200 rounded-lg flex items-center justify-center dark:bg-dark450 dark:border-zinc-500/60 z-10"
               onClick={() => setSettingsOpen(true)}
            >
               <Icon name="settings" size={14} />
            </button>
            <Dialog
               size="2xl"
               onClose={() => {
                  setSettingsOpen(false);
               }}
               open={isSettingsOpen}
            >
               <div></div>
            </Dialog>
         </AdminOrStaffOrOwner>
      </>
   );
}
