import { useState } from "react";

import type {
   Material,
   Character,
   SkillTree,
   Trace as TraceType,
} from "payload/generated-custom-types";
import { Image } from "~/components";

export const Traces = ({
   data,
}: {
   data: {
      character: Character;
      skillTree: SkillTree[];
   };
}) => {
   const { character, skillTree } = data;
   const traces = character.traces;

   return (
      <div className="grid gap-3 laptop:grid-cols-2">
         {traces?.map((trace, index) => (
            <Trace trace={trace} skillTreeData={skillTree} key={index} />
         ))}
      </div>
   );
};

function Trace({
   trace,
   skillTreeData,
}: {
   trace: TraceType;
   skillTreeData: SkillTree[];
}) {
   const [skillLevel, setSkillLevel] = useState(1);
   const activeNode = skillTreeData.find((a) => a.name == trace.name);

   return (
      <div className="border-color-sub bg-2-sub shadow-1 overflow-hidden rounded-lg border shadow-sm">
         {/* Header with Skill Icon and Name */}
         <div className="bg-3-sub relative flex items-center gap-3 p-3 border-b border-color-sub">
            <div className="flex h-11 w-11 items-center justify-center p-1 rounded-full bg-zinc-500 dark:bg-zinc-600">
               <Image
                  options="aspect_ratio=1:1&height=80&width=80"
                  className="object-contain"
                  url={trace?.icon?.url}
                  alt={trace.name}
                  loading="lazy"
               />
            </div>
            <div className="space-y-1">
               <div className="font-bold">{trace.name}</div>
               <div className="text-sm font-semibold text-1">
                  {trace.desc_type}
               </div>
            </div>
         </div>

         {/* Level Slider and Materials IF Skill Has Levels greater than 1*/}
         {trace.description_per_level &&
         trace.description_per_level?.length > 1 ? (
            <>
               {/* Slider */}
               <div className="border-color flex w-full items-center gap-2 border-y px-3 py-2.5">
                  <div className="mr-2 inline-flex align-middle ">
                     Lv. {skillLevel}
                  </div>
                  <input
                     aria-label="Level Slider"
                     className="h-1 flex-grow appearance-none justify-end
                           rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
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
            className="border-color-sub border-t p-3 text-sm"
            dangerouslySetInnerHTML={{
               __html:
                  trace?.description_per_level?.[skillLevel - 1]?.description ??
                  "",
            }}
         ></div>
      </div>
   );
}

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
                     ]?.material_qty?.map((matqty: any, key: number) => {
                        return <ItemQtyFrame mat={matqty} key={key} />;
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
type ItemQtyFrameProps = {
   materials?: Material;
   qty?: number;
   id?: string;
};
const ItemQtyFrame = ({ mat }: { mat: ItemQtyFrameProps }) => {
   // Matqty holds material and quantity information

   return (
      <div className="relative inline-block text-center" key={mat?.id}>
         <a href={`/starrail/c/materials/${mat.materials?.id}`}>
            <div className="relative mr-0.5 mt-0.5 inline-block h-11 w-11 align-middle text-xs">
               <img
                  src={mat.materials?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     mat.materials?.rarity?.display_number ?? "1"
                  } material-frame`}
                  alt={mat.materials?.name}
                  loading="lazy"
                  width="44"
                  height="44"
               />
            </div>
            <div className="relative mr-0.5 w-11 rounded-b-sm border-b border-gray-700 bg-bg1Dark align-middle text-xs text-white">
               {mat?.qty}
            </div>
         </a>
      </div>
   );
};
