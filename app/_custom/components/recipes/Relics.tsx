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
            <div className="justify-between my-1 rounded-md border dark:border-gray-700 dark:bg-neutral-800 text-center">
               {relics?.map((r: any) => {
                  // Find the relic's entries in the relicData array
                  const rimg = r?.icon?.url;
                  const rname = r?.name;
                  const rsetid = r?.relicset_id?.id;

                  return (
                     <>
                        <Link to={`/starrail/collections/relicSets/${rsetid}`}>
                           <div className="inline-block align-top m-1 overflow-x-auto">
                              <div
                                 className={`rounded-md mb-1 border dark:border-gray-700 w-24 h-24`}
                              >
                                 <Image
                                    alt={rname}
                                    url={rimg}
                                    className="object-contain"
                                 />
                              </div>
                              <div className={`text-xs text-center w-24`}>
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
