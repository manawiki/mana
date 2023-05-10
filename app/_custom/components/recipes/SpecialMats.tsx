import { Link } from "@remix-run/react";
import { H2 } from "~/_custom/components/custom";
import { Image } from "~/components";

export const SpecialMats = ({ pageData }: any) => {
   const spec = pageData?.special_material_cost;
   const specnum = pageData?.special_material_cost_num;

   return (
      <>
         {spec?.length > 0 ? (
            <>
               <H2 text="Special Materials Required" />

               <div className="justify-between mt-1 rounded-t-md border-r border-t border-l dark:border-gray-700 dark:bg-neutral-800 text-center p-2">
                  {spec?.map((mat: any) => {
                     return (
                        <>
                           <ItemFrame mat={mat} />
                        </>
                     );
                  })}
               </div>
               <div className="justify-between mb-1 rounded-b-md border dark:border-gray-700 dark:bg-neutral-800 text-center p-2">
                  Total Required: {specnum}
               </div>
            </>
         ) : null}
      </>
   );
};

// ====================================
// 0a) GENERIC: Item Icon Frame
// ------------------------------------
// * PROPS (Arguments) accepted:
// - item: An object with the material structure
// ====================================
const ItemFrame = ({ mat }: any) => {
   // Matqty holds material and quantity information

   return (
      <div className="relative inline-block text-center" key={mat?.id}>
         <Link to={`/starrail/collections/materials/${mat?.id}`}>
            <div className="relative mr-1 mt-0.5 inline-block h-16 w-16 align-middle text-xs">
               <Image
                  url={mat?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     mat?.rarity?.display_number ?? "1"
                  } rounded-md`}
                  alt={mat?.name}
               />
            </div>
         </Link>
      </div>
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
         <Link to={`/starrail/collections/materials/${mat.materials?.id}`}>
            <div className="relative mr-1 mt-0.5 inline-block h-16 w-16 align-middle text-xs">
               <Image
                  url={mat.materials?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     mat.materials?.rarity?.display_number ?? "1"
                  } material-frame`}
                  alt={mat.materials?.name}
               />
            </div>
            <div className="relative mr-1 w-16 rounded-b-sm border-b border-gray-700 bg-bg1Dark align-middle text-sm text-white">
               {mat?.qty}
            </div>
         </Link>
      </div>
   );
};
