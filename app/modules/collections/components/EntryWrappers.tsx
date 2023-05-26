import type { ReactNode } from "react";

export const EntryParent = ({ children }: { children: ReactNode }) => {
   return (
      <div className="relative mx-auto pb-10 laptop:min-h-screen desktop:px-0">
         {children}
      </div>
   );
};

export const EntryContent = ({ children }: { children: ReactNode }) => {
   return (
      <div className="mx-auto max-w-[728px] max-laptop:px-3">{children}</div>
   );
};
