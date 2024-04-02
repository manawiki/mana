export function ChargeBar({ value }: { value: string | undefined }) {
   switch (value) {
      case "_20": {
         return (
            <div className="grid grid-cols-5 gap-2 flex-none w-24">
               <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            </div>
         );
      }
      case "_25": {
         return (
            <div className="grid grid-cols-4 gap-2 flex-none w-24">
               <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            </div>
         );
      }
      case "_33": {
         return (
            <div className="grid grid-cols-3 gap-2 flex-none w-24">
               <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            </div>
         );
      }
      case "_50": {
         return (
            <div className="grid grid-cols-2 gap-2 flex-none w-24">
               <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            </div>
         );
      }
      case "_100": {
         return (
            <div className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 w-24" />
         );
      }

      default:
         //Render default element if no custom blocks match
         return;
   }
}
