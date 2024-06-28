import type { Agent as AgentType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

export function Talents({ data: char }: { data: AgentType }) {
   const talent_list = [
      {
         name: "A",
         icon: "https://static.mana.wiki/zzz/IconRoleTalentKeyA.png",
         talent: char?.talents[0],
      },
      {
         name: "B",
         icon: "https://static.mana.wiki/zzz/IconRoleTalentKeyB.png",
         talent: char?.talents[1],
      },
      {
         name: "C",
         icon: "https://static.mana.wiki/zzz/IconRoleTalentKeyC.png",
         talent: char?.talents[2],
      },
      {
         name: "D",
         icon: "https://static.mana.wiki/zzz/IconRoleTalentKeyD.png",
         talent: char?.talents[3],
      },
      {
         name: "E",
         icon: "https://static.mana.wiki/zzz/IconRoleTalentKeyE.png",
         talent: char?.talents[4],
      },
      {
         name: "F",
         icon: "https://static.mana.wiki/zzz/IconRoleTalentKeyF.png",
         talent: char?.talents[5],
      },
   ];

   return (
      <>
         <H2 text="Talents" />
         {talent_list.map((t, i) => {
            const ticon = t.icon;
            const tname = t.talent?.name;
            const tdesc = t.talent?.desc;
            const tdesc_flavor = t.talent?.desc_flavor;
            return (
               <>
                  <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-1 flex my-3 items-center content-center">
                     {ticon != "" ? (
                        <>
                           <div className="rounded-full bg-zinc-600 dark:bg-zinc-700 h-fit w-fit mr-3 shrink-0 self-center justify-center flex">
                              <Image
                                 height={80}
                                 className="object-contain"
                                 url={ticon}
                                 options="height=80"
                                 alt={"SkillIcon"}
                              />
                           </div>
                        </>
                     ) : null}

                     <div className="mr-2 col-span-11 self-center">
                        {/* Header */}
                        <div className="font-bold text-2xl mb-2">{tname}</div>
                        {/* Description */}
                        <div
                           className="dark:brightness-100 brightness-7"
                           dangerouslySetInnerHTML={{ __html: tdesc }}
                        ></div>
                        {/* Flavor */}
                        <div className="italic mt-2 text-zinc-500">
                           {tdesc_flavor}
                        </div>
                     </div>
                  </div>
               </>
            );
         })}
      </>
   );
}
