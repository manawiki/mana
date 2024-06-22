import type { Servant as ServantType } from "payload/generated-custom-types";
import { Disclosure } from "@headlessui/react";
import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";

const thformat =
   "p-2 leading-none text-center border border-color-sub bg-zinc-50 dark:bg-zinc-800";
const tdformat = "p-2 leading-none text-center border border-color-sub";

export function Writeup({ data }: { data: any }) {
   const writeup = data.writeupData;
   return (
      <>
         <Overview data={writeup} />
         <GameplayTips data={writeup} />
         <Strengths data={writeup} />
         <Weaknesses data={writeup} />
         <LevelUpSkillRec data={writeup} />
         <CERec data={writeup} />
      </>
   );
}

const pformatting = `
<style>
   div.fgo-writeup > p {
      margin-bottom: 0.625em;
   }
   div.fgo-writeup > ul {
      list-style-type: disc;  
      margin: 0 0 0.75em 25px;
   }
   div.fgo-writeup > ul > li {
      margin-bottom: 0.625em;
   }
</style>
`;
const tablestyling = `
   <style>
   table.skill-table tr th {
     text-align:center;
     padding: 0.2rem;
     font-size: 0.7rem;
     border-width: 1px;
     background-color: rgba(50,50,50,0.03);
   }
   .dark table.skill-table tr th {
      border-color: rgba(250,250,250,0.1);
      background-color: rgba(250,250,250,0.03);
   }
   table.skill-table tr td {
     text-align:center;
     padding: 0.2rem;
     font-size: 0.7rem;
     border-width: 1px;
   }
   .dark table.skill-table tr td {
     border-color: rgba(250,250,250,0.1);
   }
   </style>
   `;

function Overview({ data }: { data: any }) {
   const displaytext = data.writeup_overview;
   const author = data.authored_by;
   return (
      <>
         <div
            className=""
            dangerouslySetInnerHTML={{ __html: pformatting }}
         ></div>

         {displaytext ? (
            <>
               <H2 text="Overview" />
               {author ? (
                  <>
                     <div className="text-xs text-right w-full my-2">
                        Analysis by: {author}
                     </div>
                  </>
               ) : null}

               <div
                  className="fgo-writeup"
                  dangerouslySetInnerHTML={{ __html: displaytext }}
               ></div>
            </>
         ) : null}
      </>
   );
}

function GameplayTips({ data }: { data: any }) {
   const displaytext = data.writeup_gameplay_tips;
   return (
      <>
         {displaytext ? (
            <>
               <H2 text="Gameplay Tips" />
               <div
                  className="fgo-writeup"
                  dangerouslySetInnerHTML={{ __html: displaytext }}
               ></div>
            </>
         ) : null}
      </>
   );
}

function Strengths({ data }: { data: any }) {
   const bullets = data.writeup_strengths?.split("<h3>").slice(1);
   return (
      <>
         {bullets ? (
            <>
               <H2 text="Strengths" />
               {bullets?.map((b: any, i: any) => (
                  <>
                     <div className="flex" key={`writeup_strengths_key_${i}`}>
                        <div className="w-5 mt-5 mr-1">
                           <FaPlusCircle className="text-[#a0daa8] w-5 h-5 " />
                        </div>
                        <div
                           className="fgo-writeup"
                           dangerouslySetInnerHTML={{ __html: "<h3>" + b }}
                        ></div>
                     </div>
                  </>
               ))}
            </>
         ) : null}
      </>
   );
}
function Weaknesses({ data }: { data: any }) {
   const bullets = data.writeup_weaknesses?.split("<h3>").slice(1);
   return (
      <>
         {bullets ? (
            <>
               <H2 text="Weaknesses" />
               {bullets?.map((b: any, i: any) => (
                  <>
                     <div className="flex" key={`writeup_weaknesses_key_${i}`}>
                        <div className="w-5 mt-5 mr-1">
                           <FaMinusCircle className="text-[#daa0a0] w-5 h-5" />
                        </div>
                        <div
                           className="fgo-writeup"
                           dangerouslySetInnerHTML={{ __html: "<h3>" + b }}
                        ></div>
                     </div>
                  </>
               ))}
            </>
         ) : null}
      </>
   );
}

