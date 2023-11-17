import type { Character as CharacterType } from "payload/generated-custom-types";
import { Disclosure } from "@headlessui/react";
import { Image } from "~/components";
import { useState } from "react";

export function Main({ data: char }: { data: CharacterType }) {
   const [level, setLevel] = useState(0);

   const mainImage = char?.image?.url;
   const mainName = char?.eng_name;
   const mainStatDisplay = [
      {
         label: "Rarity",
         value: char.rarity?.name ? char.rarity?.name + "★" : "-",
      },
      {
         label: "Profession",
         value: char?.profession?.id,
         icon: char?.profession?.icon?.url,
      },
      {
         label: "Weapon Type",
         value: char?.weapon_type?.id,
         icon: char?.weapon_type?.icon?.url,
      },
      {
         label: "Energy Shard Type",
         value: char?.energy_shard_type?.id,
         icon: char?.energy_shard_type?.icon?.url,
      },
   ];

   const mainAttributes = char.attributes?.filter(
      (v: any, i: any) => i > 1 && i < 6,
   );
   const extraAttributes = char.attributes?.filter((v: any, i: any) => i > 5);
   const levelAttribute = char.attributes?.find(
      (a: any) => a.stat?.id == "level",
   );
   const stageAttribute = char.attributes?.find(
      (a: any) => a.stat?.id == "breakStage",
   );

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
                     <div className="px-3 py-1 justify-between flex items-center gap-2">
                        <div className="flex items-center gap-2">
                           <span className="font-semibold text-sm">
                              {row.label}
                           </span>
                        </div>
                        <div className="text-sm font-semibold">
                           <span className="inline-block align-middle">
                              {row.value}
                           </span>
                           {row.icon ? (
                              <>
                                 <div className="items-center inline-block align-middle justify-center dark:bg-dark350 bg-zinc-600 h-full ml-2">
                                    <Image
                                       height={30}
                                       className="object-contain"
                                       url={row?.icon}
                                       options="height=30"
                                       alt={mainName ?? "Icon"}
                                    />
                                 </div>
                              </>
                           ) : null}
                        </div>
                     </div>
                  ))}

                  {mainAttributes?.map((attr: any) => {
                     const attr_icon = attr?.stat?.icon?.url;
                     const attr_name = attr?.stat?.name;
                     const attr_val = attr?.values?.[level];

                     return (
                        <>
                           <div className="py-1 px-3 justify-between flex items-center gap-2">
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
                                    {attr_val}
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
         <div className="my-2 flex items-center gap-2 px-3 bg-zinc-50 dark:bg-dark350 rounded-lg shadow-sm shadow-1 border border-color-sub py-1">
            <div className="mr-2 inline-flex align-middle text-zinc-200">
               <div className="text-xs mr-1 text-gray-500 self-center">Lv</div>
               <div className="text-lg font-bold mr-2 w-6 text-gray-600 dark:text-gray-400 self-center">
                  {levelAttribute.values[level]}
               </div>

               <div className="flex text-md font-bold mr-2 items-center self-center rounded-full bg-zinc-500 h-3">
                  {[1, 2, 3, 4, 5].map((stg: any) => (
                     <Image
                        height={15}
                        className={`object-contain inline-block align-middle drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)] ${
                           stageAttribute.values[level] >= stg
                              ? "invert-[0.10]"
                              : "invert-[0.90]"
                        }`}
                        url={
                           "https://static.mana.wiki/endfield/icon_breakmark_01.png"
                        }
                        options="height=15"
                        alt={"BreakStage"}
                     />
                  ))}
               </div>
            </div>
            <input
               aria-label="Level Slider"
               className="h-1 flex-grow appearance-none justify-end
                              rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
               type="range"
               min="0"
               max={char.attributes?.[0]?.values?.length - 1}
               value={level}
               onChange={(event) => setLevel(parseInt(event.target.value))}
            ></input>
         </div>

         {/* Extra Attributes Collapsible */}
         <Disclosure>
            {({ open }) => (
               <>
                  <Disclosure.Button
                     className={`font-bold bg-zinc-200 dark:bg-zinc-800 border-color-sub
                block w-full border px-2 py-0.5 rounded-md text-xs text-center ${
                   open
                      ? "bg-opacity-90 dark:bg-opacity-100"
                      : "bg-opacity-40 dark:bg-opacity-40"
                }`}
                  >
                     {open ? "Hide Extra Stats" : "Show Extra Stats"}
                  </Disclosure.Button>
                  <Disclosure.Panel className="">
                     <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4 mt-1 mb-3">
                        {/* First row of extra attributes */}
                        <section>
                           <div
                              className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
                           >
                              {extraAttributes
                                 ?.filter((v: any, i: any) => i < 6)
                                 ?.map((attr: any) => {
                                    const attr_icon = attr?.stat?.icon?.url;
                                    const attr_name = attr?.stat?.name;
                                    const attr_val = attr?.values?.[level];

                                    return (
                                       <>
                                          <div className="py-1 px-3 justify-between flex items-center gap-2">
                                             <div className="flex items-center gap-2">
                                                {attr_icon ? (
                                                   <>
                                                      <div className="items-center inline-block align-middle justify-center h-full mr-1 invert-[0.3]">
                                                         <Image
                                                            height={30}
                                                            className="object-contain"
                                                            url={attr_icon}
                                                            options="height=30"
                                                            alt={
                                                               attr_name ??
                                                               "Icon"
                                                            }
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
                                                   {attr_val}
                                                </span>
                                             </div>
                                          </div>
                                       </>
                                    );
                                 })}
                           </div>
                        </section>

                        {/* Second row of extra attributes */}
                        <section>
                           <div
                              className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
          [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
                           >
                              {extraAttributes
                                 ?.filter((v: any, i: any) => i >= 6)
                                 ?.map((attr: any) => {
                                    const attr_icon = attr?.stat?.icon?.url;
                                    const attr_name = attr?.stat?.name;
                                    const attr_val = attr?.values?.[level];

                                    return (
                                       <>
                                          <div className="py-1 px-3 justify-between flex items-center gap-2">
                                             <div className="flex items-center gap-2">
                                                {attr_icon ? (
                                                   <>
                                                      <div className="items-center inline-block align-middle justify-center h-full mr-1 invert-[0.3]">
                                                         <Image
                                                            height={30}
                                                            className="object-contain"
                                                            url={attr_icon}
                                                            options="height=30"
                                                            alt={
                                                               attr_name ??
                                                               "Icon"
                                                            }
                                                         />
                                                      </div>
                                                   </>
                                                ) : (
                                                   <div className="mr-1 w-[30px] h-[30px]"></div>
                                                )}
                                                <span className="font-semibold text-sm inline-block align-middle">
                                                   {attr_name}
                                                </span>
                                             </div>
                                             <div className="text-sm font-semibold">
                                                <span className="inline-block align-middle">
                                                   {attr_val}
                                                </span>
                                             </div>
                                          </div>
                                       </>
                                    );
                                 })}
                           </div>
                        </section>
                     </div>
                  </Disclosure.Panel>
               </>
            )}
         </Disclosure>
      </>
   );
}
