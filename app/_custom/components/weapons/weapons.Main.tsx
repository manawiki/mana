import clsx from "clsx";
import { useState } from "react";

import { Image } from "~/components/Image";

export function WeaponsMain({ data: full }: { data: any }) {
   const char = full.Weapon;

   const curves = full.Curves;

   const [level, setLevel] = useState(0);

   const displevel = curves[0]?.values[level].level;
   const dispasc = curves[0]?.values[level].ascension_level;

   const mainImage = char?.icon?.url;
   const mainName = char?.name;
   const mainDesc = char?.desc;
   const mainStatDisplay = [
      {
         label: "Rarity",
         value: char.rarity?.id ? char.rarity?.id + "★" : "-",
      },
      {
         label: "Type",
         value: char?.type?.name,
      },
   ];

   const mainAttributes = char.stats;

   return (
      <>
         <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4 mb-3">
            <section>
               <div className="flex items-center justify-center shadow-sm shadow-1 border border-color-sub rounded-lg dark:bg-dark350 bg-zinc-50 h-full">
                  <Image
                     height={320}
                     className="object-contain"
                     url={
                        mainImage ??
                        "https://static.mana.wiki/endfield/common_charhead_blank.png"
                     }
                     options="height=320"
                     alt={mainName ?? "Icon"}
                  />
               </div>
            </section>
            <section>
               <div
                  className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
               >
                  {mainStatDisplay?.map((row) => (
                     <div className="px-3 py-2.5 justify-between flex items-center gap-2">
                        <div className="flex items-center gap-2">
                           <span className="font-semibold text-sm">
                              {row.label}
                           </span>
                        </div>
                        <div className="text-sm font-semibold">
                           <span className="inline-block align-middle">
                              {row.value}
                           </span>
                        </div>
                     </div>
                  ))}

                  {mainAttributes?.map((attr: any, aindex: any) => {
                     const attr_icon = attr?.icon?.url;
                     const attr_name = attr?.attribute?.name;
                     let attr_val =
                        (attr?.value *
                           curves.find((c: any) => c.id == aindex + 1)
                              ?.values?.[level]?.value) /
                        10000;

                     if (attr?.ratio) {
                        attr_val = Math.floor(attr_val * 1000) / 10;
                     } else if (attr?.attribute?.percent) {
                        attr_val = Math.floor(attr_val / 100);
                     }

                     const is_perc = attr?.ratio || attr?.attribute?.percent;

                     return (
                        <>
                           <div className="py-2.5 px-3 justify-between flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                 {attr_icon ? (
                                    <>
                                       <div className="items-center inline-block align-middle justify-center h-full mr-1 invert-[0.3]">
                                          <Image
                                             height={30}
                                             className="object-contain"
                                             url={attr_icon}
                                             options="height=30"
                                             alt={attr_name ?? "Icon"}
                                          />
                                       </div>
                                    </>
                                 ) : null}
                                 <span className="font-semibold text-sm inline-block align-middle">
                                    {attr_name}
                                 </span>
                              </div>
                              <div className="text-sm font-semibold">
                                 <span className="inline-block align-middle">
                                    {is_perc ? attr_val + "%" : attr_val}
                                 </span>
                              </div>
                           </div>
                        </>
                     );
                  })}
               </div>
            </section>
         </div>
         {/* Slider */}
         <div className="my-2 flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-dark350 rounded-lg shadow-sm shadow-1 border border-color-sub">
            <div className="mr-2 inline-flex align-middle text-zinc-200">
               <div className="text-xs mr-1 text-gray-500 self-center">Lv</div>
               <input
                  className="text-lg font-bold mr-2 w-6 text-gray-600 dark:text-gray-400 self-center bg-transparent border-0 p-0"
                  value={displevel}
                  onChange={(event) => {
                     const numonly = /^[0-9\b]+$/;
                     const maxval = 90;

                     // Only set the level slider value if the entered value is not blank or a Number. Parseint as well so leading 0s are removed.
                     if (numonly.test(event.target.value)) {
                        let input = parseInt(event.target.value);
                        if (input > maxval) {
                           input = maxval;
                        } else if (input < 1) {
                           input = 1;
                        }
                        let input_entry = curves[0]?.values?.findIndex(
                           (l: any) => l.level == input,
                        );
                        setLevel(input_entry);
                     }
                  }}
               ></input>

               {/* ◇ ◆  Symbols */}
               <div className="flex text-md font-bold mr-2 items-center self-center rounded-full bg-zinc-200 dark:bg-zinc-500 h-5 px-1.5">
                  {[1, 2, 3, 4, 5, 6].map((stg: any) => (
                     <div
                        className={clsx(
                           dispasc >= stg ? "text-white" : "text-zinc-800",
                           "inline-block align-middle drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]",
                        )}
                     >
                        ◆
                     </div>
                     // <Image
                     //   height={15}
                     //   className={`object-contain inline-block align-middle drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)] ${
                     //     dispasc >= stg ? "invert-[0.10]" : "invert-[0.90]"
                     //   }`}
                     //   url={"https://static.mana.wiki/endfield/icon_breakmark_01.png"}
                     //   options="height=15"
                     //   alt={">"}
                     // />
                  ))}
               </div>
            </div>
            <input
               aria-label="Level Slider"
               className="h-1 flex-grow appearance-none justify-end
                              rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
               type="range"
               min="0"
               max={curves[0].values.length - 1}
               value={level}
               onChange={(event) => setLevel(parseInt(event.target.value))}
            ></input>
         </div>

         {/* Description */}
         <div
            className="my-2 flex items-center gap-2 px-3 py-2.5 bg-3-sub
            rounded-lg shadow-sm shadow-1 border border-color-sub italic"
         >
            {mainDesc}
         </div>
      </>
   );
}
