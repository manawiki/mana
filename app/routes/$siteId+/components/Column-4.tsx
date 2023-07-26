import type { Site } from "~/db/payload-types";
import { PinnedList, PrimaryMenuLinks } from "./Menu";
import { Component, Dog, Users } from "lucide-react";
import Tooltip from "~/components/Tooltip";
import { Image } from "~/components";

export const ColumnFour = ({
   safeArea,
   site,
   isMobileApp,
}: {
   safeArea: any;
   site: Site;
   isMobileApp: Boolean;
}) => {
   const bottomSafeArea = isMobileApp
      ? safeArea?.bottom
         ? safeArea?.bottom + 60
         : 60
      : 0;

   return (
      <section
         className="bg-2 border-color relative z-20 max-laptop:mx-auto
                        max-laptop:max-w-[728px] laptop:block laptop:border-l laptop:border-r-0"
      >
         <div
            style={{
               paddingBottom: bottomSafeArea,
            }}
            className="flex flex-col laptop:fixed laptop:h-full laptop:w-[334px] laptop:overflow-y-auto"
         >
            <div className="border-color border-b laptop:pt-14">
               <section className="border-color py-4 max-tablet:border-b max-tablet:px-3 laptop:hidden">
                  <PrimaryMenuLinks site={site} />
                  <PinnedList site={site} />
               </section>
               {site.about && (
                  <section className="border-color border-b p-4 px-4 tablet:px-0 laptop:p-4">
                     <div className="flex items-center gap-1.5 pb-2.5">
                        <Component size={14} />
                        <span className="text-1 text-sm font-bold">About</span>
                     </div>
                     <div className="text-1 text-sm">{site.about}</div>
                  </section>
               )}
               <section className="p-4 px-4 tablet:px-0 laptop:p-4">
                  <div className="flex items-center gap-1.5 pb-3">
                     <Users size={14} />
                     <span className="text-1 text-sm font-bold">
                        Contributors
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     {site.admins?.length === 0 ? null : (
                        <>
                           {site.admins?.map((user: any) => (
                              <Tooltip
                                 key={user.id}
                                 id="site-contributors"
                                 content={user.username}
                              >
                                 <div
                                    className="bg-3 shadow-1 flex h-9 w-9 items-center justify-center
                                          overflow-hidden rounded-full border border-zinc-200 shadow-sm dark:border-zinc-600"
                                 >
                                    {user.avatar?.url ? (
                                       <Image
                                          url={user.avatar?.url}
                                          options="aspect_ratio=1:1&height=80&width=80"
                                          alt="User Avatar"
                                       />
                                    ) : (
                                       <Dog className="text-1" size={20} />
                                    )}
                                 </div>
                              </Tooltip>
                           ))}
                           <Tooltip
                              key={site?.owner?.id}
                              id="site-creator"
                              content={site?.owner?.username}
                           >
                              <div
                                 className="bg-3 shadow-1 h-9 w-9 overflow-hidden rounded-full 
                                          border border-zinc-200 shadow-sm dark:border-zinc-600"
                              >
                                 {site?.owner?.avatar?.url ? (
                                    <Image
                                       url={site?.owner?.avatar?.url}
                                       options="aspect_ratio=1:1&height=80&width=80"
                                       alt="User Avatar"
                                    />
                                 ) : (
                                    <div
                                       className="bg-3 shadow-1 flex h-9 w-9 items-center
                                                justify-center overflow-hidden rounded-full shadow-sm dark:border-zinc-700"
                                    >
                                       <Dog className="text-1" size={20} />
                                    </div>
                                 )}
                              </div>
                           </Tooltip>
                        </>
                     )}
                     <Tooltip id="join-site" content="Coming Soon!">
                        <div
                           className="shadow-1 flex h-9 items-center justify-center rounded-full
                                 bg-zinc-500 px-4 text-sm font-semibold text-white shadow dark:bg-zinc-600"
                        >
                           Join
                        </div>
                     </Tooltip>
                  </div>
               </section>
            </div>
            <div className="border-color flex items-center justify-center">
               {/* <div className="bg-1 h-[250px] w-[300px] rounded-lg" /> */}
            </div>
         </div>
      </section>
   );
};
