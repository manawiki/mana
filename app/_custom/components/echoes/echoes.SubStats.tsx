import { Image } from "~/components/Image";

export function EchoesSubStats({ data }: { data: any }) {
   const sub = data.data.EchoMainSubStats.docs?.find(
      (a: any) => a.name == "sub-1",
   )?.stats;

   return (
      <>
         {sub?.map((stat: any) => (
            <div
               className="inline-block bg-zinc-50 dark:bg-dark350 rounded-lg shadow-sm shadow-1 border border-color-sub py-1 m-2 "
               key={stat.name}
            >
               {stat.icon ? (
                  <>
                     <div className="items-center inline-block align-middle rounded-md justify-center dark:bg-dark350 bg-zinc-600 h-full mr-2">
                        <Image
                           width={30}
                           height={30}
                           className="object-contain"
                           url={stat?.icon?.url}
                           options="width=30"
                           alt={stat.name ?? "Icon"}
                        />
                     </div>
                  </>
               ) : null}
               <div className="inline-block">{stat.name}</div>
            </div>
         ))}
      </>
   );
}
