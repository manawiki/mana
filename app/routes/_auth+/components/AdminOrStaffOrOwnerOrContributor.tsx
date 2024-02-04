import { useRouteLoaderData } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";

import type { RemixRequestContext } from "remix.env";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";

export const AdminOrStaffOrOwnerOrContributor = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const hasAccess = useIsStaffSiteAdminOwnerContributor();
   return hasAccess ? <>{children}</> : null;
};

export function useIsStaffSiteAdminOwnerContributor() {
   const { site } = useRouteLoaderData("routes/_site+/_layout") as {
      site: SerializeFrom<typeof siteLoaderType>["site"];
   };

   const { user } = useRouteLoaderData("root") as {
      user: RemixRequestContext["user"];
   };

   //always false if not logged in
   if (!user || !user?.id) return false;

   if (user?.roles?.includes("staff")) return true;

   // return true if user is site owner
   if (
      typeof site?.owner === "string"
         ? site?.owner === user.id
         : site?.owner?.id === user.id
   )
      return true;

   if (site?.admins?.some((e) => e.id === user.id)) return true;

   if (site?.contributors?.some((e) => e.id === user.id)) return true;

   // return false if none of the above
   return false;
}
