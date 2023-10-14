import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Blessing } from "payload/generated-custom-types";

import { Image } from "~/components";
import { H2Default } from "~/components/H2";
import { Entry } from "~/routes/_site+/$siteId.c_+/src/components";
import {
   getAllEntryData,
   getCustomEntryData,
   meta,
} from "~/routes/_site+/$siteId.c_+/src/functions";

export { meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await getAllEntryData({
      payload,
      params,
      request,
      user,
   });

   const entryDefault = (await getCustomEntryData({
      payload,
      params,
      request,
      depth: 3,
      entryId: entry.id,
   })) as Blessing;

   // Remove html tags from entry name
   // `<i><unbreak>12</unbreak> Monkeys and Angry Men</i>` to `12 Monkeys and Angry Men`
   if (entryDefault?.name)
      entryDefault.name = entryDefault?.name?.replace(/(<([^>]+)>)/gi, "");

   //Feel free to query for more data here

   // ======================
   // Pull Skill Tree data for character
   // ======================
   // const url = new URL(request.url).pathname;
   // const cid = url.split("/")[4];

   // const skillTreeRaw = await payload.find({
   //    // @ts-ignore
   //    collection: `skillTree-lKJ16E5IhH`,
   //    where: {
   //       character: {
   //          equals: "character-" + cid,
   //       },
   //    },
   //    depth: 3,
   //    limit: 20,
   // });

   // const skillTreeData = skillTreeRaw.docs;

   // ======================
   // ======================

   return json({ entryDefault, entry });
}

export default function BlessingEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();

   return (
      <Entry>
         {/* Image */}
         <Header pageData={entryDefault} />

         {/* Effect List - Various Levels */}
         <Effects pageData={entryDefault} />
      </Entry>
   );
}

export const Header = ({ pageData }: { pageData: Blessing }) => {
   const roguebgurl =
      "https://static.mana.wiki/starrail/DecoRogueBuffFrame.png";

   const rarityurl = pageData?.rarity?.icon?.url;
   const imgurl = pageData?.icon?.url;
   const pathname = pageData?.aeon?.path_name;
   const pathurl = pageData?.aeon?.icon_class?.url;

   const maxlv = pageData?.max_level;

   const rarnum =
      pageData?.rarity?.display_number == "3"
         ? 5
         : pageData?.rarity?.display_number == "2"
         ? 3
         : pageData?.rarity?.display_number;

   return (
      <>
         <div className="grid gap-3 laptop:grid-cols-2">
            {/* ======================== */}
            {/* 1) Main Image div */}
            {/* ======================== */}
            <section>
               <div
                  className={`relative w-full rounded-md bg-gray-100 text-center dark:bg-neutral-900 color-rarity-${rarnum}`}
               >
                  {/* Rarity */}
                  <div className="absolute bottom-1 z-20 h-8 w-full text-center">
                     <Image
                        options="height=40"
                        alt="Stars"
                        className="z-20 inline-block h-8 w-20 rounded-full  object-contain"
                        url={rarityurl}
                     />
                  </div>

                  <div className="absolute flex h-96 w-full items-center justify-center">
                     {/* Main Image */}
                     <div className="inline-flex h-72 w-72">
                        {imgurl ? (
                           <Image
                              options="aspect_ratio=1:1&height=288&width=288"
                              alt="Main Icon"
                              url={imgurl}
                              className="object-contain"
                           />
                        ) : null}
                     </div>
                  </div>

                  {/* RogueBgImage */}
                  <div className="flex h-96 w-full items-end justify-center">
                     <div className="inline-flex h-auto w-auto">
                        <Image
                           options="height=384"
                           alt="Background"
                           className="object-contain"
                           url={roguebgurl}
                        />
                     </div>
                  </div>
               </div>
            </section>

            {/* ======================== */}
            {/* 2) Character Stat Block Section */}
            {/* ======================== */}
            <section>
               <div className="bg-2-sub border-color-sub shadow-1 mb-3 flex items-center gap-3 rounded-md border p-2 shadow-sm">
                  <div className="relative h-10 w-10 rounded-full bg-gray-800">
                     <Image
                        options="aspect_ratio=1:1&height=80&width=80"
                        alt="Path Icon"
                        className="relative inline-block object-contain"
                        url={pathurl}
                     />
                  </div>
                  <div className="text-1 font-bold">{pathname}</div>
               </div>

               <div className="divide-color-sub shadow-1 border-color-sub divide-y overflow-hidden rounded-md border shadow-sm">
                  <div
                     className={`
                      ${
                         1 ? "bg-2-sub relative block" : "bg-1 relative block"
                      } flex items-center px-3 py-2.5`}
                  >
                     {/* 2bi) Stat Icon */}
                     <div className="text-1 flex flex-grow items-center space-x-2 font-bold">
                        <div>Max Level</div>
                     </div>
                     {/* 2biii) Stat value */}
                     <div className="">{maxlv}</div>
                  </div>
               </div>
            </section>
         </div>
      </>
   );
};

const Effects = ({ pageData }: { pageData: Blessing }) => {
   const effects = pageData?.effects;

   return (
      <>
         <H2Default text="Effect" />
         <section className="divide-color-sub shadow-1 bg-2-sub border-color-sub divide-y overflow-hidden rounded-md border shadow-sm">
            {effects?.map((eff, i) => {
               const lv = eff?.level;
               const desc = eff?.description;
               // const descsimple = eff?.description_simple;

               return (
                  <div key={i} className="p-3">
                     <div className="pb-1 font-bold"> Lv. {lv}</div>
                     <div
                        className="text-1"
                        dangerouslySetInnerHTML={{ __html: desc ?? "" }}
                     ></div>
                  </div>
               );
            })}
         </section>
      </>
   );
};
