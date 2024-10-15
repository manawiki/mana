import { useState } from "react";

import clsx from "clsx";

import { Alert } from "~/components/Alert";
import { Image } from "~/components/Image";

import type { ImageElement } from "../../core/types";

type Props = {
   element: ImageElement;
   children: React.ReactNode;
};

export function BlockImageView({ element, children }: Props) {
   const isLargerImage = element.containerWidth && element.containerWidth > 728;

   const [isOpen, setIsOpen] = useState<boolean>(false);

   return (
      element.url && (
         <div
            className={clsx(
               isLargerImage && "max-tablet:-mx-3",
               "relative mt-3 mb-4",
            )}
         >
            <Alert
               size="5xl"
               onClose={() => {
                  setIsOpen(false);
               }}
               className="!p-0 !overflow-hidden"
               open={isOpen}
            >
               <Image
                  className="w-auto mx-auto"
                  url={element.url}
                  loading="lazy"
               />
               {element.caption && (
                  <div className="p-2 text-center text-sm border-t dark:border-zinc-700 dark:bg-dark350/80 bg-white w-full">
                     {children}
                  </div>
               )}
            </Alert>
            <button
               type="button"
               className={clsx(
                  isLargerImage
                     ? "max-tablet:rounded-none tablet:rounded-xl tablet:border max-tablet:border-y"
                     : "rounded-xl border",
                  `flex flex-col h-auto min-h-[50px] w-full justify-center bg-zinc-50 dark:shadow-zinc-800
                  dark:bg-dark350/90  dark:border-zinc-700 overflow-hidden shadow-sm`,
               )}
               onClick={() => setIsOpen(true)}
            >
               <Image
                  className="w-auto mx-auto"
                  alt="Inline"
                  url={element.url}
                  loading="lazy"
               />
               {element.caption && (
                  <div className="p-2 text-center text-sm border-t dark:border-zinc-700 dark:bg-dark350/80 bg-white w-full">
                     {children}
                  </div>
               )}
            </button>
         </div>
      )
   );
}
