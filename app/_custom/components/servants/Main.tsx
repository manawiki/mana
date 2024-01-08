import type { Servant as ServantType } from "payload/generated-custom-types";
import { Image } from "~/components";
import { Link } from "@remix-run/react";
import React, { useState } from "react";

export function Main({ data: servant }: { data: ServantType }) {
   return (
      <>
         <div>
            {/* Header - Class and Rarity */}
            <ClassRarityHeader charData={servant} />
            <ServantImageBaseData charData={servant} />
         </div>
      </>
   );
}

// =====================================
// 1) Class Header
// =====================================
const ClassRarityHeader = ({ charData }: any) => {
   var classicon = charData?.class?.icon?.url;
   var classname = charData?.class?.name;
   var rarityno = charData?.star_rarity?.name;

   return (
      <>
         <div
            className="flex items-center rounded-md border
      bg-gray-50 p-1 px-3 dark:border-zinc-700 dark:bg-zinc-800 my-1"
         >
            <div className="flex-grow font-bold">
               <div className="relative inline-block align-middle h-8 w-8">
                  <img
                     src={classicon}
                     className="h-full w-full object-contain"
                  />
               </div>
               <div className="relative inline-block align-middle font-bold ml-2 w-2/5">
                  {classname}
               </div>
            </div>

            <div className="flex-none">
               <StarRarity rar={rarityno} />
            </div>
         </div>
      </>
   );
};

