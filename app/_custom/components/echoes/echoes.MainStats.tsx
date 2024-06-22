import { Image } from "~/components/Image";

export function EchoesMainStats({ data }: { data: any }) {
   // console.log(data);
   const main = data.data.EchoMainSubStats.docs?.find(
      (a: any) => a.name == "main-1",
   )?.stats;

   return (
      <>
         {main?.map((mstat: any) => (
            <div
               className="inline-block  bg-zinc-50 dark:bg-dark350 rounded-lg shadow-sm shadow-1 border border-color-sub py-1 m-2 "
               key={mstat.name}
            >
               {mstat.icon ? (
                  <>
                     <div className="items-center inline-block align-middle rounded-md justify-center dark:bg-dark350 bg-zinc-600 h-full mr-2">
                        <Image
                           width={30}
                           height={30}
                           className="object-contain"
                           url={mstat?.icon?.url}
                           options="width=30"
                           alt={mstat.name ?? "Icon"}
                        />
                     </div>
                  </>
               ) : null}
               <div className="inline-block">{mstat.name}</div>
            </div>
         ))}
      </>
   );
}
