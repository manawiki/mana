import { Image } from "~/components";

export const Header = ({ pageData }: any) => {
   const roguebgurl =
      "https://static.mana.wiki/starrail/DecoRogueBuffFrame.png";

   const rarityurl = pageData?.rarity?.icon?.url;
   const imgurl = pageData?.icon?.url;
   const pathname = pageData?.aeon?.path_name;
   const pathurl = pageData?.aeon?.icon_class?.url;

   const maxlv = pageData?.max_level;

   const rarnum =
      pageData?.rarity?.display_number == 3
         ? 5
         : pageData?.rarity?.display_number == 2
         ? 3
         : pageData?.rarity?.display_number;

   return (
      <>
         <div className="grid gap-3 laptop:grid-cols-2">
            {/* ======================== */}
            {/* 1) Main Image div */}
            {/* ======================== */}
            <section>
               <div
                  className={`relative w-full rounded-md bg-gray-100 text-center dark:bg-neutral-900 color-rarity-${rarnum}`}
               >
                  {/* Rarity */}
                  <div className="absolute bottom-1 z-20 h-8 w-full text-center">
                     <Image
                        options="height=40"
                        alt="Stars"
                        className="z-20 inline-block h-8 w-20 rounded-full  object-contain"
                        url={rarityurl}
                     />
                  </div>

                  <div className="absolute flex h-96 w-full items-center justify-center">
                     {/* Main Image */}
                     <div className="inline-flex h-72 w-72">
                        {imgurl ? (
                           <Image
                              options="aspect_ratio=1:1&height=288&width=288"
                              alt="Main Icon"
                              url={imgurl}
                              className="object-contain"
                           />
                        ) : null}
                     </div>
                  </div>

                  {/* RogueBgImage */}
                  <div className="inline-block flex h-96 w-full items-end justify-center">
                     <div className="inline-flex h-auto w-auto">
                        <Image
                           options="height=384"
                           alt="Background"
                           className="object-contain"
                           url={roguebgurl}
                        />
                     </div>
                  </div>
               </div>
            </section>

            {/* ======================== */}
            {/* 2) Character Stat Block Section */}
            {/* ======================== */}
            <section>
               <div className="bg-2 border-color shadow-1 mb-3 flex items-center gap-3 rounded-md border p-2 shadow-sm">
                  <div className="relative h-10 w-10 rounded-full bg-gray-800">
                     <Image
                        options="aspect_ratio=1:1&height=80&width=80"
                        alt="Path Icon"
                        className="relative inline-block object-contain"
                        url={pathurl}
                     />
                  </div>
                  <div className="text-1 font-bold">{pathname}</div>
               </div>

               <div className="divide-color shadow-1 border-color divide-y overflow-hidden rounded-md border shadow-sm">
                  <div
                     className={`
                      ${
                         1 ? "bg-2 relative block" : "bg-1 relative block"
                      } flex items-center px-3 py-2.5`}
                  >
                     {/* 2bi) Stat Icon */}
                     <div className="text-1 flex flex-grow items-center space-x-2 font-bold">
                        <div>Max Level</div>
                     </div>
                     {/* 2biii) Stat value */}
                     <div className="">{maxlv}</div>
                  </div>
               </div>
            </section>
         </div>
      </>
   );
};
