import type {
   Material,
   Character,
   SkillTree,
} from "payload/generated-custom-types";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

export const TotalMaterialCost = ({
   data,
}: {
   data: {
      character: Character;
      skillTree: SkillTree[];
   };
}) => {
   const { character, skillTree } = data;

   // Three totals:
   // 1) Promotion total
   // 2) Skill tree total
   // 3) All total

   // 1) Calculate Promotion total
   // ======================
   let promotionTotal = [] as ItemQtyFrameProps[];

   const promData = character?.promotion_cost;
   if (promData && promData?.length > 0) {
      for (let i = 0; i < promData?.length; i++) {
         const material_qty = promData?.[i]?.material_qty;
         if (!material_qty) break;
         for (let j = 0; j < material_qty.length; j++) {
            const currMat = { ...material_qty?.[j] } as ItemQtyFrameProps;
            const existIndex = promotionTotal.findIndex(
               (a) => a.materials?.id == currMat.materials?.id,
            );
            if (existIndex == -1) {
               promotionTotal.push(currMat);
            } else {
               promotionTotal[existIndex].qty += currMat.qty;
            }
         }
      }
   }

   // 2) Calculate Skill Tree total
   // ======================
   let skillTreeTotal = [] as ItemQtyFrameProps[];
   for (let s = 0; s < skillTree?.length; s++) {
      const treeData = skillTree?.[s]?.level_up_cost;
      if (!treeData) break;

      for (let i = 0; i < treeData?.length; i++) {
         const material_qty = treeData[i].material_qty;
         if (!material_qty) break;

         for (let j = 0; j < material_qty?.length; j++) {
            const currMat = { ...material_qty[j] } as ItemQtyFrameProps;
            const existIndex = skillTreeTotal.findIndex(
               (a: any) => a.materials?.id == currMat.materials?.id,
            );
            if (existIndex == -1) {
               skillTreeTotal.push(currMat);
            } else {
               skillTreeTotal[existIndex].qty += currMat.qty;
            }
         }
      }
   }

   // 3) Calculate All total
   // ======================
   let allTotal = [] as ItemQtyFrameProps[];
   for (let i = 0; i < promotionTotal.length; i++) {
      const currMat = { ...promotionTotal[i] } as ItemQtyFrameProps;
      const existIndex = allTotal.findIndex(
         (a) => a.materials?.id == currMat.materials?.id,
      );
      if (existIndex == -1) {
         allTotal.push(currMat);
      } else {
         allTotal[existIndex].qty += currMat.qty;
      }
   }
   for (let i = 0; i < skillTreeTotal.length; i++) {
      const currMat = { ...skillTreeTotal[i] };
      const existIndex = allTotal.findIndex(
         (a: any) => a.materials?.id == currMat.materials?.id,
      );
      if (existIndex == -1) {
         allTotal.push(currMat);
      } else {
         allTotal[existIndex].qty += currMat.qty;
      }
   }

   return (
      <>
         <Table grid framed>
            <TableHead>
               <TableRow>
                  <TableHeader center>Total</TableHeader>
                  <TableHeader>Materials</TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {/* Promotion */}
               <TableRow>
                  <TableCell center bold>
                     Promotion
                  </TableCell>
                  <TableCell>
                     {promotionTotal?.map((mat, key) => (
                        <ItemQtyFrame mat={mat} key={key} />
                     ))}
                  </TableCell>
               </TableRow>
               {/* Skill Tree */}
               <TableRow>
                  <TableCell center bold>
                     Skill Tree
                  </TableCell>
                  <TableCell>
                     {skillTreeTotal?.map((mat, key) => (
                        <ItemQtyFrame mat={mat} key={key} />
                     ))}
                  </TableCell>
               </TableRow>
               {/* All */}
               <TableRow>
                  <TableCell center bold>
                     All
                  </TableCell>
                  <TableCell>
                     {allTotal?.map((mat, key) => (
                        <ItemQtyFrame mat={mat} key={key} />
                     ))}
                  </TableCell>
               </TableRow>
            </TableBody>
         </Table>
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
   materials: Material;
   qty: number;
   id: string;
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
         <a href={`/c/materials/${mat.materials?.id}`}>
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
