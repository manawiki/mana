import { useState } from "react";

export const SkillTree = ({ pageData, skillTreeData }: any) => {
   // UseState variable settings
   const [treeNode, setTreeNode] = useState(0);
   const [skillLevel, setSkillLevel] = useState(1);

   var pathkey = pageData?.term_path?.data_key;
   var treelist = skillTreeData; // pageData?.attributes?.tree; //skillTreeData;
   var traces = pageData?.traces;

   // Need to sort skill nodes in order from Point01 - 18
   treelist.sort((a: any, b: any) =>
      a.anchor > b.anchor ? 1 : b.anchor > a.anchor ? -1 : 0
   );

   const connectorcount = {
      Knight: 8,
      Warrior: 8,
      Rogue: 8,
      Priest: 9,
      Mage: 6,
      Shaman: 8,
      Warlock: 7,
   };
   // Initialize an array of form [1, 2, 3, ... n], where n is the number of connectors for the character's Path (from connectorcount)
   const connectorlist = Array.from(
      { length: connectorcount[pathkey] },
      (v, k) => k + 1
   );

   // Used by display for individual nodes when clicked.
   const activeNode = treelist[treeNode - 1];

   return (
      <>
         

         <div className="text-center">
            <div className="canvas inline-block">
               <div className={`canvas-${pathkey}`}></div>

               {connectorlist?.map((con: any) => {
                  return (
                     <>
                        <div
                           className={`connector connector-${con}-${pathkey}`}
                        ></div>
                     </>
                  );
               })}

               {treelist?.map((node: any, i: any) => {
                  return (
                     <>
                        <div
                           className={`cursor-pointer point point-${
                              i + 1
                           }-${pathkey} ${treeNode == i + 1 ? "invert" : ""}`}
                           style={{
                              backgroundImage:
                                 "url(" + node.entry?.icon?.url + ")",
                           }}
                           onClick={() => {
                              setTreeNode(i + 1);
                              setSkillLevel(1);
                           }}
                        ></div>
                     </>
                  );
               })}
            </div>
         </div>
         <div className="text-center">
            {treeNode > 0 ? (
               <div className="inline-block my-0.5 p-3 bg-slate-900 rounded-md border border-slate-700 w-full">
                  {/* Node Name */}
                  <div className="text-l text-white font-bold">
                     {activeNode.name}
                  </div>

                  {/* Level Slider and Materials IF Skill Has Levels greater than 1*/}
                  {activeNode.affected_skill[0]?.description_per_level?.length >
                  1 ? (
                     <>
                        {/* Slider */}
                        <div className="border-t border-b p-1 my-1 border-slate-700">
                           <div className="inline-flex align-middle mr-2 text-gray-200">
                              Lv {skillLevel}
                           </div>
                           <input
                              className="level-slider align-middle inline-flex justify-end w-4/5 rounded-lg"
                              type="range"
                              min="1"
                              max={
                                 activeNode.affected_skill[0]
                                    ?.description_per_level?.length
                              }
                              value={skillLevel}
                              onChange={(event) =>
                                 setSkillLevel(parseInt(event.target.value))
                              }
                           ></input>
                        </div>
                     </>
                  ) : null}

                  {/* Node Description */}
                  <div
                     className="text-sm text-white"
                     dangerouslySetInnerHTML={{
                        __html:
                           activeNode.description +
                           (activeNode.affected_skill?.[0]
                              ?.description_per_level?.[skillLevel - 1]
                              ?.description ?? ""),
                     }}
                  ></div>

                  {activeNode.level_up_cost?.length > 0 ? (
                     <>
                        {/* Material Upgrade List if applicable */}
                        <div>
                           {activeNode.level_up_cost[
                              skillLevel - 1
                           ]?.material_qty?.map((matqty: any) => {
                              return <ItemQtyFrame mat={matqty} />;
                           })}
                        </div>
                     </>
                  ) : null}

                  <div className="text-sm text-gray-500">
                     {activeNode.req_ascension ? (
                        <div>Req Asc. {activeNode.req_ascension}</div>
                     ) : null}

                     {activeNode.req_level ? (
                        <div>Req Lv. {activeNode.req_level}</div>
                     ) : null}
                  </div>
               </div>
            ) : null}
         </div>
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
                     mat.materials?.term_rarity?.display_number ?? "1"
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
