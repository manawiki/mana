import { Link } from "@remix-run/react";

import { Avatar } from "~/components/Avatar";
import { Image } from "~/components/Image";

import type { TierListData } from "./TierListData";

export function GridCell({
   icon,
   name,
   href,
   type,
}: {
   icon: string;
   name: string;
   href: string;
   type: TierListData["type"];
}) {
   return (
      <Link
         to={href}
         className="flex items-center justify-center flex-col gap-2.5 border border-color-sub shadow-sm shadow-1 bg-2-sub rounded-lg p-3 dark:hover:border-zinc-600/80 relative"
      >
         <div className="relative">
            <Avatar
               src={icon}
               initials={icon ? undefined : name.charAt(0)}
               className="size-14"
               options="aspect_ratio=1:1&height=120&width=120"
            />
            <div className="absolute -bottom-2 flex items-center justify-center gap-1 w-14">
               {type.map((row) => (
                  <Image
                     key={row.name}
                     url={row.icon?.url}
                     width={16}
                     height={16}
                     options="aspect_ratio=1:1&height=40&width=40"
                     className="size-4"
                  />
               ))}
            </div>
         </div>
         <div className="text-xs text-center font-bold">{name}</div>
      </Link>
   );
}
