import { Image } from "~/components/Image";

import type { ImageElement } from "../../core/types";

type Props = {
   element: ImageElement;
   children: React.ReactNode;
};

export function BlockImageView({ element, children }: Props) {
   return (
      element.url && (
         <div className="relative">
            <div className="mb-3 flex flex-col h-auto min-h-[50px] w-full justify-center">
               <Image
                  className="rounded-md block"
                  alt="Inline"
                  url={element.url}
               />
               {element.caption && (
                  <div className="pt-2 text-center text-sm">{children}</div>
               )}
            </div>
         </div>
      )
   );
}
