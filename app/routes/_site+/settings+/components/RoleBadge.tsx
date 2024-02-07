import { Badge } from "~/components/Badge";

import type { TeamMember } from "../team";

export function RoleBadge({ role }: { role: TeamMember["role"] }) {
   let color = "" as any;
   switch (role) {
      case "Owner":
         color = "purple";
         break;
      case "Admin":
         color = "amber";
         break;
      case "Contributor":
         color = "blue";
         break;
      default:
         color = "gray";
         break;
   }

   return <Badge color={color}>{role}</Badge>;
}
