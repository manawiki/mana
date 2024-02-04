import {
   useRootLoaderData,
   useSiteLoaderData,
} from "~/utils/useSiteLoaderData";

export const AdminOrStaffOrOwnerOrContributor = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const hasAccess = useIsStaffSiteAdminOwnerContributor();
   return hasAccess ? <>{children}</> : null;
};

function useIsStaffSiteAdminOwnerContributor() {
   const { site } = useSiteLoaderData();

   const { user } = useRootLoaderData();

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

   if (site?.admins?.some((e: any) => e.id === user.id)) return true;

   if (site?.contributors?.some((e: any) => e.id === user.id)) return true;

   // return false if none of the above
   return false;
}
