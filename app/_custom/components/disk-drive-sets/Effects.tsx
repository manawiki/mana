import type { DiskDriveSet as DiskDriveSetType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { useState } from "react";
import { H2 } from "~/components/Headers";

export function Effects({ data: char }: { data: DiskDriveSetType }) {
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
   const set_effects = char.set_effect;

   return (
      <>
         <H2 text="Set Effects" />
         {/* Description */}
         {set_effects?.map((effect: any) => {
            return (
               <>
                  <div className="grid grid-cols-8 bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-2 my-2">
                     <div className="col-span-1">{effect.num}-Pc:</div>
                     <div className="col-span-7">{effect.desc}</div>
                  </div>
               </>
            );
         })}
      </>
   );
}
