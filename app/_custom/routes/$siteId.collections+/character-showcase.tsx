/**
  Summon Simulator page
  implementation notes:
    1. switching banners will reset the guaranteed rateup counter
    2. switching banners will reset the epitomized weapon thing (nonTargetWeaponPulled counter)

  TODO:
    1. Implement select for switching banners in a better way
*/

import { useRef, useEffect } from "react";
import { Disclosure, Combobox } from "@headlessui/react";

import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Image } from "~/components";

// Sample data, will import via API for real case
import { showcaseSample } from "./showcaseSample";

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   var url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/relics?depth=3&limit=500`;
   const relicRaw = await (await fetch(url)).json();
   const relics = relicRaw.docs;

   url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/characters?limit=500`;
   const characterRaw = await (await fetch(url)).json();
   const characters = characterRaw.docs;

   url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/lightCones?limit=500`;
   const lightConeRaw = await (await fetch(url)).json();
   const lightCones = lightConeRaw.docs;

   url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/skillTrees?limit=5000`;
   const skillTreeRaw = await (await fetch(url)).json();
   const skillTrees = skillTreeRaw.docs;

   url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/_statTypes?limit=100`;
   const statTypesRaw = await (await fetch(url)).json();
   const statTypes = statTypesRaw.docs;

   return json({ relics, characters, lightCones, skillTrees, statTypes });
}

export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Character Showcase - Honkai: Star Rail",
      },
      {
         name: "description",
         content: "Build Better Wikis",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export default function Showcase() {
   const { relics } = useLoaderData<typeof loader>();
   const { characters } = useLoaderData<typeof loader>();
   const { lightCones } = useLoaderData<typeof loader>();
   const { skillTrees } = useLoaderData<typeof loader>();
   const { statTypes } = useLoaderData<typeof loader>();

   const pdata = showcaseSample;
   const [displayChar, setDisplayChar] = useState(-1);

   return (
      <>
         <div className="mx-auto mb-8 max-w-[960px] max-desktop:px-3">
            {/* 1) Header with main information for Profile */}
            <PlayerHeader data={pdata} />

            {/* 2) Character selector for available characters in data */}
            <CharacterSelector
               data={pdata}
               characters={characters}
               displayChar={displayChar}
               setDisplayChar={(e: any) => setDisplayChar(e)}
            />

            {/* 3) Primary Character display section */}
            <CharacterInfo
               data={pdata}
               characters={characters}
               lightCones={lightCones}
               relics={relics}
               skillTrees={skillTrees}
               statTypes={statTypes}
               displayChar={displayChar}
            />
         </div>
      </>
   );
}

const PlayerHeader = ({ data }: any) => {
   const iconid = data?.detail_info?.head_icon;

   const dataClass = "rounded-md border px-2 m-1 py-1 inline-block";

   return (
      <>
         <div className="rounded-md border p-2 my-2">
            {/* ICON - Pending */}

            {/* Nickname */}
            <div className="text-2xl font-bold">
               {data?.detail_info?.nickname}
            </div>
            {/* UID */}
            <div className={`${dataClass}`}>{data?.detail_info?.uid}</div>
            {/* Level (Trailblaze Level) */}
            <div className={`${dataClass}`}>TL: {data?.detail_info?.level}</div>
            {/* World Level (Equilibrium Level) */}
            <div className={`${dataClass}`}>
               EL: {data?.detail_info?.world_level}
            </div>
            {/* Achievements */}
            <div className={`${dataClass}`}>
               Total Achievements:{" "}
               {data?.detail_info?.record_info?.achievement_count}
            </div>
            {/* Total Characters */}
            <div className={`${dataClass}`}>
               Characters Owned: {data?.detail_info?.record_info?.avatar_count}
            </div>
         </div>
      </>
   );
};

const CharacterSelector = ({
   data,
   characters,
   displayChar,
   setDisplayChar,
}: any) => {
   // Get full list of character IDs, including the assist avatar and all characters in avatar_detail_list
   var charids = [
      data?.detail_info?.assist_avatar?.avatar_id,
      ...data?.detail_info?.avatar_detail_list?.map((a) => a.avatar_id),
   ];

   return (
      <>
         <div className="text-center my-3">
            {charids.map((c: any, i: any) => {
               const cdata = characters.find((a) => a.character_id == c);

               // Make sure to only show the selector if that character is different from the assist_avatar
               return (
                  <>
                     {i == 0 || (charids[0] != c && i > 0) ? (
                        <>
                           <div
                              className={`inline-block cursor-pointer`}
                              onClick={() => {
                                 setDisplayChar(i - 1);
                              }}
                           >
                              {/* NOTE: Passing style in as a parameter in case we want to format the actively selected character differently! */}
                              <ItemFrameRound
                                 mat={cdata}
                                 style={`${
                                    displayChar == i - 1
                                       ? "drop-shadow-md drop-shadow-[0px_0px_6px_rgba(0,0,0,1)] dark:drop-shadow-[0px_0px_4px_rgba(255,255,255,1)]"
                                       : ""
                                 }`}
                              />
                           </div>
                        </>
                     ) : null}
                  </>
               );
            })}
         </div>
      </>
   );
};

const ItemFrameRound = ({ mat, style }: any) => {
   // ========================
   // Generic Item / Character Circle Frame
   // ========================

   return (
      <div
         className={`relative align-middle text-center mx-1 inline-block h-20 w-20 align-middle ${style}`}
         key={mat?.id}
      >
         <Image
            url={mat?.icon?.url ?? "no_image_42df124128"}
            className={`object-contain h-20 w-20 color-rarity-${
               mat?.rarity?.display_number ?? "1"
            } rounded-full`}
            alt={mat?.name}
         />
      </div>
   );
};

const CharacterInfo = ({
   data,
   characters,
   lightCones,
   relics,
   skillTrees,
   statTypes,
   displayChar,
}: any) => {
   // Character Data Loading
   // If the displayChar variable is set to -1, show the assist_avatar; otherwise for 0, 1, 2, show the avatar_detail_list for the corresponding index.
   const chardata =
      displayChar == -1
         ? data?.detail_info?.assist_avatar
         : data?.detail_info?.avatar_detail_list[displayChar];
   const charid = chardata?.avatar_id;

   const charbase = characters.find((a) => a.character_id == charid);

   // Character Showcase Canvas!
   const bg_url =
      "https://static.mana.wiki/file/mana-prod/starrail/UI_Star_Bg.png";

   // Light Cone data loading
   const lcid = chardata?.equipment?.tid;
   const lcbase = lightCones.find((a) => a.lightcone_id == lcid);
   const superimp = ["0", "I", "II", "III", "IV", "V"];

   // Light Cone Stat Calculation
   const wlv = chardata?.equipment?.level;
   const wrank = chardata?.equipment?.rank;
   var wsuffix = "";
   // Ascension Check, add "A" if ascended:
   if (
      (wlv == 20 && wrank == 1) ||
      (wlv == 30 && wrank == 2) ||
      (wlv == 40 && wrank == 3) ||
      (wlv == 50 && wrank == 4) ||
      (wlv == 60 && wrank == 5) ||
      (wlv == 70 && wrank == 6)
   ) {
      wsuffix = "A";
   }
   const wi = lcbase.stats[0].data?.findIndex((a) => a == wlv) + wsuffix;
   var wstats = [
      { name: "HP", base: lcbase.stats[1].data[wi] },
      { name: "ATK", base: lcbase.stats[2].data[wi] },
      { name: "DEF", base: lcbase.stats[3].data[wi] },
   ];

   // Relic data loading
   const rid = chardata?.relic_list?.map((a) => a.tid);
   const rbase = rid?.map((r) => relics.find((a) => a.relic_id == r));

   const rchar = chardata.relic_list?.map((r: any, i: any) => {
      // Relic level
      const rlv = r.level ?? 0;

      // For each relic, need to pull the main stat, and all sub stats
      // Main Stat:
      // - Get Main Stat Icon / Affix ID / Name
      // - Get Value of Main Stat at level
      const mainstat = rbase[i]?.mainstat_group?.find(
         (a) => a.affix_id == r.main_affix_id
      );
      const mainobj = {
         id: mainstat?.stattype?.id,
         name: mainstat?.stattype?.name,
         icon: {
            url: mainstat?.stattype?.icon?.url,
         },
         affix_id: mainstat?.affix_id,
         value: mainstat?.stats[rlv],
      };

      const subobj = r.sub_affix_list?.map((s) => {
         const ss = rbase[i]?.substat_group?.find(
            (a) => a.affix_id == s.affix_id
         );
         const scnt = s.cnt ?? 0;
         const sbase = ss.base_val;
         const sstep = s.step ?? 0;
         const sstepval = ss.level_add;

         return {
            id: ss?.stattype?.id,
            name: ss?.stattype?.name,
            icon: {
               url: ss?.stattype?.icon?.url,
            },
            affix_id: ss?.affix_id,
            value: scnt * sbase + sstepval * sstep, // Value = count * base + (step_value * step)
         };
      });
      // console.log(substats);

      return { ...r, mainobj, subobj };
   });

   console.log(rchar);

   // Character Base Stat Calculation
   const lv = chardata.level;
   const rank = chardata.rank;
   var suffix = "";
   // Ascension Check, add "A" if ascended:
   if (
      (lv == 20 && rank == 1) ||
      (lv == 30 && rank == 2) ||
      (lv == 40 && rank == 3) ||
      (lv == 50 && rank == 4) ||
      (lv == 60 && rank == 5) ||
      (lv == 70 && rank == 6)
   ) {
      suffix = "A";
   }

   const li = charbase.stats[0].data.findIndex((a) => a == lv) + suffix;
   var statVal = [
      { name: "HP", base: charbase.stats[1].data[li], mod: wstats[0].base },
      { name: "ATK", base: charbase.stats[2].data[li], mod: wstats[1].base },
      { name: "DEF", base: charbase.stats[3].data[li], mod: wstats[2].base },
      { name: "SPD", base: charbase.stats[4].data[li] },
      { name: "CRIT Rate", base: charbase.stats[5].data[li] },
      { name: "CRIT DMG", base: charbase.stats[6].data[li] },
      { name: "Aggro", base: charbase.stats[7].data[li] },
   ];
   console.log(statVal);

   return (
      <>
         <div className="relative my-3 rounded-md w-full h-96 text-center overflow-x-auto overflow-y-hidden">
            {/* ================================= */}
            {/* First Column */}
            {/* ================================= */}
            {/* Background-Div */}
            <div className="relative inline-block w-full h-96 rounded-lg overflow-hidden">
               <Image
                  url={bg_url}
                  className="object-fill w-full"
                  alt="background"
               />
            </div>
            {/* Character Splash Image Left */}
            <div className="absolute -left-8 top-8 h-96 w-96 opacity-80">
               <Image
                  url={charbase?.image_draw?.url}
                  alt={charbase?.name}
                  className="object-contain"
               />
            </div>

            {/* Character Name Top Left */}
            <div className="absolute left-2 top-1 text-white font-bold">
               {charbase?.name}
            </div>
            {/* Character Level Second Line */}
            <div className="absolute left-2 top-6 text-white">Lv.{lv}</div>

            {/* Eidolon Levels; if not unlocked, show 🔒 */}
            <div className="absolute left-2 top-12">
               {charbase?.eidolons?.map((e: any, i: any) => {
                  const elv = chardata?.promotion ?? 0;

                  return (
                     <>
                        {elv > i ? (
                           <>
                              <div className="relative block my-1 h-10 w-10 bg-gray-900 rounded-full drop-shadow-md drop-shadow-[0px_0px_4px_rgba(255,255,255,1)]">
                                 <Image
                                    alt={"Eidolon Lv." + i + 1}
                                    url={e.icon?.url}
                                    className="object-contain"
                                 />
                              </div>
                           </>
                        ) : (
                           <div className="relative flex my-1 items-center justify-center h-10 w-10 bg-gray-900 rounded-full border border-gray-700">
                              <Image
                                 alt={"Eidolon Lv." + i + 1}
                                 url={e.icon?.url}
                                 className="absolute object-contain opacity-30"
                              />
                              <Image
                                 alt="Lock"
                                 url={
                                    "https://wiki-cdn.nalu.wiki/neuralcloud/Algorithm_Lock_Icon_ce5b2d3623.png"
                                 }
                                 className="absolute object-contain h-5 w-5"
                              />
                           </div>
                        )}
                     </>
                  );
               })}
            </div>

            {/* Light Cone Display  */}
            <div className="absolute left-[17rem] top-3 w-48">
               {/* Light Cone Image + Rarity */}
               <div className="relative inline-block align-top w-16">
                  <Image
                     alt={lcbase.name}
                     url={lcbase.image_full?.url}
                     className="object-contain h-16 w-16"
                  />
                  <div className="absolute -bottom-4 h-4 w-16 text-center">
                     <Image
                        alt="Rarity"
                        url={lcbase.rarity?.icon?.url}
                        className="inline-block align-top object-contain h-4"
                     />
                  </div>
               </div>

               {/* Level + Superimposition Levels */}
               <div className="relative inline-block w-28 align-top text-left">
                  <div className="relative block text-white text-sm font-bold">
                     {lcbase.name}
                  </div>
                  <div className="relative inline-block px-2 py-0.5 mx-1 bg-black bg-opacity-90 rounded-md text-xs text-white">
                     Lv.{chardata?.equipment?.level}
                  </div>
                  <div className="relative inline-block text-yellow-100 text-xs bg-yellow-900 rounded-full mx-1 p-0.5 w-6 text-center">
                     {superimp[chardata?.equipment?.promotion]}
                  </div>

                  {/* Stat Values */}
                  {wstats?.map((s) => {
                     const stattype = statTypes.find((a) => a.name == s.name);

                     return (
                        <>
                           <div className="inline-block mx-0.5 my-[1px] rounded-sm bg-black bg-opacity-80">
                              <div className="inline-block align-middle h-5 w-5">
                                 <Image
                                    alt="StatIcon"
                                    url={stattype?.icon?.url}
                                    className="object-fit"
                                 />
                              </div>
                              <div className="inline-block align-middle text-xs text-white">
                                 +{formatStat(stattype?.name, s?.base)}
                              </div>
                           </div>
                        </>
                     );
                  })}
               </div>

               {/* Stat Values */}
            </div>

            {/* Skill Tree ? */}
            <div className="absolute left-48 top-10">
               <SkillTreeDisplay
                  data={chardata}
                  skillTrees={skillTrees}
                  path={charbase?.path?.data_key}
               />
            </div>

            {/* Skill Tree Levels */}
            {/* <div className="absolute left-60 top-12">
               {chardata?.skilltree_list?.map((s: any, i: any) => {
                  const sentry = skillTrees.find((a) => a.id == s.point_id);

                  return (
                     <>
                        <div className="relative block m-1 h-10 w-10 bg-gray-900 bg-opacity-30 rounded-full drop-shadow-md drop-shadow-[0px_0px_4px_rgba(255,255,255,1)]">
                           <Image
                              alt={sentry.name}
                              url={sentry.icon?.url}
                              className="absolute object-contain"
                           />
                           <div className="absolute -bottom-1 right-0 text-right mx-auto bg-neutral-800 rounded-full text-xs px-1 text-white">
                              {s.level}
                           </div>
                        </div>
                     </>
                  );
               })}
            </div> */}

            {/* ================================= */}
            {/* Second Column */}
            {/* ================================= */}

            <div className="absolute left-[29rem] top-3 ">
               {/* Stat Display */}
               <div className="relative w-48 text-white">
                  {statVal.map((s: any) => {
                     const stattype = statTypes.find((a) => a.name == s.name);
                     return (
                        <>
                           <div className="flex items-center px-2">
                              <div className="flex flex-grow items-center space-x-2">
                                 <div>
                                    {stattype?.icon?.url ? (
                                       <div
                                          className="relative inline-flex h-6 w-6 items-center 
                               justify-center rounded-full align-middle"
                                       >
                                          <Image
                                             alt={"StatIcon"}
                                             url={
                                                stattype?.icon?.url ??
                                                "no_image_42df124128"
                                             }
                                             className="h-full w-full object-contain"
                                          />
                                       </div>
                                    ) : null}
                                 </div>
                                 <div className="font-bold text-sm">
                                    {s.name}
                                 </div>
                              </div>
                              {/* Stat Value With Modifier */}
                              <div className="text-sm">
                                 <div className="inline-block">
                                    {" "}
                                    {formatStat(s.name, s.base)}
                                 </div>
                                 {s.mod ? (
                                    <div className="text-green-400 inline-block">
                                       +{formatStat(s.name, s.mod)}
                                    </div>
                                 ) : null}
                              </div>
                           </div>
                        </>
                     );
                  })}

                  {/* NOTE TO REMOVE */}
                  <div className="relative text-xs text-white">
                     * Stat modifiers only include Light Cone currently
                  </div>
               </div>
            </div>

            {/* ================================= */}
            {/* Third Column */}
            {/* ================================= */}

            <div className="absolute left-[42rem] top-3 w-64">
               {rbase?.map((r: any, i: any) => {
                  const rdata = rchar[i];
                  const rlv = rdata.level ?? 0;

                  const mainstat = rdata.mainobj;

                  return (
                     <>
                        <div className="relative w-64 h-14 text-left my-1 bg-gray-900 bg-opacity-30">
                           {/* Relic Image */}
                           <ItemFrameSquare mat={r} style="" />

                           {/* Relic Main Stat and Level */}
                           <div className="inline-block w-12 text-right text-white align-middle leading-none mr-1">
                              <div className="inline-block align-middle h-5 w-5">
                                 <Image
                                    alt="StatIcon"
                                    url={mainstat?.icon?.url}
                                 />
                              </div>
                              <div className="align-middle text-sm font-bold">
                                 {formatStat(mainstat?.name, mainstat?.value)}
                              </div>
                              <div className="align-middle text-xs">+{rlv}</div>
                           </div>

                           {/* Relic Substats */}

                           <div className="inline-block align-middle w-32 text-white leading-none">
                              {rdata.subobj?.map((sub) => {
                                 return (
                                    <>
                                       <div className="inline-block m-0.5 rounded-sm bg-gray-900 bg-opacity-70 pr-1">
                                          <div className="inline-block align-middle h-5 w-5">
                                             <Image
                                                alt="StatIcon"
                                                url={sub?.icon?.url}
                                                className="object-fit"
                                             />
                                          </div>
                                          <div className="inline-block align-middle text-xs">
                                             +
                                             {formatStat(sub?.name, sub?.value)}
                                          </div>
                                       </div>
                                    </>
                                 );
                              })}
                           </div>
                        </div>
                     </>
                  );
               })}
            </div>
         </div>
      </>
   );
};

const ItemFrameSquare = ({ mat, style }: any) => {
   // ========================
   // Generic Item / Character Circle Frame
   // ========================

   return (
      <div
         className={`relative inline-block align-middle text-center h-14 w-14 align-middle ${style}`}
         key={mat?.id}
      >
         <Image
            url={mat?.icon?.url ?? "no_image_42df124128"}
            className={`object-contain h-14 w-14 color-rarity-${
               mat?.rarity?.display_number ?? "1"
            } rounded-md`}
            alt={mat?.name}
         />
      </div>
   );
};

function formatStat(type: any, stat: any) {
   // =====================================
   // Performs Rounding for Stats as Integers or as Percentages as necessary
   // =====================================
   // These are stats that should be formatted as an Integer.
   var intlist = ["HP", "ATK", "DEF", "SPD", "Aggro"];

   // Apply correct number formatting: Intlist should be rounded, otherwise *100 and display as Percentage of #.0% format
   if (intlist.indexOf(type) > -1) {
      stat = "" + Math.floor(Math.round(stat * 100) / 100);
   } else {
      stat =
         (Math.floor(Math.round(stat * 100000) / 100) / 10).toFixed(1) + "%";
   }
   return stat;
}

const SkillTreeDisplay = ({ data, skillTrees, path }: any) => {
   var pathkey = path;
   var treelist = skillTrees.filter(
      (a: any) => a.character?.character_id == data?.avatar_id
   ); // pageData?.attributes?.tree; //skillTreeData;

   // Need to sort skill nodes in order from Point01 - 18
   treelist.sort((a: any, b: any) =>
      a.anchor > b.anchor ? 1 : b.anchor > a.anchor ? -1 : 0
   );

   const connectorcount: any = {
      Knight: 8,
      Warrior: 8,
      Rogue: 8,
      Priest: 9,
      Mage: 6,
      Shaman: 8,
      Warlock: 7,
   };
   // Initialize an array of form [1, 2, 3, ... n], where n is the number of connectors for the character's Path (from connectorcount)
   const connectorlist = Array.from(
      { length: connectorcount[pathkey] },
      (v, k) => k + 1
   );

   return (
      <>
         <div className="canvas mx-auto flex items-center justify-center scale-[0.7]">
            <div className={`canvas-${pathkey}`}></div>

            {connectorlist?.map((con: any) => {
               return (
                  <>
                     <div
                        className={`connector connector-${con}-${pathkey}`}
                     ></div>
                  </>
               );
            })}

            {treelist?.map((node: any, i: any) => {
               const nodelv = data.skilltree_list?.find(
                  (a) => a.point_id == node.point_id
               )?.level;

               return (
                  <>
                     <div
                        className={`point cursor-pointer point-${
                           i + 1
                        }-${pathkey} `}
                        // style={{
                        //    backgroundImage: "url(" + node?.icon?.url + ")",
                        // }}
                     >
                        <Image
                           alt="Icon"
                           url={node?.icon?.url}
                           className="object-contain opacity-20"
                        />
                        {nodelv ? (
                           <div className="absolute w-9 top-1 text-white text-2xl text-center font-bold drop-shadow-[0_0_2px_rgba(250,0,0,0.8)]">
                              {nodelv}
                           </div>
                        ) : null}
                     </div>
                  </>
               );
            })}
         </div>
      </>
   );
};
