import { Image } from "~/components/Image";
import type { Entry } from "payload/generated-types";
import { NavLink, useParams } from "@remix-run/react";

export const EntryHeader = ({ entry }: { entry: Entry }) => {
   const { siteId, collectionId, entryId } = useParams();
   return (
      <section className="border-y pt-5 pb-4 flex items-center border-color">
         <div className="max-w-[728px] px-3 tablet:px-0 w-full mx-auto">
            <div className="flex justify-start items-center gap-3 pb-5">
               <div className="w-12 h-12 border-2 border-color rounded-full">
                  {entry.icon ? (
                     <Image
                        alt={entry.name}
                        options="fit=crop,height=80,width=80,gravity=auto"
                        //@ts-ignore
                        url={entry?.icon?.url}
                     />
                  ) : null}
               </div>
               <h1 className="font-mono text-xl font-semibold laptop:text-2xl">
                  {entry?.name}
               </h1>
            </div>
            <div className="flex items-center gap-6 font-bold">
               <NavLink
                  to={`/${siteId}/collections/${collectionId}/${entryId}`}
               >
                  Wiki
               </NavLink>
               <NavLink
                  to={`/${siteId}/collections/${collectionId}/${entryId}/c`}
               >
                  Custom
               </NavLink>
            </div>
         </div>
      </section>
   );
};