// =====================================
// 2) Servant Image and Base Data
// =====================================
const ServantImageBaseData = ({ charData }: any) => {
   // Initialize list of selectable images for a Servant (4 stages by default; additional images can be appended to this object for costumes)
   var selectimg = [
      {
         name: "Stage 1",
         url: charData?.image_stage_1?.url,
      },
      {
         name: "Stage 2",
         url: charData.image_stage_2?.url,
      },
      {
         name: "Stage 3",
         url: charData.image_stage_3?.url,
      },
      {
         name: "Stage 4",
         url: charData.image_stage_4?.url,
      },
   ];

   // Pull images from Costumes
   // const charCostumes = charData?.costumes?.map((cos: any) => {
   //    var cosobj = {
   //       name: cos.name,
   //       url: cos.image?.url,
   //    };
   //    return cosobj;
   // });

   // selectimg = [...selectimg, ...charCostumes];

   // UseState variable to track selected display image for Servant
   const [characterImage, setCharacterImage] = useState(selectimg[0]?.name);

   // Get deck list array
   // ----------------
   const cc_q = "https://static.mana.wiki/grandorder/FGOCommandCard_Quick.png";
   const cc_b = "https://static.mana.wiki/grandorder/FGOCommandCard_Buster.png";
   const cc_a = "https://static.mana.wiki/grandorder/FGOCommandCard_Arts.png";
   const decklist = charData?.deck_layout?.name
      ?.slice(0, 5)
      .split("")
      .map((card: any) => {
         switch (card) {
            case "Q":
               return cc_q;

            case "A":
               return cc_a;

            case "B":
               return cc_b;

            default:
         }
      });

   // Get list of hitcounts per card type
   // Q - A - B - E - NP
   const hitcounts = [
      {
         img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Quick.png",
         hits: charData?.num_hits_quick,
      },
      {
         img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Arts.png",
         hits: charData?.num_hits_arts,
      },
      {
         img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Buster.png",
         hits: charData?.num_hits_buster,
      },
      {
         img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Extra.png",
         hits: charData?.num_hits_extra,
      },
      {
         img: "https://static.mana.wiki/grandorder/FGOInterludeReward_NPUpgrade.png",
         hits: charData?.noble_phantasm_base?.hit_count,
      },
   ];
   const nptype = charData?.noble_phantasm_base?.card_type?.icon?.url;

   // Attribute and Alignment
   const attribute = charData?.attribute?.name;
   const alignment = charData?.alignment?.name;
   const id = charData?.library_id;

   const imgUrl = selectimg.find((a) => a.name == characterImage)?.url;

   return (
      <>
         <div className="mb-4 grid gap-2 laptop:grid-cols-3 ">
            {/* Servant Image */}
            <div className="w-full text-center ">
               <Link prefetch="intent" to={imgUrl} className="">
                  <div className="relative inline-block h-80 w-auto">
                     <Image
                        height={320}
                        className="object-contain"
                        url={imgUrl}
                        options="height=320"
                        alt={charData?.name}
                     />
                  </div>
               </Link>
            </div>

            {/* Right Data Block */}
            <div className="laptop:col-span-2">
               {/* - Card Deck */}
               <div className="border border-blue-200 dark:border-slate-700 rounded-md p-1 flex justify-between">
                  {decklist.map((card: any) => (
                     <div className="mx-2 h-10 w-10">
                        <img
                           src={card}
                           className="h-full w-full object-contain"
                        />
                     </div>
                  ))}
               </div>

               {/* - Hit count */}
               <div className="border border-blue-200 dark:border-slate-700 rounded-md p-1 flex justify-between my-1">
                  {hitcounts.map((hit: any, i: any) => (
                     <div className="mx-2">
                        <div className="leading-none">
                           <div className="h-auto w-8 inline-block">
                              <Image
                                 height={32}
                                 url={hit.img}
                                 className="object-contain"
                                 options="height=32"
                                 alt="CardType"
                              />
                           </div>
                           {/* Show NP Card type if NP row */}
                           {i == 4 ? (
                              <div className="h-auto w-8 inline-block">
                                 <Image
                                    height={32}
                                    url={nptype}
                                    className="object-contain"
                                    options="height=32"
                                    alt="NP"
                                 />
                              </div>
                           ) : null}
                        </div>
                        <div className="text-center text-sm leading-none">
                           {hit.hits ?? "-"}
                        </div>
                     </div>
                  ))}
               </div>

               {/* - ID/Attribute/Alignment */}
               <div
                  className="border divide-y dark:divide-slate-700 rounded-md overflow-hidden
       border-blue-200 dark:border-slate-700 text-sm"
               >
                  <div className="flex items-center block relative p-2">
                     <div className="flex-grow font-bold">ID</div>
                     <div className="flex-none">{id}</div>
                  </div>
                  <div className="flex items-center block relative p-2">
                     <div className="flex-grow font-bold">Attribute</div>
                     <div className="flex-none">{attribute}</div>
                  </div>
                  <div className="flex items-center block relative p-2">
                     <div className="flex-grow font-bold">Alignments</div>
                     <div className="flex-none">{alignment}</div>
                  </div>
               </div>

               {/* - Image Selection */}
               <div className="w-full text-center grid-cols-2">
                  {selectimg.map((opt: any) => {
                     return (
                        <>
                           <button
                              className={`inline-block border border-blue-300 p-1 px-2 m-1 text-center dark:border-slate-700 hover:bg-blue-100 hover:dark:bg-slate-800 ${
                                 characterImage == opt.name
                                    ? "bg-blue-100 dark:bg-slate-800"
                                    : ""
                              }`}
                              onClick={() => setCharacterImage(opt.name)}
                           >
                              {opt.name}
                           </button>
                        </>
                     );
                  })}
               </div>
            </div>
         </div>
      </>
   );
};

// =====================================
// For rendering Rarity Stars
// =====================================

export const StarRarity = ({ rar }: any) => {
   var color = ["text-yellow-500"];
   switch (rar) {
      case "0":
         color = ["text-black"];
         break;
      case "1":
         color = ["text-yellow-800"];
         break;
      case "2":
         color = ["text-yellow-800", "text-yellow-800"];
         break;
      case "3":
         color = ["text-gray-400", "text-gray-400", "text-gray-400"];
         break;
      case "4":
         color = [
            "text-yellow-600",
            "text-yellow-600",
            "text-yellow-600",
            "text-yellow-600",
         ];
         break;
      case "5":
         color = [
            "text-yellow-500",
            "text-yellow-500",
            "text-yellow-500",
            "text-yellow-500",
            "text-yellow-500",
         ];
         break;
      default:
   }
   return (
      <>
         {color.map((a) => (
            <FaStar className={` ${a} h-5 w-5 inline-block relative`} />
         ))}
      </>
   );
};

// =====================================
// For rendering Icons
// =====================================

const FaStar = (props: any) => (
   <svg
      className={props.className}
      height={props.h}
      width={props.w}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
   >
      <path
         fill="currentColor"
         d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
      />
   </svg>
);
