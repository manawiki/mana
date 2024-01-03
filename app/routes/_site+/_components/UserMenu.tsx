import { Fragment, useState } from "react";

import { Switch, Tab } from "@headlessui/react";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import clsx from "clsx";
import { Drawer } from "vaul";

import { Icon } from "~/components/Icon";
import { Modal } from "~/components/Modal";
import { LoggedIn } from "~/routes/_auth+/components/LoggedIn";
import { LoggedOut } from "~/routes/_auth+/components/LoggedOut";
import { LoggedOutMobile } from "~/routes/_auth+/components/LoggedOutMobile";
import { handleLogout } from "~/routes/_auth+/utils/handleLogout.client";
import { isAdding } from "~/utils";
import { useTheme } from "~/utils/client-hints";

export function UserDesktopMenu() {
   const [isMenuOpen, setMenuOpen] = useState(false);
   const { sitePath } = useRouteLoaderData("root") as { sitePath: string };

   return (
      <>
         <LoggedIn>
            <section className="z-50 flex h-14 items-center justify-end gap-2.5 max-laptop:hidden">
               <button
                  onClick={() => setMenuOpen(true)}
                  className="border-4 border-zinc-300 dark:border-zinc-700 transition duration-300 
                  active:translate-y-0.5 dark:hover:border-zinc-600  
                  rounded-full flex items-center justify-center laptop:w-12 laptop:h-12 bg-3 shadow shadow-1 hover:border-zinc-400"
               >
                  <Icon name="user" size={22} />
               </button>
            </section>
            <Modal
               onClose={() => {
                  setMenuOpen(false);
               }}
               show={isMenuOpen}
            >
               <section
                  className="bg-2-sub h-[80vh] max-h-[600px] min-h-full w-full transform overflow-hidden rounded-xl
               text-left align-middle transition-all laptop:w-[1000px] laptop:max-w-[1000px]"
               >
                  <Tab.Group
                     vertical
                     as="div"
                     className="flex items-start h-full"
                  >
                     <div className="bg-3 flex flex-col h-full w-64 p-4">
                        <Tab.List className="flex-grow space-y-1">
                           <Tab as={Fragment}>
                              {({ selected }) => (
                                 <button
                                    className={clsx(
                                       selected
                                          ? "dark:bg-dark400 bg-zinc-100"
                                          : "",
                                       "px-3 py-2.5 text-sm text-left font-bold w-full rounded-lg",
                                    )}
                                 >
                                    Settings
                                 </button>
                              )}
                           </Tab>
                           <Tab as={Fragment}>
                              {({ selected }) => (
                                 <button
                                    className={clsx(
                                       selected
                                          ? "dark:bg-dark400 bg-zinc-100"
                                          : "",
                                       "px-3 py-2.5 text-sm text-left font-bold w-full rounded-lg",
                                    )}
                                 >
                                    Advanced
                                 </button>
                              )}
                           </Tab>
                        </Tab.List>
                        <button
                           onClick={() => {
                              handleLogout(sitePath);
                           }}
                           type="submit"
                           className="px-3 bg-zinc-50 group dark:bg-dark350 text-left py-2.5 text-sm font-bold w-full flex items-center rounded-lg"
                        >
                           <div className="font-bold flex-grow">Logout</div>
                           <Icon
                              name="log-out"
                              size={16}
                              className="text-zinc-400 dark:group-hover:text-zinc-300 group-hover:text-zinc-500"
                           />
                        </button>
                     </div>
                     <Tab.Panels className="w-full py-7 px-6">
                        <Tab.Panel>
                           <ThemeToggleDesktop />
                        </Tab.Panel>
                        <Tab.Panel>
                           <UserDeleteSection />
                        </Tab.Panel>
                     </Tab.Panels>
                  </Tab.Group>
               </section>
            </Modal>
         </LoggedIn>
      </>
   );
}

