import type { Collection, Site, User } from "payload-types";
import { useLocation, useMatches, useRouteLoaderData } from "@remix-run/react";
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
   const coreCollectionData = useRouteLoaderData(
      "routes/$siteId.collections+/$collectionId._route"
   ) as { collection: Collection };

   //On the /w page, we have access to coreCollectionData so we check the collection object to see if customEntryTemplate is set to true
   const isCustomOnWikiPage =
      coreCollectionData?.collection?.customEntryTemplate;

   //On the /c page, coreCollectionData is null, so we know it's a custom collection
   const isCustom =
      isCustomOnWikiPage ?? coreCollectionData == undefined ? true : false;

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
