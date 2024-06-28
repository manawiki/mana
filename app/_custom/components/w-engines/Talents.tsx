import { useState } from "react";

import type { WEngine as WEngineType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";

export function Talents({ data: char }: { data: WEngineType }) {
   const desc_icons = [
      {
         id: "Icon_Normal",
         icon: "https://static.mana.wiki/zzz/IconRoleSkillKeyNormal.png",
      },
      {
         id: "Icon_Special",
         icon: "https://static.mana.wiki/zzz/IconRoleSkillKeySpecial.png",
      },
      {
         id: "Icon_Evade",
         icon: "https://static.mana.wiki/zzz/IconRoleSkillKeyEvade.png",
      },
      {
         id: "Icon_Ultimate",
         icon: "https://static.mana.wiki/zzz/IconRoleSkillKeyUltimate.png",
      },
      {
         id: "Icon_Switch",
         icon: "https://static.mana.wiki/zzz/IconRoleSkillKeySwitch.png",
      },
      {
         id: "Icon_JoyStick",
         icon: "https://static.mana.wiki/zzz/IconRoleSkillKeyJoyStick.png",
      },
   ];

   const talents = char.talent;

   const [talentLevel, setTalentLevel] = useState(0);

   // Some general CSS stuff
   const talent_name = char.talent_title;
   const talent_desc = talents[talentLevel]?.desc;

   return (
      <>
         <H2 text="Talent" />
         {/* Slider */}
         {talents?.length > 0 ? (
            <>
               <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1  mt-2 p-1 flex items-center">
                  <div className="text-lg mx-2">Lv{talentLevel + 1}</div>
                  <input
                     aria-label="Level Slider"
                     className="h-1 w-full
                               rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
                     type="range"
                     min="0"
                     max={4}
                     value={talentLevel}
                     onChange={(event) =>
                        setTalentLevel(parseInt(event.target.value))
                     }
                  ></input>
               </div>
            </>
         ) : null}

         <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1 flex my-3 justify-between">
            <div className="flex">
               <div className="inline-block mr-2 col-span-11 self-center">
                  {/* Header */}
                  <div className="">
                     <div className="font-bold inline-block mr-2 text-2xl">
                        {talent_name}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Description */}

         <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-2  mt-2">
            <div
               className="dark:brightness-100 brightness-7"
               dangerouslySetInnerHTML={{ __html: talent_desc }}
            ></div>
         </div>
      </>
   );
}

{
   /* Slider */
}

{
   /* <input
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
                  ></input> */
}
