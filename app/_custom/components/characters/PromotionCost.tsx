import type { Material, Character } from "payload/generated-custom-types";

export const PromotionCost = ({ pageData }: { pageData: Character }) => {
   return (
      <>
         <table className="talent-table w-full overflow-auto text-sm">
            <thead>
               <tr className="text-sm">
                  <th>Level</th>
                  <th>Materials</th>
               </tr>
            </thead>
            <tbody>
               {pageData.promotion_cost?.map((promo, index) => (
                  <tr key={index}>
                     <th className="px-3 py-0 text-center text-xs font-bold">
                        <div>Lv {promo.max_level}</div>
                     </th>
                     <td className="px-1 py-1 pl-3">
                        {promo.material_qty?.map((mat, key) => (
                           <ItemQtyFrame mat={mat} key={key} />
                        ))}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
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
