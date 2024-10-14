import type { ReactNode } from "react";

import { Link } from "@remix-run/react";

import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import type { LinkElement } from "../../core/types";

import { LinkBlockElement } from "./_link";

type Props = {
   element: LinkElement;
   children: ReactNode;
};

export function BlockLinkView({ element, children }: Props) {
   const { hostname, pathname } = new URL(element?.url as string);

   const { site } = useSiteLoaderData();

   const isSelfLink = site?.domain
      ? hostname === site?.domain
      : hostname === "mana.wiki";

   if (element.icon) {
      return (
         <Link
            to={pathname}
            className="group/link relative inline-flex items-baseline gap-1 whitespace-nowrap
          text-blue-600 visited:text-purple-600 hover:underline dark:text-blue-500"
         >
            <LinkBlockElement element={element} children={children} />
         </Link>
      );
   }

   if (isSelfLink) {
      return (
         <Link
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
         href={element?.url}
      >
         {children}
      </a>
   );
}
