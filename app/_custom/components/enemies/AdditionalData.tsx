import type { Enemy } from "payload/generated-custom-types";

export const AdditionalData = ({
   pageData,
   version,
}: {
   pageData: Enemy;
   version: number;
}) => {
   // Update pageData to use active version of enemy's data:
   const enemyData = pageData?.enemy_variations?.[version];
   const adata = [
      { name: "Hard Level Group", value: enemyData?.hard_level_group },
      { name: "Elite Group", value: enemyData?.elite_group },
      { name: "Rank", value: enemyData?.rank },
      { name: "Stance Count", value: enemyData?.stance_count },
      { name: "Initial Delay Ratio", value: enemyData?.initial_delay_ratio },
      { name: "Crit Damage Base", value: enemyData?.crit_damage_base },
      { name: "Min Fatigue Ratio", value: enemyData?.min_fatigue_ratio },
   ];

   return (
      <>
         <div className="divide-y overflow-hidden rounded-md border dark:divide-neutral-700 dark:border-neutral-700">
            {adata.map((stat, index) => {
               return (
                  <div
                     className={`
                      /*2b) Alternating background stats for 5 or 6 stats depending on bonus stat */
                      ${
                         index % 2 == 0
                            ? "relative block bg-gray-50 dark:bg-neutral-800"
                            : "relative block bg-gray-100 dark:bg-neutral-900"
                      } flex items-center p-2`}
                     key={index}
                  >
                     {/* 2bi) Stat Icon */}
                     <div className="flex flex-grow items-center space-x-2">
                        <div>{stat?.name}</div>
                     </div>
                     {/* 2biii) Stat value */}
                     <div className="">{stat?.value}</div>
                  </div>
               );
            })}
         </div>
      </>
   );
};
