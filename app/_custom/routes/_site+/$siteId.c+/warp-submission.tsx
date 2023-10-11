// Warp Counter Submission Form
//
// 1) Log into your game on a PC (Idk if supporting android/iPhone is easy for now)
// 2) Go to "Warp"
// 3) On any banner, click on "View Details"
// 4) Click on "Records" and allow at least one page of warp records to load
// 5) Close out of the game
// 6) Navigate to your game's data folder: Star Rail\Games\StarRail_Data\webCaches\Cache\Cache_Data
// 7) Find a file named "data_2" and upload it here [Browse ... / Drag and drop]
// 8) Submit

// *DISCLAIMER: This will make a request to the gacha API from mihoyo on your account's behalf. This would be the same request that would be accessed in-game.

// ---
// On our end, after we receive the data_2 file, all we actually need is to search through the file for an instance of their authkey= , and one authkey for their account, from what I can tell, works for any banner.

// We actually do not need the gacha_id used in the API request (aka dbebc8d9fbb0d4ffa067423482ce505bc5ea), we actually probably only need the gacha_id from the returned json (aka 2003).

// From there it should be possible to request the roll history JSON. It looks like I can do up to 20 entries at a time (using size=20, greater than 20 seems to just become 20), and populate the entries as required.

// We can also just change the gacha_type parameter to get the pull results of the different banners available (don't even need to pass in the gacha_id argument):
// gacha_type = 1: Standard Banner
// gacha_type = 2: Beginner Banner
// gacha_type=11: Limited Banner
// gacha_type = 12: Weapon Banner

// It's unfortunate the authkey generated from the bug report dialogue doesn't work for the gacha log though.
// Was able to get it to work, but we can't use the authkey from the bug report page, we need an authkey from the gacha_record
// any authkey for a given account will work for getting data from all banner types though

import { useState } from "react";

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Image } from "~/components";
import { H2 } from "~/components/H2";

// Global Count for total imported Warps
var count = 0;

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   return json({ user });
}

export const meta: MetaFunction = () => {
   return [
      {
         title: "Warp History Submission - Mana",
      },
      {
         name: "description",
         content: "A new kind of wiki",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
export default function WarpSubmission() {
   const { user } = useLoaderData<typeof loader>();
   console.log(user);

   const [loaded, setLoaded] = useState(false);
   const [file, setFile] = useState("");

   const jsonlist = file
      .split('{"retcode"')
      .slice(1)
      .map((a) => JSON.parse('{"retcode"' + a.split("\u0000")[0])?.data);
   console.log(jsonlist);

   return (
      <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20">
         <H2 text="How to upload Warp History information" />
         <div>
            <Instructions />

            <div className="mt-2 text-xl font-bold underline">
               Upload data_2 file:
            </div>
            <div className="mb-1 font-bold ">
               Note this will only load history pages that have been manually
               looked at in-game!
            </div>
            <input
               type="file"
               className="my-1"
               onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                     const test = e.target.files[0];
                     var reader = new FileReader();
                     reader.onload = function (event) {
                        setFile(event?.target?.result);
                     };
                     setLoaded(test);
                     reader?.readAsText(test);
                  }
               }}
            ></input>

            {loaded && jsonlist.length == 0 ? (
               <>
                  <div className="text-red-500">
                     File error; Did you make sure to fully load at least one
                     Warp History page and close the game before attempting to
                     import the file?
                  </div>
               </>
            ) : (
               <div className="h-20 w-20"></div>
            )}
            {jsonlist.length > 0 ? (
               <>
                  <CorrectFile jsonlist={jsonlist} />
               </>
            ) : null}
         </div>
      </div>
   );
}

