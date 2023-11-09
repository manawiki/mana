import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import type {
   ActionFunctionArgs,
   LoaderFunctionArgs,
   MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
   Form,
   Link,
   useLoaderData,
   useNavigation,
   useRevalidator,
   useSearchParams,
} from "@remix-run/react";
import { toPng } from "html-to-image";
import type { Material } from "payload/generated-custom-types";
import { z } from "zod";
import { zx } from "zodix";

import { settings } from "mana-config";
import { fetchShowcase } from "~/_custom/showcase-cache.server";
import { Image } from "~/components";
import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import { isLoading } from "~/utils";
import { fetchWithCache } from "~/utils/cache.server";

// Sample data, will import via API for real case
// import { showcaseSample } from "./showcaseSample";

export { ErrorBoundary } from "~/components/ErrorBoundary";

async function fetchGQL(query: string, variables?: Record<string, any>) {
   const { data, errors } = await fetchWithCache(
      `https://${settings.siteId}-db.${settings.domain}/api/graphql`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            query,
            variables,
         }),
      },
   );

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      // throw new Error();
   }
   // console.log(variables, data);

   return data;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
   const { uid } = zx.parseQuery(request, {
      uid: z.string().optional(),
   });

   if (!uid) return null;

   const showcaseDataUrl = `https://starrail-showcase.mana.wiki/api/showcase/${uid}`;
   const showcaseData = await fetchShowcase(showcaseDataUrl);

   if (showcaseData.detail)
      return json({
         errorMessage: showcaseData.detail,
      });

   const showcaseSample = showcaseData;

   const refreshCooldown = showcaseData.cooldown;

   const charids = [
      showcaseSample?.detail_info?.assist_avatar?.avatar_id.toString(),
      ...showcaseSample?.detail_info?.avatar_detail_list?.map((a: any) =>
         a.avatar_id.toString(),
      ),
   ];
   const lcids = [
      showcaseSample?.detail_info?.assist_avatar?.equipment?.tid.toString(),
      ...showcaseSample?.detail_info?.avatar_detail_list?.map(
         (a: any) => a.equipment?.tid.toString(),
      ),
   ];
   const rids = [
      ...showcaseSample?.detail_info?.assist_avatar?.relic_list?.map((a: any) =>
         a.tid.toString(),
      ),
   ];
   const piid = showcaseSample?.detail_info?.head_icon.toString();

   showcaseSample?.detail_info?.avatar_detail_list?.map((a: any) => {
      a.relic_list?.map((b: any) => {
         rids.push(b.tid.toString());
      });
   });

   const [
      { relics },
      { characters },
      { lightcones },
      { skillTrees },
      { statTypes },
      { playerIcon },
   ] = await Promise.all([
      fetchGQL(RelicQuery, { relicIdList: rids }),
      fetchGQL(CharacterQuery, { characterIdList: charids }),
      fetchGQL(LightConeQuery, { lightconeIdList: lcids }),
      fetchGQL(SkillTreeQuery, { skillTreeIdList: charids }),
      fetchGQL(StatTypeQuery),
      fetchGQL(PlayerIconQuery, { playerIconId: piid }),
   ]);

   return json(
      {
         uid: uid,
         relics: relics.docs,
         characters: characters.docs,
         lightCones: lightcones.docs,
         skillTrees: skillTrees.docs,
         statTypes: statTypes.docs,
         playerIcon: playerIcon,
         showcaseData: showcaseData,
         refreshCooldown: refreshCooldown,
      },
      { headers: { "Cache-Control": "public, s-maxage=60" } },
   );
}

export const meta: MetaFunction = () => {
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
         <div className="relative z-20 mx-auto flex max-w-[728px] justify-center px-3 pb-36 pt-24">
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
                     className="shadow-1 bg-3 inline-flex items-center justify-center gap-2 rounded-full
                  border border-blue-200 bg-zinc-50 px-3 py-1.5 pl-4 text-sm font-semibold shadow-sm dark:border-zinc-700"
                     to="/starrail/showcase?uid=700043897"
                  >
                     <span>Show me an example...</span>
                     <Icon
                        name="arrow-right"
                        className="text-blue-500"
                        size={20}
                     />
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
      <main className="desktop:pb-16">
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
            id="showcase-canvas"
            className="border-color bg-2 relative -mt-9 border-y
         desktop:border-y  desktop:p-6 desktop:pt-8"
         >
            {/* <div className="absolute right-4 top-10 z-40 flex items-center laptop:-top-14">
               <Tooltip
                  id="refreshUid"
                  side="left"
                  html={
                     //needs to be actual html string, not jsx
                     `<div class="flex items-center gap-0.5">
                        <span>Refresh in</span>
                        <span class="font-bold text-zinc-50 underline">
                           ${refreshCooldown}
                        </span>
                        <span>seconds</span>
                     </div>`
                  }
               >
                  <button
                     className="shadow-1 border-color flex h-10 w-10 items-center justify-center
                     rounded-full border bg-zinc-50 shadow disabled:opacity-50 dark:bg-bg2Dark"
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
            </div> */}
            <div className="mx-auto max-w-[1100px]">
               {/* 3) Primary Character display section */}
               <CharacterInfo
                  data={pdata}
                  characters={characters}
                  lightCones={lightCones}
                  relics={relics}
                  skillTrees={skillTrees}
                  statTypes={statTypes}
                  displayChar={displayChar}
                  refreshCooldown={refreshCooldown}
               />
            </div>
         </div>
         <div
            className="border-color bg-2 shadow-1 mx-auto my-16 max-w-[360px] border-y px-12 
            py-9 shadow mobile:rounded-3xl mobile:border"
         >
            <InputUIDNote uid={uid} />
         </div>
      </main>
   );
};

