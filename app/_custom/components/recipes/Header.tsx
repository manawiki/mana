import type { Recipe } from "payload/generated-custom-types";
import { Image } from "~/components/Image";

export const Header = ({ pageData }: { pageData: Recipe }) => {
   const resultitem = pageData?.result_item;

   const rarityurl = resultitem?.rarity?.icon?.url;
   // const rarnum = resultitem?.rarity?.display_number;
   const imgurl = resultitem?.icon?.url;

   const ftypes: any = {
      Normal: "Normal",
      Sepcial: "Special",
      SelectedRelic: "Relic",
   };

   const stats = [
      {
         name: "Recipe Type",
         value: pageData?.formula_type ? ftypes[pageData?.formula_type] : "",
      },
      { name: "Credit Cost", value: pageData?.coin_cost },
      { name: "Equilibrium Lv. Req", value: pageData?.world_level_require },
      { name: "Max Count", value: pageData?.max_count },
   ];

   const tags = (pageData?.item_compose_tag ?? []) as string[];

   return (
      <>
         <div className="grid gap-3 laptop:grid-cols-2">
            {/* ======================== */}
            {/* 1) Main Image div */}
            {/* ======================== */}

            <section>
               <div
                  className="bg-2-sub border-color-sub shadow-1 relative w-full
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
                           options="height=240"
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
                  <div className="divide-color-sub shadow-1 border-color-sub divide-y overflow-hidden rounded-md border shadow-sm">
                     {stats?.map((stat: any, index: any) => (
                        <div
                           key={stat.name}
                           className={`${
                              index % 2 == 1
                                 ? "bg-2-sub relative block"
                                 : "bg-3-sub relative block"
                           } flex items-center px-3 py-2.5`}
                        >
                           {/* 2bi) Stat Icon */}
                           <div className="text-1 flex flex-grow items-center space-x-2 font-bold">
                              <div>{stat.name}</div>
                           </div>
                           {/* 2biii) Stat value */}
                           <div className="">{stat.value}</div>
                        </div>
                     ))}
                  </div>

                  <div
                     className="bg-2-sub border-color-sub shadow-1 mt-3 flex items-center justify-between 
                  gap-3 rounded-md border p-2.5 pl-3 shadow-sm"
                  >
                     <div className="text-1 flex-none font-bold">Tags</div>
                     <div className="flex items-center space-x-2">
                        {tags?.map((t: any) => (
                           <div
                              key={t}
                              className="border-color shadow-1 bg-3 m-1 rounded-md border px-2 py-1 text-xs shadow-sm"
                           >
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