const Instructions = () => {
   return (
      <>
         <div className="my-1 rounded-md border p-2 dark:border-gray-700">
            <p className="">1) Log into your game on a PC.</p>
            <div className="flex justify-center">
               <Image
                  url={
                     "https://static.mana.wiki/starrail/ManaWiki_WarpHistoryGuide_1_Open.png"
                  }
                  className="object-contain"
                  alt={"Log in"}
               />
            </div>
         </div>
         <div className="my-1 rounded-md border p-2 dark:border-gray-700">
            <p>2) Go to "Warp".</p>
            <div className="flex justify-center">
               <Image
                  url={
                     "https://static.mana.wiki/starrail/ManaWiki_WarpHistoryGuide_2_Warp.png"
                  }
                  className="object-contain"
                  alt={"Log in"}
               />
            </div>
         </div>
         <div className="my-1 rounded-md border p-2 dark:border-gray-700">
            <p>3) On all banners with data, click on "View Details".</p>
            <div className="flex justify-center">
               <Image
                  url={
                     "https://static.mana.wiki/starrail/ManaWiki_WarpHistoryGuide_3_ViewDetail.png"
                  }
                  className="object-contain"
                  alt={"Log in"}
               />
            </div>
         </div>
         <div className="my-1 rounded-md border p-2 dark:border-gray-700">
            <p>
               4) Click on "Records" and view every page of Warp History that
               needs to be uploaded.
            </p>
            <div className="flex justify-center">
               <Image
                  url={
                     "https://static.mana.wiki/starrail/ManaWiki_WarpHistoryGuide_4_Records.png"
                  }
                  className="object-contain"
                  alt={"Log in"}
               />
            </div>
         </div>
         <div className="my-1 rounded-md border p-2 dark:border-gray-700">
            <p>5) Close out of the game.</p>
            <div className="flex justify-center">
               <Image
                  url={
                     "https://static.mana.wiki/starrail/ManaWiki_WarpHistoryGuide_5_Exit.png"
                  }
                  className="object-contain"
                  alt={"Log in"}
               />
            </div>
         </div>
         <div className="my-1 rounded-md border p-2 dark:border-gray-700">
            <p>
               6) Navigate to your game's data folder:{" "}
               <code>
                  \Star Rail\Games\StarRail_Data\webCaches\Cache\Cache_Data\
               </code>
            </p>
            <div className="flex justify-center">
               <Image
                  url={
                     "https://static.mana.wiki/starrail/ManaWiki_WarpHistoryGuide_6_Navigate.png"
                  }
                  className="object-contain"
                  alt={"Log in"}
               />
            </div>
            <p>*To find your install location from the game launcher:</p>
            <div className="flex justify-center">
               <Image
                  url={
                     "https://static.mana.wiki/starrail/ManaWiki_WarpHistoryGuide_6-2_InstallLoc.png"
                  }
                  className="object-contain"
                  alt={"Log in"}
               />
            </div>
         </div>
         <div className="my-1 rounded-md border p-2 dark:border-gray-700">
            <p>7) Find a file named "data_2" and upload it below</p>
            <div className="flex justify-center">
               <Image
                  url={
                     "https://static.mana.wiki/starrail/ManaWiki_WarpHistoryGuide_7_data2.png"
                  }
                  className="object-contain"
                  alt={"Log in"}
               />
            </div>
         </div>
         <div className="my-1 rounded-md border p-2 dark:border-gray-700">
            <p>8) Click Submit to upload!</p>
         </div>
      </>
   );
};

const CorrectFile = ({ jsonlist }: any) => {
   const [submit, setSubmit] = useState(false); // Enabled after submission completes.
   const [status, setStatus] = useState(0); // Displays status text.
   const [total, setTotal] = useState(count);
   var warplist: any = [];

   for (var i in jsonlist) {
      for (var j in jsonlist[i].list) {
         const cwarp = jsonlist[i].list[j];

         if (!warplist?.find((a: any) => a?.id == cwarp.id)) {
            warplist.push({ ...cwarp, _id: cwarp.id });
         }
      }
   }

   console.log(warplist);

   const uidlist = warplist
      .map((a) => a.uid)
      .filter((v, i, a) => a.indexOf(v) === i);

   return (
      <>
         <div className="text-blue-500">
            <p>Verify Uploaded File is correct:</p>
            <p>Total # Warps in File: {warplist?.length}</p>
            {uidlist.map((uid: any, i: any) => {
               return (
                  <>
                     <p key={i}>
                        UID {uid}:{" "}
                        {warplist.filter((a) => a.uid == uid)?.length} Warps
                     </p>
                  </>
               );
            })}
         </div>
         <div
            className="my-1 w-fit cursor-pointer rounded-md border px-3 py-1 hover:bg-gray-400 hover:bg-opacity-20 active:bg-gray-400 active:bg-opacity-40 dark:border-gray-700"
            onClick={(e) => {
               setSubmit(true);
               // getAPI(url);
               Promise.all(
                  warplist.map((warp: any, i: any) => {
                     setStatus(i + 1);
                     return postWarp(warp);
                  }),
               ).then((r) => {
                  setTotal(count);
               });
            }}
         >
            Submit
         </div>

         {submit ? (
            <>
               <div className="my-3 italic text-gray-500">
                  {status == warplist?.length
                     ? `${total} Total Warps imported! Total ${
                          status - total
                       } already in database.`
                     : `${status}/${warplist?.length} Imported.`}
               </div>
               {/* <table>
                  <thead>
                     <tr>
                        <th>UID</th>
                        <th>Gacha ID</th>
                        <th>Time</th>
                        <th>Result</th>
                        <th>Type</th>
                     </tr>
                  </thead>
                  <tbody>
                     {warplist?.map((warp: any, i: any) => {
                        return (
                           <>
                              <tr key={i}>
                                 <td>{warp.uid}</td>
                                 <td>{warp.gacha_id}</td>
                                 <td>{warp.time}</td>
                                 <td>{warp.name}</td>
                                 <td>{warp.item_type}</td>
                              </tr>
                           </>
                        );
                     })}
                  </tbody>
               </table> */}
            </>
         ) : null}
      </>
   );
};

async function postWarp(warp: any) {
   const url = `https://starrail-db.mana.wiki/api/submittedWarps`;

   const submitWarp = await fetch(url, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...warp, submission_type: "file" }),
   })
      .then((r) => {
         // console.log(r);
         if (r.ok) {
            count++;
         }
      })
      .catch((e) => {
         const mute = e;
      }); // console.log(e));
}
