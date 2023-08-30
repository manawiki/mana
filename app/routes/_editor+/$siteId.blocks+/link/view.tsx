import type { ReactNode } from "react";

import { Link } from "@remix-run/react";

import { Image } from "~/components";

import type { LinkElement } from "../../functions/types";

type Props = {
   element: LinkElement;
   children: ReactNode;
};

export const BlockLinkView = ({ element, children }: Props) => {
   const { hostname, pathname } = new URL(element.url as string);

   const isSafeLink = ["mana.wiki"].includes(hostname);

   if (isSafeLink && element.icon) {
      return (
         <Link
            prefetch="intent"
            to={pathname}
            className="group/link relative inline-flex items-baseline gap-1 whitespace-nowrap
          text-blue-600 visited:text-purple-600 hover:underline dark:text-blue-500"
         >
            <span
               className="border-color shadow-1 flex h-6 w-6 items-center justify-center
      self-center overflow-hidden rounded-full border shadow-sm"
            >
               <Image
                  width={30}
                  height={30}
                  url={element.icon.url}
                  options="aspect_ratio=1:1&height=40&width=40"
               />
            </span>
            {children}
         </Link>
      );
   }

   // Use client-side routing if internal link
   if (isSafeLink) {
      return (
         <Link
            prefetch="intent"
            className="text-blue-600 visited:text-purple-600 hover:underline"
            to={pathname}
         >
            {children}
         </Link>
      );
   }

   // Otherwise render as regular a tag for external links
   return (
      <a
         rel="nofollow"
         className="text-blue-600 visited:text-purple-600 hover:underline"
         href={element.url}
      >
         {children}
      </a>
   );
};
