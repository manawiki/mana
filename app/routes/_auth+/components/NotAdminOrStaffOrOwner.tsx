import { useIsStaffOrSiteAdminOrStaffOrOwner } from "../utils/useIsStaffSiteAdminOwner";

export const NotAdminOrStaffOrOwner = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   return !hasAccess ? <>{children}</> : null;
};
