import { useState } from "react";

export const Effect = ({ pageData }: any) => {
   const [skillLevel, setSkillLevel] = useState(1);

   const skill = pageData.skill_data;

   return (
      <>
         <div>
            <div className="inline-block my-0.5 p-3 rounded-md border border-slate-300 w-full dark:bg-neutral-900 dark:border-neutral-700">
               {/* Node Name */}
               <div className="text-l text-center font-bold">
                  {skill?.[0]?.name}
               </div>

               {/* Slider */}

               <div className="border-t border-b p-1 my-1 border-slate-200 text-center dark:border-neutral-700">
                  <div className="inline-flex align-middle mr-2">
                     Lv {skillLevel}
                  </div>
                  <input
                     className="level-slider align-middle inline-flex justify-end w-4/5 rounded-lg"
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
                  className="mt-2 "
                  dangerouslySetInnerHTML={{
                     __html: skill?.[skillLevel - 1]?.desc,
                  }}
               ></div>
            </div>
         </div>
      </>
   );
};
