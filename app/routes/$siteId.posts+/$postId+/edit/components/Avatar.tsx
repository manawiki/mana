import { Image } from "~/components/Image";
import { Tooltip } from "../forge/components";

type Props = {
   imageUrl: string;
   name: string;
   color?: string;
};

export default function Avatar({ imageUrl, name, color }: Props) {
   return (
      <Tooltip id="avatar" side="bottom" content={name}>
         <button
            style={{ borderColor: color }}
            className="h-8 w-8 border-2 relative rounded-full overflow-hidden"
         >
            <div className="border bg-2 rounded-full border-color overflow-hidden">
               <Image
                  alt={name}
                  options="fit=crop,width=88,height=88,gravity=auto"
                  url={imageUrl}
               />
            </div>
         </button>
      </Tooltip>
   );
}
