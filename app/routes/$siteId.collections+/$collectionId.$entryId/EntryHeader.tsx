import { Image } from "~/components/Image";
import type { Entry } from "payload/generated-types";
import { NavLink, useParams } from "@remix-run/react";
import { Edit3, Layout } from "lucide-react";

export const EntryHeader = ({ entry }: { entry: Entry }) => {
   const { siteId, collectionId, entryId } = useParams();
   return (
      <section className="border-y overflow-hidden bg-3 pt-5 flex items-center border-color">
         <div className="max-w-[728px] px-3 tablet:px-0 w-full mx-auto">
            <div className="flex justify-start items-center gap-3 pb-3">
               <div className="w-12 h-12 border-2 border-color rounded-full overflow-hidden flex-none">
                  {entry.icon ? (
                     <Image
                        alt={entry.name}
                        options="fit=crop,height=80,width=80,gravity=auto"
                        //@ts-ignore
                        url={entry?.icon?.url}
                     />
                  ) : null}
               </div>
               <h1 className="text-lg font-bold laptop:text-xl">
                  {entry?.name}
               </h1>
            </div>
            <div className="flex items-center gap-4 font-bold text-sm text-1">
               <NavLink
                  className="relative px-1 py-2"
                  to={`/${siteId}/collections/${collectionId}/${entryId}`}
               >
                  {({ isActive }) => (
                     <>
                        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 dark:hover:bg-zinc-700 hover:bg-zinc-100">
                           <Edit3
                              className={`${
                                 isActive
                                    ? "text-yellow-500"
                                    : "text-zinc-400 dark:text-zinc-500"
                              }`}
                              size={16}
                           />
                           <span
                              className={`${isActive ? "dark:text-white" : ""}`}
                           >
                              Wiki
                           </span>
                        </div>
                        {isActive ? (
                           <span
                              className="absolute h-1 left-0 rounded-full 
                              -bottom-0.5 w-full bg-yellow-500 dark:bg-yellow-700"
                           />
                        ) : null}
                     </>
                  )}
               </NavLink>
               <NavLink
                  className="relative px-1 py-2"
                  to={`/${siteId}/collections/${collectionId}/${entryId}/c`}
               >
                  {({ isActive }) => (
                     <>
                        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 dark:hover:bg-zinc-700 hover:bg-zinc-100">
                           <Layout
                              className={`${
                                 isActive
                                    ? "text-yellow-500"
                                    : "text-zinc-400 dark:text-zinc-500"
                              }`}
                              size={16}
                           />
                           <span
                              className={`${isActive ? "dark:text-white" : ""}`}
                           >
                              Custom
                           </span>
                        </div>
                        {isActive ? (
                           <span
                              className="absolute h-1 left-0 
                              -bottom-0.5 w-full bg-yellow-500 dark:bg-yellow-700"
                           />
                        ) : null}
                     </>
                  )}
               </NavLink>
            </div>
         </div>
      </section>
   );
};
