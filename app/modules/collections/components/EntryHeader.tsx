import { Image } from "~/components/Image";
import type { Entry } from "payload/generated-types";
import { NavLink, useLocation, useParams } from "@remix-run/react";
import { Component, Edit3, Layout, Users } from "lucide-react";
import { CustomCollection } from "~/modules/auth";

export const EntryHeader = ({ entry }: { entry: Entry }) => {
   const params = useParams();
   const siteId = params.siteId;
   const entryId = params.entryId;

   //Get path for custom site
   const { pathname } = useLocation();
   const slug = pathname.split("/")[3];

   const collectionId = params?.collectionId ? params?.collectionId : slug;

   return (
      <section className="border-y overflow-hidden pt-9 mb-5 border-color relative">
         <div
            className="pattern-dots pattern-zinc-400 dark:pattern-zinc-500
                   pattern-bg-white dark:pattern-bg-bg3Dark
                     pattern-size-4 pattern-opacity-10 absolute top-0 left-0 w-full h-full"
         ></div>
         <div
            className="bg-gradient-to-b from-zinc-50 dark:from-bg2Dark 
            absolute top-0 left-0 w-full h-full"
         ></div>
         <div className="max-w-[728px] max-desktop:px-3 mx-auto flex justify-start relative items-center gap-3 pb-4">
            <div
               className="w-12 h-12 border-2 border-color flex items-center 
                  justify-center rounded-full overflow-hidden flex-none bg-2"
            >
               {/* @ts-ignore */}
               {entry.icon?.url ? (
                  <Image
                     alt={entry.name}
                     options="fit=crop,height=80,width=80,gravity=auto"
                     //@ts-ignore
                     url={entry?.icon?.url}
                  />
               ) : (
                  <Component size={24} className="text-1" />
               )}
            </div>
            <h1 className="text-lg font-bold laptop:text-xl">{entry?.name}</h1>
         </div>
         <div className="max-w-[728px] relative max-desktop:px-3 mx-auto flex items-center gap-4 font-bold text-sm text-1">
            <CustomCollection>
               <NavLink
                  end
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
                              size={18}
                           />
                           <span
                              className={`${isActive ? "dark:text-white" : ""}`}
                           >
                              Custom
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
            </CustomCollection>
            <NavLink
               end
               className="relative px-1 py-2"
               to={`/${siteId}/collections/${collectionId}/${entryId}/w`}
            >
               {({ isActive }) => (
                  <>
                     <div className="flex items-center gap-2 rounded-md px-2 py-1.5 dark:hover:bg-zinc-700 hover:bg-zinc-100">
                        <Users
                           className={`${
                              isActive
                                 ? "text-yellow-500"
                                 : "text-zinc-400 dark:text-zinc-500"
                           }`}
                           size={18}
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
         </div>
      </section>
   );
};
