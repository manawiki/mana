import { useState } from "react";
import { Image } from "~/components";

export const Traces = ({ pageData, skillTreeData }: any) => {
   const traces = pageData.traces;

   return (
      <div
         className="bg-2 divide-color border-color shadow-1 mb-4 
      divide-y-4 overflow-hidden rounded-lg border shadow"
      >
         {traces.map((trace: any, index: any) => {
            const [skillLevel, setSkillLevel] = useState(1);
            const activeNode = skillTreeData.find(
               (a: any) => a.name == trace.name
            );

            return (
               <>
                  <div key={index}>
                     {/* Header with Skill Icon and Name */}
                     <div className="bg-1 relative flex items-center gap-3 p-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-700">
                           <div className="h-9 w-8 rounded-full">
                              <Image
                                 className="object-contain"
                                 url={trace?.icon?.url}
                                 alt={trace.name}
                              />
                           </div>
                        </div>
                        <div className="space-y-1">
                           <div className="font-bold">{trace.name}</div>
                           <div className="text-sm">{trace.desc_type}</div>
                        </div>
                     </div>

                     {/* Level Slider and Materials IF Skill Has Levels greater than 1*/}
                     {trace.description_per_level?.length > 1 ? (
                        <>
                           {/* Slider */}
                           <div className="border-color flex w-full items-center gap-2 border-y px-3 py-2.5">
                              <div className="mr-2 inline-flex align-middle ">
                                 Lv {skillLevel}
                              </div>
                              <input
                                 className="h-1 flex-grow appearance-none justify-end
                                 rounded bg-zinc-200 align-middle accent-yellow-500 outline-none dark:bg-zinc-700"
                                 type="range"
                                 min="1"
                                 max={trace?.description_per_level?.length}
                                 value={skillLevel}
                                 onChange={(event) =>
                                    setSkillLevel(parseInt(event.target.value))
                                 }
                              ></input>
                           </div>
                        </>
                     ) : null}

                     {/* Description */}
                     <div
                        className="border-color border-t p-3 text-sm"
                        dangerouslySetInnerHTML={{
                           __html:
                              trace?.description_per_level?.[skillLevel - 1]
                                 ?.description ?? "",
                        }}
                     ></div>
                  </div>
               </>
            );
         })}
      </div>
   );
};

const LevelMaterials = ({ activeNode, skillLevel }: any) => {
   return (
      <>
         {/* Level Materials */}
         {activeNode?.level_up_cost[skillLevel - 1]?.material_qty?.length >
         0 ? (
            <>
               {/* Material Upgrade List if applicable */}
               <div className="block w-full text-center">
                  <div className="mt-1 inline-block w-fit rounded-sm bg-gray-100 p-1 px-3 text-center dark:bg-neutral-800">
                     {activeNode?.level_up_cost[
                        skillLevel - 1
                     ]?.material_qty?.map((matqty: any) => {
                        return <ItemQtyFrame mat={matqty} />;
                     })}
                  </div>
               </div>
            </>
         ) : null}
      </>
   );
};

// ====================================
// 0a) GENERIC: Item Icon and Quantity Frame
// ------------------------------------
// * PROPS (Arguments) accepted:
// - item: An object from the material_qty structure, with an id, item{}, and qty field.
// ====================================
const ItemQtyFrame = ({ mat }: any) => {
   // Matqty holds material and quantity information

   return (
      <div className="relative inline-block text-center" key={mat?.id}>
         <a href={`/starrail/collections/materials/${mat.materials?.id}/c`}>
            <div className="relative mr-0.5 mt-0.5 inline-block h-11 w-11 align-middle text-xs">
               <img
                  src={mat.materials?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     mat.materials?.rarity?.display_number ?? "1"
                  } material-frame`}
                  alt={mat.materials?.name}
               />
            </div>
            <div className="relative mr-0.5 w-11 rounded-b-sm border-b border-gray-700 bg-bg1Dark align-middle text-xs text-white">
               {mat?.qty}
            </div>
         </a>
      </div>
   );
};
