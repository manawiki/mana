import { Link } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import clsx from "clsx";

import { Avatar } from "~/components/Avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";

export function Contributors({
   site,
}: {
   site: SerializeFrom<typeof siteLoaderType>["site"];
}) {
   return (
      <>
         <section
            className={clsx(
               site?.trendingPages?.length == 0 ? "w-full py-4" : "pb-4",
               "relative z-20 mx-auto max-laptop:max-w-[728px] laptop:px-4  max-tablet:px-4",
            )}
         >
            <div className="flex items-center pb-3">
               <span className="text-1 text-sm font-bold">Contributors</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="flex items-center -space-x-1">
                  <Tooltip>
                     <TooltipTrigger title={site?.owner?.username ?? undefined}>
                        <Avatar
                           src={site?.owner?.avatar?.url}
                           //@ts-ignore
                           initials={site?.owner?.username?.charAt(0)}
                           className="size-8 ring-2 ring-zinc-50 dark:ring-bg3Dark dark:bg-bg3Dark laptop:dark:ring-bg2Dark"
                           options="aspect_ratio=1:1&height=60&width=60"
                        />
                     </TooltipTrigger>
                     <TooltipContent>{site?.owner?.username}</TooltipContent>
                  </Tooltip>
                  {site.admins?.length != 0 &&
                     site.admins?.map((user: any) => (
                        <Tooltip key={user.id}>
                           <TooltipTrigger
                              title={site?.owner?.username ?? undefined}
                           >
                              <Avatar
                                 src={user?.avatar?.url}
                                 initials={user?.username.charAt(0)}
                                 className="size-8 ring-2 ring-zinc-50 dark:ring-bg3Dark dark:bg-bg3Dark laptop:dark:ring-bg2Dark"
                                 options="aspect_ratio=1:1&height=60&width=60"
                              />
                           </TooltipTrigger>
                           <TooltipContent>{user.username}</TooltipContent>
                        </Tooltip>
                     ))}
                  {site.contributors?.length != 0 &&
                     site.contributors?.map((user: any) => (
                        <Tooltip key={user.id}>
                           <TooltipTrigger
                              title={site?.owner?.username ?? undefined}
                           >
                              <Avatar
                                 src={user?.avatar?.url}
                                 initials={user?.username.charAt(0)}
                                 className="size-8 ring-2 ring-zinc-50 dark:ring-bg3Dark dark:bg-bg3Dark laptop:dark:ring-bg2Dark"
                                 options="aspect_ratio=1:1&height=60&width=60"
                              />
                           </TooltipTrigger>
                           <TooltipContent>{user.username}</TooltipContent>
                        </Tooltip>
                     ))}
               </div>
               <Link
                  to="/apply"
                  className="shadow-1 flex h-8 items-center dark:hover:bg-zinc-200 justify-center rounded-full bg-zinc-800
                 px-4 text-sm font-semibold dark:text-zinc-900 dark:bg-zinc-100 text-zinc-100 hover:bg-zinc-700"
               >
                  Join
               </Link>
            </div>
         </section>
      </>
   );
}
