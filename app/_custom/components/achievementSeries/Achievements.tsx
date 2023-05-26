import { Check, Circle } from "lucide-react";
import { useState, useEffect } from "react";

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
                  <div className="group flex items-start gap-4 px-4 py-3">
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
                     <div className="space-y-0.5 text-sm">
                        <div className="font-bold">{a.name}</div>
                        <div
                           className="text-1"
                           dangerouslySetInnerHTML={{ __html: a.description }}
                        ></div>
                     </div>
                  </div>
               </>
            );
         })}
      </section>
   );
};
