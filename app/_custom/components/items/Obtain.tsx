import type { Item as ItemType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";

export function Obtain({ data: fulldata }: { data: ItemType }) {
   const char = fulldata.Item;

   const obtain = char?.obtain_data;

   return (
      <>
         {obtain.length > 0 ? (
            <>
               <H2 text="Obtain Data" />
               <div
                  className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
               >
                  {obtain.map((ob: any, i: number) => (
                     <div
                        className="px-3 py-2 justify-between flex items-center gap-2 text-sm"
                        key={i}
                     >
                        {ob.desc}
                     </div>
                  ))}
               </div>
            </>
         ) : null}
      </>
   );
}
