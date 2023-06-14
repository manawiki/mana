import type { Material } from "payload/generated-custom-types";

export const TotalMaterialCost = ({ pageData, skillTreeData }: any) => {
   // Three totals:
   // 1) Promotion total
   // 2) Skill tree total
   // 3) All total

   // 1) Calculate Promotion total
   // ======================
   var promotionTotal = [];
   const promData = pageData?.promotion_cost;
   for (var i = 0; i < promData?.length; i++) {
      for (var j = 0; j < promData[i].material_qty?.length; j++) {
         const currMat = { ...promData[i].material_qty[j] };
         const existIndex = promotionTotal.findIndex(
            (a: any) => a.materials?.id == currMat.materials?.id
         );
         if (existIndex == -1) {
            promotionTotal.push(currMat);
         } else {
            promotionTotal[existIndex].qty += currMat.qty;
         }
      }
   }

   // 2) Calculate Skill Tree total
   // ======================
   var skillTreeTotal = [];
   for (var s = 0; s < skillTreeData.length; s++) {
      if (skillTreeData[s].level_up_cost?.length > 0) {
         const treeData = skillTreeData[s]?.level_up_cost;

         for (var i = 0; i < treeData?.length; i++) {
            for (var j = 0; j < treeData[i].material_qty?.length; j++) {
               const currMat = { ...treeData[i].material_qty[j] };
               const existIndex = skillTreeTotal.findIndex(
                  (a: any) => a.materials?.id == currMat.materials?.id
               );
               if (existIndex == -1) {
                  skillTreeTotal.push(currMat);
               } else {
                  skillTreeTotal[existIndex].qty += currMat.qty;
               }
            }
         }
      }
   }

   // 3) Calculate All total
   // ======================
   var allTotal = [];
   for (var i = 0; i < promotionTotal.length; i++) {
      const currMat = { ...promotionTotal[i] };
      const existIndex = allTotal.findIndex(
         (a: any) => a.materials?.id == currMat.materials?.id
      );
      if (existIndex == -1) {
         allTotal.push(currMat);
      } else {
         allTotal[existIndex].qty += currMat.qty;
      }
   }
   for (var i = 0; i < skillTreeTotal.length; i++) {
      const currMat = { ...skillTreeTotal[i] };
      const existIndex = allTotal.findIndex(
         (a: any) => a.materials?.id == currMat.materials?.id
      );
      if (existIndex == -1) {
         allTotal.push(currMat);
      } else {
         allTotal[existIndex].qty += currMat.qty;
      }
   }

   return (
      <>
         <table className="talent-table w-full overflow-auto text-sm">
            <thead>
               <tr className="text-sm">
                  <th>Total</th>
                  <th>Materials</th>
               </tr>
            </thead>
            <tbody>
               {/* Promotion */}
               <tr>
                  <th className="px-3 py-0 text-center text-xs font-bold">
                     <div>Promotion</div>
                  </th>
                  <td className="px-1 py-1 pl-3">
                     {promotionTotal?.map((mat: any, key: number) => (
                        <ItemQtyFrame mat={mat} key={key} />
                     ))}
                  </td>
               </tr>
               {/* Skill Tree */}
               <tr>
                  <th className="px-3 py-0 text-center text-xs font-bold">
                     <div>Skill Tree</div>
                  </th>
                  <td className="px-1 py-1 pl-3">
                     {skillTreeTotal?.map((mat: any, key: number) => (
                        <ItemQtyFrame mat={mat} key={key} />
                     ))}
                  </td>
               </tr>
               {/* All */}
               <tr>
                  <th className="px-3 py-0 text-center text-xs font-bold">
                     <div>All</div>
                  </th>
                  <td className="px-1 py-1 pl-3">
                     {allTotal?.map((mat: any, key: number) => (
                        <ItemQtyFrame mat={mat} key={key} />
                     ))}
                  </td>
               </tr>
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
   const qtydisp =
      mat?.qty > 999999
         ? Math.round(mat?.qty / 1000) / 1000 + "M"
         : mat?.qty > 999
         ? mat?.qty / 1000 + "k"
         : mat?.qty;

   return (
      <div className="relative inline-block text-center">
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
            <div
               className={`} relative mr-0.5 w-11 rounded-b-sm border-b border-gray-700 bg-bg1Dark align-middle text-xs
               text-white`}
            >
               {qtydisp}
            </div>
         </a>
      </div>
   );
};
