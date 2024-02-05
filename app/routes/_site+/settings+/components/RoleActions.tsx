import { useFetcher } from "@remix-run/react";

import type { RemixRequestContext } from "remix.env";
import {
   Dropdown,
   DropdownButton,
   DropdownItem,
   DropdownMenu,
} from "~/components/Dropdown";
import { Icon } from "~/components/Icon";

import type { TeamMember } from "../team";

export function RoleActions({
   member,
   currentUser,
}: {
   member: TeamMember;
   currentUser: RemixRequestContext["user"];
}) {
   const fetcher = useFetcher();

   switch (member.role) {
      case "Owner":
         return null;
      case "Admin":
         return (
            <Dropdown>
               <DropdownButton plain aria-label="More options">
                  <Icon name="more-horizontal" size={16} className="text-1" />
               </DropdownButton>
               <DropdownMenu anchor="bottom end">
                  <DropdownItem
                     onClick={() =>
                        fetcher.submit(
                           {
                              userId: member.id,
                              intent: "demoteToContributor",
                           },
                           {
                              method: "POST",
                           },
                        )
                     }
                  >
                     Demote to Contributor
                  </DropdownItem>
               </DropdownMenu>
            </Dropdown>
         );
      case "Contributor":
         return (
            <Dropdown>
               <DropdownButton plain aria-label="More options">
                  <Icon name="more-horizontal" size={16} className="text-1" />
               </DropdownButton>
               <DropdownMenu anchor="bottom end">
                  <DropdownItem>Promote to Admin</DropdownItem>
               </DropdownMenu>
            </Dropdown>
         );
   }
}
