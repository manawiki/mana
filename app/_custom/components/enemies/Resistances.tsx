import type { Enemy } from "payload/generated-custom-types";

export const Resistances = ({
   pageData,
   version,
}: {
   pageData: Enemy;
   version: number;
}) => {
   const debuff_resist = pageData?.enemy_variations?.[version]?.debuff_resist;
   const elem_resist = pageData?.enemy_variations?.[version]?.damage_resist;

   if (!debuff_resist && !elem_resist) <div className="px-2">N/A</div>;

   return (
      <>
         {debuff_resist && debuff_resist?.length > 0 ? (
            <>
               <div className="my-1 border-b p-1 font-bold dark:border-gray-700">
                  Debuff Resistances
               </div>

               <div className="">
                  {debuff_resist.map((res) => (
                     <div
                        key={res.debuff?.name}
                        className="relative my-1 inline-block rounded-md bg-gray-700 bg-opacity-10 p-2 text-center"
                     >
                        {/* Weakness Icon & Name */}
                        <div className="relative mx-1 inline-block h-12 w-12 rounded-full bg-gray-800 align-middle">
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
                        <div className="relative block font-bold text-yellow-900 dark:text-yellow-50">
                           {res.value && formatStat("percentage", res.value)}
                        </div>
                     </div>
                  ))}
               </div>
            </>
         ) : null}

         {elem_resist && elem_resist?.length > 0 ? (
            <>
               <div className="my-1 border-b p-1 font-bold dark:border-gray-700">
                  Elemental Resistances
               </div>
               <div className="">
                  {elem_resist.map((res) => (
                     <div
                        key={res.element?.name}
                        className="relative m-1 inline-block rounded-md bg-gray-700 bg-opacity-10 p-2 text-center"
                     >
                        {/* Weakness Icon & Name */}
                        <div className="relative mx-1 inline-block h-12 w-12 rounded-full bg-gray-800 align-middle">
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
                        <div className="relative block font-bold text-yellow-900 dark:text-yellow-50">
                           {res?.value && formatStat("percentage", res.value)}
                        </div>
                     </div>
                  ))}
               </div>
            </>
         ) : null}
      </>
   );
};

// =====================================
// Performs Rounding for Stats as Integers or as Percentages as necessary
// =====================================
function formatStat(type: string, stat: number) {
   // These are stats that should be formatted as an Integer.
   var intlist = ["HP", "ATK", "DEF", "Speed", "BaseAggro", "Break"];

   // Apply correct number formatting: Intlist should be rounded, otherwise *100 and display as Percentage of #.0% format
   if (intlist.indexOf(type) > -1) {
      return "" + Math.floor(Math.round(stat * 100) / 100);
   } else {
      return (
         (Math.floor(Math.round(stat * 100000) / 10) / 100).toFixed(1) + "%"
      );
   }
}
