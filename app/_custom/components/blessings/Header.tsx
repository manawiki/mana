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
            <div>
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
            </div>

            {/* ======================== */}
            {/* 2) Character Stat Block Section */}
            {/* ======================== */}
            <div>
               <div className="mb-3 flex rounded-md border bg-gray-50 p-3 dark:border-neutral-700 dark:bg-neutral-900">
                  <div className="flex flex-grow items-center space-x-2">
                     <div className="relative h-10 w-10 rounded-full bg-gray-800">
                        <Image
                           options="aspect_ratio=1:1&height=40&width=40"
                           alt="Path Icon"
                           className="relative inline-block object-contain"
                           url={pathurl}
                        />
                     </div>
                  </div>
                  <div className="flex flex-grow items-center space-x-2">
                     {pathname}
                  </div>
               </div>

               <div className="divide-y overflow-hidden rounded-md border dark:divide-neutral-700 dark:border-neutral-700">
                  <div
                     className={`
                      /*2b) Alternating background stats for 5 or 6 stats depending on bonus stat */
                      ${
                         1
                            ? "relative block bg-gray-50 dark:bg-neutral-800"
                            : "relative block bg-gray-100 dark:bg-neutral-900"
                      } flex items-center p-2`}
                  >
                     {/* 2bi) Stat Icon */}
                     <div className="flex flex-grow items-center space-x-2">
                        <div>Max Level</div>
                     </div>
                     {/* 2biii) Stat value */}
                     <div className="">{maxlv}</div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};
