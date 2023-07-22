import type { Site, User } from "payload/generated-types";
import { Form, useRouteLoaderData } from "@remix-run/react";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from ".";
import { Menu, Transition } from "@headlessui/react";
import { LogOut, User as UserLucideIcon } from "lucide-react";
import { Fragment } from "react";

export const LoggedIn = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   return user ? <>{children}</> : null;
};

//Render child components if the user is an admin or the site owner
export const AdminOrStaffOrOwner = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   return hasAccess ? <>{children}</> : null;
};

//Render child components if the user is following the site
export const FollowingSite = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   const { site } = useRouteLoaderData("routes/$siteId+/_layout") as {
      site: Site;
   };
   if (site && user?.sites?.some((e: any) => e.id === site?.id))
      return <>{children}</>;
   return null;
};

//Is custom site
export const CustomSite = ({ children }: { children: React.ReactNode }) => {
   const { site } = useRouteLoaderData("routes/$siteId+/_layout") as {
      site: Site;
   };
   const isCustom = site.type === "custom";
   return isCustom ? <>{children}</> : null;
};

export const NotFollowingSite = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   const { site } = useRouteLoaderData("routes/$siteId+/_layout") as {
      site: Site;
   };
   if (!user) return null;
   if (user?.sites?.some((e: any) => e.id === site?.id)) return null;
   return <>{children}</>;
};

export const LoggedOut = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   return user ? null : <>{children}</>;
};

export const LoggedOutDropDown = () => {
   return (
      <LoggedIn>
         <section className="z-50 flex h-14 items-center justify-end gap-2.5">
            <Menu as="div" className="relative">
               <Menu.Button
                  className="bg-3 shadow-1 border-color flex h-9 w-9 items-center
         justify-center rounded-full border shadow-sm"
               >
                  <UserLucideIcon size={20} />
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
                     className="absolute right-0 z-10 mt-1 w-full min-w-[200px]
            max-w-md origin-top-right transform transition-all"
                  >
                     <div className="border-color bg-3 shadow-1 rounded-lg border p-1 shadow">
                        <Menu.Item>
                           <Form action="/logout" method="post">
                              <button
                                 type="submit"
                                 className="text-1 flex w-full items-center gap-3 rounded-lg
                        p-2 pl-3 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                              >
                                 <div className="flex-grow text-left">
                                    Logout
                                 </div>
                                 <LogOut
                                    size={18}
                                    className="text-red-400 dark:text-red-300"
                                 />
                              </button>
                           </Form>
                        </Menu.Item>
                     </div>
                  </Menu.Items>
               </Transition>
            </Menu>
         </section>
      </LoggedIn>
   );
};
