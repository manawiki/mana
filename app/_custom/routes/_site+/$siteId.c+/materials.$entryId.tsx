import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { Material } from "payload/generated-custom-types";
import { Image } from "~/components";
import {
   getAllEntryData,
   getCustomEntryData,
   meta,
} from "~/routes/_site+/$siteId.c_+/$collectionId_.$entryId";
import { Entry } from "~/routes/_site+/$siteId.c_+/components/Entry";

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
   })) as Material;

   //Feel free to query for more data here

   return json({ entryDefault, entry });
}

export default function MaterialsEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();

   return (
      <Entry>
         <Header pageData={entryDefault} />
      </Entry>
   );
}

export const Header = ({ pageData }: any) => {
   const iconurl = pageData?.icon?.url;
   const rarityurl = pageData?.rarity?.icon?.url;

   const statobj = [
      { stat: "Rarity", value: pageData?.rarity?.display_number },
      { stat: "Max Limit", value: pageData?.max_limit },
   ];

   return (
      <>
         <div className="grid gap-4 laptop:grid-cols-2">
            {/* ======================== */}
            {/* 1) Character Image div */}
            {/* ======================== */}
            <section>
               <div
                  className="bg-2-sub border-color-sub shadow-1 relative w-full
                rounded-lg border text-center shadow-sm"
               >
                  {/* Rarity */}
                  <div className="absolute bottom-4 left-4 z-20 flex h-8 items-center rounded-full bg-zinc-300 px-2 py-1 dark:bg-bg1Dark">
                     <Image options="height=100" alt="Rarity" url={rarityurl} />
                  </div>

                  <div className="relative inline-block h-96 w-full text-center">
                     {/* Main Image */}
                     {iconurl ? (
                        <Image
                           options="height=400"
                           alt="Materials Icon"
                           url={iconurl}
                           className="absolute h-96 w-full object-contain"
                        />
                     ) : null}
                  </div>
               </div>
            </section>

            {/* ======================== */}
            {/* 2) Info Block Section */}
            {/* ======================== */}
            <section>
               {/* <div className="flex rounded-md border bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 mb-3 p-3">
                  <div className="flex flex-grow items-center space-x-2">
                     <div className="relative bg-gray-800 rounded-full h-10 w-20">
                        <img
                           className="relative inline-block object-contain"
                           src={rarityurl}
                        />
                     </div>
                  </div>
                  <div className="flex flex-grow items-center space-x-2">
                     Rarity
                  </div>
               </div> */}

               <div className="divide-color-sub border-color-sub shadow-1 mb-4 divide-y overflow-hidden rounded-md border shadow-sm">
                  {statobj.map((stat: any, index) => {
                     return (
                        /*2b) Alternating background stats for 5 or 6 stats depending on bonus stat */
                        <div
                           className={`
                      ${
                         index % 2 == 1
                            ? "bg-2-sub relative block"
                            : "bg-3-sub relative block"
                      } flex items-center p-2`}
                           key={index}
                        >
                           {/* 2bi) Stat Icon */}
                           <div className="flex flex-grow items-center space-x-2">
                              <div>
                                 {stat.hash ? (
                                    <div
                                       className="relative inline-flex h-6 w-6 items-center 
                          justify-center rounded-full bg-gray-600 align-middle"
                                    >
                                       <Image
                                          options="aspect_ratio=1:1&height=30&width=30"
                                          alt="Background"
                                          url={
                                             stat.hash ?? "no_image_42df124128"
                                          }
                                          className="h-full w-full object-contain"
                                       />
                                    </div>
                                 ) : null}
                              </div>
                              <div className="text-1 font-bold">
                                 {stat.stat}
                              </div>
                           </div>
                           {/* 2biii) Stat value */}
                           <div className="">{stat.value}</div>

                           {/* 2bii.a) Show bonus icon if stat is Secondary Stat ? */}
                           {/* 
                    {stat.bonus ? (
                      <div className="inline-flex absolute items-center align-middle justify-center rounded-full h-4 w-4 mt-1 right-2/3 bg-gray-400 text-center">
                        <img
                          src="https://res.cloudinary.com/genshinimpact-nalu/image/upload/v1631645303/UI_Icon_Arrow_Point_1a06775238.png"
                          height="15"
                          width="15"
                        ></img>
                      </div>
                    ) : null}
                     */}
                        </div>
                     );
                  })}
               </div>

               <div className="border-color-sub bg-2-sub shadow-1 my-2 mb-3 rounded-md border p-3 text-sm shadow-sm">
                  <div
                     dangerouslySetInnerHTML={{ __html: pageData?.description }}
                  ></div>
                  {pageData?.bg_description ? (
                     <>
                        <div
                           className="mt-2 border-t pt-2 text-sm text-gray-500 dark:border-neutral-700"
                           dangerouslySetInnerHTML={{
                              __html: pageData?.bg_description,
                           }}
                        ></div>
                     </>
                  ) : null}
               </div>
            </section>
         </div>
      </>
   );
};
