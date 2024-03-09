import clsx from "clsx";

import { Image } from "~/components/Image";

import type { ImageElement } from "../../core/types";

type Props = {
   element: ImageElement;
   children: React.ReactNode;
};

export function BlockImageView({ element, children }: Props) {
   const isLargerImage = element.containerWidth && element.containerWidth > 728;

   return (
      element.url && (
         <div
            className={clsx(
               isLargerImage && "max-tablet:-mx-3",
               "relative mt-3 mb-4",
            )}
         >
            <div
               className={clsx(
                  isLargerImage
                     ? "max-tablet:rounded-none tablet:rounded-xl tablet:border max-tablet:border-y"
                     : "rounded-xl border",
                  `flex flex-col h-auto min-h-[50px] w-full justify-center bg-zinc-50 dark:shadow-zinc-800
                  dark:bg-dark350/90  dark:border-zinc-700 overflow-hidden shadow-sm`,
               )}
            >
               <Image
                  className="max-h-80 w-auto mx-auto"
                  alt="Inline"
                  url={element.url}
               />
               {element.caption && (
                  <div className="p-2 text-center text-sm border-t dark:border-zinc-700 dark:bg-dark350/80 bg-white">
                     {children}
                  </div>
               )}
            </div>
         </div>
      )
   );
}
