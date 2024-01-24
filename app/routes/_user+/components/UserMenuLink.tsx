import { NavLink } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import type { IconName } from "~/components/icons";

export function UserMenuLink({
   text,
   icon,
   to,
}: {
   text: string;
   icon: IconName;
   to: string;
}) {
   return (
      <NavLink
         className={({ isActive }) =>
            clsx(
               isActive
                  ? "bg-zinc-200/80 dark:bg-dark350 font-bold"
                  : "hover:bg-zinc-100 dark:hover:bg-dark400 font-semibold",
               "desktop:py-2 desktop:px-3 max-desktop:p-2 laptop:justify-center desktop:justify-start flex items-center gap-2 rounded-lg text-sm",
            )
         }
         to={to}
      >
         <Icon name={icon} size={16} className="flex-none text-1" />
         <span className="laptop:hidden desktop:block">{text}</span>
      </NavLink>
   );
}
