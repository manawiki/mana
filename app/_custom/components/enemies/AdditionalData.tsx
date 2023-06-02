export const AdditionalData = ({ pageData, version }: any) => {
   // Update pageData to use active version of enemy's data:
   pageData = pageData.enemy_variations[version];
   const adata = [
      { name: "Hard Level Group", value: pageData.hard_level_group },
      { name: "Elite Group", value: pageData.elite_group },
      { name: "Rank", value: pageData.rank },
      { name: "Stance Count", value: pageData.stance_count },
      { name: "Initial Delay Ratio", value: pageData.initial_delay_ratio },
      { name: "Crit Damage Base", value: pageData.crit_damage_base },
      { name: "Min Fatigue Ratio", value: pageData.min_fatigue_ratio },
   ];

   return (
      <>
         <div className="border divide-y dark:divide-neutral-700 dark:border-neutral-700 rounded-md overflow-hidden">
            {adata.map((stat: any, index: any) => {
               return (
                  <div
                     className={`
                      /*2b) Alternating background stats for 5 or 6 stats depending on bonus stat */
                      ${
                         index % 2 == 0
                            ? "block relative bg-gray-50 dark:bg-neutral-800"
                            : "block relative bg-gray-100 dark:bg-neutral-900"
                      } p-2 flex items-center`}
                     key={index}
                  >
                     {/* 2bi) Stat Icon */}
                     <div className="flex flex-grow items-center space-x-2">
                        <div>{stat.name}</div>
                     </div>
                     {/* 2biii) Stat value */}
                     <div className="">{stat.value}</div>
                  </div>
               );
            })}
         </div>
      </>
   );
};
