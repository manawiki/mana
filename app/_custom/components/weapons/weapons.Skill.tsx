import { useState } from "react";
export function WeaponsSkill({ data: full }: { data: any }) {
   const char = full.Weapon;

   const [level, setLevel] = useState(0);

   const name = char?.skill_name;
   const params = char?.skill_params;
   const desc = char?.skill_desc;

   let dispdesc = desc;
   params.forEach((par: any, i: any) => {
      dispdesc = dispdesc?.replace("{" + i + "}", par?.[level]);
   });

   return (
      <>
         {/* Name */}
         {name && (
            <div className="my-2 flex items-center gap-2 px-3 py-1.5 bg-3-sub rounded-lg shadow-sm shadow-1 border border-color-sub font-bold">
               {name}
            </div>
         )}
         {/* Slider */}
         <div className="my-2 flex items-center gap-2 px-3 bg-zinc-50 dark:bg-dark350 rounded-lg shadow-sm shadow-1 border border-color-sub py-2">
            <div className="mr-2 inline-flex align-middle text-zinc-200">
               <div className="text-xs mr-1 text-gray-500 self-center">R</div>
               <input
                  className="text-lg font-bold mr-2 w-6 text-gray-600 dark:text-gray-400 self-center bg-transparent border-0 p-0"
                  value={level + 1}
                  onChange={(event) => {
                     const numonly = /^[0-9\b]+$/;
                     const maxval = 5;

                     // Only set the level slider value if the entered value is not blank or a Number. Parseint as well so leading 0s are removed.
                     if (numonly.test(event.target.value)) {
                        let input = parseInt(event.target.value);
                        if (input > maxval) {
                           input = maxval;
                        } else if (input < 1) {
                           input = 1;
                        }
                        setLevel(input - 1);
                     }
                  }}
               ></input>
            </div>
            <input
               aria-label="Level Slider"
               className="h-1 flex-grow appearance-none justify-end
                              rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
               type="range"
               min="1"
               max={5}
               value={level + 1}
               onChange={(event) => setLevel(parseInt(event.target.value) - 1)}
            ></input>
         </div>

         {/* Description */}
         <div className="my-2 flex items-center gap-2 px-3 py-2.5 bg-3-sub rounded-lg shadow-sm shadow-1 border border-color-sub">
            {dispdesc}
         </div>
      </>
   );
}
