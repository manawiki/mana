export const Resistances = ({ pageData }: any) => {
   const debuff_resist = pageData.debuff_resist;
   const elem_resist = pageData.damage_resist;
   return (
      <>
         {debuff_resist?.length > 0 ? (
            <>
               <div className="p-1 my-1 font-bold border-b dark:border-gray-700">
                  Debuff Resistances
               </div>

               <div className="">
                  {debuff_resist.map((res: any) => {
                     return (
                        <>
                           <div className="relative rounded-md p-2 my-1 bg-gray-700 bg-opacity-10 inline-block text-center">
                              {/* Weakness Icon & Name */}
                              <div className="relative h-12 w-12 mx-1 inline-block rounded-full bg-gray-800 align-middle">
                                 <img
                                    className="relative inline-block object-contain text-white"
                                    src={res.debuff?.icon?.url}
                                    alt={res.debuff?.name}
                                 />
                              </div>
                              <div className="block align-middle text-xs">
                                 {res.debuff?.name}
                              </div>

                              {/* Weakness value percentage */}
                              <div className="block relative font-bold dark:text-yellow-50 text-yellow-900">
                                 {formatStat("percentage", res.value)}
                              </div>
                           </div>
                        </>
                     );
                  })}
               </div>
            </>
         ) : null}

         {elem_resist?.length > 0 ? (
            <>
               <div className="p-1 my-1 font-bold border-b dark:border-gray-700">
                  Elemental Resistances
               </div>
               <div className="">
                  {elem_resist.map((res: any) => {
                     return (
                        <>
                           <div className="relative rounded-md p-2 m-1 bg-gray-700 bg-opacity-10 inline-block text-center">
                              {/* Weakness Icon & Name */}
                              <div className="relative h-12 w-12 mx-1 inline-block rounded-full bg-gray-800 align-middle">
                                 <img
                                    className="relative inline-block object-contain text-white"
                                    src={res.element?.icon?.url}
                                    alt={res.element?.name}
                                 />
                              </div>
                              <div className="block align-middle text-xs">
                                 {res.element?.name}
                              </div>

                              {/* Weakness value percentage */}
                              <div className="block relative font-bold dark:text-yellow-50 text-yellow-900">
                                 {formatStat("percentage", res.value)}
                              </div>
                           </div>
                        </>
                     );
                  })}
               </div>
            </>
         ) : null}
      </>
   );
};

// =====================================
// Performs Rounding for Stats as Integers or as Percentages as necessary
// =====================================
function formatStat(type: any, stat: any) {
   // These are stats that should be formatted as an Integer.
   var intlist = ["HP", "ATK", "DEF", "Speed", "BaseAggro", "Break"];

   // Apply correct number formatting: Intlist should be rounded, otherwise *100 and display as Percentage of #.0% format
   if (intlist.indexOf(type) > -1) {
      stat = "" + Math.round(stat);
   } else {
      stat = (Math.round(stat * 1000) / 10).toFixed(1) + "%";
   }
   return stat;
}
