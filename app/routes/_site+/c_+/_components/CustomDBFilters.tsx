import { useState } from "react";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import type { Collection, Site } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";

import { MobileTray } from "../../_components/MobileTray";

export function CustomDBFilters({
   collection,
   site,
}: {
   collection: Collection;
   site: Site;
}) {
   const [filterMenuToggle, setFilterToggle] = useState(false);

   return (
      <div className="flex items-center justify-between w-full pb-2">
         {/* <div className="flex items-center gap-3">
            <Button
               onClick={() => setFilterToggle(!filterMenuToggle)}
               href={`/c/${collection.slug}?sort=name`}
               className="text-sm"
            >
               Filter
               <Icon name="arrow-up-down" title="Sort" size={14} />
            </Button>
            <MobileTray
               shouldScaleBackground
               direction="right"
               onOpenChange={setFilterToggle}
               open={filterMenuToggle}
               modal
            >
               <div>pog</div>
            </MobileTray>
         </div> */}
         <AdminOrStaffOrOwner>
            <Button
               type="button"
               color="blue"
               target="_blank"
               className="text-sm"
               href={`https://${site.slug}-db.mana.wiki/admin/collections/${collection?.slug}/create`}
            >
               <Icon className="text-blue-200" name="plus" size={15} />
               Add {collection?.name}
            </Button>
         </AdminOrStaffOrOwner>
      </div>
   );
}
