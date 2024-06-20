import { useState } from "react";

import type { Servant as ServantType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";

const thformat =
  "p-2 leading-none text-left border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800";
const tdformat =
  "p-2 leading-none text-center border border-zinc-200 dark:border-zinc-700";

export function AdditionalInfo({ data: servant }: { data: ServantType }) {
  return (
    <>
      <Table_Info data={servant} />
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
                    <td className={tdformat} key={"info_value_" + ind}>
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
