import { Fragment, useState } from "react";

import { Menu, Transition, Switch } from "@headlessui/react";
import { useFetcher } from "@remix-run/react";
import clsx from "clsx";

import { Drawer } from "vaul";

import { Modal } from "~/components/Modal";
import {
   LoggedIn,
   LoggedOut,
   LoggedOutMobile,
} from "~/routes/_auth+/src/components";
import { handleLogout } from "~/routes/_auth+/src/functions";
import { isAdding } from "~/utils";
import { Theme, useTheme } from "~/utils/theme-provider";
import { Icon } from "~/components/Icon";

export const UserMenu = () => {
   const [isMenuOpen, setMenuOpen] = useState(false);

   return (
      <>
         <LoggedIn>
            <section className="z-50 flex h-14 w-full items-center justify-end gap-2.5 max-laptop:hidden">
               <Menu as="div" className="relative">
                  <Menu.Button className="bg-3 shadow-1 border-color flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm">
                     <Icon name="user" size={20} />
                  </Menu.Button>
                  <Transition
                     as={Fragment}
                     enter="transition ease-out duration-100"
                     enterFrom="transform opacity-0 scale-95"
                     enterTo="transform opacity-100 scale-100"
                     leave="transition ease-in duration-75"
                     leaveFrom="transform opacity-100 scale-100"
                     leaveTo="transform opacity-0 scale-95"
                  >
                     <Menu.Items
                        className="absolute right-0 z-10 mt-1 w-full min-w-[220px]
             max-w-md origin-top-right transform text-sm transition-all"
                     >
                        <div className="border-color bg-3 shadow-1 rounded-lg border font-semibold shadow">
                           <div className="p-1">
                              <Menu.Item>
                                 <button
                                    className="text-1 flex w-full items-center gap-3 rounded-lg
                               p-2 hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                    onClick={() => setMenuOpen(true)}
                                 >
                                    <div className="flex-grow text-left">
                                       Settings
                                    </div>
                                    <Icon
                                       name="settings"
                                       size={18}
                                       className="text-zinc-500 dark:text-zinc-400"
                                    />
                                 </button>
                              </Menu.Item>
                              <Menu.Item>
                                 <ThemeToggleDesktop />
                              </Menu.Item>
                           </div>
                           <div className="border-color border-t p-1">
                              <Menu.Item>
                                 <button
                                    className="text-1 flex w-full items-center gap-3 rounded-lg
                               p-2 hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                    onClick={handleLogout}
                                 >
                                    <div className="flex-grow text-left">
                                       Logout
                                    </div>
                                    <Icon
                                       name="log-out"
                                       size={16}
                                       className="text-zinc-500 dark:text-zinc-400"
                                    />
                                 </button>
                              </Menu.Item>
                           </div>
                        </div>
                     </Menu.Items>
                  </Transition>
               </Menu>
            </section>
            <Modal
               onClose={() => {
                  setMenuOpen(false);
               }}
               show={isMenuOpen}
            >
               <section
                  className="bg-2 h-[80vh] max-h-[600px] min-h-full w-full transform overflow-hidden rounded-md
               text-left align-middle transition-all laptop:w-[1000px] laptop:max-w-[1000px]"
               >
                  <div className="flex h-full gap-5">
                     <div className="bg-3 h-full w-60 flex-none">
                        <ul className="p-4">
                           <li
                              className="dark:bg-dark400 flex items-center gap-2 rounded-lg 
                                 bg-zinc-200/40 px-3 py-3 text-sm font-bold"
                           >
                              <Icon
                                 name="settings"
                                 size={16}
                                 className="text-zinc-400"
                              />
                              Settings
                           </li>
                        </ul>
                     </div>
                     <UserDeleteSection />
                  </div>
               </section>
            </Modal>
         </LoggedIn>
      </>
   );
};

