import { ReactEditor, useSlate } from "slate-react";
import type { CustomElement, LinkElement } from "../types";
import { Transforms } from "slate";
import { useSelf } from "~/liveblocks.config";
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
   const self = useSelf();
   console.log(element);
   console.log(self);
   const [isOpen, setIsOpen] = useState(element?.url == "" ? true : false);
   return (
      <>
         {element.url ? (
            <a rel="nofollow" className="text-blue-500" href={element.url}>
               {children}
            </a>
         ) : (
            <>
               <PlaceholderLink
                  defaultOpen={isOpen}
                  icon={Link}
                  inputs={{
                     url: {
                        type: "url",
                        label: "URL",
                        placeholder: "Paste a link…",
                        title: "Please enter a valid link",
                        required: true,
                        // pattern:
                        //    "^((?:https?:)?//)?((?:www|m)\\.)?((?:youtube(-nocookie)?\\.com|youtu.be))(/(?:[\\w\\-]+\\?v=|embed/|v/)?)([\\w\\-]+)(\\S+)?$",
                     },
                  }}
                  onSubmit={({ url }) => {
                     const path = ReactEditor.findPath(editor, element);
                     const newProperties: Partial<CustomElement> = {
                        url,
                     };
                     Transforms.setNodes<CustomElement>(editor, newProperties, {
                        at: path,
                     });
                  }}
               />
               {children}
            </>
         )}
      </>
   );
}
