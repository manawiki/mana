import { useState } from "react";

import type { Servant as ServantType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";

import { Bond } from "~/_custom/components/servants/Bond";

const thformat =
   "p-2 leading-none text-left border border-color-sub bg-zinc-50 dark:bg-zinc-800";
const tdformat = "p-2 leading-none text-center border border-color-sub";

export function AdditionalInfo({ data }: { data: any }) {
   const servant = data.servant;
   return (
      <>
         <Table_Info data={servant} />
         <H2 text="Bond" />
         <Bond data={data} />
      </>
   );
}

function Table_Info({ data: servant }: { data: ServantType }) {
   const info = [
      {
         name: "Cost",
         value: servant?.cost,
      },
      {
         name: "Growth",
         value: servant?.growth_curve?.name,
      },
      {
         name: "Instant Death Chance",
         value: servant?.instant_death_chance,
      },
      {
         name: "Damage Distribution Quick",
         value: servant?.damage_distribution_quick,
      },
      {
         name: "Damage Distribution Arts",
         value: servant?.damage_distribution_arts,
      },
      {
         name: "Damage Distribution Buster",
         value: servant?.damage_distribution_buster,
      },
      {
         name: "Damage Distribution Extra",
         value: servant?.damage_distribution_extra,
      },
      {
         name: "Damage Distribution NP",
         value: servant?.damage_distribution_np,
      },
   ];

   return (
      <>
         <div className="my-1">
            <table className="text-sm w-full ">
               <tbody>
                  {info?.map((irow: any, ind: any) => {
                     return (
                        <>
                           <tr key={"additional_info_" + ind}>
                              <th className={thformat} key={"info_row_" + ind}>
                                 {irow?.name}
                              </th>
                              <td
                                 className={tdformat}
                                 key={"info_value_" + ind}
                              >
                                 {irow?.value}
                              </td>
                           </tr>
                        </>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </>
   );
}
