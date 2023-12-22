import type { Bangboo as BangbooType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { useState } from "react";

export function Skills({ data: char }: { data: BangbooType }) {
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

   const skills = char.skills;
   console.log(skills);

   // Some general CSS stuff
   const skill_desc_header = "font-bold text-lg my-1";
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
            const skill_icon = sk.icon?.url;
            const skill_name = sk.name;

            const desc = sk.desc;
            var display = desc;
            // Description parsing: Replace instances of <IconMap:Icon_Special> etc. with correct icon image
            const icon_ids = display
               .split("<IconMap:")
               .slice(1)
               .map((a) => a.replace(/\>.*/g, ""));
            for (var i in icon_ids) {
               const curr = icon_ids[i];
               const ricon = desc_icons.find((a) => a.id == curr)?.icon;
               const regex = "<IconMap:" + curr + ">";

               const replace_text = `<img style="display:inline-block; vertical-align:middle; height:25px; width:auto;" src="${ricon}">`;
               display = display.replace(regex, replace_text);
            }

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
                  </div>

                  {/* Description */}

                  <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-2  mt-2">
                     <div
                        className="zzz-skill-description"
                        dangerouslySetInnerHTML={{ __html: display }}
                     ></div>
                  </div>
               </>
            );
         })}
      </>
   );
}
