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
      <h2
         className="dark:text-zinc-100 mt-8 mb-3 pl-3.5 leading-7 dark:bg-dark400 bg-zinc-100 block shadow-sm dark:shadow-zinc-800/70 border-zinc-300
      font-header relative text-lg scroll-mt-32 laptop:scroll-mt-60 rounded-l rounded-r-md py-2 overflow-hidden border shadow-zinc-50 dark:border-zinc-600"
      >
         <span className="z-10 relative">{text}</span>
         <span
            contentEditable={false}
            className="h-full inline-flex top-0 w-1.5 dark:bg-zinc-600 bg-zinc-200 absolute left-0 z-10"
         />
         <div
            contentEditable={false}
            className="pattern-dots absolute left-0
                  top-0 z-0 h-full
                  w-full pattern-bg-white pattern-zinc-600 pattern-opacity-10 
                  pattern-size-1 dark:pattern-zinc-400 dark:pattern-bg-bg3Dark"
         />
      </h2>
   );
};
