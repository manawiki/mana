import { NavLink } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import type { IconName } from "~/components/icons";

export function SettingsMenuLink({
   text,
   to,
   icon,
}: {
   text: string;
   to: string;
   icon: IconName;
}) {
   return (
      <NavLink
         end
         to={to}
         className={({ isActive }) =>
            clsx(isActive ? "" : "text-1", "flex items-center relative h-full")
         }
      >
         {({ isActive }) => (
            <div className="hover:dark:bg-dark400 hover:bg-white hover:shadow-sm flex items-center gap-2 rounded-lg pl-2 pr-3 py-1.5">
               {isActive && (
                  <div className="bg-blue-500 h-[5px] left-1/2 -translate-x-1/2 rounded-sm w-full absolute -bottom-[2px]" />
               )}
               <Icon size={15} name={icon} className="text-1" />
               {text}
            </div>
         )}
      </NavLink>
   );
}
