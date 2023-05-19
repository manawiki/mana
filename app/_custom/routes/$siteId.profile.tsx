import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
   Link,
   useLoaderData,
   useRevalidator,
   useSearchParams,
   useTransition,
} from "@remix-run/react";
import { useState } from "react";
import { Image } from "~/components";
// import html2canvas from "html2canvas";
import { zx } from "zodix";
import { z } from "zod";
import Tooltip from "~/components/Tooltip";
import { ArrowRight, Loader2, RefreshCcw, X } from "lucide-react";
import { isLoading } from "~/utils";

// Sample data, will import via API for real case
// import { showcaseSample } from "./showcaseSample";

export async function loader({ params, request }: LoaderArgs) {
   const { uid } = zx.parseQuery(request, {
      uid: z.string().optional(),
   });

   if (!uid) return null;

   const showcaseDataUrl = `https://starrail-profiles-prod-fwq2wjp57a-uc.a.run.app/profile/${uid}`;
   const showcaseData = await (await fetch(showcaseDataUrl)).json();

   if (showcaseData.detail)
      return json({
         errorMessage: showcaseData.detail,
      });

   const showcaseSample = showcaseData;

   const refreshCooldown = showcaseData.cooldown;

   const charids = [
      showcaseSample?.detail_info?.assist_avatar?.avatar_id,
      ...showcaseSample?.detail_info?.avatar_detail_list?.map(
         (a: any) => a.avatar_id
      ),
   ];
   const lcids = [
      showcaseSample?.detail_info?.assist_avatar?.equipment?.tid,
      ...showcaseSample?.detail_info?.avatar_detail_list?.map(
         (a: any) => a.equipment?.tid
      ),
   ];
   const rids = [
      ...showcaseSample?.detail_info?.assist_avatar?.relic_list?.map(
         (a: any) => a.tid
      ),
   ];
   const piid = showcaseSample?.detail_info?.head_icon;

   showcaseSample?.detail_info?.avatar_detail_list?.map((a: any) => {
      a.relic_list?.map((b: any) => {
         rids.push(b.tid);
      });
   });
   //We pull all data at the same time
   const [
      { docs: relics },
      { docs: characters },
      { docs: lightCones },
      { docs: skillTrees },
      { docs: statTypes },
      playerIcon,
   ] = await Promise.all([
      await (
         await fetch(
            `https://${
               process.env.PAYLOAD_PUBLIC_SITE_ID
            }-db.mana.wiki/api/relics?depth=3&limit=502&where[id][in]=${rids.toString()}`
         )
      ).json(),
      await (
         await fetch(
            `https://${
               process.env.PAYLOAD_PUBLIC_SITE_ID
            }-db.mana.wiki/api/characters?limit=100&where[id][in]=${charids.toString()}`
         )
      ).json(),
      await (
         await fetch(
            `https://${
               process.env.PAYLOAD_PUBLIC_SITE_ID
            }-db.mana.wiki/api/lightCones?limit=100&where[id][in]=${lcids.toString()}`
         )
      ).json(),
      await (
         await fetch(
            `https://${
               process.env.PAYLOAD_PUBLIC_SITE_ID
            }-db.mana.wiki/api/skillTrees?limit=500&where[character][in]=${charids.toString()}`
         )
      ).json(),
      await (
         await fetch(
            `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/_statTypes?limit=100`
         )
      ).json(),
      await (
         await fetch(
            `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/playerIcons/${piid}`
         )
      ).json(),
   ]);

   return json(
      {
         uid,
         relics,
         characters,
         lightCones,
         skillTrees,
         statTypes,
         playerIcon,
         showcaseData,
         refreshCooldown,
      },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
   );
}

