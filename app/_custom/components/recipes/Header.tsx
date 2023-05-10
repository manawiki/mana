import { Image } from "~/components";

export const Header = ({ pageData }: any) => {
   const resultitem = pageData?.result_item;

   const rarityurl = resultitem?.rarity?.icon?.url;
   const rarnum = resultitem?.rarity?.display_number;
   const imgurl = resultitem?.icon?.url;

   const ftypes: any = {
      Normal: "Normal",
      Sepcial: "Special",
      SelectedRelic: "Relic",
   };

   const stats = [
      { name: "Recipe Type", value: ftypes[pageData?.formula_type] },
      { name: "Credit Cost", value: pageData?.coin_cost },
      { name: "Equilibrium Lv. Req", value: pageData?.world_level_require },
      { name: "Max Count", value: pageData?.max_count },
   ];

   const tags = pageData?.item_compose_tag;

   return (
      <>
         <div className="grid gap-3 laptop:grid-cols-2">
            {/* ======================== */}
            {/* 1) Main Image div */}
            {/* ======================== */}

            <section>
               <div
                  className="bg-2 border-color shadow-1 relative w-full
                rounded-lg border text-center shadow-sm"
               >
                  {/* Rarity */}
                  <div className="absolute bottom-4 left-4 z-20 flex h-8 items-center rounded-full bg-zinc-300 px-2 py-1 dark:bg-bg1Dark">
                     <Image options="height=100" alt="Rarity" url={rarityurl} />
                  </div>

                  <div className="relative inline-block h-56 w-full text-center">
                     {/* Main Image */}
                     {imgurl ? (
                        <Image
                           alt="Materials Icon"
                           url={imgurl}
                           className="absolute h-56 w-full object-contain"
                        />
                     ) : null}
                  </div>
               </div>
            </section>

            {/* ======================== */}
            {/* 2) Character Stat Block Section */}
            {/* ======================== */}
            <section>
               <div>
                  <div className="divide-y overflow-hidden rounded-md border dark:divide-neutral-700 dark:border-neutral-700">
                     {stats?.map((stat: any, index: any) => {
                        return (
                           <>
                              <div
                                 className={`
                     /*2b) Alternating background stats for 5 or 6 stats depending on bonus stat */
                     ${
                        index % 2 == 1
                           ? "relative block bg-gray-50 dark:bg-neutral-800"
                           : "relative block bg-gray-100 dark:bg-neutral-900"
                     } flex items-center p-2 px-3`}
                              >
                                 {/* 2bi) Stat Icon */}
                                 <div className="flex flex-grow items-center space-x-2">
                                    <div>{stat.name}</div>
                                 </div>
                                 {/* 2biii) Stat value */}
                                 <div className="">{stat.value}</div>
                              </div>
                           </>
                        );
                     })}
                  </div>

                  <div className="mt-1.5 flex rounded-md border bg-gray-50 p-3 dark:border-neutral-700 dark:bg-neutral-900">
                     <div className="flex flex-grow items-center space-x-2">
                        Tags
                     </div>
                     <div className="flex flex-grow items-center space-x-2">
                        {tags?.map((t: any) => (
                           <div className="px-2 py-1 m-1 rounded-md border border-color bg-gray-500 bg-opacity-30 text-xs">
                              {t}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </>
   );
};
