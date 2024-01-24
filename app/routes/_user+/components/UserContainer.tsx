export function UserContainer({
   title,
   children,
}: {
   title: string;
   children: React.ReactNode;
}) {
   return (
      <>
         <div
            className="border-b border-color-sub w-full py-3 relative 
            bg-zinc-50 dark:bg-dark400 shadow-sm shadow-zinc-100 dark:shadow-zinc-800/50"
         >
            <div className="max-tablet:px-3 tablet:w-[728px] text-lg mx-auto font-bold font-header z-10 relative">
               {title}
            </div>
            <div
               className="pattern-dots absolute inset-0 z-0 h-full
          w-full pattern-bg-white pattern-zinc-500 pattern-opacity-10 
          pattern-size-1 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
            />
         </div>
         <main className="max-tablet:px-3 tablet:w-[728px] tablet:mx-auto py-5">
            {children}
         </main>
      </>
   );
}
