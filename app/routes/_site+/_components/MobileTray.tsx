import clsx from "clsx";
import { Drawer } from "vaul";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import type { Site } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { NotAdminOrStaffOrOwner } from "~/routes/_auth+/components/NotAdminOrStaffOrOwner";
import { useWindowDimensions } from "~/utils/useWindowDimensions";

import { PrimaryMenu } from "./PrimaryMenu";
import { SideMenu } from "./sidemenu/SideMenu";
import { ViewSideMenu } from "./sidemenu/ViewSideMenu";

export const MobileTray = ({
   children,
   onOpenChange,
   open,
   direction,
   shouldScaleBackground,
   dismissible,
}: {
   children: any;
   onOpenChange: (open: boolean) => void;
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
            <Drawer.Overlay className="fixed inset-0 z-50 min-h-[100vh] bg-black/40" />
            <Drawer.Content
               className={clsx(
                  getDirection == "bottom" &&
                     "fixed bottom-0 left-0 right-0 mx-auto mt-24 flex h-[95%] max-w-[728px] flex-col rounded-t-xl",
                  getDirection == "right" || getDirection == "left"
                     ? "flex flex-col h-full w-[400px] mt-24 fixed bottom-0"
                     : "",
                  getDirection == "right" && "right-0",
                  getDirection == "left" && "left-0",
                  "z-[999999]",
               )}
            >
               <div
                  className={clsx(
                     getDirection == "right" || getDirection == "left"
                        ? "m-3 rounded-lg"
                        : "",
                     getDirection == "bottom" && "rounded-t-xl",
                     "relative flex-1 overflow-auto flex flex-col max-tablet:pt-0 p-3 bg-3 scrollbar dark:scrollbar-thumb-zinc-500 dark:scrollbar-track-dark450 scrollbar-thumb-zinc-300 scrollbar-track-zinc-100",
                  )}
               >
                  {!isDesktop && (
                     <div className="w-full flex items-center justify-center sticky top-0 bg-3 z-50 py-3">
                        <div className="h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                     </div>
                  )}
                  {isDesktop && getDirection == "left" && (
                     <div className="flex items-center justify-start pb-2">
                        <Button
                           plain
                           className="!size-8 !rounded-full !p-0 flex-none"
                           onClick={() => onOpenChange(false)}
                        >
                           <Icon
                              name="arrow-left"
                              className="text-1"
                              size={16}
                           />
                        </Button>
                     </div>
                  )}
                  {isDesktop && getDirection == "right" && (
                     <div className="flex items-center justify-end pb-2">
                        <Button
                           plain
                           className="!size-8 !rounded-full !p-0 flex-none"
                           onClick={() => onOpenChange(false)}
                        >
                           <Icon
                              name="arrow-right"
                              className="text-1"
                              size={16}
                           />
                        </Button>
                     </div>
                  )}
                  <div>{children}</div>
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
            <Drawer.Overlay className="fixed inset-0 z-50 min-h-[100vh] bg-black/40" />
            <Drawer.Content
               className={clsx(
                  getDirection == "bottom" &&
                     "fixed bottom-0 left-0 right-0 mx-auto mt-24 flex h-[95%] max-w-[728px] flex-col rounded-t-xl",
                  getDirection == "right" || getDirection == "left"
                     ? "flex flex-col h-full w-[400px] mt-24 fixed bottom-0"
                     : "",
                  getDirection == "right" && "right-0",
                  getDirection == "left" && "left-0",
                  "z-[999999]",
               )}
            >
               <div
                  className={clsx(
                     getDirection == "right" || getDirection == "left"
                        ? "m-3 rounded-lg"
                        : "",
                     getDirection == "bottom" && "rounded-t-xl",
                     "relative flex-1 overflow-auto flex flex-col max-tablet:pt-0 p-3 bg-3 scrollbar dark:scrollbar-thumb-zinc-500 dark:scrollbar-track-dark450 scrollbar-thumb-zinc-300 scrollbar-track-zinc-100",
                  )}
               >
                  {!isDesktop && (
                     <div className="w-full flex items-center justify-center sticky top-0 bg-3 z-50 py-3">
                        <div className="h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                     </div>
                  )}
                  {isDesktop && getDirection == "left" && (
                     <div className="flex items-center justify-start pb-2">
                        <Button
                           plain
                           className="!size-8 !rounded-full !p-0 flex-none"
                           onClick={() => onOpenChange(false)}
                        >
                           <Icon
                              name="arrow-left"
                              className="text-1"
                              size={16}
                           />
                        </Button>
                     </div>
                  )}
                  {isDesktop && getDirection == "right" && (
                     <div className="flex items-center justify-end pb-2">
                        <Button
                           plain
                           className="!size-8 !rounded-full !p-0 flex-none"
                           onClick={() => onOpenChange(false)}
                        >
                           <Icon
                              name="arrow-right"
                              className="text-1"
                              size={16}
                           />
                        </Button>
                     </div>
                  )}
                  <div>{children}</div>
               </div>
            </Drawer.Content>
         </Drawer.Portal>
      </Drawer.NestedRoot>
   );
}

export function MenuTrayContent({
   site,
   onOpenChange,
}: {
   site: Site;
   onOpenChange: (open: boolean) => void;
}) {
   return (
      <menu className="flex flex-col h-full">
         <div className="flex-grow">
            <PrimaryMenu />
            <div className="-mx-2 pb-12">
               <div className="border-dotted border-t-2 mt-4 border-zinc-200/80 dark:border-zinc-700 mx-4" />
               <AdminOrStaffOrOwner>
                  <SideMenu site={site} />
               </AdminOrStaffOrOwner>
               <NotAdminOrStaffOrOwner>
                  <ViewSideMenu site={site} />
               </NotAdminOrStaffOrOwner>
            </div>
         </div>
      </menu>
   );
}
