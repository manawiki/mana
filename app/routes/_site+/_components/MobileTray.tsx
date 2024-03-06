import clsx from "clsx";
import { Drawer } from "vaul";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import type { Site } from "~/db/payload-types";
import { useWindowDimensions } from "~/utils/useWindowDimensions";

import { PinnedList, PrimaryMenuLinks } from "./Menu";

export const MobileTray = ({
   children,
   onOpenChange,
   open,
   direction,
   shouldScaleBackground,
   dismissible,
}: {
   children: any;
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
   open: boolean;
   direction?: "left" | "right";
   shouldScaleBackground?: boolean;
   dismissible?: boolean;
}) => {
   const { width } = useWindowDimensions();

   const isDesktop = width && width > 768;

   const getDirection = isDesktop ? direction : "bottom";

   return (
      <Drawer.Root
         shouldScaleBackground={shouldScaleBackground}
         direction={getDirection}
         onOpenChange={onOpenChange}
         open={open}
         dismissible={dismissible}
      >
         <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-20 min-h-[100vh] bg-black/40" />
            <Drawer.Content
               className={clsx(
                  getDirection == "bottom" &&
                     "fixed bottom-0 left-0 right-0 mx-auto mt-24 flex h-[80%] max-w-[728px] flex-col rounded-t-xl pb-5",
                  getDirection == "right" &&
                     "flex flex-col h-full w-[400px] mt-24 fixed bottom-0 right-0",
                  "bg-2 z-30",
               )}
            >
               <div className="relative flex-1 rounded-t-xl overflow-auto flex flex-col">
                  {!isDesktop && (
                     <div className="w-full flex items-center justify-center sticky top-0 bg-2 z-50">
                        <div className="h-1.5 w-12 my-3 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                     </div>
                  )}
                  <div className="p-4">{children}</div>
               </div>
            </Drawer.Content>
         </Drawer.Portal>
      </Drawer.Root>
   );
};

export function NestedTray({
   children,
   open,
   onOpenChange,
   direction,
   dismissible,
}: {
   children: any;
   open: boolean;
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
   direction?: "left" | "right";
   dismissible?: boolean;
}) {
   const { width } = useWindowDimensions();

   const isDesktop = width && width > 768;

   const getDirection = isDesktop ? direction : "bottom";

   return (
      <Drawer.NestedRoot
         onOpenChange={onOpenChange}
         open={open}
         direction={getDirection}
         dismissible={dismissible}
      >
         <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-40 min-h-[100vh] bg-black/40 pointer-events-auto" />
            <Drawer.Content
               className={clsx(
                  getDirection == "bottom" &&
                     "fixed bottom-0 left-0 right-0 mx-auto mt-24 flex h-full max-h-[70%] max-w-[728px] flex-col rounded-t-xl pb-5",
                  getDirection == "right" &&
                     "flex flex-col h-full w-[400px] mt-24 fixed bottom-0 right-0",
                  "bg-2 z-40 pointer-events-auto",
               )}
            >
               <div className="relative flex-1 rounded-t-xl overflow-auto flex flex-col p-4">
                  {!isDesktop && (
                     <div className="w-full flex items-center justify-center sticky top-0 bg-2 z-50">
                        <div className="h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                     </div>
                  )}
                  <Button
                     className="size-9 !p-0"
                     onClick={() => onOpenChange(false)}
                  >
                     <Icon name="arrow-left" size={16} />
                  </Button>
                  <div className="pt-4">{children}</div>
               </div>
            </Drawer.Content>
         </Drawer.Portal>
      </Drawer.NestedRoot>
   );
}

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
