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
   var url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/relics?limit=500`;
   const relicRaw = await (await fetch(url)).json();
   const relics = relicRaw.docs;

   url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/characters?limit=500`;
   const characterRaw = await (await fetch(url)).json();
   const characters = characterRaw.docs;

   url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/lightCones?limit=500`;
   const lightConeRaw = await (await fetch(url)).json();
   const lightCones = lightConeRaw.docs;

   url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/_statTypes?limit=100`;
   const statTypesRaw = await (await fetch(url)).json();
   const statTypes = statTypesRaw.docs;

   return json({ relics, characters, lightCones, statTypes });
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
   const { statTypes } = useLoaderData<typeof loader>();

   const pdata = showcaseSample;
   const [displayChar, setDisplayChar] = useState(-1);

   return (
      <>
         <div className="mx-auto mb-8 max-w-[728px] max-desktop:px-3">
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
                                       ? "drop-shadow-md dark:drop-shadow-[0px_0px_4px_rgba(255,255,255,1)]"
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

   // Character Base Stat Calculation
   const lv = chardata.level;
   const li = charbase.stats[0].data.findIndex((a) => a == lv);
   var statVal = [
      { name: "HP", base: charbase.stats[1].data[li] },
      { name: "ATK", base: charbase.stats[2].data[li] },
      { name: "DEF", base: charbase.stats[3].data[li] },
      { name: "SPD", base: charbase.stats[4].data[li] },
      { name: "CRIT Rate", base: charbase.stats[5].data[li] },
      { name: "CRIT DMG", base: charbase.stats[6].data[li] },
      { name: "Aggro", base: charbase.stats[7].data[li] },
   ];

   // Light Cone data loading
   const lcid = chardata?.equipment?.tid;
   const lcbase = lightCones.find((a) => a.lightcone_id == lcid);
   const superimp = ["0", "I", "II", "III", "IV", "V"];

   // Relic data loading
   const rid = chardata?.relic_list?.map((a) => a.tid);
   const rbase = rid?.map((r) => relics.find((a) => a.relic_id == r));
   console.log(rid);
   console.log(rbase);

   return (
      <>
         <div className="relative my-3 rounded-md w-full h-96 text-center overflow-x-auto overflow-y-hidden">
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

            {/* ================================= */}
            {/* Second Column */}
            {/* ================================= */}
            {/* Light Cone Display  */}
            <div className="absolute left-80 top-1 h-28 w-48 overflow-hidden text-center">
               <div className="relative block">
                  <Image
                     alt={lcbase.name}
                     url={lcbase.icon?.url}
                     className="object-contain h-16 w-48"
                  />
               </div>
               <div className="relative block text-white text-sm">
                  {lcbase.name} Lv.{chardata?.equipment?.level}
               </div>
               <div className="relative inline-block text-yellow-100 text-xs bg-yellow-900 rounded-full p-0.5 w-6">
                  {superimp[chardata?.equipment?.promotion]}
               </div>
            </div>

            {/* Stat Display */}
            <div className="absolute left-80 top-32 w-48 text-white">
               {statVal.map((s: any) => {
                  return (
                     <>
                        {/* <div className="">{JSON.stringify(s.name)}</div> */}
                        <div className="flex items-center px-2">
                           <div className="flex flex-grow items-center space-x-2">
                              <div>
                                 {s.hash ? (
                                    <div
                                       className="relative inline-flex h-6 w-6 items-center 
                               justify-center rounded-full align-middle"
                                    >
                                       <Image
                                          alt="Character Stat"
                                          url={s.hash ?? "no_image_42df124128"}
                                          className="h-full w-full object-contain"
                                       />
                                    </div>
                                 ) : null}
                              </div>
                              <div className="text-1 font-bold">{s.name}</div>
                           </div>
                           <div className="">{formatStat(s.name, s.base)}</div>
                        </div>
                     </>
                  );
               })}
            </div>

            {/* ================================= */}
            {/* Third Column */}
            {/* ================================= */}

            <div className="absolute right-24 top-0 w-24">
               {rbase?.map((r: any) => {
                  return (
                     <>
                        <ItemFrameSquare mat={r} style="" />
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
         className={`relative align-middle text-center m-1 h-16 w-16 align-middle ${style}`}
         key={mat?.id}
      >
         <Image
            url={mat?.icon?.url ?? "no_image_42df124128"}
            className={`object-contain h-16 w-16 color-rarity-${
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
         (Math.floor(Math.round(stat * 100000) / 10) / 100).toFixed(1) + "%";
   }
   return stat;
}
