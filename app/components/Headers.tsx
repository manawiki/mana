import clsx from "clsx";

export const H2 = ({ text }: { text: string | undefined }) => {
   return (
      <h2
         className="dark:shadow-zinc-800/50 border-color relative mb-2.5 mt-8 overflow-hidden rounded-lg
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

export const H2Plain = ({
   text,
   className,
}: {
   text: string | undefined | null;
   className?: string;
}) => {
   return (
      <h2
         className={clsx(
            className,
            "flex items-center gap-3 py-2 font-header text-xl scroll-mt-32 laptop:scroll-mt-16",
         )}
      >
         <div className="flex-none">{text}</div>
         <div className="h-0.5 w-full rounded-full bg-zinc-100 dark:bg-dark400" />
      </h2>
   );
};
