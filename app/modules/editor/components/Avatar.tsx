import { Image } from "~/components/Image";
import { Tooltip } from "~/modules/editor/components";
import { MousePointer2 } from "lucide-react";

type Props = {
   imageUrl: string;
   name: string;
   color?: string;
};

export default function Avatar({ imageUrl, name, color }: Props) {
   return (
      <Tooltip
         className="flex items-center"
         id="avatar"
         side="bottom"
         content={name}
      >
         <button
            style={{ borderColor: color }}
            className="bg-4 relative h-[34px] w-[34px] overflow-hidden rounded-full border-2"
         >
            {imageUrl ? (
               <div className="border-color flex items-center justify-center overflow-hidden rounded-full border">
                  <Image
                     alt={name}
                     options="fit=crop,width=88,height=88,gravity=auto"
                     url={imageUrl}
                  />
               </div>
            ) : (
               <div className="flex items-center justify-center">
                  <MousePointer2 size={16} />
               </div>
            )}
         </button>
      </Tooltip>
   );
}
