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
   //We bypass and use the custom defined user layout
   if (children) {
      return (
         <div className="mx-auto max-w-[728px] pt-20 laptop:pt-6 max-tablet:px-3 pb-5 laptop:pb-14">
            <CollectionHeader />
            {children}
         </div>
      );
   }

   //Otherwise render sections normally
   return (
      <div className="mx-auto max-w-[728px] pt-20 laptop:pt-6 max-tablet:px-3 pb-5 laptop:pb-14">
         <CollectionHeader />
         <Section customData={customData} customComponents={customComponents} />
      </div>
   );
}
