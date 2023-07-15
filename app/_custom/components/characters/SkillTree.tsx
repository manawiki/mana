import { useState } from "react";
import { Image } from "~/components";
import type {
   Material,
   Character,
   SkillTree as SkillTreeType,
} from "payload/generated-custom-types";

export const SkillTree = ({
   pageData,
   skillTreeData,
}: {
   pageData: Character;
   skillTreeData: SkillTreeType[];
}) => {
   // UseState variable settings
   const [treeNode, setTreeNode] = useState(0);
   const [skillLevel, setSkillLevel] = useState(1);

   let pathkey = pageData?.path?.data_key;
   let treelist = skillTreeData; // pageData?.attributes?.tree; //skillTreeData;
   let traces = pageData?.traces;

   // Need to sort skill nodes in order from Point01 - 18
   treelist.sort((a, b) =>
      a?.anchor && b?.anchor && a.anchor > b.anchor
         ? 1
         : a?.anchor && b?.anchor && b.anchor > a.anchor
         ? -1
         : 0
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
         <div
            className="shadow-1 shadow-1 rounded-lg bg-zinc-500 text-center
          shadow-sm dark:bg-bg2Dark"
         >
            <div className="canvas mx-auto flex items-center justify-center">
               <div className={`canvas-${pathkey}`}></div>

               {connectorlist?.map((con) => (
                  <div
                     className={`connector connector-${con}-${pathkey}`}
                     key={`connector-${con}-${pathkey}`}
                  />
               ))}

               {treelist?.map((node: any, i: any) => (
                  <div
                     key={i}
                     className={`point cursor-pointer point-${
                        i + 1
                     }-${pathkey} ${treeNode == i + 1 ? "invert" : ""}`}
                     style={{
                        backgroundImage: "url(" + node?.icon?.url + ")",
                     }}
                     onClick={() => {
                        setTreeNode(i + 1);
                        setSkillLevel(1);
                     }}
                  ></div>
               ))}
            </div>
         </div>
         <div className="text-center">
            {treeNode > 0 ? (
               <div className="-mt-2 inline-block w-full rounded-b-md bg-zinc-500 p-3 dark:bg-bg2Dark">
                  {/* Node Name */}
                  <div className="text-lg font-bold text-zinc-100">
                     {activeNode.name}
                  </div>

                  {/* Level Slider and Materials IF Skill Has Levels greater than 1*/}
                  {activeNode.affected_skill?.[0]?.description_per_level &&
                  activeNode.affected_skill[0]?.description_per_level?.length >
                     1 ? (
                     <>
                        {/* Slider */}
                        <div className="my-2 flex items-center gap-2 px-10">
                           <div className="mr-2 inline-flex align-middle text-zinc-200">
                              Lv {skillLevel}
                           </div>
                           <input
                              aria-label="Level Slider"
                              className="h-1 flex-grow appearance-none justify-end
                              rounded bg-zinc-200 align-middle accent-yellow-500 outline-none dark:bg-zinc-700"
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
                     className="pt-2 text-sm text-zinc-200"
                     dangerouslySetInnerHTML={{
                        __html:
                           activeNode.description +
                           (activeNode.affected_skill?.[0]
                              ?.description_per_level?.[skillLevel - 1]
                              ?.description ?? ""),
                     }}
                  ></div>

                  {activeNode.level_up_cost &&
                  activeNode.level_up_cost?.length > 0 ? (
                     <>
                        {/* Material Upgrade List if applicable */}
                        <div className="space-x-2 p-3">
                           {activeNode.level_up_cost[
                              skillLevel - 1
                           ]?.material_qty?.map((matqty: any, key: number) => (
                              <ItemQtyFrame mat={matqty} key={key} />
                           ))}
                        </div>
                     </>
                  ) : null}

                  <div className="p-3 text-sm text-zinc-200">
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
type ItemQtyFrameProps = {
   materials?: Material;
   qty?: number;
   id?: string;
};
const ItemQtyFrame = ({ mat }: { mat: ItemQtyFrameProps }) => {
   // Matqty holds material and quantity information

   return (
      <div className="relative inline-block text-center" key={mat?.id}>
         <a href={`/starrail/collections/materials/${mat.materials?.id}`}>
            <div
               className="relative mr-0.5 mt-0.5 inline-block h-11 w-11
            align-middle text-xs"
            >
               <Image
                  options="aspect_ratio=1:1&height=60&width=60"
                  url={mat.materials?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     mat.materials?.rarity?.display_number ?? "1"
                  } material-frame`}
                  alt={mat.materials?.name}
                  loading="lazy"
               />
            </div>
            <div
               className="relative mr-0.5 w-11 rounded-b-sm border-b 
               border-gray-700 bg-bg1Dark align-middle text-xs text-white"
            >
               {mat?.qty}
            </div>
         </a>
      </div>
   );
};
