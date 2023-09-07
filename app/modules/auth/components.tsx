import {
   useRouteLoaderData,
   Link,
   useLocation,
   useMatches,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";

import type { Site, User } from "payload/generated-types";

import { useIsStaffOrSiteAdminOrStaffOrOwner } from "./functions";

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

   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const  { site } = useMatches()?.[1]?.data as {site: Site | null} ?? {site: null}; 
   if (site && user?.sites?.some((e: any) => e.id === site?.id))
      return <>{children}</>;
   return null;
};

//Is custom site
export const CustomSite = ({ children }: { children: React.ReactNode }) => {
   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const  { site } = useMatches()?.[1]?.data as {site: Site | null} ?? {site: null}; 
   const isCustom = site.type === "custom";
   return isCustom ? <>{children}</> : null;
};

export const NotFollowingSite = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const { user } = useRouteLoaderData("root") as { user: User };

   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const  { site } = useMatches()?.[1]?.data as {site: Site | null} ?? {site: null}; 
   if (!user) return null;
   if (user?.sites?.some((e: any) => e.id === site?.id)) return null;
   return <>{children}</>;
};

export const LoggedOut = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   return user ? null : <>{children}</>;
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
