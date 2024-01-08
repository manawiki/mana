import type { Dispatch, SetStateAction } from "react";
import { Fragment, useState } from "react";

import { Switch, Tab } from "@headlessui/react";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import {
   EmbeddedCheckoutProvider,
   EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import clsx from "clsx";

import { Dialog } from "~/components/Dialog";
import { Icon } from "~/components/Icon";
import { Modal } from "~/components/Modal";
import { LoggedIn } from "~/routes/_auth+/components/LoggedIn";
import { handleLogout } from "~/routes/_auth+/utils/handleLogout.client";
import { useTheme } from "~/utils/client-hints";
import { isAdding } from "~/utils/form";

const stripePromise = loadStripe(
   "pk_test_51NIHqPHY2vBdJM8edEvVJJsZYBTB61TXs3R5oFPhD0kPNLXmCBCCGgOicF3S7EGVkp7YGTeKmVD2g5LsV7iC3pIj00UJr87Pmn",
);

export function UserMenu({
   isUserMenuOpen,
   setUserMenuOpen,
}: {
   isUserMenuOpen: boolean;
   setUserMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
   const { sitePath } = useRouteLoaderData("root") as { sitePath: string };
   const fetcher = useFetcher();

   //@ts-ignore
   const clientSecret = fetcher.data?.clientSecret;
   const options = { clientSecret };

   return (
      <>
         <LoggedIn>
            <section className="z-50 flex h-14 items-center justify-end gap-2.5 max-laptop:hidden">
               <button
                  onClick={() => setUserMenuOpen(true)}
                  className="border-4 border-zinc-300 dark:border-zinc-700 transition duration-300 
                  active:translate-y-0.5 dark:hover:border-zinc-600  
                  rounded-full flex items-center justify-center laptop:w-12 laptop:h-12 bg-3 shadow shadow-1 hover:border-zinc-400"
               >
                  <Icon name="user" size={22} />
               </button>
            </section>
            <Dialog
               className="min-h-400px"
               size="5xl"
               onClose={setUserMenuOpen}
               open={isUserMenuOpen}
            >
               <Tab.Group
                  vertical
                  as="div"
                  className="laptop:flex laptop:items-start gap-6"
               >
                  <div className="flex laptop:flex-col laptop:w-64 max-laptop:pb-8">
                     <Tab.List className="max-laptop:flex flex-grow space-y-1">
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
                                 Billing
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
                  </div>
                  <Tab.Panels className="w-full overflow-auto">
                     <Tab.Panel>
                        <ThemeToggleDesktop />
                        <button
                           onClick={() => {
                              handleLogout(sitePath);
                           }}
                           type="submit"
                           className="px-3 bg-zinc-50 group dark:bg-dark350 text-left py-2.5 text-sm font-bold mt-4 gap-4 flex items-center rounded-lg"
                        >
                           <div className="font-bold flex-grow">Logout</div>
                           <Icon
                              name="log-out"
                              size={16}
                              className="text-zinc-400 dark:group-hover:text-zinc-300 group-hover:text-zinc-500"
                           />
                        </button>
                     </Tab.Panel>
                     <Tab.Panel>
                        <div id="checkout">
                           <button
                              onClick={() =>
                                 fetcher.submit(
                                    { intent: "setupUserPayments" },
                                    {
                                       method: "post",
                                       action: "/auth-actions",
                                    },
                                 )
                              }
                              className="h-10 w-full rounded-md bg-red-500 text-sm font-bold text-white
                                     focus:bg-red-400 dark:bg-red-600 dark:focus:bg-red-500"
                           >
                              Setup
                           </button>
                           {clientSecret && (
                              <>
                                 <EmbeddedCheckoutProvider
                                    stripe={stripePromise}
                                    options={options}
                                 >
                                    <EmbeddedCheckout />
                                 </EmbeddedCheckoutProvider>
                              </>
                           )}
                        </div>
                     </Tab.Panel>
                     <Tab.Panel>
                        <UserDeleteSection />
                     </Tab.Panel>
                  </Tab.Panels>
               </Tab.Group>
            </Dialog>
         </LoggedIn>
      </>
   );
}

function UserDeleteSection() {
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
}

function ThemeToggleDesktop() {
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
}