const PlayerHeader = ({ data, playerIcon }: any) => {
   const dataClass =
      "rounded-md border font-bold border-color justify-between flex gap-1 px-2 py-1.5 bg-3 shadow-sm shadow-1 text-xs";

   return (
      <>
         <div className="border-color relative z-20 border-b p-3 pb-8 pt-16">
            <section className="relative z-10">
               <Image
                  alt="Icon"
                  options="aspect_ratio=1:1&height=100&width=100"
                  url={playerIcon?.icon?.url}
                  className="border-color shadow-1 mx-auto rounded-full border-4 shadow"
               />
               <div className="py-2 text-center font-header text-2xl font-bold">
                  {data?.detail_info?.nickname}
               </div>
               <div
                  className="mx-auto grid max-w-xl cursor-default
                  grid-cols-2 gap-2 p-2 pt-2 laptop:grid-cols-4"
               >
                  {/* UID - Will move this elsewhere in future, atm commented out due to mobile issue */}

                  <Tooltip>
                     <TooltipTrigger className={dataClass}>
                        <span className="text-1 truncate">UID</span>
                        <span>{data?.detail_info?.uid}</span>
                     </TooltipTrigger>
                     <TooltipContent>UID</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger className={dataClass}>
                        <span className="text-1">Trailblaze Lvl</span>
                        <span>{data?.detail_info?.level}</span>
                     </TooltipTrigger>
                     <TooltipContent>Trailblaze Level</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger className={dataClass}>
                        <span className="text-1">Equilibrium Lvl</span>
                        <span>{data?.detail_info?.world_level}</span>
                     </TooltipTrigger>
                     <TooltipContent>Equilibrium Level</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger className={dataClass}>
                        <span className="text-1">Achievements</span>
                        <span>
                           {data?.detail_info?.record_info?.achievement_count}
                        </span>
                     </TooltipTrigger>
                     <TooltipContent>Achievements Unlocked</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger className={dataClass}>
                        <span className="text-1">Characters</span>
                        <span>
                           {data?.detail_info?.record_info?.avatar_count}
                        </span>
                     </TooltipTrigger>
                     <TooltipContent>Characters Owned</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger className={dataClass}>
                        <span className="text-1">Simulated</span>
                        <span>
                           {data?.detail_info?.record_info?.rogue_area_progress}
                        </span>
                     </TooltipTrigger>
                     <TooltipContent>Simulated Universe World</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger className={dataClass}>
                        <span className="text-1 truncate">F. Hall Normal</span>
                        <span>
                           {
                              data?.detail_info?.record_info?.challenge_info
                                 ?.none_schedule_max_level
                           }
                        </span>
                     </TooltipTrigger>
                     <TooltipContent>Forgotten Hall Normal</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger className={dataClass}>
                        <span className="text-1 truncate">F. Hall Hard</span>
                        <span>
                           {
                              data?.detail_info?.record_info?.challenge_info
                                 ?.schedule_max_level
                           }
                        </span>
                     </TooltipTrigger>
                     <TooltipContent>Forgotten Hall Hard</TooltipContent>
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
         <div className="relative z-20 -mt-5 flex items-center justify-center gap-3">
            {charids.map((c: any, i: any) => {
               const cdata = characters.find((a: any) => a.character_id == c);

               // Make sure to only show the selector if that character is different from the assist_avatar
               return i == 0 || (charids[0] != c && i > 0) ? (
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
               ) : null;
            })}
         </div>
      </>
   );
};

