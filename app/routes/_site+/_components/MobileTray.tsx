import { Drawer } from "vaul";

import type { Site } from "~/db/payload-types";

import { PinnedList, PrimaryMenuLinks } from "./Menu";

export const MobileTray = ({
   children,
   onOpenChange,
   open,
}: {
   children: any;
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
   open: boolean;
}) => {
   return (
      <Drawer.Root onOpenChange={onOpenChange} open={open}>
         <Drawer.Overlay className="fixed inset-0 z-40 min-h-[100vh] bg-black/40" />
         <Drawer.Portal>
            <Drawer.Content className="bg-2 fixed bottom-0 left-0 right-0 z-50 mx-auto mt-24 flex h-[80%] max-w-[728px] flex-col rounded-t-xl pb-5">
               <div className="relative flex-1 rounded-t-xl p-4">
                  <div className="mx-auto mb-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  {children}
               </div>
            </Drawer.Content>
         </Drawer.Portal>
      </Drawer.Root>
   );
};

export const MenuTrayContent = ({
   site,
   onOpenChange,
}: {
   site: Site;
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
   return (
      <menu className="flex flex-col h-full">
         <div className="flex-grow">
            <PrimaryMenuLinks site={site} onOpenChange={onOpenChange} />
            <PinnedList site={site} onOpenChange={onOpenChange} />
         </div>
      </menu>
   );
};