export const UserTrayContent = ({ onOpenChange }: { onOpenChange: any }) => {
   const fetcher = useFetcher();
   const deleting = isAdding(fetcher, "deleteUserAccount");
   const { sitePath } = useRouteLoaderData("root") as { sitePath: string };

   return (
      <div className="h-full">
         <div className="flex h-full flex-col justify-between">
            <LoggedIn>
               <div className="space-y-3">
                  <Drawer.NestedRoot>
                     <Drawer.Trigger
                        className="shadow-1 bg-2-sub border-color relative flex w-full items-center
                  justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm"
                     >
                        <div className="font-bold">Settings</div>
                     </Drawer.Trigger>
                     <Drawer.Portal>
                        <Drawer.Overlay className="fixed inset-0 z-40 min-h-[100vh] bg-black/40" />
                        <Drawer.Content className="bg-2 fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-[80%] flex-col rounded-t-xl pb-5">
                           <div className="bg-2 relative flex-1 rounded-t-xl p-4">
                              <div className="mx-auto mb-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                              <Drawer.NestedRoot>
                                 <div className="px-2">
                                    <div className="pb-4">
                                       <div className="pb-0.5 font-bold">
                                          Delete your account
                                       </div>
                                       <div className="text-1 text-sm">
                                          Permanently delete your account
                                          information
                                       </div>
                                    </div>
                                    <Drawer.Trigger
                                       className="h-10 rounded-md border border-red-400 px-4 text-sm font-bold 
                                 text-red-500 hover:bg-red-50 dark:border-red-500 dark:hover:bg-zinc-800"
                                    >
                                       Delete Account
                                    </Drawer.Trigger>
                                 </div>
                                 <Drawer.Portal>
                                    <Drawer.Overlay className="fixed inset-0 z-40 min-h-[100vh] bg-black/40" />
                                    <Drawer.Content className="bg-2 fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-[80%] flex-col rounded-t-xl pb-5">
                                       <div className="bg-2 relative flex-1 rounded-t-xl p-4">
                                          <div className="mx-auto mb-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                                          <section className="p-10">
                                             <div className="pb-6">
                                                <div className="pb-2 text-center font-bold">
                                                   This will permanently delete
                                                   your account
                                                </div>
                                                <div className="text-1 text-center">
                                                   You cannot undo this action.
                                                </div>
                                             </div>
                                             <div className="grid grid-cols-2 gap-4">
                                                <Drawer.Close
                                                   className="h-10 rounded-md bg-zinc-200 text-sm 
                                          font-bold focus:bg-zinc-100 dark:bg-zinc-700 dark:focus:bg-zinc-600"
                                                >
                                                   Cancel
                                                </Drawer.Close>
                                                <button
                                                   onClick={() =>
                                                      fetcher.submit(
                                                         {
                                                            intent:
                                                               "deleteUserAccount",
                                                         },
                                                         {
                                                            method: "delete",
                                                            action:
                                                               "/auth-actions",
                                                         },
                                                      )
                                                   }
                                                   className="h-10 w-full rounded-md bg-red-500 text-sm font-bold text-white
                                     focus:bg-red-400 dark:bg-red-600 dark:focus:bg-red-500"
                                                >
                                                   {deleting ? (
                                                      <Icon
                                                         name="loader-2"
                                                         className="mx-auto h-5 w-5 animate-spin text-red-200"
                                                      />
                                                   ) : (
                                                      "Delete"
                                                   )}
                                                </button>
                                             </div>
                                          </section>
                                       </div>
                                    </Drawer.Content>
                                 </Drawer.Portal>
                              </Drawer.NestedRoot>
                           </div>
                        </Drawer.Content>
                     </Drawer.Portal>
                  </Drawer.NestedRoot>
                  <div
                     className="shadow-1 bg-2-sub border-color relative flex w-full items-center
                  justify-between gap-3 rounded-xl border py-3 pl-4 pr-3 shadow-sm"
                  >
                     <ThemeToggleMobile />
                  </div>
               </div>
               <button
                  onClick={() => {
                     onOpenChange(false);
                     handleLogout(sitePath);
                  }}
                  type="submit"
                  className="shadow-1 bg-2-sub border-color relative flex w-full items-center
                  justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm"
               >
                  <div className="font-bold">Logout</div>
                  <Icon name="log-out" size={18} className="text-zinc-400" />
               </button>
            </LoggedIn>
         </div>
         <LoggedOut>
            <div className="flex w-full flex-col items-center justify-center px-4">
               <LoggedOutMobile />
            </div>
         </LoggedOut>
      </div>
   );
};

