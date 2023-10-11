import type { ReactNode } from "react";

import { CollectionHeader } from "../$collectionId";

export function Entry({ children }: { children: ReactNode }) {
   return (
      <div className="mx-auto max-w-[728px] max-laptop:pt-14 max-tablet:px-3 pb-5 laptop:pb-14">
         <CollectionHeader />
         {children}
      </div>
   );
}
