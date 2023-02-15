import type { Site, User } from "~/payload-types";
import { useRouteLoaderData } from "@remix-run/react";
import { useIsAdminOrOwner } from ".";

export const LoggedIn = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   return user ? <>{children}</> : null;
};

//Render child components if the user is an admin or the site owner
export const AdminOrOwner = ({ children }: { children: React.ReactNode }) => {
   const hasAccess = useIsAdminOrOwner();

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
