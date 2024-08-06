export function ChargeBar({ value }: { value: string | undefined | null }) {
   switch (value) {
      case "20":
      case "_20": {
         return (
            <div className="grid grid-cols-5 gap-2 flex-none w-24">
               <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
            </div>
         );
      }
      case "25":
      case "_25": {
         return (
            <div className="grid grid-cols-4 gap-2 flex-none w-24">
               <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
            </div>
         );
      }
      case "33":
      case "_33": {
         return (
            <div className="grid grid-cols-3 gap-2 flex-none w-24">
               <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
            </div>
         );
      }
      case "50":
      case "_50": {
         return (
            <div className="grid grid-cols-2 gap-2 flex-none w-24">
               <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
               <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
            </div>
         );
      }
      case "100":
      case "_100": {
         return (
            <div className="h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500 w-24" />
         );
      }

      default:
         //Render default element if no custom blocks match
         return;
   }
}
