import type { ReactNode } from "react";

export const H2 = ({ children, id }: { children: ReactNode; id?: string }) => {
   return (
      <h2
         id={id}
         className="dark:text-zinc-100 mt-8 flex items-center text-lg scroll-mt-20 relative overflow-hidden pb-0 font-header pl-2.5 mb-3 leading-0"
      >
         <span
            contentEditable={false}
            className="h-full w-1 select-none bg-zinc-400 dark:bg-zinc-500 absolute left-0 rounded-full border-zinc-300 dark:border-zinc-500 z-20"
         />
         <span className="bg-zinc-50 dark:bg-dark450 px-2.5 overflow-hidden py-1.5 flex-grow rounded-lg border-2 border-color-sub border-zinc-200 relative shadow-sm dark:shadow-zinc-800/70 shadow-zinc-50">
            <span className="z-10 relative">{children}</span>
            <div
               contentEditable={false}
               className="pattern-dots absolute left-0
               top-0 z-0 h-full
               w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
               pattern-size-2 dark:pattern-zinc-400 dark:pattern-bg-bg3Dark"
            />
         </span>
      </h2>
   );
};

export const H3 = ({ children, id }: { children: ReactNode; id?: string }) => {
   return (
      <h3
         id={id}
         className="dark:text-zinc-100 mt-5 mb-2 px-2.5 leading-7 dark:bg-dark450/60 bg-zinc-50 block shadow-sm dark:shadow-zinc-800/40 border-zinc-200/70
         font-header relative text-lg scroll-mt-20 rounded-lg py-1.5 overflow-hidden border-2 dark:border-zinc-600/50 shadow-zinc-50"
      >
         <span className="z-10 relative">{children}</span>
         <div
            contentEditable={false}
            className="pattern-dots absolute left-0 top-0 z-0 h-full
            w-full pattern-bg-white pattern-zinc-400 dark:pattern-zinc-400 pattern-opacity-10 
            pattern-size-1  dark:pattern-bg-bg3Dark"
         />
      </h3>
   );
};

export const H2Plain = ({
   text,
   className,
}: {
   text: string | undefined | null;
   className?: string;
}) => {
   return (
      <h2 className="dark:text-zinc-100  mt-8 flex items-center text-lg scroll-mt-20 relative overflow-hidden pb-0 font-header pl-2.5 mb-3 leading-0">
         <span
            contentEditable={false}
            className="h-full w-1 select-none bg-zinc-400 dark:bg-zinc-500 absolute left-0 rounded-full border-zinc-300 dark:border-zinc-500 z-20"
         />
         <span className="bg-zinc-50 dark:bg-dark450 px-2.5 overflow-hidden py-1.5 flex-grow rounded-lg border-2 dark:border-zinc-600/90 border-zinc-200 relative shadow-sm dark:shadow-zinc-800/70 shadow-zinc-50">
            <span className="z-10 relative">{text}</span>
            <div
               contentEditable={false}
               className="pattern-dots absolute left-0
               top-0 z-0 h-full
               w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
               pattern-size-2 dark:pattern-zinc-400 dark:pattern-bg-bg3Dark"
            />
         </span>
      </h2>
   );
};
