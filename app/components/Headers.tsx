export const H2 = ({ text }: { text: string | undefined }) => {
   return (
      <h2
         className="dark:shadow-zinc-800/50 border-color relative mb-2.5 mt-8 overflow-hidden rounded-lg
      border-2 font-header text-xl font-bold shadow-sm shadow-zinc-50 dark:bg-dark350"
      >
         <div
            className="pattern-dots absolute left-0
                   top-0 -z-0 h-full dark:text-zinc-100
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                     pattern-size-4 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
         />
         <div className="relative h-full w-full px-3.5 py-2.5">{text}</div>
      </h2>
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
      <h2 className="mt-6 flex items-center text-lg scroll-mt-20 relative overflow-hidden pb-0 font-header pl-2.5 mb-3 leading-0">
         <span
            contentEditable={false}
            className="h-full w-1 select-none bg-zinc-400 dark:bg-zinc-500 absolute left-0 rounded-full border-zinc-300 dark:border-zinc-500 z-20"
         />
         <span className="bg-zinc-50 dark:bg-dark450 px-2.5 overflow-hidden py-1.5 flex-grow rounded-lg border-2 border-color-sub border-zinc-200 relative shadow-sm dark:shadow-zinc-800/70 shadow-zinc-50">
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
