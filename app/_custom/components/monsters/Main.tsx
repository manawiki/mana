import type { Item as ItemType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";

export function Main({ data: fulldata }: { data: ItemType }) {
   const char = fulldata;

   const mainImage = char?.icon?.url;
   const mainName = char?.name;
   const mainDesc = char?.fight_desc;
   var fullDesc = char?.desc;
   fullDesc = fullDesc.replace(/(<br\s*\/?>){3,}/gi, "<br/><br/>");

   return (
      <>
         <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4">
            <section>
               <div className="flex items-center justify-center shadow-sm shadow-1 border border-color-sub rounded-lg dark:bg-dark350 bg-zinc-50 h-full p-3">
                  <Image
                     height={280}
                     width={280}
                     className="object-contain"
                     url={
                        mainImage ??
                        "https://static.mana.wiki/zzz/Run2_00016.png"
                     }
                     alt={mainName ?? "Icon"}
                  />
               </div>
            </section>
            <section>
               <div
                  className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
               >
                  {/* Description */}
                  {mainDesc == "" ? null : (
                     <div className="px-3 py-2 justify-between flex items-center gap-2 text-sm">
                        {mainDesc}
                     </div>
                  )}
                  {fullDesc != "" ? (
                     <>
                        <div
                           className="px-3 py-2 items-center gap-2 text-sm"
                           dangerouslySetInnerHTML={{ __html: fullDesc }}
                        ></div>
                     </>
                  ) : null}
               </div>
            </section>
         </div>
      </>
   );
}
