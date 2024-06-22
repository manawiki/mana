import { useState } from "react";

import type { Servant as ServantType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

const thformat =
   "p-2 leading-none text-left border border-color-sub bg-zinc-50 dark:bg-zinc-800";
const tdformat = "p-2 leading-none text-center border border-color-sub";
const tdVoiceline = "p-2 text-left border border-color-sub";

export function Profile({ data }: { data: any }) {
   const servant = data.servant;
   const ce = data.ceData;
   return (
      <>
         <Table_Info data={servant} />
         <Parameters data={servant} />
         <Valentines_CE ce={ce} />
         <ProfileEntries data={servant} />
         <VoiceLines data={servant} />
      </>
   );
}

function Table_Info({ data: servant }: { data: ServantType }) {
   const info = [
      {
         name: "Illustrator",
         value: servant?.illustrator?.name,
      },
      {
         name: "Seiyuu (CV)",
         value: servant?.cv?.name,
      },
      {
         name: "AKA/Alias/Nicknames",
         value: servant?.aka_aliases_nicknames,
      },
      {
         name: "Country/Place of Origin",
         value: servant?.country_origin,
      },
      {
         name: "Series",
         value: servant?.series,
      },
      {
         name: "Release Date (JP)",
         value: servant?.jp_release_date,
      },
      {
         name: "Release Date (NA)",
         value: servant?.np_release_date,
      },
   ];

   return (
      <>
         <div className="my-1">
            <table className="text-sm w-full ">
               <tbody>
                  {info?.map((irow: any, ind: any) => {
                     return (
                        <>
                           {irow?.value ? (
                              <>
                                 <tr key={"additional_info_" + ind}>
                                    <th
                                       className={thformat}
                                       key={"info_row_" + ind}
                                    >
                                       {irow?.name}
                                    </th>
                                    <td
                                       className={tdformat}
                                       key={"info_value_" + ind}
                                    >
                                       {irow?.value}
                                    </td>
                                 </tr>
                              </>
                           ) : null}
                        </>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </>
   );
}

function Parameters({ data: servant }: { data: ServantType }) {
   // STR / END
   // AGL / MP
   // LUK / NP

   const paramlist = [
      {
         name: "STR",
         grade: servant.str_grade,
         bar: servant.str_bar,
      },
      {
         name: "END",
         grade: servant.end_grade,
         bar: servant.end_bar,
      },
      {
         name: "AGL",
         grade: servant.agl_grade,
         bar: servant.agl_bar,
      },
      {
         name: "MP",
         grade: servant.mp_grade,
         bar: servant.mp_bar,
      },
      {
         name: "LUK",
         grade: servant.luk_grade,
         bar: servant.luk_bar,
      },
      {
         name: "NP",
         grade: servant.np_grade,
         bar: servant.np_bar,
      },
   ];

   return (
      <>
         <H2 text="Parameters" />
         <div className="grid grid-cols-2 text-sm justify-center gap-y-1">
            {paramlist?.map((p: any) => {
               return (
                  <>
                     <div className="w-full flex items-center justify-left px-2">
                        <div className="text-center w-[15%] mr-1">{p.name}</div>
                        <div className="w-[60%]">
                           {[1, 2, 3, 4, 5].map((bar: any) => {
                              return (
                                 <div
                                    className={`inline-block h-5 w-1/5 border border-color-sub
                                    ${
                                       bar <= p.bar && p.bar != 6
                                          ? " bg-orange-400 bg-opacity-80"
                                          : null
                                    }
                                    ${
                                       p.bar == 6
                                          ? " bg-yellow-300 bg-opacity-80"
                                          : null
                                    }
                                    ${bar == 1 ? " rounded-l-lg" : null}
                                    ${bar == 5 ? " rounded-r-lg" : null}`}
                                 ></div>
                              );
                           })}
                        </div>

                        <div className="text-center ml-1">{p.grade}</div>
                     </div>
                  </>
               );
            })}
         </div>
      </>
   );
}

function Valentines_CE({ ce }: { ce: any }) {
   const val_ce = ce?.filter((a) => a.is_valentines == true);
   return (
      <>
         {val_ce ? (
            <>
               <H2 text="Valentine's CE" />
               {val_ce?.map((bc: any) => {
                  return (
                     <>
                        <a href={`/c/craft-essences/${bc?.id}`}>
                           <div className="my-1 border border-color-sub rounded-sm p-3">
                              <div className="inline-block mr-1 align-middle">
                                 <div className="relative mr-0.5 inline-block h-14 w-14 align-middle text-xs">
                                    <img
                                       src={
                                          bc?.icon?.url ?? "no_image_42df124128"
                                       }
                                       className={`object-contain h-14`}
                                       alt={bc?.name}
                                       loading="lazy"
                                    />
                                 </div>
                              </div>
                              <div className="inline-block align-middle">
                                 <div>
                                    <div className="text-base text-blue-500">
                                       {bc?.name}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </a>
                     </>
                  );
               })}
            </>
         ) : null}
      </>
   );
}

function ProfileEntries({ data: servant }: { data: ServantType }) {
   const profiles = servant.profile_entries;

   return (
      <>
         {profiles ? (
            <>
               <H2 text="Profile Entries" />
               {profiles.map((pe: any) => {
                  return (
                     <>
                        <h3 className="px-1 pb-1 mb-2 border-b border-color-sub">
                           {pe?.title}
                        </h3>
                        <div
                           className="whitespace-pre-wrap"
                           dangerouslySetInnerHTML={{ __html: pe.text }}
                        ></div>
                     </>
                  );
               })}
            </>
         ) : null}
      </>
   );
}

function VoiceLines({ data: servant }: { data: ServantType }) {
   const lines = servant.voice_lines;

   return (
      <>
         {lines ? (
            <>
               <H2 text="Voice Lines" />
               <div className="my-1">
                  <table className="text-sm w-full ">
                     <tbody>
                        {lines?.map((irow: any, ind: any) => {
                           return (
                              <>
                                 {irow?.text ? (
                                    <>
                                       <tr key={"voice_lines_row_" + ind}>
                                          <th
                                             className={thformat}
                                             key={"info_row_" + ind}
                                          >
                                             {irow?.title}
                                          </th>
                                          <td
                                             className={tdVoiceline}
                                             key={"info_value_" + ind}
                                             dangerouslySetInnerHTML={{
                                                __html: irow?.text,
                                             }}
                                          ></td>
                                       </tr>
                                    </>
                                 ) : null}
                              </>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            </>
         ) : null}
      </>
   );
}
