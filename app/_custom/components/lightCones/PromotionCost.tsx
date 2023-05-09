export const PromotionCost = ({ pageData }: any) => {
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
               {pageData.promotion_cost?.map((promo: any, index: any) => {
                  return (
                     <>
                        <tr key={index}>
                           <td className="px-3 py-0 text-center text-xs font-bold">
                              <div>Lv {index + 1}</div>
                           </td>
                           <td className="px-1 py-1 pl-3">
                              {promo.material_qty?.map((mat: any) => (
                                 <ItemQtyFrame mat={mat} />
                              ))}
                           </td>
                        </tr>
                     </>
                  );
               })}
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
const ItemQtyFrame = ({ mat }: any) => {
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
               />
            </div>
            <div className="relative mr-0.5 w-11 rounded-b-sm border-b border-gray-700 bg-bg1Dark align-middle text-xs text-white">
               {mat?.qty}
            </div>
         </a>
      </div>
   );
};
