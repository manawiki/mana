import { ReactEditor, useSlate } from "slate-react";
import type { CustomElement, TierElement } from "../types";
import { Transforms } from "slate";
import Placeholder from "../components/Placeholder";
import { Image } from "lucide-react";

type Props = {
   element: TierElement;
};

export default function BlockTierList({ element }: Props) {
   const editor = useSlate();

   return (
      <div className="relative">
         {element.url ? (
            <div className="relative mb-3 flex h-auto min-h-[100px] w-full justify-center">
               <img
                  className="w-full rounded-md"
                  src={element.url}
                  alt={element.alt || ""}
               />
            </div>
         ) : (
            <Placeholder
               defaultOpen={true}
               icon={Image}
               text="Embed an image from a URL"
               inputs={{
                  url: {
                     type: "url",
                     label: "URL",
                     placeholder: "Paste image link",
                     title: "Please enter a valid image link",
                     required: true,
                  },
                  alt: {
                     type: "text",
                     label: "Alt text",
                     placeholder: "Enter alt text",
                     required: false,
                  },
               }}
               onSubmit={({ url, alt }) => {
                  const path = ReactEditor.findPath(editor, element);
                  const newProperties: Partial<CustomElement> = {
                     url,
                     alt,
                  };
                  Transforms.setNodes<CustomElement>(editor, newProperties, {
                     at: path,
                  });
               }}
            />
         )}
      </div>
   );
}
