import { useState } from "react";

import { Link, useLocation } from "@remix-run/react";
import clsx from "clsx";

import { Avatar } from "~/components/Avatar";
import { Icon } from "~/components/Icon";
import type { Site } from "~/db/payload-types";

export function ViewSideMenu({ site }: { site: Site }) {
   return (
      <>
         {site?.menu?.map((item) => (
            <menu key={item.id} className="px-2 pt-4">
               <div
                  className="pl-2 pb-1 text-xs dark:text-zinc-400 text-zinc-500 font-semibold
                flex items-center justify-between relative group"
               >
                  {item.name}
               </div>
               <div className="space-y-0.5">
                  {item.links?.map((link: any) => (
                     <ViewSideMenuLink key={link.id} link={link} />
                  ))}
               </div>
            </menu>
         ))}
      </>
   );
}

function ViewSideMenuLink({ link }: { link: any }) {
   const { pathname } = useLocation();

   const nestedLinkActive = link?.nestedLinks?.find(
      (x: any) => x.path === pathname,
   );

   const [isSectionOpen, setSection] = useState(nestedLinkActive ?? false);

   return (
      <>
         {link.nestedLinks && link.nestedLinks.length > 0 ? (
            <button
               onClick={() => setSection(!isSectionOpen)}
               className={clsx(
                  pathname === link.path && "bg-zinc-200/40 dark:bg-dark350",
                  "relative group/section hover:bg-zinc-200/40 dark:hover:bg-dark350 w-full rounded-lg p-1.5 flex items-center gap-2",
               )}
            >
               <div className="flex items-center gap-2 truncate">
                  <Avatar
                     initials={!link.icon && link.name.charAt(0)}
                     className="size-6 flex-none"
                     src={link.icon}
                     options="aspect_ratio=1:1&height=120&width=120"
                  />
                  <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                     {link.name}
                  </span>
                  <Icon
                     name="chevron-right"
                     className={`${
                        isSectionOpen ? "rotate-90" : ""
                     } transform transition duration-300 ease-in-out text-zinc-400 dark:text-zinc-500`}
                     size={14}
                  />
               </div>
            </button>
         ) : (
            <Link
               className={clsx(
                  pathname === link.path && "bg-zinc-200/40 dark:bg-dark350",
                  "relative group/section hover:bg-zinc-200/40 dark:hover:bg-dark350 w-full rounded-lg p-1.5 flex items-center gap-2",
               )}
               to={link.path}
            >
               <Avatar
                  initials={!link.icon && link.name.charAt(0)}
                  className="size-6 flex-none"
                  src={link.icon}
                  options="aspect_ratio=1:1&height=120&width=120"
               />
               <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  {link.name}
               </span>
            </Link>
         )}
         {isSectionOpen && (
            <div className="pl-1.5 ml-2 space-y-0.5 border-l-2 border-dotted dark:border-dark450 my-1.5">
               {link.nestedLinks?.map((linkRow: any) => (
                  <Link
                     key={linkRow.id}
                     to={linkRow.path}
                     className={clsx(
                        pathname === linkRow.path &&
                           "bg-zinc-200/40 dark:bg-dark350",
                        "pl-2 pr-1 py-1 justify-between w-full flex items-center gap-2 truncate rounded-lg hover:bg-zinc-100 dark:hover:bg-dark350",
                     )}
                  >
                     <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                        {linkRow.name}
                     </span>
                     <Avatar
                        initials={!linkRow.icon && linkRow.name.charAt(0)}
                        src={linkRow.icon}
                        className="size-6 flex-none group-hover/nestedLink:hidden"
                        options="aspect_ratio=1:1&height=120&width=120"
                     />
                  </Link>
               ))}
            </div>
         )}
      </>
   );
}
