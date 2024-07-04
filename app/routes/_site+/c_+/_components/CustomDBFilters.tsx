import { useState } from "react";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import type { Collection } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";

import { MobileTray } from "../../_components/MobileTray";

export function CustomDBFilters({ collection }: { collection: Collection }) {
   const [filterMenuToggle, setFilterToggle] = useState(false);

   return (
      <div className="flex items-center justify-between w-full pb-2">
         <div className="flex items-center gap-3">
            <Button
               onClick={() => setFilterToggle(!filterMenuToggle)}
               className="text-sm"
            >
               Filter
               <Icon name="arrow-up-down" title="Sort" size={14} />
            </Button>
            <MobileTray
               direction="right"
               onOpenChange={setFilterToggle}
               open={filterMenuToggle}
            >
               <div className="space-y-6">
                  <div>
                     <div className="pb-2 text-sm font-bold text-1">
                        Sort by
                     </div>
                     <div className="grid grid-cols-2 gap-3"></div>
                  </div>
               </div>
            </MobileTray>
         </div>
         <AdminOrStaffOrOwner>
            <Button
               type="button"
               color="blue"
               target="_blank"
               className="text-sm"
               href={`/admin/collections/${collection?.slug}/create`}
               onClick={(e: any) => {
                  e.target.port = 4000;
               }}
            >
               <Icon className="text-blue-200" name="plus" size={15} />
               Add {collection?.name}
            </Button>
         </AdminOrStaffOrOwner>
      </div>
   );
}
