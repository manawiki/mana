import React, { useState, useEffect } from "react";

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import type { Material } from "payload/generated-custom-types";
import { Image } from "~/components";
import { H2 } from "~/components/Headers";
import { fetchWithCache } from "~/utils/cache.server";

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
);

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderFunctionArgs) {
   const url = `https://${settings.siteId}-db.${settings.domain}/api/characters?limit=100`;
   const characterRaw = await fetchWithCache(url);
   const characters = characterRaw.docs;

   const url2 = `https://${settings.siteId}-db.${settings.domain}/api/lightCones?limit=200&sort=lightcone_id`;
   const lightConesRaw = await fetchWithCache(url2);
   const lightCones = lightConesRaw.docs;

   const url3 = `https://${settings.siteId}-db.${settings.domain}/api/banners?limit=100&sort=-banner_id`;
   const bannerRaw = await fetchWithCache(url3);
   const banners = bannerRaw.docs;

   const url4 = `https://${settings.siteId}-db.${settings.domain}/api/submittedWarps?limit=1000&sort=id`;
   const warpRaw = await fetchWithCache(url4);
   const warps = warpRaw.docs;

   return json({ characters, lightCones, banners, warps });
}

export const meta: MetaFunction = () => {
   return [
      {
         title: "Characters - Honkai: Star Rail",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
export default function HomePage() {
   const { characters } = useLoaderData<typeof loader>();
   const { lightCones } = useLoaderData<typeof loader>();
   const { banners } = useLoaderData<typeof loader>();
   const { warps } = useLoaderData<typeof loader>();

   const [uid, setUid] = useState("");
   const [warpList, setWarpList] = useState([]);
   useEffect(() => {
      setUid(JSON.parse(localStorage.getItem("HSR_manawiki_warphistory_UID")));
   }, []);

   return (
      <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20">
         <H2 text="Warp History" />
         <div className="justify-left flex items-center gap-x-1">
            <input
               className="my-2 inline-flex rounded-sm border p-2 dark:bg-neutral-800"
               onChange={(e) => setUid(e.target.value)}
               placeholder="Set UID ..."
               value={uid}
            />

            <div
               className="my-1 inline-flex h-min w-fit cursor-pointer rounded-md border px-3 py-1 hover:bg-gray-400 hover:bg-opacity-20 active:bg-gray-400 active:bg-opacity-40 dark:border-gray-700"
               onClick={(e) => {
                  const filtWarps = loadWarps(uid, warps);
                  setWarpList(filtWarps);
                  localStorage.setItem(
                     "HSR_manawiki_warphistory_UID",
                     JSON.stringify(uid),
                  );
               }}
            >
               Submit
            </div>
         </div>

         {warpList.length > 0 ? (
            <>
               <WarpHistoryDisplay
                  warps={warpList}
                  characters={characters}
                  lightCones={lightCones}
                  banners={banners}
               />
            </>
         ) : null}
      </div>
   );
}

function loadWarps(uid: any, warps: any) {
   return warps.filter((w: any) => w.uid == uid);
}

const WarpHistoryDisplay = ({
   warps,
   characters,
   lightCones,
   banners,
}: any) => {
   const [type, setType] = useState("1"); // Defaults to standard banner for now.
   const bannerTypes = [
      { name: "Standard Banner", value: "1", pity5: 90, pity4: 10 },
      { name: "Starter Banner", value: "2", pity5: 50, pity4: 10 },
      { name: "Limited Banner", value: "11", pity5: 90, pity4: 10 },
      { name: "Light Cone Banner", value: "12", pity5: 80, pity4: 9 },
   ];

   const wall = warps
      .filter((w: any) => w.gacha_type == type)
      .sort((a, b) => (a["id"] > b["id"] ? 1 : b["id"] > a["id"] ? -1 : 0));
   //Used for calculations, sort ascending by oldest first for correct pity estimation.

   var wfilt = [...wall];
   wfilt
      .sort((a, b) => (a["id"] < b["id"] ? 1 : b["id"] < a["id"] ? -1 : 0))
      .slice(0, 100);
   // These will be displayed - sort descending by most recent
   // At some point will paginate this, limits entries shown

   console.log("wall");
   console.log(wall);
   console.log("wfilt");
   console.log(wfilt);

   var pity5 =
      wfilt.findIndex((a: any) => a.rank_type == 5) == -1
         ? wfilt.length
         : wfilt.findIndex((a: any) => a.rank_type == 5);
   var pity4 =
      wfilt.findIndex((a: any) => a.rank_type == 4) == -1
         ? wfilt.length
         : wfilt.findIndex((a: any) => a.rank_type == 4);

   var guarantee5 = bannerTypes.find((a) => a.value == type)?.pity5;
   var guarantee4 = bannerTypes.find((a) => a.value == type)?.pity4;

   // =======================
   // Statistics: Histogram for Total number of rolls for 4* and for 5*
   // =======================
   var label4 = [...Array(11).keys()];
   var label5 = [...Array(91).keys()];
   var summary4 = new Array(11).fill(0);
   var summary5 = new Array(91).fill(0);

   // Count number of rolls required for 4 stars - Get index of 4* roll in chronological full array.
   var count4 = wall
      .map((a, i) => (a.rank_type == "4" ? i : -1))
      .filter((a) => a !== -1);

   for (var i = count4.length - 1; i > -1; i--) {
      if (i == 0) {
         count4[i] = count4[i] + 1;
      } else {
         count4[i] = count4[i] - count4[i - 1];
      }
   }
   for (var i = 0; i < count4.length; i++) {
      summary4[count4[i]]++;
   }
   console.log(count4);

   // Count number of rolls required for 5 stars - Get index of 4* roll in chronological full array.
   var count5 = wall
      .map((a, i) => (a.rank_type == "5" ? i : -1))
      .filter((a) => a !== -1);
   for (var i = count5.length - 1; i > -1; i--) {
      if (i == 0) {
         count5[i] = count5[i] + 1;
      } else {
         count5[i] = count5[i] - count5[i - 1];
      }
   }

   for (var i = 0; i < count5.length; i++) {
      summary5[count5[i]]++;
   }

   if (count4.length > 0) {
      var average4 = count4?.reduce((a, b) => a + b) / count4?.length;
   }
   if (count5.length > 0) {
      var average5 = count5?.reduce((a, b) => a + b) / count5?.length;
   }

   // =======================
   // End of statistics for counting
   // =======================

   console.log(wfilt);
   return (
      <>
         <div className="">
            <select
               className="my-1 w-full rounded-md border p-2 dark:bg-neutral-800"
               onChange={(e) => setType(e.target.value)}
            >
               {bannerTypes.map((t: any) => {
                  return (
                     <>
                        <option value={t.value}>{t.name}</option>
                     </>
                  );
               })}
            </select>
         </div>

         <div className="mt-2 grid gap-3 laptop:grid-cols-2">
            <div className="w-full">
               {/* Total Pulls */}
               <div className="my-2 text-2xl">
                  <div className="mr-2 inline-block font-bold">
                     Total Rolls:
                  </div>
                  <div className="inline-block">{wfilt?.length}</div>
               </div>

               {/* Pity Counters */}
               <div className="text-xl">
                  <div className="mr-2 inline-block font-bold">
                     5* Pity Counter:
                  </div>
                  <div className="inline-block">{pity5}</div>
               </div>
               <div className="text-xl italic text-gray-500">
                  <div className="mr-2 inline-block">5* Guaranteed at:</div>
                  <div className="inline-block">{guarantee5}</div>
               </div>

               <div className="text-xl">
                  <div className="mr-2 inline-block font-bold">
                     4* Pity Counter:
                  </div>
                  <div className="inline-block">{pity4}</div>
               </div>
               <div className="text-xl italic text-gray-500">
                  <div className="mr-2 inline-block">4* Guaranteed at:</div>
                  <div className="inline-block">{guarantee4}</div>
               </div>

               {/* Histogram */}
               <div>
                  <Histogram
                     x={label4}
                     y={summary4}
                     color={"rgba(177,52,235,0.5)"}
                     title={"#Rolls until 4*"}
                  />
               </div>

               <div>
                  <Histogram
                     x={label5}
                     y={summary5}
                     color={"rgba(235,161,52,0.5)"}
                     title={"#Rolls until 5*"}
                  />
               </div>
            </div>
            <div className="w-full">
               {wfilt?.map((w: any) => {
                  var main;
                  var idfield: any;
                  var type: any;
                  if (w.item_type == "Character") {
                     main = characters;
                     idfield = "character_id";
                     type = "characters";
                  } else {
                     main = lightCones;
                     idfield = "lightcone_id";
                     type = "lightCones";
                  }
                  const entry = main.find((a) => a[idfield] == w.item_id);

                  return (
                     <>
                        <ResultFrame entry={entry} type={type} />
                     </>
                  );
               })}
            </div>
         </div>
      </>
   );
};

// Roll Result Frame
const ResultFrame = ({ entry, type }: any) => {
   var customcolor = "";
   switch (entry?.rarity?.display_number) {
      case "5":
         customcolor = "bg-orange-500 bg-opacity-10 font-bold";
         break;
      case "4":
         customcolor = "bg-purple-500 bg-opacity-10 font-bold";
         break;
      default:
   }
   return (
      <>
         <a href={`/starrail/c/${type}/${entry?.id}`}>
            <div
               className={`relative m-1 w-full rounded-md border p-2 dark:border-gray-700 ${customcolor}`}
            >
               <ItemFrame mat={entry} type={type} />
               <div className="mx-1 inline-block align-middle">
                  {entry?.rarity?.display_number}*
               </div>
               <div className="mx-1 inline-block align-middle">
                  {entry?.name}
               </div>
            </div>
         </a>
      </>
   );
};

// ====================================
// 0a) GENERIC: Item Icon Frame
// ------------------------------------
// * PROPS (Arguments) accepted:
// - mat: Any that contains a rarity, icon, and name field.
// - type: string denoting type of item for link
// ====================================
const ItemFrame = ({ mat, type }: { mat: Material; type: string }) => {
   // mat holds material information

   return (
      <div
         className="relative inline-block text-center align-middle"
         key={mat?.id}
      >
         <div className="relative mx-0.5 inline-block h-11 w-11 align-middle text-xs">
            <Image
               url={mat?.icon?.url ?? "no_image_42df124128"}
               className={`object-contain color-rarity-${
                  mat?.rarity?.display_number ?? "1"
               } material-frame`}
               alt={mat?.name}
            />
         </div>
      </div>
   );
};

// ====================================
// Chart definitions
// ====================================

const Histogram = ({ x, y, color, title }: any) => {
   const labels = x;

   const graphdata = {
      labels, // x,
      datasets: [
         {
            data: y,
            backgroundColor: color,
         },
      ],
   };

   const opts = {
      responsive: true,
      plugins: {
         legend: {
            display: false,
         },
         title: {
            display: true,
            text: title,
         },
      },
      scales: {
         y: {
            grid: {
               color: "rgba(150,150,150,0.5)",
            },
         },
         x: {
            grid: {
               tickLength: 2,
               // Only show vertical grid where a showlabel value is
               // color: function (context) {
               //    if (context.tick.label != "") {
               //       return "rgba(150,150,150,0.5)";
               //    } else {
               //       return "rgba(0,0,0,0)"; //transparent
               //    }
               // },
            },
            ticks: {
               // autoSkip: false,
               // For a category axis, only show label if the value matches the "showlabels" array
               // callback: function (val, index) {
               //    // Hide every non-10th tick label
               //    return showlabels.indexOf(this.getLabelForValue(val)) > -1
               //       ? this.getLabelForValue(val)
               //       : "";
               // },
            },
         },
      },
   };

   return <Bar options={opts} data={graphdata} />;
};
