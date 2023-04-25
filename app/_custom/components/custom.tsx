export const H2 = ({ text }: { text: string }) => {
   return (
      <>
         <h2
            className="border-color relative mt-8 overflow-hidden rounded-lg border-2 
         px-4 py-3 shadow-sm shadow-yellow-300/60 dark:shadow-yellow-500/30"
         >
            <div
               className="pattern-dots absolute left-0
                   top-0 h-full
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                     pattern-size-4 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
            ></div>

            {text}
         </h2>
      </>
   );
};
