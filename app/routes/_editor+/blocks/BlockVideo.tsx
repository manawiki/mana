import { Video } from "lucide-react";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import Placeholder from "../components/Placeholder";
import type { CustomElement, VideoElement } from "../types";

type Props = {
   element: VideoElement;
};

export default function BlockVideo({ element }: Props) {
   const editor = useSlate();

   return (
      <div className="relative">
         {element.url ? (
            <div className="relative mb-3 flex h-0 min-h-[100px] w-full justify-center pb-[56.20608899297424%]">
               <iframe
                  className="absolute left-0 top-0 h-full w-full"
                  width="100%"
                  height="315"
                  src={element.url}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
               ></iframe>
            </div>
         ) : (
            <Placeholder
               defaultOpen={true}
               icon={Video}
               text="Embed a YouTube video"
               inputs={{
                  url: {
                     type: "url",
                     label: "URL",
                     placeholder: "Paste YouTube video link…",
                     title: "Please enter a valid YouTube video link",
                     required: true,
                     pattern:
                        "^((?:https?:)?//)?((?:www|m)\\.)?((?:youtube(-nocookie)?\\.com|youtu.be))(/(?:[\\w\\-]+\\?v=|embed/|v/)?)([\\w\\-]+)(\\S+)?$",
                  },
               }}
               onSubmit={({ url }) => {
                  if (!url.includes("/embed/")) {
                     const id = new URL(url).searchParams.get("v");
                     url = `https://youtube.com/embed/${id}`;
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