const ItemFrameRound = ({
   mat,
   className,
}: {
   mat: Material;
   className: string;
}) => {
   // ========================
   // Generic Item / Character Circle Frame
   // ========================

   return (
      <div
         className={`rounded-full border-2 border-zinc-200 text-center align-middle dark:border-bg4Dark ${className}`}
         key={mat?.id}
      >
         <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white dark:border-bg3Dark">
            <Image
               options="aspect_ratio=1:1&height=100&width=100"
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
   refreshCooldown,
}: any) => {
   // State Variables:
   // hoverStat = Current mouse-over'd state.
   const [hoverStat, setHoverStat] = useState<string[]>([]);

   //Disable Refresh if already submitting
   const navigation = useNavigation();

   const [disableRefresh, setDisableRefresh] = useState<boolean>(true);

   useEffect(() => {
      // Turn disableRefresh false after 60 seconds
      setTimeout(() => {
         setDisableRefresh(false);
      }, refreshCooldown * 1000);

      // Disable Refresh if already submitting
      if (navigation.state !== "idle") setDisableRefresh(true);
   }, [navigation.state, refreshCooldown]);

   // Character Data Loading
   // If the displayChar variable is set to -1, show the assist_avatar; otherwise for 0, 1, 2, show the avatar_detail_list for the corresponding index.
   const chardata =
      displayChar == -1
         ? data?.detail_info?.assist_avatar
         : data?.detail_info?.avatar_detail_list[displayChar];
   const charid = chardata?.avatar_id;

   const charbase = characters.find((a: any) => a.character_id == charid);

   // Character Showcase Canvas!
   const bg_url = "https://static.mana.wiki/starrail/UI_Star_Bg.png";

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

   const wi = lcbase?.stats[0].data?.findIndex((a: any) => a == wlv + wsuffix);
   var wstats = [
      { name: "HP", base: lcbase?.stats[1].data[wi] },
      { name: "ATK", base: lcbase?.stats[2].data[wi] },
      { name: "DEF", base: lcbase?.stats[3].data[wi] },
   ];

   // Total all light cone-sourced bonuses, same format as relic bonuses:
   // ============================
   var lightconebonuses: any = [];

   lcbase?.skill_data[chardata?.equipment?.promotion - 1]?.stat_added?.map(
      (a: any) => {
         const tempbonus = {
            id: a?.stat_type?.id,
            icon: {
               url: a?.stat_type?.icon?.url,
            },
            name: a?.stat_type?.name,
            property_classify: a?.stat_type?.property_classify,
            value: a.value,
         };
         lightconebonuses.push(tempbonus);
      },
   );

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
         (a: any) => a.affix_id == r.main_affix_id,
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
            (a: any) => a.affix_id == s.affix_id,
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
         const currset = setlist.find((s: any) => s.id == r);
         const numInSet = rsetids.filter((a: any) => a == r)?.length;

         var show = false;

         // For each bonus effect in the set, check if the number of artifacts in set is at least equal to the required number:
         var bonuses: any = [];
         var effect_desc: any = [];
         for (var ei = 0; ei < currset?.set_effect?.length; ei++) {
            const eff = currset?.set_effect[ei];

            // If number equipped is at least the required number, return the stat bonuses in property_list
            if (numInSet >= eff?.req_no) {
               show = true;

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
            show: show,
            bonuses: bonuses,
            effect_desc: effect_desc,
         };
      })
      .filter((a: any) => a.show === true);

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
         (a: any) => a.point_id == currpoint.point_id,
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
      // MODIFIER (statmod) = RelicATK + TreeATK + lcATK + BASE*(RelicATK% + TreeATK% + SetATK% + lcATK%)
      // RelicATK = All relic Flat ATK bonuses
      // RelicATK% = All relic ATK % bonuses
      // SetATK% = All relic set ATK % bonuses
      // TreeATK = All tree Flat ATK bonuses
      // TreeATK% = All tree ATK% bonuses
      // lcATK = All light cone skill Flat bonuses
      // lcATK% = All light cone skill % bonuses

      const statbase =
         parseFloat(charbase.stats[i + 1].data[li]) +
         (wstats[i]?.base ? parseFloat(wstats[i]?.base) : 0);

      // Flat bonuses =
      const relicflat = relicbonuses
         .filter((a: any) => a.name == stat)
         ?.map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      const treeflat = skilltreebonuses
         .filter((a: any) => a.name == stat)
         .map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      const lcflat = lightconebonuses
         .filter((a: any) => a.name == stat)
         .map((a: any) => a.value)
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

      const lcperc = lightconebonuses
         .filter((a: any) => a.name == stat + "%")
         .map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      const statmod =
         relicflat +
         treeflat +
         lcflat +
         statbase * (relicperc + treeperc + lcperc);

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
      // - lcperc // Contains all Light Cone bonuses.
      const relicperc = relicbonuses
         .filter((a: any) => a.name == stat)
         .map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      const treeperc = skilltreebonuses
         .filter((a: any) => a.name == stat)
         .map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      const lcperc = lightconebonuses
         .filter((a: any) => a.name == stat)
         .map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      const statmod = relicperc + treeperc + lcperc;

      if (statmod > 0) {
         statVal.push({
            name: stat,
            base: 0,
            mod: statmod,
         });
      }
   });

   // Light cone name highlighting if stat bonus is involved

   const lcbonuses = lightconebonuses?.map(
      (b: any) => b?.name?.replace("%", ""),
   );
   const lcHighlightStyle =
      intersect(lcbonuses, hoverStat)?.length > 0
         ? "bg-blue-200 dark:bg-zinc-700"
         : hoverStat.length > 0
         ? "opacity-40"
         : "";

   const ref = useRef<HTMLDivElement>(null);

   const uid = useLoaderData<typeof loader>();

   const onDownloadImage = useCallback(() => {
      if (ref.current === null) {
         return;
      }

      toPng(ref.current, {
         cacheBust: true,
         filter: (node) => node.id !== "relic-legend",
      })
         .then((dataUrl) => {
            const link = document.createElement("a");
            link.download = `${uid?.uid}-showcase`;
            link.href = dataUrl;
            link.click();
         })
         .catch((err) => {
            console.log(err);
         });
   }, [ref]);

   // I am sorry for this -// 9/8/2023 lmao dw this is fine -NorseFTX
   const imageTop = statVal.length > 6 ? (statVal.length - 6) * 20 : 0;

   return (
      <>
         <div
            ref={ref}
            className="bg-2 relative overflow-hidden rounded-lg max-desktop:pt-4 desktop:py-6"
         >
            <div
               className="absolute bottom-0 left-0 right-0 top-0 w-[440px] scale-125 transform overflow-hidden"
               style={{ top: `${imageTop}px` }}
            >
               <Image
                  options="height=1200"
                  url={charbase?.image_draw?.url}
                  alt={charbase?.name}
                  className="object-cover max-desktop:hidden"
               />
            </div>
            <div>
               {/* Background-Div */}
               {/* <div className="relative inline-block h-[32rem] w-[960px] overflow-hidden rounded-lg">
                  <img
                     src={bg_url}
                     className="w-full object-fill"
                     alt="background"
                  />
               </div> */}

               <section className="items-stretch gap-4 desktop:flex desktop:justify-center">
                  {/* ================================= */}
                  {/* First Column */}
                  {/* ================================= */}
                  <div className="relative max-desktop:mx-3 desktop:w-[420px]">
                     <Image
                        options="height=400&quality=100"
                        url={charbase?.image_draw?.url}
                        alt={charbase?.name}
                        className="hsr-showcase-character mx-auto -mt-8 desktop:hidden"
                     />
                     <div className="pb-3 max-desktop:text-center">
                        <Link
                           className="font-header text-2xl font-bold leading-none hover:underline"
                           prefetch="intent"
                           to={`/starrail/c/characters/${
                              charbase?.slug ?? charbase?.id
                           }`}
                        >
                           {charbase?.name}
                        </Link>
                        <div className="text-1 text-sm">Lv. {lv}</div>
                     </div>
                     {/* Skill Tree ? */}
                     <div className="absolute -right-24 -top-14">
                        <SkillTreeDisplay
                           data={chardata}
                           skillTrees={skillTrees}
                           path={charbase?.path?.data_key}
                           hoverStat={hoverStat}
                           setHoverStat={setHoverStat}
                        />
                     </div>

                     {/* Eidolon Levels; if not unlocked, show 🔒 */}
                     <div className="absolute left-0 top-16 flex flex-col">
                        {charbase?.eidolons?.map((e: any, i: any) => {
                           const elv = chardata?.promotion ?? 0;

                           return elv > i ? (
                              <Tooltip placement="right" key={i}>
                                 <TooltipTrigger>
                                    <div className="relative my-1 block h-10 w-10 rounded-full bg-gray-900">
                                       <Image
                                          options="aspect_ratio=1:1&height=60&width=60"
                                          alt={"Eidolon Lv." + i + 1}
                                          url={e.icon?.url}
                                          className="absolute object-contain"
                                       />
                                    </div>
                                 </TooltipTrigger>
                                 <TooltipContent>
                                    <div className="w-44">
                                       <div className="pb-0.5 text-blue-500">
                                          {e?.name}
                                       </div>
                                       <div
                                          dangerouslySetInnerHTML={{
                                             __html: e?.description,
                                          }}
                                       />
                                    </div>
                                 </TooltipContent>
                              </Tooltip>
                           ) : (
                              <Tooltip placement="right-start" key={i}>
                                 <TooltipTrigger>
                                    <div className="relative my-1 h-10 w-10 rounded-full border border-gray-700 bg-gray-900">
                                       <Image
                                          options="aspect_ratio=1:1&height=60&width=60"
                                          alt={"Eidolon Lv." + i + 1}
                                          url={e.icon?.url}
                                          className="absolute object-contain opacity-30"
                                       />
                                       <div className="mt-2.5 flex items-center justify-center">
                                          <Icon
                                             name="lock"
                                             className="text-white"
                                             size={18}
                                          />
                                       </div>
                                    </div>
                                 </TooltipTrigger>
                                 <TooltipContent>
                                    <div className="z-40 w-44">
                                       <div className="pb-0.5 text-blue-500">
                                          {e?.name}
                                       </div>
                                       <div
                                          dangerouslySetInnerHTML={{
                                             __html: e?.description,
                                          }}
                                       />
                                    </div>
                                 </TooltipContent>
                              </Tooltip>
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
                     {lcbase !== undefined && (
                        <div
                           className="max-desktop:border-color flex items-start 
                        gap-3 dark:bg-bg2Dark max-desktop:border-y max-desktop:p-3 
                        desktop:mb-4 desktop:rounded-md"
                        >
                           <Link
                              className="block"
                              prefetch="intent"
                              to={`/starrail/c/lightCones/${
                                 lcbase?.slug ?? lcbase?.id
                              }`}
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
                                 {/* {lcbase.name} */}
                                 <Tooltip key={"lightcone_showcase_name"}>
                                    <TooltipTrigger
                                       className={` ${lcHighlightStyle}`}
                                       onMouseOver={() =>
                                          setHoverStat(lcbonuses)
                                       }
                                       onMouseOut={() => setHoverStat([])}
                                    >
                                       {lcbase.name}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                       <div className="w-44">
                                          <div className="pb-0.5 text-blue-500">
                                             {lcbase?.name}
                                          </div>
                                          <div
                                             dangerouslySetInnerHTML={{
                                                __html:
                                                   lcbase?.skill_data?.[
                                                      chardata?.equipment
                                                         ?.promotion - 1
                                                   ]?.desc,
                                             }}
                                          ></div>
                                       </div>
                                    </TooltipContent>
                                 </Tooltip>
                                 {/* <Tooltip
                                 id="relic-set-bonus"
                                 side="top"
                                 className={`text-sm ${lcHighlightStyle}`}
                                 onMouseOver={() => setHoverStat(lcbonuses)}
                                 onMouseOut={() => setHoverStat([])}
                                 onClick={() =>
                                    setHoverStat(
                                       hoverStat?.length > 0 ? [] : lcbonuses
                                    )
                                 }
                                 html={
                                    //needs to be actual html string, not jsx
                                    `<div class="w-44">
                                       <div class="pb-0.5 text-blue-500">
                                          ${lcbase?.name}
                                       </div>
                                       <div>
                                          ${lcbase?.skill_data?.[
                                             chardata?.equipment
                                                ?.promotion - 1
                                          ]?.desc}
                                       </div>
                                    </div>`
                                 }
                              >
                                 {lcbase.name}
                              </Tooltip> */}
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
                                 {wstats?.map((s: any, i: number) => {
                                    const stattype = statTypes.find(
                                       (a: any) => a.name == s.name,
                                    );
                                    const lcstatname = s.name?.replace("%", "");

                                    return (
                                       <div
                                          key={i}
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
                                                   : [lcstatname],
                                             )
                                          }
                                       >
                                          <div className="h-5 w-5 rounded-full bg-zinc-400 align-middle dark:bg-zinc-500">
                                             <Image
                                                options="aspect_ratio=1:1&height=30&width=30"
                                                alt="StatIcon"
                                                url={stattype?.icon?.url}
                                                className="object-fit"
                                             />
                                          </div>
                                          <div className="text-1 inline-block pr-2 align-middle text-xs font-bold">
                                             +
                                             {formatStat(
                                                stattype?.name,
                                                s?.base,
                                             )}
                                          </div>
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>
                        </div>
                     )}
                     {/* Stat Display */}
                     <div className="max-desktop:border-color relative max-desktop:border-b">
                        {statVal.map((s: any, i: number) => {
                           const stattype = statTypes.find(
                              (a: any) => a.name == s.name,
                           );

                           const statname = s.name?.replace("%", "");
                           return (
                              <div
                                 key={i}
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
                                       hoverStat.length > 0 ? [] : [statname],
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
                                                options="aspect_ratio=1:1&height=50&width=50"
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
                           );
                        })}
                     </div>
                  </div>

                  {/* ================================= */}
                  {/* Third Column */}
                  {/* ================================= */}
                  <div className="relative max-desktop:mx-3 max-desktop:pb-3 desktop:w-[300px]">
                     {/* Individual Relics */}

                     {/* Artifact Substat Legend (?) */}
                     <div
                        id="relic-legend"
                        className="relative z-30 h-6 w-6 max-desktop:mb-2 max-desktop:mt-4 desktop:absolute desktop:-left-6 desktop:top-0"
                     >
                        <Tooltip>
                           <TooltipTrigger>
                              <Icon
                                 name="info"
                                 className="text-1 h-5 w-5 laptop:h-4 laptop:w-4"
                              />
                           </TooltipTrigger>
                           <TooltipContent>
                              <div className="w-60 text-left font-normal">
                                 <div className="border-color mb-2 border-b pb-2">
                                    Each group of dots represents an individual
                                    time the substat was rolled into. The number
                                    of dots represent the quality of substat
                                    rolls
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <div className="flex w-8 items-center justify-center gap-1">
                                       <span className="block h-1 w-1 rounded-full bg-blue-500" />
                                    </div>
                                    <span>Lowest roll</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <div className="flex w-8 items-center justify-center gap-1">
                                       <span className="block h-1 w-1 rounded-full bg-blue-500" />
                                       <span className="block h-1 w-1 rounded-full bg-blue-500" />
                                    </div>
                                    <span>Medium roll</span>
                                 </div>

                                 <div className="flex items-center gap-2">
                                    <div className="flex w-8 items-center justify-center gap-1">
                                       <span className="block h-1 w-1 rounded-full bg-blue-500" />
                                       <span className="block h-1 w-1 rounded-full bg-blue-500" />
                                       <span className="block h-1 w-1 rounded-full bg-blue-500" />
                                    </div>
                                    <span>Highest roll (best)</span>
                                 </div>
                              </div>
                           </TooltipContent>
                        </Tooltip>
                     </div>
                     {rbase?.map((r: any, i: any) => {
                        const rdata = rchar[i];
                        const rlv = rdata.level ?? 0;

                        const mainstat = rdata.mainobj;

                        const mainstatname = mainstat?.name?.replace("%", "");

                        return (
                           <div
                              key={i}
                              className="relative mb-2 flex items-center justify-between gap-2"
                           >
                              {/* Relic Image */}
                              <ItemFrameSquare
                                 mat={r}
                                 style=""
                                 lv={"+" + rlv}
                              />

                              {/* Relic Main Stat and Level */}
                              <div className="bg-3 shadow-1 flex h-[62px] flex-grow items-center justify-between rounded px-1 shadow-sm">
                                 <div
                                    className={`mr-1 flex-grow cursor-default rounded p-1 ${
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
                                             : [mainstatname],
                                       )
                                    }
                                 >
                                    <div
                                       className="inline-flex h-5 w-5 items-center justify-center
                                             gap-1 rounded-full bg-zinc-400 dark:bg-zinc-600"
                                    >
                                       <Image
                                          options="aspect_ratio=1:1&height=60&width=60"
                                          alt="StatIcon"
                                          url={mainstat?.icon?.url}
                                       />
                                    </div>
                                    <div className="text-xs font-bold">
                                       {formatStat(
                                          mainstat?.name,
                                          mainstat?.value,
                                       )}
                                    </div>
                                 </div>

                                 {/* Relic Substats */}
                                 <div className="grid w-40 grid-cols-2 gap-x-1 text-center desktop:w-[150px]">
                                    {rdata.subobj?.map(
                                       (sub: any, key: number) => {
                                          const steptext =
                                             sub?.stepDistribution?.map(
                                                (step: any) =>
                                                   step == 0
                                                      ? "."
                                                      : step == 1
                                                      ? ".."
                                                      : "...",
                                             );
                                          const statname = sub.name?.replace(
                                             "%",
                                             "",
                                          );
                                          return (
                                             <div
                                                key={key}
                                                className={`flex cursor-default items-center rounded px-1 py-0.5 ${
                                                   hoverStat.indexOf(statname) >
                                                   -1
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
                                                         : [statname],
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
                                                            options="aspect_ratio=1:1&height=20&width=20"
                                                            alt="StatIcon"
                                                            url={sub?.icon?.url}
                                                            className="object-fit"
                                                         />
                                                      </div>
                                                      <div className="text-xs">
                                                         +
                                                         {formatStat(
                                                            sub?.name,
                                                            sub?.value,
                                                         )}
                                                      </div>
                                                   </div>
                                                   <div className="mt-0.5 flex w-full">
                                                      {steptext?.map(
                                                         (
                                                            st: any,
                                                            key: number,
                                                         ) => {
                                                            return (
                                                               <div
                                                                  key={key}
                                                                  className={`mx-1 -mt-3 inline-flex w-full justify-center text-center text-lg leading-none text-blue-500  ${
                                                                     st == "="
                                                                        ? "text-opacity-0"
                                                                        : ""
                                                                  }`}
                                                               >
                                                                  {st}
                                                               </div>
                                                            );
                                                         },
                                                      )}
                                                   </div>
                                                </div>
                                             </div>
                                          );
                                       },
                                    )}
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                     {/* Relic Set Bonuses */}
                     <div className="!mt-3 space-y-2">
                        {rset?.map((set: any, key: number) => {
                           var setdesc = "";

                           set.effect_desc.map((e: any, i: any) => {
                              setdesc +=
                                 e +
                                 (i < set.effect_desc.length - 1
                                    ? "<br><br>"
                                    : "");
                           });

                           // Check if any of the stat bonuses in the set apply to the currently highlighted stat.
                           const sbonuses = set.bonuses?.map(
                              (b: any) => b.stattype?.name?.replace("%", ""),
                           );

                           const highlightStyle =
                              intersect(sbonuses, hoverStat)?.length > 0
                                 ? "bg-blue-200 dark:bg-zinc-700"
                                 : hoverStat.length > 0
                                 ? "opacity-40"
                                 : "";

                           // Check if any of the set bonuses also include the currently highlighted stat

                           return (
                              <Tooltip key={key}>
                                 <TooltipTrigger
                                    className={`bg-3 shadow-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs shadow-sm ${highlightStyle}`}
                                    onMouseOver={() => setHoverStat(sbonuses)}
                                    onMouseOut={() => setHoverStat([])}
                                 >
                                    {set.name}

                                    <div
                                       className="bg-2 relative flex h-6 w-6 items-center justify-center 
                                       rounded-full font-bold text-green-400"
                                    >
                                       {set.num}
                                    </div>
                                 </TooltipTrigger>
                                 <TooltipContent>
                                    <div className="w-44">
                                       <div className="pb-0.5 text-blue-500">
                                          {set?.name}
                                       </div>
                                       <div
                                          dangerouslySetInnerHTML={{
                                             __html: setdesc,
                                          }}
                                       />
                                    </div>
                                 </TooltipContent>
                              </Tooltip>
                           );
                        })}
                     </div>
                  </div>
               </section>
            </div>
         </div>
         <button
            className="border-color shadow-1 absolute left-1/3 z-20 flex -translate-x-1/2 transform
            items-center gap-2.5 rounded-b-xl border-2 bg-white py-2.5 pl-5 pr-6 text-sm font-bold 
            shadow dark:bg-zinc-800 max-desktop:mt-[1px] max-desktop:border-t-0 desktop:mt-1 desktop:rounded-full"
            onClick={onDownloadImage}
            aria-label="Download"
            title="Download"
         >
            <Icon name="download" size={18}>
               Download
            </Icon>
         </button>
         <Form method="post">
            <button
               disabled={disableRefresh}
               type="submit"
               className="border-color shadow-1 absolute left-2/3 z-20 flex -translate-x-1/2 transform
            items-center gap-2.5 rounded-b-xl border-2 bg-white py-2.5 pl-5 pr-6 text-sm font-bold 
            shadow disabled:opacity-50 dark:bg-zinc-800 max-desktop:mt-[1px] max-desktop:border-t-0 desktop:mt-1 desktop:rounded-full"
               aria-label={disableRefresh ? "On cooldown..." : "Refresh"}
               title={disableRefresh ? "On cooldown..." : "Refresh"}
            >
               {disableRefresh ? (
                  <Icon name="hourglass" size={18} />
               ) : (
                  <Icon name="refresh-ccw" size={18} />
               )}
               <span>Refresh</span>
            </button>
         </Form>

         {/* <ScreenshotButton /> */}
      </>
   );
};

// Basically the same as laoder, but refetches instead
export async function action({ request }: ActionFunctionArgs) {
   const { uid } = zx.parseQuery(request, {
      uid: z.string().optional(),
   });

   if (!uid) return null;

   const showcaseDataUrl = `https://starrail-showcase.mana.wiki/api/showcase/${uid}`;
   const showcaseData = await fetchShowcase(showcaseDataUrl);

   return showcaseData;
}

const ItemFrameSquare = ({
   mat,
   style,
   lv,
}: {
   mat: Material;
   style?: string;
   lv: number;
}) => {
   // ========================
   // Generic Item / Character Circle Frame - Light Cone
   // ========================

   return (
      <Link
         className={`relative flex-none text-center align-middle ${style}`}
         key={mat?.id}
         to={`/starrail/c/relicSets/${mat?.relicset_id?.id}`}
      >
         <Image
            options="aspect_ratio=1:1&height=80&width=80"
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
      </Link>
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
      (a: any) => a.character.id == data?.avatar_id,
   ); // pageData?.attributes?.tree; //skillTreeData;

   // Need to sort skill nodes in order from Point01 - 18
   treelist.sort((a: any, b: any) =>
      a.anchor > b.anchor ? 1 : b.anchor > a.anchor ? -1 : 0,
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
      (v, k) => k + 1,
   );

   return (
      <>
         <div className="canvas mx-auto flex scale-[0.5] items-center justify-center">
            <div className={`canvas-${pathkey}`}></div>

            {connectorlist?.map((con: any, key: number) => {
               return (
                  <div
                     key={key}
                     className={`connector connector-${con}-${pathkey}`}
                  ></div>
               );
            })}

            {treelist?.map((node: any, i: number) => {
               const nodelv = data.skilltree_list?.find(
                  (a: any) => a.point_id == node.point_id,
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
                  node?.stat_added?.map(
                     (s: any) => s.stat_type?.name?.replace("%", ""),
                  ) ?? [];

               const treeHighlight =
                  intersect(skillstats, hoverStat)?.length > 0 ? "invert" : "";

               return (
                  <Fragment key={`skill-tree-${i}`}>
                     <div
                        className={`point point-${
                           i + 1
                        }-${pathkey} ${treeHighlight}`}
                        // style={{
                        //    backgroundImage: "url(" + node?.icon?.url + ")",
                        // }}
                     >
                        <Image
                           options="aspect_ratio=1:1&height=60&width=60"
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

                     <Tooltip>
                        <TooltipTrigger
                           className={`absolute z-30 h-[20px] w-[20px] origin-top-left scale-[2.0] point-${
                              i + 1
                           }-${pathkey}`}
                           onMouseOver={() => setHoverStat(skillstats)}
                           onMouseOut={() => setHoverStat([])}
                           onClick={() =>
                              setHoverStat(
                                 hoverStat.length > 0 ? [] : skillstats,
                              )
                           }
                        >
                           <></>
                        </TooltipTrigger>
                        <TooltipContent>
                           <div className="max-w-[200px]">
                              <div className="pb-0.5 text-blue-500">
                                 {node?.name ?? ""}
                              </div>
                              <div
                                 dangerouslySetInnerHTML={{ __html: node_desc }}
                              />
                           </div>
                        </TooltipContent>
                     </Tooltip>
                  </Fragment>
               );
            })}
         </div>
      </>
   );
};

const InputUIDNote = ({ uid }: { uid: any }) => {
   const [inputUID, setInputUID] = useState(uid);
   const [searchParams, setSearchParams] = useSearchParams({});
   const transition = useNavigation();
   const isSearching = isLoading(transition);
   return (
      <form
         onSubmit={(e) => {
            e.preventDefault();
         }}
      >
         <div className="text-1 pb-4 text-center font-bold">
            Enter UID to view your showcase
         </div>
         <div className="rotate-input relative mx-auto h-14 w-60 rounded-full shadow shadow-zinc-100 dark:shadow-zinc-800">
            <input
               className="absolute left-1 top-1 z-10 h-[48px] w-[232px] rounded-full border-0 bg-white p-0 text-center 
               focus:ring-zinc-300 dark:bg-bg2Dark dark:focus:ring-zinc-600"
               required
               //    className="shadow-1 rounded border border-zinc-200 bg-white
               // shadow-sm focus:ring-0 dark:border-zinc-600 dark:bg-bg4Dark"
               type="text"
               placeholder="Enter UID..."
               value={inputUID}
               onChange={(e) => setInputUID(e.target.value)}
            />
            {inputUID && (
               <button
                  type="button"
                  className="shadow-1 bg-2 border-color absolute -right-1 -top-1 z-10 flex
                  h-6 w-6 items-center justify-center rounded-full border-2 shadow-sm"
                  onClick={() => {
                     setSearchParams((searchParams) => {
                        searchParams.delete("uid");
                        return searchParams;
                     });
                     setInputUID("");
                  }}
               >
                  <Icon name="x" size={14} className="text-red-400" />
               </button>
            )}
         </div>
         <div className="flex items-center justify-center gap-2 pt-5">
            <button
               type="submit"
               className="flex h-11 w-24 items-center justify-center rounded-full bg-blue-500
                  px-3 text-sm font-bold text-white shadow shadow-blue-300 dark:shadow-blue-800"
               onClick={() => {
                  setSearchParams((searchParams) => {
                     searchParams.set("uid", inputUID);
                     return searchParams;
                  });
               }}
            >
               {isSearching ? (
                  <Icon
                     name="loader-2"
                     className="h-6 w-6 animate-spin text-white"
                  />
               ) : (
                  "Submit"
               )}
            </button>
         </div>
      </form>
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

const RelicQuery = `
query ($relicIdList: [String]) {
   relics: Relics(where: { relic_id: {in: $relicIdList } }, limit: 100) {
      docs {
       relic_id
       mainstat_group {
         affix_id
         stattype {
           id
           name
           icon {
             url
           }
         }
         stats
       }
       substat_group {
         affix_id
         base_val
         level_add
         stattype {
           id
           name
           icon {
             url
           }
           property_classify
         }
       }
       relicset_id {
         id
         set_effect {
           req_no
           property_list {
             stattype {
               id
               icon {
                 url
               }
               name
               property_classify
             }
             value
           }
           description
         }
         name
       }
       icon {
         url
       }
       rarity {
         display_number
       }
     }  
   }
}
`;

const CharacterQuery = `
query ($characterIdList: [String]) {
      characters: Characters(where: { character_id: { in: $characterIdList } }) {
     docs {
       character_id
       icon {
         url
       }
       rarity {
         display_number
       }
       stats {
         data
       }
       image_draw {
         url
       }
       name
       id
       slug
       path {
         data_key
       }
       eidolons {
         icon {
           url
         }
         name
         description
       }
     }
   }
}
`;

const LightConeQuery = `
query ($lightconeIdList: [String]) {
   lightcones: LightCones(where: { lightcone_id: { in: $lightconeIdList } }) {
     docs {
       lightcone_id
       stats {
         data
       }
       skill_data {
         stat_added {
           stat_type {
             id
             icon {
               url
             }
             name
             property_classify
           }
           value
         }
         desc
       }
       id
       name
       slug
       image_full {
         url
       }
       rarity {
         icon {
           url
         }
       }
     }
   }
}
`;

const SkillTreeQuery = `
query ($skillTreeIdList: [JSON]) {
   skillTrees: SkillTrees(where: { character: { in: $skillTreeIdList } }, limit: 100) {
     docs {
       character {
         id
       }
       anchor
       affected_skill {
         description_per_level {
            description
         }
       }
       description
      icon {
        url
      }
       stat_added {
         stat_type {
           id
           icon {
             url
           }
           name
           property_classify
         }
         value
       }
       point_id
     }
   }
}
`;

const StatTypeQuery = `
query {
   statTypes: _statTypes(limit: 100) {
     docs {
       name
       icon {
         url
       }
     }
   } 
}
`;

const PlayerIconQuery = `
query ($playerIconId: String!) {
   playerIcon: PlayerIcon(id: $playerIconId) {
     icon {
       url
     }
   }
 }
`;