function LevelUpSkillRec({ data }: { data: any }) {
   const displaytext = data.writeup_skill_level_explanation;

   return (
      <>
         {displaytext ? (
            <>
               <H2 text="Level Up Skill Recommendations" />
               {/* Skill Rec Tables */}
               <div className="mb-4">
                  {data.writeup_skill_level_recommendation?.map(
                     (skill: any, si: any) => {
                        const skillts = skill.level_up_skill;
                        return (
                           <SkillDisplay
                              skill={skill}
                              key={"skill_recommendation_display_" + si}
                           />
                        );
                     },
                  )}
               </div>

               {/* Writeup */}
               <div
                  className="fgo-writeup"
                  dangerouslySetInnerHTML={{
                     __html: displaytext,
                  }}
               ></div>
            </>
         ) : null}
      </>
   );
}

function CERec({ data }: { data: any }) {
   const displaytext = data.writeup_recommended_ces;
   return (
      <>
         {displaytext ? (
            <>
               <H2 text="Craft Essence Recommendations" />
               <div className="">
                  <CE_List data={data} />
               </div>

               <div
                  className="fgo-writeup"
                  dangerouslySetInnerHTML={{ __html: displaytext }}
               ></div>
            </>
         ) : null}
      </>
   );
}

const SkillDisplay = ({ skill }: any) => {
   const skilldat = skill.level_up_skill;
   const skillrec = skill.level_up_importance?.name;
   const skill_name = skilldat?.name;
   const skill_icon = skilldat?._skill_Image?.icon?.url;
   const skill_value_table = skilldat?.effect_value_table;
   const skill_description = skilldat?.description;
   const cd = skilldat.cooldown ?? 0;

   var rec_bg_color = "";

   switch (skillrec) {
      case "Higher":
         rec_bg_color = "bg-[#00dd00]";
         break;
      case "High":
         rec_bg_color = "bg-[#88ff88]";
         break;
      case "Medium":
         rec_bg_color = "bg-[#ffff00]";
         break;
      case "Low":
         rec_bg_color = "bg-[#ff8888]";
         break;
      case "Lower":
         rec_bg_color = "bg-[#dd0000]";
         break;
   }

   const skilltablehtml = `
   ${tablestyling}
   <tr>
   <th>Lvl</th>
   <th>1</th>
   <th>2</th>
   <th>3</th>
   <th>4</th>
   <th>5</th>
   <th>6</th>
   <th>7</th>
   <th>8</th>
   <th>9</th>
   <th>10</th>
   </tr>
   ${skill_value_table}
   <tr>
     <th>CD</th>
     <td>${cd}</td>
     <td>${cd}</td>
     <td>${cd}</td>
     <td>${cd}</td>
     <td>${cd}</td>
     <td>${cd - 1}</td>
     <td>${cd - 1}</td>
     <td>${cd - 1}</td>
     <td>${cd - 1}</td>
     <td>${cd - 2}</td>
   </tr>`;

   return (
      <>
         <div
            className={`border flex my-0.5 dark:border-slate-800 border-slate-300 p-2 rounded-md bg-opacity-10 ${rec_bg_color}`}
         >
            <div className="grow">
               <div className="h-10 w-10 inline-block relative mr-2">
                  <Image
                     height={40}
                     url={skill_icon}
                     className="object-contain"
                     options="height=40"
                     alt="SkillIcon"
                  />
               </div>

               <div className="w-5/6 inline-block relative align-top">
                  <div className="font-bold">{skill_name}</div>
                  <div
                     className="text-xs whitespace-pre-wrap"
                     dangerouslySetInnerHTML={{
                        __html: skill_description
                           .replace(/\<br\>/g, "")
                           .replace(/\<p\>\r\n/g, "<p>"),
                     }}
                  ></div>
               </div>

               <Disclosure>
                  {({ open }) => (
                     <>
                        <Disclosure.Button
                           className={`font-bold text-white bg-blue-800 dark:border-zinc-600 dark:bg-zinc-800
                 flex items-center mb-1 w-full border px-2 py-0.5 mt-1 rounded-md text-xs ${
                    open
                       ? "bg-opacity-100 dark:bg-opacity-100"
                       : "bg-opacity-80 dark:bg-opacity-40"
                 }`}
                        >
                           Show Info
                           <div
                              className={`${
                                 open
                                    ? "transform rotate-180 text-gray-600 font-bold "
                                    : "text-gray-400 "
                              } inline-block ml-auto `}
                           >
                              <TiArrowSortedDown className="inline-block h-4 w-4" />
                           </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className="mb-1">
                           <table
                              className="text-xs text-center mb-1 w-full skill-table"
                              dangerouslySetInnerHTML={{
                                 __html: skilltablehtml,
                              }}
                           ></table>
                        </Disclosure.Panel>
                     </>
                  )}
               </Disclosure>
            </div>
            <div className="flex w-12 self-center justify-center">
               <SkillRecCircle rec={skillrec} />
            </div>
         </div>
      </>
   );
};
const SkillRecCircle = ({ rec }: any) => {
   switch (rec) {
      case "Higher":
         return (
            <>
               <FaPlusCircle className="text-[#00dd00] w-5 h-5 " />
               <FaPlusCircle className="text-[#00dd00] w-5 h-5 " />
            </>
         );
      case "High":
         return <FaPlusCircle className="text-[#a0daa8] w-5 h-5 " />;
      case "Medium":
         return <FaCircle className="text-[#e49a11] w-5 h-5 " />;
      case "Low":
         return <FaMinusCircle className="text-[#daa0a0] w-5 h-5" />;
      case "Lower":
         return (
            <>
               <FaMinusCircle className="text-[#ff8080] w-5 h-5" />
               <FaMinusCircle className="text-[#ff8080] w-5 h-5" />
            </>
         );

      default:
         return null;
   }
};
function CE_List({ data }: { data: any }) {
   const celist = data?.recommended_ces;
   return (
      <>
         <div className="border border-color-sub divide-y dark:divide-zinc-700 rounded-md mb-4">
            {celist?.map((bc: any) => {
               return (
                  <>
                     <div className="px-3 p-2">
                        <div className="inline-block mr-2 align-middle">
                           <a href={`/c/craft-essences/${bc?.id}`}>
                              <div className="relative mr-0.5 inline-block h-11 w-11 align-middle text-xs">
                                 <img
                                    src={bc?.icon?.url ?? "no_image_42df124128"}
                                    className={`object-contain h-11`}
                                    alt={bc?.name}
                                    loading="lazy"
                                 />
                              </div>
                           </a>
                        </div>
                        <div className="inline-block align-middle">
                           <div>
                              <a href={`/c/craft-essences/${bc?.id}`}>
                                 <div className="text-base text-blue-500">
                                    {bc?.name}
                                 </div>
                              </a>
                           </div>
                        </div>
                     </div>
                  </>
               );
            })}
         </div>
      </>
   );
}

const FaPlusCircle = (props: any) => (
   <svg
      className={props.className}
      width={props.w}
      height={props.h}
      viewBox="0 0 576 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <path
         fill="currentColor"
         d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"
      ></path>
   </svg>
);

const FaMinusCircle = (props: any) => (
   <svg
      className={props.className}
      width={props.w}
      height={props.h}
      viewBox="0 0 576 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <path
         fill="currentColor"
         d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"
      ></path>
   </svg>
);

const FaCircle = (props: any) => (
   <svg
      className={props.className}
      width={props.w}
      height={props.h}
      viewBox="0 0 576 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <path
         fill="currentColor"
         d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"
      ></path>
   </svg>
);

const TiArrowSortedDown = (props: any) => (
   <svg
      className={props.className}
      height={props.h}
      width={props.w}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
   >
      <path
         fill="currentColor"
         d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
      />
   </svg>
);
