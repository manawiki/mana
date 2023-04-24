import type { Collection, Site, User } from "payload-types";
import { useLocation, useRouteLoaderData } from "@remix-run/react";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from ".";

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
   const { site } = useRouteLoaderData("routes/$siteId") as { site: Site };
   if (site && user?.sites?.some((e: any) => e.id === site?.id))
      return <>{children}</>;
   return null;
};

//Is custom site
export const CustomSite = ({ children }: { children: React.ReactNode }) => {
   const { site } = useRouteLoaderData("routes/$siteId") as { site: Site };
   const isCustom = site.type === "custom";
   return isCustom ? <>{children}</> : null;
};

//Is custom collection
export const CustomCollection = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const collectionData = useRouteLoaderData(
      "routes/$siteId.collections+/$collectionId._route"
   ) as { collection: Collection };

   //Pull data for custom site
   const { pathname } = useLocation();
   const parts = pathname.split("/");
   const slug = parts[3];

   const customCollectionData = useRouteLoaderData(
      `_custom/routes/$siteId.collections+/${slug}.$entryId.c`
   ) as {
      entryDefault: { collectionEntity: Collection };
   };

   const collection = collectionData?.collection
      ? collectionData?.collection
      : customCollectionData?.entryDefault.collectionEntity;

   const isCustom = collection?.customEntryTemplate === true;

   return isCustom ? <>{children}</> : null;
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
