import { useState } from "react";

import type { LightCone } from "payload/generated-custom-types";

export const Effect = ({ data }: { data: LightCone }) => {
   const [skillLevel, setSkillLevel] = useState(1);

   const skill = data.skill_data;

   return (
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
            <div className="flex w-full items-center gap-2 px-3 py-2.5">
               <div className="mr-2 inline-flex align-middle ">
                  Lv. {skillLevel}
               </div>
               <input
                  aria-label="Level Slider"
                  type="range"
                  min="1"
                  className="flex-grow"
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
   );
};
