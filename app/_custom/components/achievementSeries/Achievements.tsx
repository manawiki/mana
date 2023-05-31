import { Check, Circle } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { Image } from "~/components";

export const Achievements = ({ pageData }: any) => {
   return (
      <section className="divide-color shadow-1 bg-2 border-color divide-y overflow-hidden rounded-lg border shadow-sm">
         {pageData?.map((a: any) => {
            const [checked, setChecked] = useState(null);
            useEffect(() => {
               setChecked(
                  JSON.parse(
                     localStorage.getItem(
                        "HSR_manawiki_achievement-" + a?.data_key
                     )
                  )
               );
            }, []);

            return (
               <>
                  <div className="flex items-center justify-between gap-3 p-2">
                     {/* Checkbox section */}
                     <div
                        className={`shadow-1 flex h-8 w-8 flex-none cursor-pointer items-center 
                        justify-center rounded-lg border-2 shadow-md hover:bg-green-50 dark:hover:bg-zinc-800 ${
                        checked
                              ? "border-green-300 dark:border-green-800"
                              : "border-zinc-200 dark:border-zinc-700"
                        }`}
                        onClick={() => {
                        localStorage.setItem(
                           "HSR_manawiki_achievement-" + a?.data_key,
                           JSON.stringify(!checked)
                        );

                        setChecked(!checked);
                        }}
                     >
                        {checked ? (
                        <Check className="text-green-500" size={16} />
                        ) : (
                        <></>
                        )}
                     </div>

                     {/* Achievement Description section */}
                     <div className="space-y-0.5 text-sm flex-grow">
                        <div className="font-bold">{a.name}</div>
                        <div
                           className="text-1"
                           dangerouslySetInnerHTML={{ __html: a.description }}
                        ></div>
                     </div>
                     
                     {/* Achievement Reward section */}
                     { /* TODO(dim): This pattern works for now but should use the Quest reward instead! */ }
                     <div className="flex items-center gap-1">
                        <JadeReward qty={a.rarity === "Mid" ? 10 : a.rarity === "Low" ? 5 : a.rarity === "High" ? 20 : 0} />
                     </div>
                  </div>
               </>
            );
         })}
      </section>
   );
};


const JadeReward = ({ qty }: { qty: number }) => {
   return (
      <div className="relative inline-block text-center" key="900001">
         <a href={`/starrail/collections/materials/900001`}>
            <div className="relative mr-0.5 mt-0.5 inline-block h-11 w-11 align-middle text-xs">
               <img
                  src="https://static.mana.wiki/starrail/ItemIcon_900001.png"
                  className={`object-contain color-rarity-5 material-frame`}
                  alt="Stellar Jade"
               />
            </div>
            <div
               className={`relative mr-0.5 w-11 rounded-b-sm border-b border-gray-700 bg-bg1Dark align-middle text-white text-xs
               }`}
            >
               {qty}
            </div>
         </a>
      </div>
   );
};