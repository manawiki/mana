import { type ReactNode } from "react";

import { AdminOrStaffOrOwner } from "~/routes/_auth+/src/components";

import { CollectionHeader } from "./CollectionHeader";
import { Sections } from "./Sections";

export function List({ children }: { children: ReactNode }) {
   return (
      <>
         <CollectionHeader />
         <div className="mx-auto max-w-[728px] max-tablet:px-3 py-3 laptop:py-4 laptop:pb-14">
            <AdminOrStaffOrOwner>
               <Sections />
            </AdminOrStaffOrOwner>
            {children}
         </div>
      </>
   );
}
