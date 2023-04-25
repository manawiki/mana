import { Disclosure } from "@headlessui/react";

export const Skills = ({ pageData }: any) => {
   var skills = pageData.skill_list;

   return (
      <>
         {skills.map((skill: any, index: any) => {
            return (
               <>
                  <div
                     className="border rounded-md dark:border-neutral-700 dark:bg-neutral-900 p-2 my-1 bg-gray-50"
                     key={index}
                  >
                     {/* Header with Skill Icon and Name */}
                     <div className="relative ">
                        <div className="inline-block align-middle mb-2 pb-2 border-b w-full dark:border-slate-700">
                           <div className="block text-xl font-bold">
                              {skill.name}
                           </div>
                           {/* Damage Type */}
                           <div className="block">
                              {skill.damage_type?.icon?.url ? (
                                 <div
                                    className="inline-flex relative items-center align-middle justify-center 
                          bg-gray-600 rounded-full h-6 w-6 mr-1"
                                 >
                                    <img
                                       src={
                                          skill.damage_type?.icon?.url ??
                                          "no_image_42df124128"
                                       }
                                       className="object-contain h-full w-full"
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
                     {skill.skill_params?.length > 0 ? (
                        <CollapsibleText
                           title="Skill Parameters"
                           data={skill.skill_params}
                        />
                     ) : null}
                  </div>
               </>
            );
         })}
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
                        className="font-bold bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700
             flex items-center mb-2 w-full border px-3 py-2 rounded-md"
                     >
                        {title}
                        <div
                           className={`${
                              open
                                 ? "transform rotate-180 text-gray-600 font-bold "
                                 : "text-gray-400"
                           } inline-block ml-auto `}
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
                           className="h-24 font-mono border overflow-y-scroll dark:border-neutral-700 text-base bg-gray-100 dark:bg-neutral-800 px-4 py-3 rounded-md"
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
