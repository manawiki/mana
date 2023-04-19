import { useState } from "react";

export const Traces = ({ pageData, skillTreeData }: any) => {
   var traces = pageData.traces;

   return (
      <>
         {traces.map((trace: any, index: any) => {
            const [skillLevel, setSkillLevel] = useState(1);
            const activeNode = skillTreeData.find(
               (a: any) => a.name == trace.name
            );

            return (
               <>
                  <div
                     className="border rounded-md dark:border-neutral-700 dark:bg-neutral-900 p-2 my-1 bg-gray-50"
                     key={index}
                  >
                     {/* Header with Skill Icon and Name */}
                     <div className="relative ">
                        <div className="inline-flex align-middle h-12 w-12 mr-2 rounded-full bg-neutral-700">
                           <div className="flex self-center justify-center h-9 w-full rounded-full bg-neutral-7">
                              <img
                                 className="object-contain "
                                 src={trace.entry?.icon?.url}
                                 alt={trace.name}
                              />
                           </div>
                        </div>
                        <div className="inline-block align-middle w-3/4">
                           <div className="block text-xl font-bold">
                              {trace.name}
                           </div>
                           <div className="block">{trace.desc_type}</div>
                        </div>
                     </div>

                     {/* Level Slider and Materials IF Skill Has Levels greater than 1*/}
                     {trace.description_per_level?.length > 1 ? (
                        <>
                           {/* Slider */}
                           <div className="border-t border-b p-1 my-1 dark:border-slate-700 w-full flex">
                              <div className="inline-flex align-middle mr-2 dark:text-gray-200 ">
                                 Lv {skillLevel}
                              </div>
                              <input
                                 className="level-slider align-middle inline-flex justify-end grow rounded-lg"
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
                     ) : (
                        <div className="border-b w-full dark:border-slate-700 h-1 my-1"></div>
                     )}

                     {/* Description */}
                     <div
                        className="text-sm"
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
      </>
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
                  <div className="inline-block text-center px-3 p-1 rounded-sm bg-gray-100 dark:bg-neutral-800 mt-1 w-fit">
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
         <a
            href={`/lKJ16E5IhH/collections/materials/${mat.materials?.entry?.id}/c`}
         >
            <div className="relative mt-0.5 mr-0.5 inline-block h-11 w-11 align-middle text-xs">
               <img
                  src={mat.materials?.entry?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     mat.materials?.rarity?.display_number ?? "1"
                  } material-frame`}
                  alt={mat.materials?.name}
               />
            </div>
            <div className="relative mr-0.5 w-11 border-b border-gray-700 bg-black align-middle text-xs text-white">
               {mat?.qty}
            </div>
         </a>
      </div>
   );
};
