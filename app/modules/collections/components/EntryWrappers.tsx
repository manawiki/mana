import type { ReactNode } from "react";

export const EntryParent = ({ children }: { children: ReactNode }) => {
   return (
      <div className="max-laptop:pb-20 relative mx-auto min-h-screen desktop:px-0">
         {children}
      </div>
   );
};

export const EntryContent = ({ children }: { children: ReactNode }) => {
   return (
      <div className="mx-auto max-w-[728px] max-laptop:px-3">{children}</div>
   );
};
