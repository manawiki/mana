import { ReactEditor, useSlate } from "slate-react";
import type { CustomElement, CodeSandboxElement } from "../types";
import { Transforms } from "slate";
import Placeholder from "../components/Placeholder";
import { useSelf } from "~/liveblocks.config";
import { Code } from "lucide-react";

type Props = {
   element: CodeSandboxElement;
};

export default function BlockCodeSandbox({ element }: Props) {
   const editor = useSlate();
   const self = useSelf();

   return (
      <div className="relative my-0.5">
         {element.url ? (
            <div className="flex mb-3 relative justify-center w-full min-h-[100px] h-0 pb-[66%]">
               <iframe
                  className="absolute left-0 top-0 w-full h-full"
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
               defaultOpen={self?.connectionId === element?.createdBy}
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
