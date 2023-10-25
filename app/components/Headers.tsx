export const H2 = ({ text }: { text: string | undefined }) => {
   return (
      <h2
         className="shadow-1 border-color relative mb-2.5 mt-8 overflow-hidden rounded-lg
      border-2 font-header text-xl font-bold shadow-sm shadow-zinc-50 dark:bg-dark350"
      >
         <div
            className="pattern-dots absolute left-0
                   top-0 -z-0 h-full
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                     pattern-size-4 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
         />
         <div className="relative h-full w-full px-3.5 py-2.5">{text}</div>
      </h2>
   );
};

export const H3 = ({ text }: { text: string | undefined }) => {
   return (
      <h3 className="flex items-center gap-3 py-2 font-header text-lg">
         <div className="min-w-[10px] flex-none">{text}</div>
         <div
            contentEditable={false}
            className="h-0.5 w-full rounded-full bg-zinc-100 dark:bg-dark400"
         ></div>
      </h3>
   );
};
