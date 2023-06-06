import { Link } from "@remix-run/react";
import { H2 } from "~/_custom/components/custom";
import { Image } from "~/components";

export const Ingredients = ({ pageData }: any) => {
   const mats = pageData?.material_cost;

   return (
      <>
         {mats?.length > 0 ? (
            <>
               <H2 text="Materials Required" />
               <div className="bg-2 border-color shadow-1 my-1 justify-between rounded-md border p-3 shadow-sm">
                  {mats?.map((mat: any, key: number) => {
                     return (
                           <ItemQtyFrame mat={mat} key={key} />
                     );
                  })}
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
         <Link
            prefetch="intent"
            to={`/starrail/collections/materials/${mat.materials?.id}`}
         >
            <div className="relative mr-2 mt-0.5 inline-block h-16 w-16 align-middle text-xs">
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
