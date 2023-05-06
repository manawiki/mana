import { ReactEditor, useSlate } from "slate-react";
import type { CustomElement, LinkElement } from "../types";
import { Transforms } from "slate";
import { Link } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import PlaceholderLink from "../components/PlaceholderLink";

type Props = {
   element: LinkElement;
   children: ReactNode;
};

export default function BlockLink({ element, children }: Props) {
   const editor = useSlate();
   const [isOpen] = useState(element?.url == "" ? true : false);
   return (
      <>
         <a rel="nofollow" className="text-blue-500" href={element.url}>
            {children}
         </a>
      </>
   );
}
