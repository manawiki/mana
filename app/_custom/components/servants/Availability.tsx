import { useState } from "react";
import { Disclosure } from "@headlessui/react";

import type { Servant as ServantType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";

const thformat =
   "p-2 leading-none text-left border border-color-sub bg-zinc-50 dark:bg-zinc-800";
const tdformat = "p-2 leading-tight text-center border border-color-sub";

export function Availability({ data }: { data: any }) {
   const servant = data.servant;
   return (
      <>
         <Summon_Availability data={servant} />
         <Future_Banners data={data} />
      </>
   );
}

function Summon_Availability({ data: servant }: { data: ServantType }) {
   const availability = servant.summon_availability;

   return (
      <>
         <div className="my-1">
            <span className="font-bold">{availability.name}</span>
            <span> - {availability.description.replace(/<[^>]*>?/gm, "")}</span>
         </div>
      </>
   );
}

function Future_Banners({ data }: { data: any }) {
   // Sort Banners descending by date!
   const today = new Date().getTime();
   const banners = data.bannerData.sort(
      (a, b) =>
         new Date(b.jp_start_date).getTime() -
         new Date(a.jp_start_date).getTime(),
   );
   const past_banners = banners.filter(
      (a) => a.na_end_date && new Date(a.na_end_date)?.getTime() < today,
   );
   const future_banners = banners.filter(
      (a) => !a.na_end_date || new Date(a.na_end_date).getTime() >= today,
   );
   const servant = data.servant;
   // console.log(banners);

   return (
      <>
         {banners ? (
            <>
               <H2 text="Future Banners" />
               <table className="text-sm">
                  <tbody>
                     <tr>
                        <th className={thformat}>
                           Banner (Add 2 years for NA Date)
                        </th>
                        <th className={thformat}>JP Period</th>
                     </tr>

                     {future_banners.map((b: any) => {
                        const btype = b.servant_profile_future_banner?.find(
                           (s: any) => s?.banner_servant?.id == servant?.id,
                        )?.banner_reference;

                        var typedisplay = "";
                        switch (btype) {
                           case "single":
                              typedisplay = "Single";
                              break;
                           case "shared":
                              typedisplay = "Shared";
                              break;
                           case "guaranteed_gacha":
                           case "guaranteed-gacha":
                           case "guaranteed":
                              typedisplay = "Guaranteed Gacha";
                              break;
                           case "class-based":
                           case "class_based":
                              typedisplay = "Class-Based";
                              break;
                           default:
                              typedisplay = btype;
                        }
                        return (
                           <>
                              <tr>
                                 <td className={tdformat}>
                                    <div className="inline-block">
                                       <Image
                                          // height={100}
                                          url={b.icon?.url}
                                          className="object-contain"
                                          options="height=100"
                                          alt="Banner"
                                       />
                                    </div>
                                    <div>{b.name}</div>
                                 </td>
                                 <td className={tdformat}>
                                    <div>{b.jp_start_date}</div>
                                    <div>{b.jp_end_date}</div>
                                    <div>Banner Type: {typedisplay}</div>
                                 </td>
                              </tr>
                           </>
                        );
                     })}
                  </tbody>
               </table>
            </>
         ) : null}

         <Disclosure>
            {({ open }) => (
               <>
                  <Disclosure.Button
                     className={`font-bold text-white bg-blue-800 dark:border-zinc-600 dark:bg-zinc-800
                 flex items-center mb-1 w-full border px-3 py-2 mt-1 rounded-md text-lg ${
                    open
                       ? "bg-opacity-100 dark:bg-opacity-100"
                       : "bg-opacity-80 dark:bg-opacity-40"
                 }`}
                  >
                     Past Banners
                     <div
                        className={`${
                           open
                              ? "transform rotate-180 text-gray-600 font-bold "
                              : "text-gray-400 "
                        } inline-block ml-auto `}
                     >
                        <TiArrowSortedDown className="inline-block h-4 w-4" />
                     </div>
                  </Disclosure.Button>
                  <Disclosure.Panel className="mb-1">
                     {past_banners.map((b: any) => {
                        return (
                           <>
                              <div className="text-center text-sm p-2 border border-color-sub">
                                 <div className="inline-block">
                                    <Image
                                       height={100}
                                       url={b.icon?.url}
                                       className="object-contain"
                                       options="height=100"
                                       alt="Banner"
                                    />
                                 </div>
                                 <div>{b.name}</div>
                              </div>
                           </>
                        );
                     })}
                  </Disclosure.Panel>
               </>
            )}
         </Disclosure>
      </>
   );
}

const TiArrowSortedDown = (props: any) => (
   <svg
      className={props.className}
      height={props.h}
      width={props.w}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
   >
      <path
         fill="currentColor"
         d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
      />
   </svg>
);
