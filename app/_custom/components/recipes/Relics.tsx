import { Link } from "@remix-run/react";

import type { Recipe } from "payload/generated-custom-types";
import { H2 } from "~/components/H2";
import { Image } from "~/components";

export const Relics = ({ pageData }: { pageData: Recipe }) => {
   // Only return a result if there are relics!
   const relics = pageData?.relic_list;

   if (relics && relics?.length > 0) {
      return (
         <>
            <H2 text="Possible Relics" />
            <div className="border-color divide-color shadow-1 bg-2 divide-y rounded-md border shadow-sm">
               {relics?.map((r) => {
                  // Find the relic's entries in the relicData array
                  const rimg = r?.icon?.url;
                  const rname = r?.name;
                  const rsetid = r?.relicset_id?.id;

                  return (
                     <Link
                        key={rname}
                        prefetch="intent"
                        className="flex items-center gap-3 p-2"
                        to={`/starrail/collections/relicSets/${rsetid}`}
                     >
                        <div className="h-12 w-12">
                           <Image
                              options="aspect_ratio=1:1&height=120&width=120"
                              alt={rname}
                              url={rimg}
                              className="object-contain"
                           />
                        </div>
                        <div className="text-1 font-semibold">{rname}</div>
                     </Link>
                  );
               })}
            </div>
         </>
      );
   } else {
      return null;
   }
};
