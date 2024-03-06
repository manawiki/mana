import { useEffect, useMemo } from "react";

import clsx from "clsx";
import ReactDOM from "react-dom";
import { Drawer } from "vaul";

import type { Site } from "~/db/payload-types";
import { useWindowDimensions } from "~/utils/useWindowDimensions";

import { PinnedList, PrimaryMenuLinks } from "./Menu";

export const MobileTray = ({
   children,
   onOpenChange,
   open,
   direction,
   shouldScaleBackground,
   modal,
}: {
   children: any;
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
   open: boolean;
   direction?: "left" | "right";
   shouldScaleBackground?: boolean;
   modal?: boolean;
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
         modal={modal}
      >
         <Drawer.Portal>
            {open ? (
               <PortalIntoBody>
                  <div
                     className="fixed z-20 inset-0 bg-black/40 pointer-events-auto"
                     onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        if (event.currentTarget === event.target) {
                           onOpenChange(false);
                        }
                     }}
                  />
               </PortalIntoBody>
            ) : null}
            <Drawer.Content
               className={clsx(
                  getDirection == "bottom" &&
                     "fixed bottom-0 left-0 right-0 mx-auto mt-24 flex h-[80%] max-w-[728px] flex-col rounded-t-xl pb-5",
                  getDirection == "right" &&
                     "flex flex-col h-full w-[400px] mt-24 fixed bottom-0 right-0",
                  "bg-2 z-30 pointer-events-auto",
               )}
            >
               <div className="relative flex-1 rounded-t-xl overflow-auto flex flex-col">
                  {!isDesktop && (
                     <div className="w-full flex items-center justify-center sticky top-0 bg-2 z-50">
                        <div className="h-1.5 w-12 my-3 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                     </div>
                  )}
                  <div className="px-4">{children}</div>
               </div>
            </Drawer.Content>
         </Drawer.Portal>
      </Drawer.Root>
   );
};

const PortalIntoBody = ({ children }: { children: React.ReactNode }) => {
   const container = useMemo(() => document.createElement("div"), []);

   useEffect(() => {
      document.body.appendChild(container);

      return () => {
         document.body.removeChild(container);
      };
   });

   return ReactDOM.createPortal(children, container);
};

export function NestedTray({
   children,
   open,
   onOpenChange,
   direction,
}: {
   children: any;
   open: boolean;
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
   direction?: "left" | "right";
}) {
   const { width } = useWindowDimensions();

   const isDesktop = width && width > 768;

   const getDirection = isDesktop ? direction : "bottom";

   return (
      <Drawer.NestedRoot
         onOpenChange={onOpenChange}
         open={open}
         direction={getDirection}
      >
         <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-30 min-h-[100vh] bg-black/40" />
            <Drawer.Content
               className={clsx(
                  getDirection == "bottom" &&
                     "fixed bottom-0 left-0 right-0 mx-auto mt-24 flex h-full max-h-[70%] max-w-[728px] flex-col rounded-t-xl pb-5",
                  getDirection == "right" &&
                     "flex flex-col h-full w-[400px] mt-24 fixed bottom-0 right-0",
                  "bg-2 z-40",
               )}
            >
               <div className="relative flex-1 rounded-t-xl overflow-auto flex flex-col">
                  {!isDesktop && (
                     <div className="w-full flex items-center justify-center sticky top-0 bg-2 z-50">
                        <div className="h-1.5 w-12 my-3 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                     </div>
                  )}
                  <div className="px-4">{children}</div>
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