const UserDeleteSection = () => {
   const fetcher = useFetcher();
   const deleting = isAdding(fetcher, "deleteUserAccount");
   const [isDeleteOpen, setDeleteOpen] = useState(false);

   return (
      <div className="relative z-50 w-full">
         <div className="flex h-full flex-grow flex-col border-b pb-4 self-end border-color justify-end">
            <div className="items-center justify-between gap-8 laptop:flex">
               <div className="max-laptop:pb-4">
                  <div className="pb-0.5 font-bold">Delete your account</div>
                  <div className="text-1 text-xs">
                     Permanently delete your account information
                  </div>
               </div>
               <button
                  className="h-10 rounded-md border border-red-400 px-4 text-sm font-bold 
               text-red-500 hover:bg-red-50 dark:border-red-500 dark:hover:bg-zinc-800"
                  onClick={() => setDeleteOpen(true)}
               >
                  Delete Account
               </button>
            </div>
         </div>
         <Modal
            onClose={() => {
               setDeleteOpen(false);
            }}
            show={isDeleteOpen}
         >
            <div
               className="bg-2 mx-5 max-w-md transform rounded-2xl
      p-8 text-left align-middle shadow-xl transition-all"
            >
               <div className="pb-6">
                  <div className="pb-2 text-center text-lg font-bold">
                     This will permanently delete your account
                  </div>
                  <div className="text-1 text-center">
                     You cannot undo this action.
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <button
                     className="h-10 rounded-md bg-zinc-200 text-sm 
            font-bold focus:bg-zinc-100 dark:bg-zinc-700 dark:focus:bg-zinc-600"
                     onClick={() => setDeleteOpen(false)}
                  >
                     Cancel
                  </button>
                  <button
                     onClick={() =>
                        fetcher.submit(
                           { intent: "deleteUserAccount" },
                           {
                              method: "delete",
                              action: "/auth-actions",
                           },
                        )
                     }
                     className="h-10 w-full rounded-md bg-red-500 text-sm font-bold text-white
                                     focus:bg-red-400 dark:bg-red-600 dark:focus:bg-red-500"
                  >
                     {deleting ? (
                        <></>
                     ) : (
                        // <Loader2 className="mx-auto h-5 w-5 animate-spin text-red-200" />
                        "Delete"
                     )}
                  </button>
               </div>
            </div>
         </Modal>
      </div>
   );
};

export const ThemeToggleMobile = () => {
   const theme = useTheme();
   const fetcher = useFetcher();

   return (
      <Switch.Group>
         <div className="flex w-full items-center gap-3">
            <Switch.Label className="flex-grow font-bold">Theme</Switch.Label>
            <Switch
               checked={Boolean(theme === "dark")}
               onChange={() =>
                  fetcher.submit(
                     { theme: theme === "light" ? "dark" : "light" },
                     { method: "POST", action: "/action/theme-toggle" },
                  )
               }
               className="relative inline-flex h-7 w-14 items-center rounded-full border
               bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-700"
            >
               <span className="sr-only">Theme</span>
               <div
                  className={clsx(
                     theme == "dark"
                        ? "translate-x-8 bg-white"
                        : "translate-x-1.5 bg-zinc-400",
                     "inline-flex h-4 w-4 transform items-center justify-center rounded-full transition",
                  )}
               />
               <div
                  className={clsx(
                     theme == "dark" ? "left-2" : "right-1.5",
                     "absolute flex  items-center justify-center",
                  )}
               >
                  {theme == "dark" ? (
                     <Icon
                        name="moon"
                        title="Dark Mode"
                        className="h-3 w-3 text-zinc-400"
                     />
                  ) : (
                     <Icon
                        name="sun"
                        title="Light Mode"
                        className="h-4 w-4 text-zinc-500"
                     />
                  )}
               </div>
            </Switch>
         </div>
      </Switch.Group>
   );
};

const ThemeToggleDesktop = () => {
   const theme = useTheme();
   const fetcher = useFetcher();

   return (
      <Switch.Group>
         <div className="border-b pb-4 border-color flex items-center">
            <div className="flex-grow">
               <Switch.Label className="font-bold pb-0.5 block">
                  Theme
               </Switch.Label>
               <div className="text-1 text-xs">Change the site theme</div>
            </div>
            <Switch
               className="border-zinc-200 bg-white dark:border-zinc-500/60 dark:bg-dark500 relative
               shadow-sm shadow-1 inline-flex h-7 w-[51px] items-center rounded-full border"
               checked={Boolean(theme === "dark")}
               onChange={() =>
                  fetcher.submit(
                     { theme: theme === "light" ? "dark" : "light" },
                     { method: "POST", action: "/action/theme-toggle" },
                  )
               }
            >
               <span className="sr-only">Theme</span>
               <div
                  className={clsx(
                     theme == "dark"
                        ? "translate-x-7 bg-white"
                        : "translate-x-1.5 bg-zinc-500",
                     "inline-flex h-4 w-4 transform items-center justify-center rounded-full transition",
                  )}
               />
               <div
                  className={clsx(
                     theme == "dark" ? "left-1.5" : "right-1.5",
                     "absolute flex  items-center justify-center",
                  )}
               >
                  {theme == "dark" ? (
                     <Icon
                        name="moon"
                        title="Dark Mode"
                        className="h-3.5 w-3.5 text-zinc-400"
                     />
                  ) : (
                     <Icon
                        name="sun"
                        title="Light Mode"
                        className="h-3.5 w-3.5 text-zinc-500"
                     />
                  )}
               </div>
            </Switch>
         </div>
      </Switch.Group>
   );
};
