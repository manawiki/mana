import { useState } from "react";

export const RelicsInSet = ({ pageData, relicData }: any) => {
   // Artifact Ordering
   const art_order = ["HEAD", "HAND", "BODY", "FOOT", "NECK", "OBJECT"];

   // Get a unique list of each type of relic, in the order of the artifact ordering, since relics have one entry per rarity
   const urelics = art_order
      .map(
         (type: any) => relicData?.find((r: any) => r.relic_type == type)?.name
      )
      .filter((n: any) => n);

   //    const urelics = relicData
   //       ?.map((r: any) => r.name)
   //       .filter((v: any, i: any, a: any) => a.indexOf(v) == i);
   console.log(urelics);

   // Get max rarity for relic set
   const rarities = relicData
      .map((r: any) => parseInt(r.rarity?.display_number))
      .filter((v: any, i: any, a: any) => a.indexOf(v) == i)
      .sort((a: any, b: any) => a - b);
   const maxrarity = Math.max(...rarities);

   // Define max level per rarity, gonna do manually for now.
   const maxlevels = [
      { rarity: 2, maxlv: 6 },
      { rarity: 3, maxlv: 9 },
      { rarity: 4, maxlv: 12 },
      { rarity: 5, maxlv: 15 },
   ];

   // Set relic with actively shown data
   const [activeRelic, setActiveRelic] = useState(urelics[0]);
   const [activeRarity, setActiveRarity] = useState(maxrarity);
   const [mainLevel, setMainLevel] = useState(0);
   const [subLevel, setSubLevel] = useState(1);

   // Get the list of relic data for the actively selected relics of selected rarity
   const activeData = relicData.find(
      (r: any) =>
         r.name == activeRelic && r.rarity?.display_number == activeRarity
   );

   // Sort mainstats
   const mainStatData = activeData?.mainstat_group?.sort((a: any, b: any) =>
      a.stattype?.stat_id > b.stattype?.stat_id
         ? 1
         : b.stattype?.stat_id > a.stattype?.stat_id
         ? -1
         : 0
   );

   // Sort substats
   const subStatData = activeData?.substat_group?.sort((a: any, b: any) =>
      a.stattype?.stat_id > b.stattype?.stat_id
         ? 1
         : b.stattype?.stat_id > a.stattype?.stat_id
         ? -1
         : 0
   );

   // Get currently selected rarity's maxlv
   const maxlv = maxlevels.find(
      (rar: any) => rar.rarity == activeRarity
   )?.maxlv;

   console.log(maxlv);

   return (
      <>
         <h2>Relics in Set</h2>

         <div className="justify-between my-1 rounded-md border dark:border-gray-700 dark:bg-neutral-800 text-center">
            {urelics?.map((rname: any) => {
               // Find the relic's entries in the relicData array
               const curr = relicData.filter((r: any) => r.name == rname);
               const rimg = curr?.[0]?.entry?.icon?.url;

               return (
                  <>
                     <div
                        className="inline-block align-top m-1 cursor-pointer overflow-x-auto"
                        onClick={(e) => {
                           setActiveRelic(rname);
                        }}
                     >
                        <div
                           className={`rounded-md mb-1 border dark:border-gray-700 w-24 h-24 ${
                              activeRelic == rname
                                 ? "bg-blue-800 bg-opacity-20"
                                 : ""
                           }`}
                        >
                           <img src={rimg} className="object-contain" />
                        </div>
                        <div
                           className={`text-xs text-center w-24 ${
                              activeRelic == rname
                                 ? "dark:text-blue-200 text-blue-900 "
                                 : "dark:text-gray-400 text-gray-600"
                           }}`}
                        >
                           {rname}
                        </div>
                     </div>
                  </>
               );
            })}
         </div>

         {/* Show information for selected Relic */}

         <div className="text-center">{activeRelic}</div>

         <div className="flex justify-between gap-1">
            {rarities.map((r: any) => {
               return (
                  <>
                     <div
                        className={`inline-flex w-full border rounded-md p-2 justify-center cursor-pointer dark:border-gray-700 ${
                           activeRarity == r.toString()
                              ? "bg-blue-800 bg-opacity-20"
                              : ""
                        }`}
                        onClick={(e) => {
                           setActiveRarity(r.toString());
                           //    If the slider is at a value higher than is possible for the newly selected rarity, bring the slider down to the maximum for that new rarity.
                           if (
                              mainLevel >
                              (maxlevels.find((rar: any) => rar.rarity == r)
                                 ?.maxlv ?? 0)
                           ) {
                              setMainLevel(
                                 maxlevels.find((rar: any) => rar.rarity == r)
                                    ?.maxlv ?? 0
                              );
                           }
                        }}
                     >
                        {r}★
                     </div>
                  </>
               );
            })}
         </div>

         <div className="border rounded-t-md mt-1 pt-1 font-bold text-lg text-center dark:border-gray-700 bg-yellow-800 bg-opacity-10">
            Main Stats
         </div>
         <div className="border-l border-r border-b rounded-b-md text-center mb-1 p-2 dark:border-gray-700">
            {/* Level Slider Section */}
            <div className="">
               <div className="align-middle inline-flex justify-between pr-0.5">
                  Lv + {mainLevel}
               </div>
               {/* Level Input Box */}
               <input
                  className="level-slider align-middle inline-flex justify-end w-4/5 rounded-lg my-2"
                  type="range"
                  min="0"
                  max={maxlv ?? 15}
                  value={mainLevel}
                  onChange={(event) =>
                     setMainLevel(parseInt(event.target.value))
                  }
               ></input>
            </div>

            {/* All tiled possible Main Stats with symbol if available */}
            {mainStatData?.map((stat: any) => {
               return (
                  <>
                     <div className="flex justify-between m-1 border dark:border-gray-700 dark:bg-neutral-800 rounded-sm text-center p-2">
                        <div className="inline-flex">
                           <div className="w-6 h-6 inline-block align-middle rounded-full bg-gray-800 ">
                              <img
                                 src={stat.stattype?.entry?.icon?.url}
                                 className="object-contain"
                              />
                           </div>
                           <div className="inline-block align-middle self-center ml-2 text-sm">
                              {stat.stattype?.name}
                           </div>
                        </div>
                        <div className="inline-flex">
                           <div className="inline-block align-middle self-center">
                              {formatStat(stat.stats[mainLevel], stat.stattype)}
                           </div>
                        </div>
                     </div>
                  </>
               );
            })}
         </div>

         {/* Substat Data */}
         <div className="border rounded-t-md mt-1 pt-1 font-bold text-lg text-center dark:border-gray-700 bg-yellow-800 bg-opacity-10">
            Sub Stats
         </div>
         <div className="border-l border-r border-b rounded-b-md text-center mb-1 p-2 dark:border-gray-700">
            {/* All tiled possible Substats, and their three possible rolls */}
            {subStatData?.map((stat: any) => {
               return (
                  <>
                     <div className="m-1 border dark:border-gray-700 dark:bg-neutral-800 rounded-sm text-center p-2">
                        <div className="inline-block w-2/5 text-left">
                           <div className="w-6 h-6 inline-block align-middle rounded-full bg-gray-800 ">
                              <img
                                 src={stat.stattype?.entry?.icon?.url}
                                 className="object-contain"
                              />
                           </div>
                           <div className="inline-block align-middle self-center ml-2 text-sm">
                              {stat.stattype?.name}
                           </div>
                        </div>
                        {stat.stats?.map((val: any) => {
                           return (
                              <>
                                 <div className="inline-block w-1/6 align-middle self-center">
                                    {formatStat(val, stat.stattype)}
                                 </div>
                              </>
                           );
                        })}
                     </div>
                  </>
               );
            })}
         </div>
      </>
   );
};

function formatStat(stat: any, stattype: any) {
   const classify = stattype.property_classify;

   var fstat = stat;
   if (classify || stattype.name.indexOf("%") >= 0) {
      fstat = Math.floor(Math.round(fstat * 10000) / 10) / 10 + "%";
   } else {
      fstat = Math.floor(Math.round(fstat * 10000) / 1000) / 10;
   }

   return fstat;
}
