import { Link } from "@remix-run/react";
import { H2 } from "~/_custom/components/custom";
import { Image } from "~/components";

export const Relics = ({ pageData }: any) => {
   // Only return a result if there are relics!
   const relics = pageData?.relic_list;

   if (relics?.length > 0) {
      return (
         <>
            <H2 text="Possible Relics" />
            <div className="my-1 justify-between rounded-md border text-center dark:border-gray-700 dark:bg-neutral-800">
               {relics?.map((r: any) => {
                  // Find the relic's entries in the relicData array
                  const rimg = r?.icon?.url;
                  const rname = r?.name;
                  const rsetid = r?.relicset_id?.id;

                  return (
                     <>
                        <Link to={`/starrail/collections/relicSets/${rsetid}`}>
                           <div className="m-1 inline-block overflow-x-auto align-top">
                              <div
                                 className={`mb-1 h-24 w-24 rounded-md border dark:border-gray-700`}
                              >
                                 <Image
                                    options="aspect_ratio=1:1&height=120&width=120"
                                    alt={rname}
                                    url={rimg}
                                    className="object-contain"
                                 />
                              </div>
                              <div className={`w-24 text-center text-xs`}>
                                 {rname}
                              </div>
                           </div>
                        </Link>
                     </>
                  );
               })}
            </div>
         </>
      );
   } else {
      return null;
   }
};
