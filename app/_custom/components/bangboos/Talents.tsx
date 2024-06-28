import type { Agent as AgentType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { useState } from "react";
import { H2 } from "~/components/Headers";

export function Talents({ data: char }: { data: AgentType }) {
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

   const talents = char.talents;

   const [talentLevel, setTalentLevel] = useState(0);

   // Some general CSS stuff
   const skill_desc_header = "font-bold text-lg my-1";
   const toggle_desc_button =
      "text-gray-900 hover:text-white border-2 border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-sm font-bold px-3 py-1 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 cursor-pointer";
   const toggle_stats_button =
      "text-blue-700 hover:text-white border-2 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm font-bold px-3 py-1 text-center dark:border-blue-500 dark:text-gray-400 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 cursor-pointer";

   return (
      <>
         <H2 text="Talents" />
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

         {talents?.map((tl: any) => {
            const talent_icon = tl.icon?.url;
            const talent_name = tl.name;

            const talent_desc = tl.levels[talentLevel]?.desc;
            return (
               <>
                  <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1 flex my-3 justify-between">
                     <div className="flex">
                        {talent_icon != "" ? (
                           <>
                              <div className="inline-block mr-2 rounded-full bg-zinc-300 dark:bg-zinc-700 h-fit">
                                 <Image
                                    height={40}
                                    className="object-contain"
                                    url={talent_icon}
                                    options="height=40"
                                    alt={"Icon"}
                                 />
                              </div>
                           </>
                        ) : null}

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
                        className="dark:brightness-100 brightness-75"
                        dangerouslySetInnerHTML={{ __html: talent_desc }}
                     ></div>
                  </div>
               </>
            );
         })}
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
