import Tooltip from "./Tooltip";
import { Image } from "~/components/Image";

type Props = {
   imageUrl: string;
   name: string;
   color?: string;
};

export default function Avatar({ imageUrl, name, color }: Props) {
   console.log(name);
   return (
      <Tooltip content={name}>
         <button
            style={{ borderColor: color }}
            className="h-7 w-7 border relative rounded-full overflow-hidden"
         >
            <div className="border-2 rounded-full border-color">
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
