import type { Character as CharacterType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";
import { useState } from "react";

export function FactorySkills({ data: char }: { data: CharacterType }) {
  const skills = char?.factory_skills;
  return (
    <>
      <H2 text="Factory Skills" />
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
        const skill = sk.factory_skill;

        return (
          <>
            <div className="bg-zinc-50 dark:bg-dark350 shadow-sm shadow-1 border border-color-sub rounded-lg px-3 py-2 my-3">
              <div>
                <div className="inline-block rounded-sm bg-zinc-600 dark:bg-zinc-800 h-fit align-middle mb-1 mr-2">
                  <div className="inline-block mr-1 align-middle">
                    <Image
                      height={25}
                      className="object-contain"
                      url={skill.icon?.url}
                      options="height=25"
                      alt={"SkillIcon"}
                    />
                  </div>
                  <div className="font-bold inline-block mr-2 align-middle text-white">
                    {skill?.name}
                  </div>
                </div>
                <div className="inline-block mr-2">
                  {/* Header */}
                  <div className="">
                    {/* Add Tags for individual skill type */}
                    {skill?.type?.map((t: any) => {
                      return (
                        <>
                          <div className="inline-block mr-2 px-2 text-sm bg-zinc-300 dark:dark:bg-zinc-800 align-middle">
                            {t.name}
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div
                  className="text-sm mt-2 p-1 endfield-skill-description"
                  dangerouslySetInnerHTML={{
                    __html: `${skill.desc}`,
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
