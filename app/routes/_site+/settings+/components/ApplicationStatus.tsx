import { Badge } from "~/components/Badge";
import type { SiteApplication } from "~/db/payload-types";

export function ApplicationStatus({
   status,
}: {
   status: SiteApplication["status"];
}) {
   let color = "" as any;
   let statusLabel = "" as any;
   switch (status) {
      case "under-review":
         color = "cyan";
         statusLabel = "Needs Review";
         break;
      case "approved":
         color = "green";
         statusLabel = "Approved";
         break;
      case "denied":
         color = "red";
         statusLabel = "Denied";
         break;
      default:
         color = "gray";
         break;
   }

   return <Badge color={color}>{statusLabel}</Badge>;
}