export const UserTrayContent = ({ onOpenChange }: { onOpenChange: any }) => {
   const fetcher = useFetcher();
   const deleting = isAdding(fetcher, "deleteUserAccount");

   return (
      <div className="h-full">
         <div className="flex h-full flex-col justify-between">
            <LoggedIn>
               <div className="space-y-3">
                  <Drawer.NestedRoot>
                     <Drawer.Trigger
                        className="shadow-1 bg-3 border-color relative flex w-full items-center
                  justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm"
                     >
                        <div className="font-bold">Settings</div>
                        <Settings size={18} className="text-zinc-400" />
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
                     className="shadow-1 bg-3 border-color relative flex w-full items-center
                  justify-between gap-3 rounded-xl border py-3 pl-4 pr-3 shadow-sm"
                  >
                     <ThemeToggleMobile />
                  </div>
               </div>
               <button
                  onClick={() => {
                     onOpenChange(false);
                     handleLogout();
                  }}
                  type="submit"
                  className="shadow-1 bg-3 border-color relative flex w-full items-center
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
         <div className="flex h-full flex-grow flex-col justify-end p-4 pb-8 pr-8">
            <div className="items-center justify-between gap-8 laptop:flex">
               <div className="max-laptop:pb-4">
                  <div className="pb-0.5 font-bold">Delete your account</div>
                  <div className="text-1 text-sm">
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
                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-red-200" />
                     ) : (
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
   const [theme, setTheme] = useTheme();

   const toggleTheme = () => {
      setTheme((prevTheme) =>
         prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
      );
      setEnabled(!enabled);
   };
   const [enabled, setEnabled] = useState(false);

   return (
      <Switch.Group>
         <div className="flex w-full items-center gap-3">
            <Switch.Label className="flex-grow font-bold">Theme</Switch.Label>
            <Switch
               checked={enabled}
               onChange={toggleTheme}
               className="relative inline-flex h-7 w-14 items-center rounded-full border 
               bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-700"
            >
               <span className="sr-only">Theme</span>
               <div
                  className={clsx(
                     theme == Theme.DARK
                        ? "translate-x-8 bg-white"
                        : "translate-x-1.5 bg-zinc-400",
                     "inline-flex h-4 w-4 transform items-center justify-center rounded-full transition",
                  )}
               />
               <div
                  className={clsx(
                     theme == Theme.DARK ? "left-2" : "right-1.5",
                     "absolute flex  items-center justify-center",
                  )}
               >
                  {theme == Theme.DARK ? (
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
   const [theme, setTheme] = useTheme();

   const toggleTheme = () => {
      setTheme((prevTheme) =>
         prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
      );
      setEnabled(!enabled);
   };
   const [enabled, setEnabled] = useState(false);

   return (
      <Switch.Group>
         <div
            className="text-1 w-ful flex items-center gap-3 rounded-lg
            p-2 hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
         >
            <Switch.Label className="flex-grow">Theme</Switch.Label>
            <Switch
               checked={enabled}
               onChange={toggleTheme}
               className="border-color bg-2 relative inline-flex h-5 w-[42px] items-center rounded-full border"
            >
               <span className="sr-only">Theme</span>
               <div
                  className={clsx(
                     theme == Theme.DARK
                        ? "translate-x-[24px] bg-white"
                        : "translate-x-1 bg-zinc-500",
                     "inline-flex h-3 w-3 transform items-center justify-center rounded-full transition",
                  )}
               />
               <div
                  className={clsx(
                     theme == Theme.DARK ? "left-1.5" : "right-1",
                     "absolute flex  items-center justify-center",
                  )}
               >
                  {theme == Theme.DARK ? (
                     <Icon
                        name="moon"
                        title="Dark Mode"
                        className="h-2.5 w-2.5 text-zinc-400"
                     />
                  ) : (
                     <Icon
                        name="sun"
                        title="Light Mode"
                        className="h-[13px] w-[13px] text-zinc-500"
                     />
                  )}
               </div>
            </Switch>
         </div>
      </Switch.Group>
   );
};
