export const Profile = ({ pageData }: any) => {
   const adata = [
      { name: "CN CV", value: pageData.cv_cn },
      { name: "JP CV", value: pageData.cv_jp },
      { name: "KR CV", value: pageData.cv_kr },
      { name: "EN CV", value: pageData.cv_en },
      { name: "Affiliation", value: pageData.camp },
   ];

   return (
      <>
         <h2>Profile</h2>
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
