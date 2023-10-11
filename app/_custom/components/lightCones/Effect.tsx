import { useState } from "react";

import type { LightCone } from "payload/generated-custom-types";
import { H2, H2Default } from "~/components/H2";

export const Effect = ({ pageData }: { pageData: LightCone }) => {
   const [skillLevel, setSkillLevel] = useState(1);

   const skill = pageData.skill_data;

   return (
      <>
         <H2Default text="Effect" />
         <div
            className="bg-2-sub divide-color-sub border-color-sub shadow-1 mb-4 
      divide-y-4 overflow-hidden rounded-lg border shadow-sm"
         >
            <div>
               {/* Node Name */}
               <div className="bg-3-sub relative flex items-center gap-3 px-3 py-2.5">
                  <div className="font-bold">{skill?.[0]?.name}</div>
               </div>

               {/* Slider */}
               <div className="border-color-sub flex w-full items-center gap-2 border-y px-3 py-2.5">
                  <div className="mr-2 inline-flex align-middle ">
                     Lv. {skillLevel}
                  </div>
                  <input
                     aria-label="Level Slider"
                     className="h-1 flex-grow appearance-none justify-end
                     rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
                     type="range"
                     min="1"
                     max={skill?.length}
                     value={skillLevel}
                     onChange={(event) =>
                        setSkillLevel(parseInt(event.target.value))
                     }
                  ></input>
               </div>

               {/* Node Description */}
               <div
                  className="border-color-sub border-t p-3 text-sm"
                  dangerouslySetInnerHTML={{
                     __html: skill?.[skillLevel - 1]?.desc ?? "",
                  }}
               ></div>
            </div>
         </div>
      </>
   );
};
