import { useState } from "react";

import type { Agent as AgentType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

export function Skills({ data: char }: { data: AgentType }) {
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

   const skills = [
      {
         id: "Basic Attack",
         icon: "https://static.mana.wiki/zzz/SkillNormal.png",
         skill: char.skill_basic,
      },
      {
         id: "Dodge",
         icon: "https://static.mana.wiki/zzz/SkillEvade.png",
         skill: char.skill_dodge,
      },
      {
         id: "Special Attack",
         icon: "https://static.mana.wiki/zzz/SkillSpecial.png",
         skill: char.skill_special,
      },
      {
         id: "Chain Attack",
         icon: "https://static.mana.wiki/zzz/SkillQTE.png",
         skill: char.skill_chain,
      },
      { id: "Core Skills", icon: "", skill: char.skill_core },
   ];

   // Some general CSS stuff
   const skill_desc_header = "font-bold text-lg my-1";
   const toggle_desc_button =
      "text-gray-900 hover:text-white border-2 border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-sm font-bold px-3 py-1 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 cursor-pointer";
   const toggle_stats_button =
      "text-blue-700 hover:text-white border-2 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm font-bold px-3 py-1 text-center dark:border-blue-500 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 cursor-pointer";

   return (
      <>
         <H2 text="Skills" />
         <div
            dangerouslySetInnerHTML={{
               __html: `<style>
                                  div.zzz-skill-description > span {
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
            const [tab, setTab] = useState(false); // false = Description, true = Stats

            const skill_icon = sk.icon;
            const skill_name = sk.id;

            const desc_list = sk.skill?.description;
            const stat_list = sk.skill?.stats;
            return (
               <>
                  <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1 flex my-3 justify-between">
                     <div className="flex">
                        {skill_icon != "" ? (
                           <>
                              <div className="inline-block mr-2 rounded-full bg-zinc-300 dark:bg-zinc-700 h-fit">
                                 <Image
                                    height={40}
                                    className="object-contain"
                                    url={skill_icon}
                                    options="height=40"
                                    alt={"SkillIcon"}
                                 />
                              </div>
                           </>
                        ) : null}

                        <div className="inline-block mr-2 col-span-11 self-center">
                           {/* Header */}
                           <div className="">
                              <div className="font-bold inline-block mr-2 text-2xl">
                                 {skill_name}
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Toggle for Desc/Stat! */}
                     <div
                        className={`self-center ${
                           tab ? toggle_desc_button : toggle_stats_button
                        }`}
                        onClick={() => setTab(!tab)}
                     >
                        {tab ? "Description" : "Stats"}
                     </div>
                  </div>

                  {/* Stats */}
                  {tab ? (
                     <>
                        <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1  mt-2 p-1 flex items-center">
                           <div className="text-lg mx-2">
                              Lv{skillLevel + 1}
                           </div>
                           <input
                              aria-label="Level Slider"
                              className="h-1 w-full
                               rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
                              type="range"
                              min="0"
                              max={6}
                              value={skillLevel}
                              onChange={(event) =>
                                 setSkillLevel(parseInt(event.target.value))
                              }
                           ></input>
                        </div>
                        <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1  mt-2 p-1">
                           {stat_list?.map((stat: any, i: any) => {
                              // skillLevel should start at 0
                              return (
                                 <>
                                    {stat.params?.length != 0 ? (
                                       // Has parameters!
                                       <>
                                          <div className="bg-zinc-200 dark:bg-dark450 rounded-full w-full px-3 py-1 flex justify-between my-1">
                                             <div>{stat.title}</div>
                                             <div>
                                                {stat.params[skillLevel]}
                                             </div>
                                          </div>
                                       </>
                                    ) : (
                                       // No parameters
                                       <>
                                          {/* Spacer for additional headers */}
                                          {i > 1 ? (
                                             <div className="w-full mt-3"></div>
                                          ) : null}
                                          <div className={skill_desc_header}>
                                             {stat.title}
                                          </div>
                                       </>
                                    )}
                                 </>
                              );
                           })}
                        </div>
                     </>
                  ) : (
                     <>
                        {/* Description */}

                        <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1  mt-2 p-1">
                           {desc_list?.map((desc: any) => {
                              var display = desc.desc;

                              // Description parsing: Replace instances of <IconMap:Icon_Special> etc. with correct icon image
                              const icon_ids = display
                                 .split("<IconMap:")
                                 .slice(1)
                                 .map((a) => a.replace(/\>.*/g, ""));
                              for (var i in icon_ids) {
                                 const curr = icon_ids[i];
                                 const ricon = desc_icons.find(
                                    (a) => a.id == curr,
                                 )?.icon;
                                 const regex = "<IconMap:" + curr + ">";

                                 const replace_text = `<img style="display:inline-block; vertical-align:middle; height:25px; width:auto;" src="${ricon}">`;
                                 display = display.replace(regex, replace_text);
                              }

                              return (
                                 <>
                                    <div className={skill_desc_header}>
                                       {desc.name}
                                    </div>
                                    <div
                                       className="zzz-skill-description mb-4"
                                       dangerouslySetInnerHTML={{
                                          __html: display,
                                       }}
                                    ></div>
                                 </>
                              );
                           })}
                        </div>
                     </>
                  )}
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
