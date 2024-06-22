import { Fragment } from "react";
import { Image } from "~/components/Image";

export function EchoesSonata({ data }: { data: any }) {
   const sonata_list = data.data.Echo.sonata_effect_pool;

   return (
      <>
         {sonata_list?.map((sonata: any) => (
            <SonataEffect sonata={sonata} key={sonata?.name} />
         ))}
      </>
   );
}

const SonataEffect = ({ sonata }: { sonata: any }) => {
   const sonata_icon = sonata.icon?.url;
   const sonata_name = sonata?.name;
   const sonata_effects = sonata?.effects;
   const sonata_color = sonata?.color;
   return (
      <div className="border-color-sub bg-2-sub shadow-1 overflow-hidden rounded-lg border shadow-sm">
         {/* Header with Sonata Icon and Name */}
         <div className="bg-3-sub relative flex items-center gap-3 p-3 border-b border-color-sub">
            <div className="bg-zinc-800 dark:bg-transparent rounded-full">
               <div
                  style={{
                     //@ts-ignore
                     "border-color": `#${sonata_color}`,
                     "background-color": `#${sonata_color}44`,
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2"
               >
                  <Image
                     options="aspect_ratio=1:1&height=80&width=80"
                     className="object-contain"
                     url={sonata_icon}
                     alt={sonata_name}
                     loading="lazy"
                  />
               </div>
            </div>
            <div className="space-y-1">
               <div className="font-bold">{sonata_name}</div>
            </div>
         </div>

         {/* Set Effects */}
         <div className="border-color-sub border-t p-3 text-sm">
            {sonata_effects?.map((effect: any, j: number) => {
               let dispdesc = effect.effect;
               effect.params.map((par: any, i: any) => {
                  dispdesc = dispdesc?.replace("{" + i + "}", par);
               });

               return (
                  <Fragment key={j}>
                     <div className="font-bold">{effect.pieces}-Set: </div>
                     <div
                        className=""
                        dangerouslySetInnerHTML={{
                           __html: dispdesc ?? "",
                        }}
                     ></div>
                  </Fragment>
               );
            })}
         </div>
      </div>
   );
};
