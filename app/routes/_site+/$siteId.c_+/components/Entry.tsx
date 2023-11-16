import { type ReactNode } from "react";

import { CollectionHeader } from "./CollectionHeader";
import { Section } from "./Section";

export function Entry({
   children,
   customData,
   customComponents,
}: {
   children?: ReactNode;
   customData?: unknown;
   customComponents?: unknown;
}) {
   return (
      <>
         <CollectionHeader />
         <div className="mx-auto max-w-[728px] max-tablet:px-3 py-3 laptop:py-5 laptop:pb-14">
            {children ? (
               children
            ) : (
               <Section
                  customData={customData}
                  customComponents={customComponents}
               />
            )}
         </div>
      </>
   );
}
