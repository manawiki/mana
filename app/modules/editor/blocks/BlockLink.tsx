import type { LinkElement } from "../types";
import type { ReactNode } from "react";

type Props = {
   element: LinkElement;
   children: ReactNode;
};

export default function BlockLink({ element, children }: Props) {
   return (
      <a rel="nofollow" className="text-blue-500" href={element.url}>
         {children}
      </a>
   );
}
