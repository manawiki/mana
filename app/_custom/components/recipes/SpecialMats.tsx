import { Link } from "@remix-run/react";

import type { Material, Recipe } from "payload/generated-custom-types";
import { H2 } from "~/components/H2";
import { Image } from "~/components";

export const SpecialMats = ({ pageData }: { pageData: Recipe }) => {
   const spec = pageData?.special_material_cost;
   const specnum = pageData?.special_material_cost_num;

   return (
      <>
         {spec && spec?.length > 0 ? (
            <>
               <H2 text="Special Materials Required" />
               <section className="border-color bg-2 shadow-1 rounded-lg border shadow-sm">
                  <div className="border-color flex items-center gap-2 border-b p-3 text-sm font-bold">
                     <span>Total Required</span>
                     <span
                        className="bg-3 border-color shadow-1 flex h-6 w-6 
                     items-center justify-center rounded-full border shadow-sm"
                     >
                        {specnum}
                     </span>
                  </div>
                  <div className="p-3 pt-1">
                     {spec?.map((mat, key) => (
                        <ItemFrame mat={mat} key={key} />
                     ))}
                  </div>
               </section>
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
const ItemFrame = ({ mat }: { mat: Material }) => {
   // Matqty holds material and quantity information

   return (
      <Link
         className="relative inline-block text-center"
         key={mat?.id}
         prefetch="intent"
         to={`/starrail/collections/materials/${mat?.id}`}
      >
         <div className="relative mr-2 mt-2 inline-block h-16 w-16 align-middle text-xs">
            <Image
               options="aspect_ratio=1:1&height=80&width=80"
               url={mat?.icon?.url ?? "no_image_42df124128"}
               className={`object-contain color-rarity-${
                  mat?.rarity?.display_number ?? "1"
               } rounded-md`}
               alt={mat?.name}
            />
         </div>
      </Link>
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
         <Link to={`/starrail/collections/materials/${mat.materials?.id}`}>
            <div className="relative mr-1 mt-0.5 inline-block h-16 w-16 align-middle text-xs">
               <Image
                  options="aspect_ratio=1:1&height=80&width=80"
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
