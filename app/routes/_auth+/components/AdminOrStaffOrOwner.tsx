import { useIsStaffOrSiteAdminOrStaffOrOwner } from "../utils/useIsStaffSiteAdminOwner";

export const AdminOrStaffOrOwner = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();
   return hasAccess ? <>{children}</> : null;
};
