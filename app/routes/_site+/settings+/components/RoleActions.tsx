import { useFetcher } from "@remix-run/react";

import type { RemixRequestContext } from "remix.env";
import {
   Dropdown,
   DropdownButton,
   DropdownItem,
   DropdownMenu,
} from "~/components/Dropdown";
import { Icon } from "~/components/Icon";
import { TableCell } from "~/components/Table";
import { isSiteAdmin } from "~/db/access/isSiteAdmin";
import { isSiteOwner } from "~/db/access/isSiteOwner";
import { isSiteStaff } from "~/db/access/isSiteStaff";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import type { TeamMember } from "../team";

export function RoleActions({
   member,
   currentUser,
}: {
   member: TeamMember;
   currentUser: RemixRequestContext["user"];
}) {
   const fetcher = useFetcher();

   const { site } = useSiteLoaderData();

   const isOwner = isSiteOwner(currentUser?.id, site?.owner?.id as string);

   const admins = site?.admins?.map((admin) => admin.id);
   const isAdmin = isSiteAdmin(currentUser?.id, admins as string[]);

   const isStaff = isSiteStaff(currentUser?.roles);

   switch (member.role) {
      case "Owner":
         return null;
      case "Admin":
         return (
            (isStaff || isOwner) && (
               <TableCell>
                  <Dropdown>
                     <DropdownButton plain aria-label="More options">
                        <Icon
                           name="more-horizontal"
                           size={16}
                           className="text-1"
                        />
                     </DropdownButton>
                     <DropdownMenu anchor="bottom end">
                        <DropdownItem
                           onClick={() =>
                              fetcher.submit(
                                 {
                                    siteId: site.id,
                                    userId: member.id,
                                    intent: "demoteToContributorFromAdmin",
                                 },
                                 {
                                    method: "POST",
                                 },
                              )
                           }
                        >
                           Demote to contributor
                        </DropdownItem>
                     </DropdownMenu>
                  </Dropdown>
               </TableCell>
            )
         );
      case "Contributor":
         return (
            (isStaff || isAdmin || isOwner) && (
               <TableCell>
                  <Dropdown>
                     <DropdownButton plain aria-label="More options">
                        <Icon
                           name="more-horizontal"
                           size={16}
                           className="text-1"
                        />
                     </DropdownButton>
                     <DropdownMenu anchor="bottom end">
                        {(isStaff || isOwner) && (
                           <DropdownItem
                              onClick={() =>
                                 fetcher.submit(
                                    {
                                       siteId: site.id,
                                       userId: member.id,
                                       intent: "promoteToAdmin",
                                    },
                                    {
                                       method: "POST",
                                    },
                                 )
                              }
                           >
                              Promote to admin
                           </DropdownItem>
                        )}
                        <DropdownItem
                           onClick={() =>
                              fetcher.submit(
                                 {
                                    siteId: site.id,
                                    userId: member.id,
                                    intent: "removeContributor",
                                 },
                                 {
                                    method: "POST",
                                 },
                              )
                           }
                        >
                           Remove contributor
                        </DropdownItem>
                     </DropdownMenu>
                  </Dropdown>
               </TableCell>
            )
         );
   }
}
