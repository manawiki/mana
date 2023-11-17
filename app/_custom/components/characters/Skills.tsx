import type { Character as CharacterType } from "payload/generated-custom-types";
import { H2, Image } from "~/components";
import { useState } from "react";

export function Skills({ data: char }: { data: CharacterType }) {
   const skills = char?.skills;
   return (
      <>
         <H2 text="Skills" />
         <div
            dangerouslySetInnerHTML={{
               __html: `<style>
                                  div.endfield-skill-description > span {
                                     background-color: rgb(50,50,50);
                                     padding-top: 2px;
                                     padding-right: 2px;
                                     padding-left: 2px;
                                     padding-bottom: 1px;
                                     margin-right: 2px;
                                     margin-left: 2px;
                                     border-radius: 2px;
                                  }
                               </style>`,
            }}
         ></div>
         {skills?.map((sk: any) => {
            const [skillLevel, setSkillLevel] = useState(0);

            const s = sk.skill;
            console.log(skillLevel);
            return (
               <>
                  <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1 grid grid-cols-12 gap-2 my-3">
                     <div className="inline-block mr-2 rounded-full bg-zinc-300 dark:bg-zinc-700 h-fit">
                        <Image
                           height={50}
                           className="object-contain"
                           url={s.icon?.url}
                           options="height=50"
                           alt={"SkillIcon"}
                        />
                     </div>
                     <div className="inline-block mr-2 col-span-11">
                        {/* Header */}
                        <div className="">
                           <div className="font-bold inline-block mr-2">
                              {s?.name}
                           </div>
                           <div className="inline-block mr-2 text-xs">
                              Lv: {s?.levels[skillLevel].level}
                           </div>
                           <div className="inline-block mr-2 text-xs">
                              Cost: {s?.levels[skillLevel].cost_val}
                           </div>
                           <div className="inline-block mr-2 text-xs">
                              CD: {s?.levels[skillLevel].cool_down}
                           </div>
                           <div className="inline-block mr-2 text-xs">
                              Max Charge Time:{" "}
                              {s?.levels[skillLevel].max_charge_time}
                           </div>
                        </div>

                        {/* Slider */}
                        {s?.levels?.length - 1 > 0 ? (
                           <input
                              aria-label="Level Slider"
                              className="h-1 w-full
                               rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
                              type="range"
                              min="0"
                              max={s?.levels?.length - 1}
                              value={skillLevel}
                              onChange={(event) =>
                                 setSkillLevel(parseInt(event.target.value))
                              }
                           ></input>
                        ) : null}

                        {/* Description */}
                        <div
                           className="text-sm mt-2 p-1 endfield-skill-description"
                           dangerouslySetInnerHTML={{
                              __html: `${s.levels[skillLevel].description}`,
                           }}
                        ></div>
                     </div>
                  </div>
               </>
            );
         })}
      </>
   );
}