export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Character Showcase - Honkai: Star Rail",
      },
      {
         name: "description",
         content: "A new kind of wiki",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export default function Showcase() {
   const data = useLoaderData<typeof loader>();

   if (!data?.uid || data?.errorMessage) {
      return (
         <div className="mx-auto flex max-w-[728px] justify-center px-3 pt-32">
            <div>
               <h1 className="pb-6 text-center font-header text-3xl">
                  Character Showcase
               </h1>
               <InputUIDNote uid={data?.uid} />
               {data?.errorMessage && (
                  <div className="pt-4 text-center text-sm text-red-400">
                     {data?.errorMessage}
                  </div>
               )}
               <div className="flex items-center justify-center pt-12">
                  <Link
                     className="shadow-1 inline-flex items-center justify-center gap-2 rounded-full border
                  border-blue-100 bg-blue-50 px-3 py-1.5 pl-4 text-sm font-semibold shadow-sm dark:border-zinc-600 dark:bg-zinc-700"
                     to="/starrail/profile?uid=700043897"
                  >
                     <span>Show me an example...</span>
                     <ArrowRight className="text-blue-500" size={20} />
                  </Link>
               </div>
            </div>
         </div>
      );
   }
   const {
      relics,
      characters,
      lightCones,
      skillTrees,
      statTypes,
      playerIcon,
      showcaseData,
      uid,
      refreshCooldown,
   } = data as any;

   const pdata = showcaseData;

   return (
      <>
         <DisplayPlayerInfo
            relics={relics}
            characters={characters}
            lightCones={lightCones}
            skillTrees={skillTrees}
            statTypes={statTypes}
            playerIcon={playerIcon}
            pdata={pdata}
            uid={uid}
            refreshCooldown={refreshCooldown}
         />
      </>
   );
}

const DisplayPlayerInfo = ({
   relics,
   characters,
   lightCones,
   skillTrees,
   statTypes,
   playerIcon,
   pdata,
   uid,
   refreshCooldown,
}: any) => {
   const [displayChar, setDisplayChar] = useState(-1);
   const revalidator = useRevalidator();

   return (
      <main className="-mt-2 pb-20">
         {/* 1) Header with main information for Profile */}
         <PlayerHeader data={pdata} playerIcon={playerIcon} />
         {/* 2) Character selector for available characters in data */}

         <CharacterSelector
            data={pdata}
            characters={characters}
            displayChar={displayChar}
            setDisplayChar={(e: any) => setDisplayChar(e)}
         />
         <div
            className="border-color bg-2 shadow-1 relative -mt-9 border-y
         p-3 desktop:border-y desktop:p-6 desktop:pt-14 desktop:shadow-sm"
         >
            <div className="absolute right-4 top-10 z-40 flex items-center laptop:-top-14">
               <Tooltip
                  id="refreshUid"
                  side="left"
                  html={
                     <div className="flex items-center gap-0.5">
                        <span>Refresh in</span>
                        <span className="font-bold text-zinc-50 underline">
                           {refreshCooldown}
                        </span>
                        <span>seconds</span>
                     </div>
                  }
               >
                  <button
                     className="shadow-1 border-color flex h-10 w-10 items-center justify-center
                     rounded-full border bg-zinc-50 shadow dark:bg-bg2Dark"
                     disabled={true}
                     onClick={() => {
                        revalidator.revalidate();
                     }}
                  >
                     {revalidator.state != "idle" ? (
                        <Loader2 size={16} className="animate-spin" />
                     ) : (
                        <RefreshCcw size={16} />
                     )}
                  </button>
               </Tooltip>
            </div>
            <div className="mx-auto max-w-[1000px]">
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
         </div>
         <div className="border-color bg-2 shadow-1 mx-auto my-16 max-w-[400px] rounded-3xl border px-12 py-9 shadow">
            <InputUIDNote uid={uid} />
         </div>
      </main>
   );
};

const PlayerHeader = ({ data, playerIcon }: any) => {
   const dataClass =
      "rounded-md border font-bold border-color flex gap-1 px-2 py-1 bg-3 shadow shadow-1 text-sm";

   return (
      <>
         <div className="border-color relative border-b px-8 pb-6 pt-24 laptop:pt-16">
            <section className="relative z-10">
               <Image
                  alt="Icon"
                  options="height=100,width=100"
                  url={playerIcon?.icon?.url}
                  className="border-color shadow-1 mx-auto rounded-full border-4 shadow"
               />
               <div className="py-2 text-center font-header text-2xl font-bold">
                  {data?.detail_info?.nickname}
               </div>
               <div className="absolute -bottom-10 left-1/2 flex  -translate-x-1/2 transform cursor-default items-center justify-center gap-3">
                  {/* UID - Will move this elsewhere in future, atm commented out due to mobile issue */}
                  {/* <Tooltip
                     className={`${dataClass}`}
                     id="starrail-uid"
                     content="UID"
                  >
                     {data?.detail_info?.uid}
                  </Tooltip> */}

                  {/* Level (Trailblaze Level) */}
                  <Tooltip
                     className={`${dataClass}`}
                     id="trailblazeLevel"
                     content="Trailblaze Level"
                  >
                     <>
                        <span className="text-1">TL</span>
                        <span>{data?.detail_info?.level}</span>
                     </>
                  </Tooltip>

                  {/* World Level (Equilibrium Level) */}
                  <Tooltip
                     className={`${dataClass}`}
                     id="equilibriumLevel"
                     content="Equilibrium Level"
                  >
                     <>
                        <span className="text-1">EL</span>
                        <span>{data?.detail_info?.world_level}</span>
                     </>
                  </Tooltip>

                  {/* Achievements */}
                  <Tooltip
                     className={`${dataClass}`}
                     id="achievements"
                     content="Achievements Unlocked"
                  >
                     <>
                        <span className="text-1">TA</span>
                        <span>
                           {data?.detail_info?.record_info?.achievement_count}
                        </span>
                     </>
                  </Tooltip>

                  {/* Total Characters */}
                  <Tooltip
                     className={`${dataClass}`}
                     id="owned"
                     content="Owned"
                  >
                     <>
                        <span className="text-1">Owned</span>
                        <span>
                           {data?.detail_info?.record_info?.avatar_count}
                        </span>
                     </>
                  </Tooltip>
               </div>
            </section>
            <div
               className="pattern-opacity-50 pattern-wavy absolute
                   left-0 top-0
                     h-full w-full pattern-bg-white pattern-zinc-200 
                     pattern-size-6 dark:pattern-zinc-800 dark:pattern-bg-zinc-900"
            />
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
      ...data?.detail_info?.avatar_detail_list?.map((a: any) => a.avatar_id),
   ];

   return (
      <>
         <div className="relative z-30 flex items-center justify-center gap-3 pt-10">
            {charids.map((c: any, i: any) => {
               const cdata = characters.find((a: any) => a.character_id == c);

               // Make sure to only show the selector if that character is different from the assist_avatar
               return (
                  <>
                     {i == 0 || (charids[0] != c && i > 0) ? (
                        <>
                           <div
                              className="cursor-pointer"
                              onClick={() => {
                                 setDisplayChar(i - 1);
                              }}
                              key={c + "-" + i}
                           >
                              {/* NOTE: Passing style in as a parameter in case we want to format the actively selected character differently! */}
                              <ItemFrameRound
                                 mat={cdata}
                                 className={`${
                                    displayChar == i - 1
                                       ? "border-zinc-300 shadow dark:border-zinc-400"
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

const ItemFrameRound = ({
   mat,
   className,
}: {
   mat: any;
   className: string;
}) => {
   // ========================
   // Generic Item / Character Circle Frame
   // ========================

   return (
      <div
         className={`rounded-full border-2 border-zinc-100 text-center align-middle dark:border-bg4Dark ${className}`}
         key={mat?.id}
      >
         <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white dark:border-bg3Dark">
            <Image
               options="width=100,height=100"
               url={mat?.icon?.url ?? "no_image_42df124128"}
               className={`h-16 w-16 object-contain color-rarity-${
                  mat?.rarity?.display_number ?? "1"
               } rounded-full`}
               alt={mat?.name}
            />
         </div>
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
   // State Variables:
   // hoverStat = Current mouse-over'd state.
   const [hoverStat, setHoverStat] = useState<string[]>([]);

   // Character Data Loading
   // If the displayChar variable is set to -1, show the assist_avatar; otherwise for 0, 1, 2, show the avatar_detail_list for the corresponding index.
   const chardata =
      displayChar == -1
         ? data?.detail_info?.assist_avatar
         : data?.detail_info?.avatar_detail_list[displayChar];
   const charid = chardata?.avatar_id;

   const charbase = characters.find((a: any) => a.character_id == charid);

   // Character Showcase Canvas!
   const bg_url =
      "https://static.mana.wiki/file/mana-prod/starrail/UI_Star_Bg.png";

   // Light Cone data loading
   const lcid = chardata?.equipment?.tid;
   const lcbase = lightCones.find((a: any) => a.lightcone_id == lcid);
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

   const wi = lcbase.stats[0].data?.findIndex((a: any) => a == wlv + wsuffix);
   var wstats = [
      { name: "HP", base: lcbase.stats[1].data[wi] },
      { name: "ATK", base: lcbase.stats[2].data[wi] },
      { name: "DEF", base: lcbase.stats[3].data[wi] },
   ];

   // Relic data loading
   const rid = chardata?.relic_list?.map((a: any) => a.tid);
   const rbase = rid?.map((r: any) => relics.find((a: any) => a.relic_id == r));

   const rchar = chardata.relic_list?.map((r: any, i: any) => {
      // Relic level
      const rlv = r.level ?? 0;

      // For each relic, need to pull the main stat, and all sub stats
      // Main Stat:
      // - Get Main Stat Icon / Affix ID / Name
      // - Get Value of Main Stat at level
      const mainstat = rbase[i]?.mainstat_group?.find(
         (a: any) => a.affix_id == r.main_affix_id
      );

      // Main stats
      const mainobj = {
         id: mainstat?.stattype?.id,
         name: mainstat?.stattype?.name,
         icon: {
            url: mainstat?.stattype?.icon?.url,
         },
         affix_id: mainstat?.affix_id,
         value: mainstat?.stats[rlv],
      };

      // Sub stats
      const subobj = r.sub_affix_list?.map((s: any) => {
         const ss = rbase[i]?.substat_group?.find(
            (a: any) => a.affix_id == s.affix_id
         );
         const scnt = s.cnt ?? 0;
         const sbase = ss.base_val;
         const sstep = s.step ?? 0;
         const sstepval = ss.level_add;

         var stepdist: any = []; // Has an array of [1, 2, 1, 1, 2, 1 ...] equal in size to scnt, where total sum of elements = sstep.

         // number of '2' rolls is equal to step - cnt;
         for (var d = 0; d < scnt; d++) {
            if (d < sstep - scnt) {
               stepdist[d] = 2;
            } else if (!sstep) {
               stepdist[d] = 0;
            } else {
               stepdist[d] = 1;
            }
         }

         return {
            id: ss?.stattype?.id,
            name: ss?.stattype?.name,
            icon: {
               url: ss?.stattype?.icon?.url,
            },
            affix_id: ss?.affix_id,
            property_classify: ss?.stattype?.property_classify,
            stepDistribution: stepdist,
            value: scnt * sbase + sstepval * sstep, // Value = count * base + (step_value * step)
         };
      });

      // Set name/icon

      return { ...r, mainobj, subobj, set: rbase[i]?.relicset_id };
   });

   // Relic Sets
   // =================
   // Put all relic set data into an object with Relic Set + their corresponding bonuses
   // const rset = [{
   //    id: "102",
   //    name: "Musketeer of Wild Wheat",
   //    num: 2, // Number of artifacts in set
   //    bonuses: [{ stattype: "AttackAddedRatio", value: 0.1199999 }], // Total bonuses from this set, lists all of them for set number requirements less than or equal to amount in set.
   // }];
   const setlist = rbase.map((r: any) => r.relicset_id);
   const rsetids = rchar.map((r: any) => r.set?.id);
   const rset = rsetids
      .filter((v: any, i: any, a: any) => a.indexOf(v) === i)
      .map((r: any) => {
         const currset = setlist.find((s: any) => s.relicset_id == r);
         const numInSet = rsetids.filter((a: any) => a == r)?.length;

         // For each bonus effect in the set, check if the number of artifacts in set is at least equal to the required number:
         var bonuses: any = [];
         var effect_desc: any = [];
         for (var ei = 0; ei < currset?.set_effect?.length; ei++) {
            const eff = currset?.set_effect[ei];

            // If number equipped is at least the required number, return the stat bonuses in property_list
            if (numInSet >= eff?.req_no) {
               eff?.property_list.map((p: any) => {
                  bonuses.push(p);
               });
               effect_desc.push(eff?.description);
            }
         }

         return {
            id: r,
            name: currset?.name,
            num: numInSet,
            bonuses: bonuses,
            effect_desc: effect_desc,
         };
      });

   // Total all relic-sourced bonuses:
   // ============================
   // [ "HPDelta" // FLAT, "HPAddedRatio" // PERCENT]
   var relicbonuses: any = [];

   for (var rb = 0; rb < rchar.length; rb++) {
      const curr = rchar[rb];
      relicbonuses.push(curr.mainobj);

      curr.subobj?.map((a: any) => {
         relicbonuses.push(a);
      });
   }

   for (var sb = 0; sb < rset.length; sb++) {
      const curr = rset[sb];

      curr.bonuses?.map((a: any) => {
         const tempbonus = {
            id: a?.stattype?.id,
            icon: {
               url: a?.stattype?.icon?.url,
            },
            name: a?.stattype?.name,
            property_classify: a?.stattype?.property_classify,
            value: a.value,
         };
         relicbonuses.push(tempbonus);
      });
   }

   // Total all skill tree-sourced bonuses, same format as relic bonuses:
   // ============================
   var skilltreebonuses: any = [];

   for (var sk = 0; sk < chardata?.skilltree_list?.length; sk++) {
      const currpoint = chardata?.skilltree_list[sk];
      var treepoint = skillTrees.find(
         (a: any) => a.point_id == currpoint.point_id
      );

      treepoint.stat_added?.map((a: any) => {
         const tempbonus = {
            id: a?.stat_type?.id,
            icon: {
               url: a?.stat_type?.icon?.url,
            },
            name: a?.stat_type?.name,
            property_classify: a?.stat_type?.property_classify,
            value: a.value,
            point_id: treepoint?.point_id,
         };
         skilltreebonuses.push(tempbonus);
      });
   }

   // ============================
   // ============================

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

   const li = charbase.stats[0].data.findIndex((a: any) => a == lv + suffix);

   const defaultStats = [
      "HP",
      "ATK",
      "DEF",
      "SPD",
      "CRIT Rate",
      "CRIT DMG",
      //   "Aggro",
   ];
   var statVal = defaultStats.map((stat: any, i: any) => {
      // Final Modifier is calculated as follows:
      // ============================
      // Stat = BASE + MODIFIER
      // ---
      // BASE (statbase) = BaseATK + WATK
      // BaseATK = Character's base atk @ LV
      // WATK = Light cone base atk
      // ---
      // MODIFIER (statmod) = RelicATK + BASE*(RelicATK% + Tree% + SetATK%)
      // RelicATK = All relic Flat ATK bonuses
      // RelicATK% = All relic ATK % bonuses
      // SetATK% = All relic set ATK % bonuses
      // Tree% = All tree ATK% bonuses
      const statbase =
         parseFloat(charbase.stats[i + 1].data[li]) +
         (wstats[i]?.base ? parseFloat(wstats[i]?.base) : 0);

      // Flat bonuses =
      const relicflat = relicbonuses
         .filter((a: any) => a.name == stat)
         ?.map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      // Percent Bonuses =
      // - relicperc // Contains both relic and set bonuses
      // - treeperc // Contains all Skill Tree bonuses.
      const relicperc = relicbonuses
         .filter((a: any) => a.name == stat + "%")
         .map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      const treeperc = skilltreebonuses
         .filter((a: any) => a.name == stat + "%")
         .map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      const statmod = relicflat + statbase * (relicperc + treeperc);

      return {
         name: stat,
         base: statbase,
         mod: statmod,
      };
   });

   const additionalStats = [
      "Break Effect%",
      "Outgoing Healing Boost%",
      "Max Energy",
      "Energy Regeneration Rate%",
      "Effect Hit Rate",
      "Effect RES",
      "Physical DMG Boost%",
      "Fire DMG Boost%",
      "Ice DMG Boost%",
      "Lightning DMG Boost%",
      "Wind DMG Boost%",
      "Quantum DMG Boost%",
      "Imaginary DMG Boost%",
      "Physical RES Boost",
      "Fire RES Boost",
      "Ice RES Boost",
      "Lightning RES Boost",
      "Wind RES Boost",
      "Quantum RES Boost",
      "Imaginary RES Boost",
   ];

   additionalStats.map((stat) => {
      // Percent Bonuses =
      // - relicperc // Contains both relic and set bonuses
      // - treeperc // Contains all Skill Tree bonuses.
      const relicperc = relicbonuses
         .filter((a: any) => a.name == stat)
         .map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      const treeperc = skilltreebonuses
         .filter((a: any) => a.name == stat)
         .map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      const statmod = relicperc + treeperc;

      if (statmod > 0) {
         statVal.push({
            name: stat,
            base: 0,
            mod: statmod,
         });
      }
   });

   return (
      <>
         <div className="relative" id="hsr-char-summary">
            <Image
               options="height=1200"
               url={charbase?.image_draw?.url}
               alt={charbase?.name}
               className="hsr-showcase-character absolute -left-16 top-0 w-[520px] object-contain max-desktop:hidden"
            />
            <div className="relative">
               {/* Background-Div */}
               {/* <div className="relative inline-block h-[32rem] w-[960px] overflow-hidden rounded-lg">
                  <img
                     src={bg_url}
                     className="w-full object-fill"
                     alt="background"
                  />
               </div> */}

               <section className="items-stretch gap-6 max-laptop:space-y-4 laptop:flex">
                  {/* ================================= */}
                  {/* First Column */}
                  {/* ================================= */}

                  <div className="relative flex-grow">
                     <Image
                        options="height=1200"
                        url={charbase?.image_draw?.url}
                        alt={charbase?.name}
                        className="hsr-showcase-character mx-auto w-[560px] object-contain desktop:hidden"
                     />
                     <div className="-mt-1">
                        <Link
                           className="font-header text-2xl font-bold leading-none hover:underline"
                           prefetch="intent"
                           to={`/starrail/collections/characters/${charbase?.id}`}
                        >
                           {charbase?.name}
                        </Link>
                        <div className="text-1 text-sm">Lv.{lv}</div>
                     </div>

                     {/* Skill Tree ? */}
                     <div className="absolute max-desktop:-bottom-16 max-desktop:right-0 desktop:-bottom-28 desktop:-left-28">
                        <SkillTreeDisplay
                           data={chardata}
                           skillTrees={skillTrees}
                           path={charbase?.path?.data_key}
                           hoverStat={hoverStat}
                           setHoverStat={setHoverStat}
                        />
                     </div>

                     {/* Eidolon Levels; if not unlocked, show 🔒 */}
                     <div className="absolute left-0 top-16">
                        {charbase?.eidolons?.map((e: any, i: any) => {
                           const elv = chardata?.promotion ?? 0;

                           return (
                              <>
                                 {elv > i ? (
                                    <>
                                       <div className="relative my-1 block h-10 w-10 rounded-full bg-gray-900">
                                          <Image
                                             alt={"Eidolon Lv." + i + 1}
                                             url={e.icon?.url}
                                             className="absolute object-contain"
                                          />
                                          <NameToolTip
                                             text={e?.name}
                                             tooltip={e?.description}
                                             style="absolute"
                                             styleTooltip="left-9 top-9"
                                          />
                                       </div>
                                    </>
                                 ) : (
                                    <div className="relative my-1 flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-900">
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
                                          className="absolute h-5 w-5 object-contain"
                                       />
                                       <NameToolTip
                                          text={e?.name}
                                          tooltip={e?.description}
                                          styleTooltip="left-9 top-9"
                                       />
                                    </div>
                                 )}
                              </>
                           );
                        })}
                     </div>
                  </div>

                  {/* ================================= */}
                  {/* Second Column */}
                  {/* ================================= */}

                  {/* Light Cone Display  */}
                  <div className="mb-1 desktop:w-[300px]">
                     {/* Light Cone Image + Rarity */}
                     <div className="mb-4 flex items-center gap-3 rounded-md">
                        <Link
                           className="block"
                           prefetch="intent"
                           to={`/starrail/collections/lightCones/${lcbase?.id}`}
                        >
                           <div className="relative overflow-hidden rounded">
                              <Image
                                 options="height=140"
                                 alt={lcbase.name}
                                 url={lcbase.image_full?.url}
                                 className="z-0 mx-auto w-14"
                              />
                              <div className="relative z-10 -mt-4 h-4 w-14 rounded  bg-zinc-500 text-center">
                                 <Image
                                    options="width=56"
                                    alt="Rarity"
                                    url={lcbase.rarity?.icon?.url}
                                    className="inline-block h-4 object-contain align-top"
                                 />
                              </div>
                           </div>
                        </Link>

                        {/* Level + Superimposition Levels */}
                        <div className="flex-grow">
                           <div className="relative pb-1.5 font-bold">
                              <div className="text-sm">{lcbase.name}</div>
                              <NameToolTip
                                 text={lcbase?.name}
                                 tooltip={
                                    lcbase?.skill_data[
                                       chardata?.equipment?.promotion - 1
                                    ]?.desc
                                 }
                                 style="absolute top-0 left-0"
                              />
                           </div>
                           <div className="flex flex-grow items-center gap-2">
                              <span className="text-sm">
                                 Lv.{chardata?.equipment?.level}
                              </span>
                              <div
                                 className="relative flex h-4 w-4 items-center justify-center rounded-full bg-yellow-600 
                                 text-xs font-bold text-yellow-100"
                              >
                                 {superimp[chardata?.equipment?.promotion]}
                              </div>
                           </div>

                           {/* Light Cone Stat Values */}
                           <div className="flex items-center gap-2 pt-2">
                              {wstats?.map((s: any) => {
                                 const stattype = statTypes.find(
                                    (a: any) => a.name == s.name
                                 );
                                 const lcstatname = s.name?.replace("%", "");
                                 return (
                                    <>
                                       <div
                                          className={`flex items-center gap-1 rounded-full ${
                                             hoverStat.indexOf(lcstatname) > -1
                                                ? "bg-blue-200 dark:bg-zinc-700"
                                                : hoverStat.length > 0
                                                ? "opacity-40"
                                                : ""
                                          }`}
                                          onMouseOver={() =>
                                             setHoverStat([lcstatname])
                                          }
                                          onMouseOut={() => setHoverStat([])}
                                          onClick={() =>
                                             setHoverStat(
                                                hoverStat.length > 0
                                                   ? []
                                                   : [lcstatname]
                                             )
                                          }
                                       >
                                          <div className="h-5 w-5 rounded-full bg-zinc-400 align-middle dark:bg-zinc-500">
                                             <Image
                                                alt="StatIcon"
                                                url={stattype?.icon?.url}
                                                className="object-fit"
                                             />
                                          </div>
                                          <div className="text-1 inline-block pr-2 align-middle text-xs font-bold">
                                             +
                                             {formatStat(
                                                stattype?.name,
                                                s?.base
                                             )}
                                          </div>
                                       </div>
                                    </>
                                 );
                              })}
                           </div>
                        </div>
                     </div>
                     {/* Stat Display */}
                     <div className="relative">
                        {statVal.map((s: any) => {
                           const stattype = statTypes.find(
                              (a: any) => a.name == s.name
                           );

                           const statname = s.name?.replace("%", "");
                           return (
                              <>
                                 <div
                                    className={`flex cursor-default items-center justify-between border border-transparent
                                    px-2 py-0.5 odd:bg-white/70 even:bg-zinc-50/50 dark:odd:bg-bg3Dark/70 dark:even:bg-bg2Dark/50 ${
                                       hoverStat.indexOf(statname) > -1
                                          ? "shadow-1 border-color !bg-blue-200 shadow-lg dark:!bg-zinc-700"
                                          : hoverStat.length > 0
                                          ? "opacity-40"
                                          : ""
                                    }`}
                                    onMouseOver={() => setHoverStat([statname])}
                                    onMouseOut={() => setHoverStat([])}
                                    onClick={() =>
                                       setHoverStat(
                                          hoverStat.length > 0 ? [] : [statname]
                                       )
                                    }
                                 >
                                    <div className="flex flex-grow items-center gap-2">
                                       <div>
                                          {stattype?.icon?.url ? (
                                             <div
                                                className="flex h-6 w-6 items-center justify-center
                                                rounded-full bg-zinc-400 dark:bg-zinc-500"
                                             >
                                                <Image
                                                   options="height=50,width=50"
                                                   alt={"StatIcon"}
                                                   url={
                                                      stattype?.icon?.url ??
                                                      "no_image_42df124128"
                                                   }
                                                />
                                             </div>
                                          ) : null}
                                       </div>
                                       <div className="text-sm font-bold">
                                          {s.name}
                                       </div>
                                    </div>
                                    {/* Stat Value With Modifier */}
                                    <div className="text-right">
                                       <div className="text-sm font-bold">
                                          {formatStat(s.name, s.base + s.mod)}
                                       </div>
                                       <div className="space-x-0.5 text-[8pt]">
                                          {s.base > 0 ? (
                                             <span className="text-1">
                                                {formatStat(s.name, s.base)}
                                             </span>
                                          ) : null}

                                          {s.mod ? (
                                             <span className="text-green-500">
                                                +{formatStat(s.name, s.mod)}
                                             </span>
                                          ) : null}
                                       </div>
                                    </div>
                                 </div>
                              </>
                           );
                        })}
                     </div>
                  </div>
                  {/* ================================= */}
                  {/* Third Column */}
                  {/* ================================= */}

                  <div className="space-y-2 desktop:w-[300px]">
                     {/* Individual Relics */}

                     {/* Artifact Substat Legend (?) */}
                     <div className="relative text-right w-full">
                        <div className="w-4 h-4 rounded-full my-auto text-center inline-block relative border border-color cursor-default text-xs">
                           ?
                           <NameToolTip
                              text={"Artifact Substats"}
                              tooltip="Each group of dots represents an individual time the substat was rolled into. The number of dots represent the quality of substat rolls:<br>. = Lowest roll<br>.. = Medium roll<br>... = Highest roll (best)"
                              style="absolute w-[inherit] top-0 left-0"
                              styleTooltip="left-10"
                           />
                        </div>
                     </div>

                     {rbase?.map((r: any, i: any) => {
                        const rdata = rchar[i];
                        const rlv = rdata.level ?? 0;

                        const mainstat = rdata.mainobj;

                        const mainstatname = mainstat?.name?.replace("%", "");

                        return (
                           <>
                              <div className="relative flex items-center justify-between gap-2">
                                 {/* Relic Image */}
                                 <ItemFrameSquare
                                    mat={r}
                                    style=""
                                    lv={"+" + rlv}
                                 />

                                 {/* Relic Main Stat and Level */}
                                 <div className="bg-3 flex h-[62px] flex-grow items-center justify-between rounded p-1">
                                    <div
                                       className={`ml-1 flex items-center gap-1.5 rounded p-1 cursor-default ${
                                          hoverStat.indexOf(mainstatname) > -1
                                             ? "bg-blue-200 dark:bg-zinc-700"
                                             : hoverStat.length > 0
                                             ? "opacity-40"
                                             : "bg-3"
                                       }`}
                                       onMouseOver={() =>
                                          setHoverStat([mainstatname])
                                       }
                                       onMouseOut={() => setHoverStat([])}
                                       onClick={() =>
                                          setHoverStat(
                                             hoverStat.length > 0
                                                ? []
                                                : [mainstatname]
                                          )
                                       }
                                    >
                                       <div
                                          className="inline-flex h-6 w-6 items-center justify-center
                                                gap-1 rounded-full bg-zinc-400 dark:bg-zinc-600"
                                       >
                                          <Image
                                             options="height=40,width=40"
                                             alt="StatIcon"
                                             url={mainstat?.icon?.url}
                                          />
                                       </div>
                                       <div className="text-sm font-bold">
                                          {formatStat(
                                             mainstat?.name,
                                             mainstat?.value
                                          )}
                                       </div>
                                    </div>

                                    {/* Relic Substats */}
                                    <div className="grid grid-cols-2 gap-0.5 text-center">
                                       {rdata.subobj?.map((sub: any) => {
                                          const steptext =
                                             sub?.stepDistribution?.map(
                                                (step: any) =>
                                                   step == 0
                                                      ? "."
                                                      : step == 1
                                                      ? ".."
                                                      : "..."
                                             );
                                          const statname = sub.name?.replace(
                                             "%",
                                             ""
                                          );
                                          return (
                                             <>
                                                <div
                                                   className={`flex cursor-default items-center rounded px-1 py-0.5 ${
                                                      hoverStat.indexOf(
                                                         statname
                                                      ) > -1
                                                         ? "bg-blue-200 dark:bg-zinc-700"
                                                         : hoverStat.length > 0
                                                         ? "opacity-40"
                                                         : ""
                                                   }`}
                                                   onMouseOver={() =>
                                                      setHoverStat([statname])
                                                   }
                                                   onMouseOut={() =>
                                                      setHoverStat([])
                                                   }
                                                   onClick={() =>
                                                      setHoverStat(
                                                         hoverStat.length > 0
                                                            ? []
                                                            : [statname]
                                                      )
                                                   }
                                                >
                                                   <div>
                                                      <div className="flex items-center gap-1">
                                                         <div
                                                            className="inline-flex h-4 w-4 items-center 
                                                justify-center rounded-full bg-zinc-400 dark:bg-zinc-600"
                                                         >
                                                            <Image
                                                               options="height=20,width=20"
                                                               alt="StatIcon"
                                                               url={
                                                                  sub?.icon?.url
                                                               }
                                                               className="object-fit"
                                                            />
                                                         </div>
                                                         <div className="text-xs">
                                                            +
                                                            {formatStat(
                                                               sub?.name,
                                                               sub?.value
                                                            )}
                                                         </div>
                                                      </div>
                                                      <div className="mt-0.5 flex w-full">
                                                         {steptext?.map(
                                                            (st: any) => {
                                                               return (
                                                                  <>
                                                                     <div
                                                                        className={`mx-1 -mt-2.5 inline-flex w-full justify-center text-center text-sm leading-none text-blue-500  ${
                                                                           st ==
                                                                           "="
                                                                              ? "text-opacity-0"
                                                                              : ""
                                                                        }`}
                                                                     >
                                                                        {st}
                                                                     </div>
                                                                  </>
                                                               );
                                                            }
                                                         )}
                                                      </div>
                                                   </div>
                                                </div>
                                             </>
                                          );
                                       })}
                                    </div>
                                 </div>
                              </div>
                           </>
                        );
                     })}

                     {/* Relic Set Bonuses */}
                     <div className="!mt-3 space-y-2">
                        {rset?.map((set: any) => {
                           var setdesc = "";

                           set.effect_desc.map((e: any, i: any) => {
                              setdesc +=
                                 e +
                                 (i < set.effect_desc.length - 1
                                    ? "<br><br>"
                                    : "");
                           });

                           // Check if any of the stat bonuses in the set apply to the currently highlighted stat.
                           const sbonuses = set.bonuses?.map((b: any) =>
                              b.stattype?.name?.replace("%", "")
                           );

                           const highlightStyle =
                              intersect(sbonuses, hoverStat)?.length > 0
                                 ? "bg-blue-200 dark:bg-zinc-700"
                                 : hoverStat.length > 0
                                 ? "opacity-40"
                                 : "";

                           // Check if any of the set bonuses also include the currently highlighted stat

                           return (
                              <>
                                 <div
                                    className={`bg-3 flex items-center justify-between rounded-lg px-3 py-2 text-xs ${highlightStyle}`}
                                    onMouseOver={() => setHoverStat(sbonuses)}
                                    onMouseOut={() => setHoverStat([])}
                                    onClick={() =>
                                       setHoverStat(
                                          hoverStat?.length > 0 ? [] : sbonuses
                                       )
                                    }
                                 >
                                    <div className="relative font-bold">
                                       {set.name}
                                       <NameToolTip
                                          text={set?.name}
                                          tooltip={setdesc}
                                          style="absolute top-0 left-0"
                                       />
                                    </div>
                                    <div
                                       className="bg-2 relative flex h-6 w-6 items-center justify-center 
                                        rounded-full font-bold text-green-400"
                                    >
                                       {set.num}
                                    </div>
                                 </div>
                              </>
                           );
                        })}
                     </div>
                  </div>
               </section>
            </div>
         </div>

         {/* <ScreenshotButton /> */}
      </>
   );
};

const ItemFrameSquare = ({ mat, style, lv }: any) => {
   // ========================
   // Generic Item / Character Circle Frame - Light Cone
   // ========================

   return (
      <a href={`/starrail/collections/relicSets/${mat?.relicset_id?.id}`}>
         <div
            className={`relative inline-block text-center align-middle ${style}`}
            key={mat?.id}
         >
            <Image
               url={mat?.icon?.url ?? "no_image_42df124128"}
               className={`h-[62px] w-[62px] object-contain color-rarity-${
                  mat?.rarity?.display_number ?? "1"
               } rounded-md`}
               alt={mat?.name}
            />
            <div
               className="absolute bottom-0.5 right-0.5 rounded bg-zinc-900 
               bg-opacity-70 px-1 py-0.5 text-xs font-bold text-white"
            >
               {lv}
            </div>
         </div>
      </a>
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

const SkillTreeDisplay = ({
   data,
   skillTrees,
   path,
   hoverStat,
   setHoverStat,
}: any) => {
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
         <div className="canvas mx-auto flex scale-[0.5] items-center justify-center">
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
                  (a: any) => a.point_id == node.point_id
               )?.level;

               // Populate node description tooltip text
               var detail_desc = "";
               if (nodelv) {
                  detail_desc =
                     node.affected_skill?.[0]?.description_per_level?.[
                        nodelv - 1
                     ]?.description ?? "";
               }

               const node_desc = node?.description + detail_desc;

               // Check if any of the node's stat_added equal the current highlighted hoverStat

               const skillstats =
                  node?.stat_added?.map((s: any) =>
                     s.stat_type?.name?.replace("%", "")
                  ) ?? [];

               const treeHighlight =
                  intersect(skillstats, hoverStat)?.length > 0 ? "invert" : "";

               return (
                  <>
                     <div
                        className={`point point-${
                           i + 1
                        }-${pathkey} ${treeHighlight}`}
                        // style={{
                        //    backgroundImage: "url(" + node?.icon?.url + ")",
                        // }}
                     >
                        <Image
                           alt="Icon"
                           url={node?.icon?.url}
                           className={`object-contain opacity-20 `}
                        />

                        {nodelv ? (
                           <div className="absolute top-1 w-9 text-center text-2xl font-bold text-white  drop-shadow-[0_0_2px_rgba(250,0,0,0.8)]">
                              {nodelv}
                           </div>
                        ) : null}
                     </div>
                     <div
                        className={`absolute z-30 h-[20px] w-[20px] origin-top-left scale-[2.0] point-${
                           i + 1
                        }-${pathkey}`}
                        onMouseOver={() => setHoverStat(skillstats)}
                        onMouseOut={() => setHoverStat([])}
                        onClick={() =>
                           setHoverStat(hoverStat.length > 0 ? [] : skillstats)
                        }
                     >
                        <NameToolTip
                           text={node?.name}
                           tooltip={node_desc}
                           style={``}
                        />
                     </div>
                  </>
               );
            })}
         </div>
      </>
   );
};

const InputUIDNote = ({ uid }: { uid: any }) => {
   const [inputUID, setInputUID] = useState(uid);
   const [searchParams, setSearchParams] = useSearchParams({});
   const transition = useTransition();
   const isSearching = isLoading(transition);
   return (
      <div>
         <div className="text-1 pb-4 text-center font-bold">
            Enter UID to view your profile
         </div>
         <div className="mx-auto flex max-w-[600px] items-center justify-center gap-3">
            <div className="relative">
               <input
                  required
                  className="shadow-1 rounded border border-zinc-200 bg-zinc-50
               shadow-sm focus:ring-0 dark:border-zinc-600 dark:bg-bg4Dark"
                  type="text"
                  placeholder="Enter UID..."
                  value={inputUID}
                  onChange={(e) => setInputUID(e.target.value)}
               />
               {inputUID && (
                  <button
                     className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center"
                     onClick={() => {
                        setSearchParams((searchParams) => {
                           searchParams.delete("uid");
                           return searchParams;
                        });
                        setInputUID("");
                     }}
                  >
                     <X size={20} className="pt-0.5 text-red-400" />
                  </button>
               )}
            </div>
            <div className="flex items-center gap-2">
               <button
                  className="flex h-10 w-20 items-center justify-center
                  rounded bg-blue-500 px-3 text-sm font-bold text-white"
                  onClick={() => {
                     setSearchParams((searchParams) => {
                        searchParams.set("uid", inputUID);
                        return searchParams;
                     });
                  }}
               >
                  {isSearching ? (
                     <Loader2 className="h-6 w-6 animate-spin text-white" />
                  ) : (
                     "Submit"
                  )}
               </button>
            </div>
         </div>
      </div>
   );
};

const BadUIDNote = () => {
   return (
      <div className="mx-auto mb-8 max-w-[960px] max-desktop:px-3">
         <div className="border-color rounded-md border p-3 text-xl">
            <div>UID data not found.</div>
            <div className="text-md italic">
               * Note CN Server support is not yet available.
            </div>
         </div>
      </div>
   );
};

const NameToolTip = ({ text, tooltip, style = "", styleTooltip = "" }: any) => {
   const [ttip, setTtip] = useState(false);
   return (
      <>
         <div
            className={`z-30 h-full w-full ${style}`}
            onMouseOver={() => setTtip(true)}
            onMouseOut={() => setTtip(false)}
            onClick={() => setTtip(!ttip)}
         >
            {/* {text} */}

            <div
               className={`absolute left-6 top-6 z-40 w-64 rounded-md border border-gray-700 bg-gray-900 bg-opacity-90 px-2 py-1 text-xs text-gray-50 ${styleTooltip} ${
                  ttip ? "block" : "hidden"
               }`}
            >
               <div className="text-sm font-bold text-blue-400 dark:text-blue-600">
                  {text}
               </div>
               <div
                  className="italic"
                  dangerouslySetInnerHTML={{ __html: tooltip }}
               ></div>
            </div>
         </div>
      </>
   );
};

function intersect(a: any, b: any) {
   var result = a?.filter(function (n: any) {
      return b?.indexOf(n) > -1;
   });

   return result;
}

// function getScreenshotOfElement(element, posX, posY, width, height, callback) {
//    html2canvas(element, {
//       // width: width,
//       // height: height,
//       useCORS: true,
//       allowTaint: true,
//       logging: false,
//       // scrollX: 0,
//       // scrollY: 0,
//       // windowWidth: window.innerWidth,
//       // windowHeight: window.innerHeight,
//    }).then(function (canvas) {
//       // var context = canvas.getContext("2d");
//       // var imageData = context.getImageData(posX, posY, width, height).data;
//       // var outputCanvas = document.createElement("canvas");
//       // var outputContext = outputCanvas.getContext("2d");
//       // outputCanvas.width = width;
//       // outputCanvas.height = height;

//       // var idata = outputContext.createImageData(width, height);
//       // idata.data.set(imageData);
//       // outputContext.putImageData(idata, 0, 0);
//       // callback(outputCanvas.toDataURL("image/png"));
//       callback(canvas.toDataURL("image/png"));
//    });
// }

// const ScreenshotButton = () => {
//    return (
//       <div
//          className=""
//          onClick={() => {
//             const summ = document.getElementById("hsr-char-summary");
//             getScreenshotOfElement(summ, 0, 0, 960, 512, function (data) {
//                // in the data variable there is the base64 image
//                // exmaple for displaying the image in an <img>
//             });
//          }}
//       >
//          Screenshot Test
//       </div>
//    );
// };
