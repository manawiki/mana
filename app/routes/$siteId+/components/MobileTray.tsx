import type { Site } from "~/db/payload-types";
import { FollowingListMobile, PinnedList, PrimaryMenuLinks } from "./Menu";
import { LoggedIn, LoggedOut, LoggedOutMobile } from "~/modules/auth";
import { Form, Link } from "@remix-run/react";
import { LogOut } from "lucide-react";
import { Drawer } from "vaul";

export const MobileTray = ({
   children,
   onOpenChange,
   open,
}: {
   children: any;
   onOpenChange: any;
   open: boolean;
}) => {
   return (
      <Drawer.Root onOpenChange={onOpenChange} open={open}>
         <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
         <Drawer.Portal>
            <Drawer.Content className="bg-2 fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-[80%] flex-col rounded-t-xl pb-5">
               <div className="bg-2 relative flex-1 rounded-t-xl p-4">
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
   onOpenChange: any;
}) => {
   return (
      <menu>
         <PrimaryMenuLinks site={site} onOpenChange={onOpenChange} />
         <PinnedList site={site} onOpenChange={onOpenChange} />
      </menu>
   );
};

export const UserTrayContent = ({ onOpenChange }: { onOpenChange: any }) => {
   return (
      <>
         <LoggedIn>
            <Form action="/logout" method="post">
               <button
                  onClick={() => onOpenChange(false)}
                  type="submit"
                  className="shadow-1 bg-3 border-color relative flex w-full items-center
                  justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm"
               >
                  <div className="font-bold">Logout</div>
                  <LogOut
                     size={18}
                     className="text-red-400 dark:text-red-300"
                  />
               </button>
            </Form>
         </LoggedIn>
      </>
   );
};

export const FollowingTrayContent = ({
   isMobileApp,
   setFollowerMenuOpen,
}: {
   isMobileApp: Boolean;
   setFollowerMenuOpen: any;
}) => {
   return (
      <>
         {isMobileApp && (
            <LoggedOut>
               <div className="flex w-full flex-col items-center justify-center px-4">
                  <Link
                     className="block w-full rounded-full bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-white"
                     to="/"
                  >
                     Explore Discoverable Sites
                  </Link>
                  <div className="flex w-full items-center gap-4 pb-6 pt-8">
                     <span className="h-0.5 flex-grow rounded-full bg-zinc-100 dark:bg-zinc-700/50" />
                     <span className="text-sm">or</span>
                     <span className="h-0.5 flex-grow rounded-full bg-zinc-100 dark:bg-zinc-700/50" />
                  </div>
                  <div className="pb-4 text-center text-sm font-semibold">
                     Login to view the sites you <b>follow</b>
                  </div>
                  <LoggedOutMobile />
               </div>
            </LoggedOut>
         )}
         <menu className="flex h-full flex-col">
            <FollowingListMobile setMenuOpen={setFollowerMenuOpen} />
            <LoggedIn>
               <Link
                  className="mx-6 my-9 rounded-full bg-emerald-500 px-5 py-3 text-center text-sm font-bold text-white"
                  to="/"
               >
                  Explore Discoverable Sites
               </Link>
            </LoggedIn>
         </menu>
      </>
   );
};
