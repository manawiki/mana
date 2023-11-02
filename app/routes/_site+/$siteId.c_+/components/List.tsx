import { type ReactNode } from "react";

import { AdminOrStaffOrOwner } from "~/routes/_auth+/src/components";

import { CollectionHeader } from "./CollectionHeader";
import { Sections } from "./Sections";

export function List({ children }: { children: ReactNode }) {
   return (
      <div className="mx-auto max-w-[728px] pt-20 laptop:pt-12 max-tablet:px-3 pb-5 laptop:pb-14">
         <CollectionHeader />
         <AdminOrStaffOrOwner>
            <Sections />
         </AdminOrStaffOrOwner>
         {children}
      </div>
   );
}
