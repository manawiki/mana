import type { ReactNode } from "react";

export const EntryParent = ({ children }: { children: ReactNode }) => {
   return (
      <div className="max-laptop:pb-20 relative mx-auto min-h-screen py-12 desktop:px-0">
         {children}
      </div>
   );
};

export const EntryContent = ({ children }: { children: ReactNode }) => {
   return <div className="mx-auto max-w-[728px] py-8">{children}</div>;
};
