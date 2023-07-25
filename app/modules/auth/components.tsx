import type { Site, User } from "payload/generated-types";
import {
   Form,
   useRouteLoaderData,
   Link,
   useLocation,
   NavLink,
} from "@remix-run/react";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from ".";
import { Menu, Transition } from "@headlessui/react";
import { LogOut, User as UserLucideIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Image } from "~/components";

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

export const LoggedOutMobile = () => {
   const location = useLocation();
   const { t } = useTranslation(["site", "auth"]);

   return (
      <LoggedOut>
         <div className="grid w-full grid-cols-2 gap-4">
            <Link
               to="/join"
               className="group relative inline-flex h-10 w-full items-center justify-center overflow-hidden 
        rounded-full p-4 px-5 font-medium text-indigo-600 transition duration-300 ease-out"
            >
               <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
               <span
                  className="ease absolute bottom-0 right-0 mb-32 mr-4 block h-64 w-64 origin-bottom-left translate-x-24 
        rotate-45 transform rounded-full bg-teal-500 opacity-30 transition duration-500 group-hover:rotate-90"
               ></span>
               <span className="relative text-sm font-bold text-white">
                  {t("login.signUp", { ns: "auth" })}
               </span>
            </Link>
            <Link
               className="flex h-10 w-full items-center justify-center rounded-full
        border border-zinc-200 bg-zinc-100 text-center text-sm font-bold
       dark:border-zinc-600 dark:bg-bg4Dark"
               to={`/login?redirectTo=${location.pathname}`}
            >
               {t("login.action", { ns: "auth" })}
            </Link>
         </div>
      </LoggedOut>
   );
};

export const FollowingListMobile = ({
   setMenuOpen,
}: {
   setMenuOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   const following = user?.sites as Site[];

   return (
      <>
         <LoggedIn>
            {following?.length === 0 ? null : (
               <div className="flex-grow space-y-3">
                  {following?.map((item) => (
                     <NavLink
                        reloadDocument={
                           // Reload if custom site, but NOT if current site is custom
                           item.type == "custom" && true
                        }
                        key={item.id}
                        onClick={() => setMenuOpen(false)}
                        className="shadow-1 bg-3 border-color relative flex w-full items-center justify-between gap-3 rounded-xl border pr-4 shadow-sm"
                        to={`/${item.slug}`}
                     >
                        {({ isActive }) => (
                           <>
                              <div className="flex w-full items-center gap-3 truncate p-2">
                                 <div className="h-7 w-7 flex-none ">
                                    <Image
                                       className="border-color overflow-hidden rounded-full border shadow-sm"
                                       width={32}
                                       height={32}
                                       alt="Site Logo"
                                       options="aspect_ratio=1:1&height=120&width=120"
                                       url={item.icon?.url}
                                    />
                                 </div>
                                 <div className="truncate text-sm font-bold">
                                    {item.name}
                                 </div>
                              </div>
                              {isActive && (
                                 <div className="h-2.5 w-2.5 flex-none rounded-full bg-blue-500" />
                              )}
                           </>
                        )}
                     </NavLink>
                  ))}
               </div>
            )}
         </LoggedIn>
      </>
   );
};
