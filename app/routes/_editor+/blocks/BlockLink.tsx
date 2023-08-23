import type { ReactNode } from "react";

import { Link } from "@remix-run/react";

import { settings } from "mana-config";

import type { LinkElement } from "../types";

type Props = {
   element: LinkElement;
   children: ReactNode;
};

export default function BlockLink({ element, children }: Props) {
   const hostName = new URL(element.url as string).hostname;
   const pathname = new URL(element.url as string).pathname;
   const currentHost = settings.domain;

   // Use client-side routing if internal link
   if (hostName == currentHost) {
      return (
         <Link
            prefetch="viewport"
            className="text-blue-600 visited:text-purple-600 hover:underline"
            to={pathname}
         >
            {children}
         </Link>
      );
   }

   //Otherwise render as regular a tag for external links
   return (
      <a
         rel="nofollow"
         className="text-blue-600 visited:text-purple-600 hover:underline"
         href={element.url}
      >
         {children}
      </a>
   );
}
