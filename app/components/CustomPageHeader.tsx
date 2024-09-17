import { Avatar } from "./Avatar";

export function CustomPageHeader({
   name,
   iconUrl,
}: {
   name: string;
   iconUrl?: string;
}) {
   return (
      <div
         className="bg-gradient-to-t from-zinc-100 to-transparent dark:from-dark350 dark:to-bg3Dark relative border-b
         border-color dark:border-zinc-700/50 dark:shadow-zinc-800/50 shadow-zinc-50 shadow-sm max-laptop:px-3"
      >
         <div className="relative z-20 mx-auto max-w-[728px] justify-baseline pb-3 pt-3.5">
            <div className="flex items-end justify-between gap-3">
               <h1 className="font-header font-semibold text-xl">{name}</h1>
               <Avatar
                  src={iconUrl}
                  className="size-10 bg-3 flex-none"
                  options="aspect_ratio=1:1&height=128&width=128"
               />
            </div>
         </div>
         <span
            className="pattern-dots absolute left-0 top-0 -z-0 h-full
          w-full pattern-bg-white pattern-zinc-800 pattern-opacity-10 
          pattern-size-1 dark:pattern-zinc-400 dark:pattern-bg-bg3Dark"
         />
         <span
            className="bg-gradient-to-b dark:from-dark350 dark:to-bg3Dark/60 
            from-white/80 to-white/60
                w-full h-full absolute top-0 left-0 z-0"
         />
      </div>
   );
}
