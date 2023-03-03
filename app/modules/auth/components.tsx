import type { Collection, Site, User } from "payload-types";
import { useRouteLoaderData } from "@remix-run/react";
import { useIsStaffOrSiteAdminOrOwner } from ".";

export const LoggedIn = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   return user ? <>{children}</> : null;
};

//Render child components if the user is an admin or the site owner
export const AdminOrOwner = ({ children }: { children: React.ReactNode }) => {
   const hasAccess = useIsStaffOrSiteAdminOrOwner();

   return hasAccess ? <>{children}</> : null;
};

//Render child components if the user is following the site
export const FollowingSite = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   const { site } = useRouteLoaderData("routes/$siteId") as { site: Site };
   if (site && user?.sites?.some((e: any) => e.id === site?.id))
      return <>{children}</>;
   return null;
};

//Is custom site
export const CustomSite = ({ children }: { children: React.ReactNode }) => {
   const { site } = useRouteLoaderData("routes/$siteId") as { site: Site };
   const hasAccess = useIsStaffOrSiteAdminOrOwner();
   const isCustom = site.type === "custom";
   return hasAccess && isCustom ? <>{children}</> : null;
};

//Is custom collection
export const CustomCollection = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const { collection } = useRouteLoaderData(
      "routes/$siteId.collections+/$collectionId._route"
   ) as { collection: Collection };
   const hasAccess = useIsStaffOrSiteAdminOrOwner();
   const isCustom = collection.customTemplate === true;
   return hasAccess && isCustom ? <>{children}</> : null;
};

export const NotFollowingSite = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   const { site } = useRouteLoaderData("routes/$siteId") as { site: Site };
   if (!user) return null;
   if (user?.sites?.some((e: any) => e.id === site?.id)) return null;
   return <>{children}</>;
};

export const LoggedOut = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   return user ? null : <>{children}</>;
};
