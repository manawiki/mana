import { Code } from "lucide-react";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import Placeholder from "../components/Placeholder";
import type { CustomElement, CodeSandboxElement } from "../core/types";

type Props = {
   element: CodeSandboxElement;
};

export function BlockCodeSandbox({ element }: Props) {
   const editor = useSlate();

   return (
      <div className="relative my-0.5">
         {element.url ? (
            <div className="relative mb-3 flex h-0 min-h-[100px] w-full justify-center pb-[66%]">
               <iframe
                  className="absolute left-0 top-0 h-full w-full"
                  width="100%"
                  height="315"
                  src={element.url}
                  title="CodeSandbox embed"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
               ></iframe>
            </div>
         ) : (
            <Placeholder
               defaultOpen={true}
               icon={Code}
               text="Embed a CodeSandbox project"
               inputs={{
                  url: {
                     type: "url",
                     label: "URL",
                     placeholder: "Paste CodeSandbox link…",
                     title: "Please enter a valid CodeSandbox project link",
                     required: true,
                     pattern:
                        "((?:https?:)?//)?(?:www.)?(?:codesandbox.io)((/s/)|(/embed/))(.*)+$",
                  },
               }}
               onSubmit={({ url }) => {
                  if (!url.includes("/embed/")) {
                     url = url.replace("/s/", "/embed/");
                  }

                  const path = ReactEditor.findPath(editor, element);
                  const newProperties: Partial<CustomElement> = {
                     url,
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
