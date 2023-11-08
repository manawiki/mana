import { Image } from "~/components";
import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import type { Site } from "~/db/payload-types";
import { AdUnit } from "~/routes/_site+/$siteId+/src/components/Ramp";

import { PinnedList, PrimaryMenuLinks } from "./Menu";

export function ColumnFour({ site }: { site: Site }) {
   return (
      <section className="relative z-40 laptop:block max-laptop:bg-2-sub">
         <div
            className="flex flex-col laptop:fixed laptop:border-l laptop:shadow-sm laptop:shadow-1 h-full bg-2-sub max-laptop:max-w-[728px]
            laptop:w-[334px] laptop:dark:bg-dark350/50 laptop:dark:border-zinc-700 laptop:border-zinc-200/60 laptop:overflow-y-auto max-laptop:mx-auto"
         >
            <div className="laptop:h-full flex flex-col">
               <section className="border-color py-4 max-tablet:border-b max-tablet:px-3 laptop:hidden">
                  <PrimaryMenuLinks site={site} />
                  <PinnedList site={site} />
               </section>
               {site?.banner && (
                  <div className="border-b border-color">
                     <div className="bg-3-sub flex items-center justify-center bg-zinc-100 h-40 relative overflow-hidden">
                        <span
                           className="bg-gradient-to-b dark:from-dark350/80 dark:via-dark350/40 
                               from-white/30 via-white/10 to-white/20
                               dark:to-dark350/90  w-full h-full absolute top-0 left-0 z-10"
                        />
                        <Image
                           url={site?.banner?.url}
                           options="aspect_ratio=2:1&height=260"
                           alt="Site Banner"
                        />
                     </div>
                  </div>
               )}
               <section className="border-color border-b p-4 px-4 tablet:px-0 laptop:p-4">
                  <div className="flex items-center gap-2 pl-0.5">
                     <Icon
                        className="text-1"
                        name="users"
                        title="Contributors"
                        size={14}
                     />
                     <span className="text-xs font-semibold">
                        {site.followers}
                     </span>
                  </div>
                  {site.about && (
                     <div className="text-1 text-xs pt-3">{site.about}</div>
                  )}
               </section>
               <section className="p-4 px-4 tablet:px-0 laptop:p-4 border-b border-color">
                  <div className="flex items-center pb-3">
                     <span className="text-1 text-sm font-bold">
                        Contributors
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     {site.admins?.length === 0 ? null : (
                        <>
                           {site.admins?.map((user: any) => (
                              <Tooltip key={user.id}>
                                 <TooltipTrigger>
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
                                          <Icon
                                             name="dog"
                                             className="text-1"
                                             size={20}
                                          />
                                       )}
                                    </div>
                                 </TooltipTrigger>
                                 <TooltipContent>
                                    {user.username}
                                 </TooltipContent>
                              </Tooltip>
                           ))}
                           <Tooltip key={site?.owner?.id}>
                              <TooltipTrigger>
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
                                          <Icon
                                             name="dog"
                                             className="text-1"
                                             size={20}
                                          />
                                       </div>
                                    )}
                                 </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                 {site?.owner?.username}
                              </TooltipContent>
                           </Tooltip>
                        </>
                     )}
                     <Tooltip>
                        <TooltipTrigger>
                           <div
                              className="shadow-1 flex h-9 items-center justify-center rounded-full
                                 bg-zinc-500 px-4 text-sm font-semibold text-white shadow dark:bg-zinc-600"
                           >
                              Join
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>Coming Soon!</TooltipContent>
                     </Tooltip>
                  </div>
               </section>
               {site.enableAds && (
                  <>
                     <div className="flex-grow h-full" />
                     <div className="border-t border-color p-4">
                        <AdUnit adId="pwDeskMedRectAtf" />
                     </div>
                  </>
               )}
            </div>
         </div>
      </section>
   );
}
