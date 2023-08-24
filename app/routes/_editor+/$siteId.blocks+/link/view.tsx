import type { ReactNode } from "react";

import { Link } from "@remix-run/react";

import type { LinkElement } from "../../types";

type Props = {
   element: LinkElement;
   children: ReactNode;
};

export const BlockLinkView = ({ element, children }: Props) => {
   const { hostname, pathname } = new URL(element.url as string);

   const isSafeLink = ["mana.wiki"].includes(hostname);

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
