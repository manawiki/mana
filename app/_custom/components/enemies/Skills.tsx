import { Disclosure } from "@headlessui/react";
import type { Enemy } from "payload/generated-custom-types";

export const Skills = ({
   pageData,
   version,
}: {
   pageData: Enemy;
   version: number;
}) => {
   var skills = pageData?.enemy_variations?.[version]?.skill_list;

   return (
      <>
         {skills?.map((skill, index) => (
            <div
               className="my-3 rounded-md border bg-gray-50 p-2 dark:border-neutral-700 dark:bg-neutral-900"
               key={index}
            >
               {/* Header with Skill Icon and Name */}
               <div className="relative ">
                  <div className="mb-2 inline-block w-full border-b pb-2 align-middle dark:border-slate-700">
                     <div className="block text-xl font-bold">{skill.name}</div>
                     {/* Damage Type */}
                     <div className="block">
                        {skill?.damage_type?.icon?.url ? (
                           <div
                              className="relative mr-1 inline-flex h-6 w-6 
                          items-center justify-center rounded-full bg-gray-600 align-middle"
                           >
                              <img
                                 src={
                                    skill.damage_type?.icon?.url ??
                                    "no_image_42df124128"
                                 }
                                 alt={skill.damage_type?.name}
                                 className="h-full w-full object-contain"
                              />
                           </div>
                        ) : null}
                        {skill.damage_type?.name}
                     </div>
                  </div>
               </div>

               {/* Description */}
               <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                     __html: skill?.description ?? "",
                  }}
               ></div>

               {/* Parameters */}
               {skill?.skill_params && skill.skill_params?.length > 0 ? (
                  <CollapsibleText
                     title="Skill Parameters"
                     data={skill.skill_params}
                  />
               ) : null}
            </div>
         ))}
      </>
   );
};

// =====================================
// Collapsible Text box
// =====================================
const CollapsibleText = ({ title, data }: any) => {
   if (data.stats != undefined && data.stats.length != 0) {
      return (
         <>
            <Disclosure>
               {({ open }) => (
                  <>
                     <Disclosure.Button
                        className="mb-2 flex w-full items-center
             rounded-md border bg-gray-50 px-3 py-2 font-bold dark:border-neutral-700 dark:bg-neutral-900"
                     >
                        {title}
                        <div
                           className={`${
                              open
                                 ? "rotate-180 transform font-bold text-gray-600 "
                                 : "text-gray-400"
                           } ml-auto inline-block `}
                        >
                           <CaretDownIcon class="text-brand_1" w={28} h={28} />
                        </div>
                     </Disclosure.Button>
                     <Disclosure.Panel className="">
                        <div
                           contentEditable="true"
                           dangerouslySetInnerHTML={{
                              __html: data,
                           }}
                           className="h-24 overflow-y-scroll rounded-md border bg-gray-100 px-4 py-3 font-mono text-base dark:border-neutral-700 dark:bg-neutral-800"
                        ></div>
                     </Disclosure.Panel>
                  </>
               )}
            </Disclosure>
         </>
      );
   } else {
      return <></>;
   }
};

// =====================================
// For rendering Down Icon
// =====================================
export const CaretDownIcon = (props: any) => (
   <svg
      className={props.class}
      width={props.w}
      height={props.h}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <path fill="currentColor" d="M20 8H4L12 16L20 8Z"></path>
   </svg>
);
