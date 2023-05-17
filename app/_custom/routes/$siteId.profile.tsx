import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Image } from "~/components";
// import html2canvas from "html2canvas";

// Sample data, will import via API for real case
// import { showcaseSample } from "./showcaseSample";

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   const uid = new URL(request.url)?.searchParams.get("uid");

   var url = `https://starrail-profiles-prod-fwq2wjp57a-uc.a.run.app/profile/${uid}`;
   const showcaseData = await (await fetch(url)).json();

   var relics = null;
   var characters = null;
   var lightCones = null;
   var skillTrees = null;
   var statTypes = null;
   var playerIcon = null;
   var result = null;

   if (!uid) {
   } else if (
      showcaseData?.detail_info?.detail == "Improperly formatted uid." ||
      !showcaseData?.detail_info?.assist_avatar
   ) {
      result = "bad_uid";
   } else {
      result = "success";
      var showcaseSample = showcaseData;

      var charids = [
         showcaseSample?.detail_info?.assist_avatar?.avatar_id,
         ...showcaseSample?.detail_info?.avatar_detail_list?.map(
            (a: any) => a.avatar_id
         ),
      ];
      var lcids = [
         showcaseSample?.detail_info?.assist_avatar?.equipment?.tid,
         ...showcaseSample?.detail_info?.avatar_detail_list?.map(
            (a: any) => a.equipment?.tid
         ),
      ];
      var rids = [
         ...showcaseSample?.detail_info?.assist_avatar?.relic_list?.map(
            (a: any) => a.tid
         ),
      ];
      var piid = showcaseSample?.detail_info?.head_icon;

      showcaseSample?.detail_info?.avatar_detail_list?.map((a: any) => {
         a.relic_list?.map((b: any) => {
            rids.push(b.tid);
         });
      });

      var url = `https://${
         process.env.PAYLOAD_PUBLIC_SITE_ID
      }-db.mana.wiki/api/relics?depth=3&limit=502&where[id][in]=${rids.toString()}`;
      const relicRaw = await (await fetch(url)).json();
      var relics = relicRaw.docs;

      url = `https://${
         process.env.PAYLOAD_PUBLIC_SITE_ID
      }-db.mana.wiki/api/characters?limit=100&where[id][in]=${charids.toString()}`;
      const characterRaw = await (await fetch(url)).json();
      var characters = characterRaw.docs;

      url = `https://${
         process.env.PAYLOAD_PUBLIC_SITE_ID
      }-db.mana.wiki/api/lightCones?limit=100&where[id][in]=${lcids.toString()}`;
      const lightConeRaw = await (await fetch(url)).json();
      var lightCones = lightConeRaw.docs;

      url = `https://${
         process.env.PAYLOAD_PUBLIC_SITE_ID
      }-db.mana.wiki/api/skillTrees?limit=500&where[character][in]=${charids.toString()}`;
      const skillTreeRaw = await (await fetch(url)).json();
      var skillTrees = skillTreeRaw.docs;

      url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/_statTypes?limit=100`;
      const statTypesRaw = await (await fetch(url)).json();
      var statTypes = statTypesRaw.docs;

      url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/playerIcons/${piid}`;
      var playerIcon = await (await fetch(url)).json();
   }

   return json({
      relics,
      characters,
      lightCones,
      skillTrees,
      statTypes,
      playerIcon,
      showcaseData,
      result,
   });
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
   const {
      relics,
      characters,
      lightCones,
      skillTrees,
      statTypes,
      playerIcon,
      showcaseData,
      result,
   } = useLoaderData<typeof loader>();

   // result:
   // null = No argument or UID provided, ask for UID input
   // bad_uid = UID provided but does not provide result
   // success = successful.

   const pdata = showcaseData;

   if (result == "bad_uid") {
      return (
         <>
            <div className="mt-10"></div>
            <InputUIDNote />
            <BadUIDNote />
         </>
      );
   } else {
      return (
         <>
            <div className="mt-10"></div>
            <InputUIDNote />
         </>
      );
   }
}

const InputUIDNote = () => {
   const [inputUID, setInputUID] = useState("");

   return (
      <>
         {" "}
         <div className="mx-auto mb-8 max-w-[960px] text-center max-desktop:px-3">
            <div className="border-color my-2 w-full rounded-md border p-3 text-center text-2xl font-bold">
               Input a UID to load:
            </div>

            <input
               className="border-color my-2 rounded-full border px-3 py-1 text-neutral-800"
               value={inputUID}
               onChange={(e) => setInputUID(e.target.value)}
            ></input>
            <a href={`/starrail/profile/${inputUID}`}>
               <div className="mx-auto my-1 w-fit cursor-pointer rounded-md border px-3 py-1 hover:bg-gray-400 hover:bg-opacity-20 active:bg-gray-400 active:bg-opacity-40 dark:border-gray-700">
                  Submit
               </div>
            </a>
         </div>
      </>
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
