import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";
import { Image } from "~/components/Image";

export function ResonatorTotalMaterialCost({ data: full }: { data: any }) {
   const char = full.Resonator;
   const skill_nodes_cost = char?.skill_tree
      ?.filter((a: any) => a.node_type == "SKILL_NODE")
      ?.map((a: any) => a.resonator_skill?.upgrade_costs);
   const passive_nodes_cost = char?.skill_tree
      ?.filter((a: any) => a.node_type == "PASSIVE_NODE")
      ?.map((a: any) => a.resonator_skill?.upgrade_costs);
   const bonus_nodes_cost = char?.skill_tree
      ?.filter((a: any) => a.node_type == "BONUS_NODE")
      ?.map((a: any) => a.unlock_costs);
   const skillTree = [
      ...skill_nodes_cost,
      ...passive_nodes_cost,
      ...bonus_nodes_cost,
   ]
      .flat()
      .flat();

   // Three totals:
   // 1) Ascension total
   // 2) Skill tree total
   // 3) All total

   // 1) Calculate Ascension total
   // ======================
   let promotionTotal = [] as ItemQtyFrameProps[];

   //@ts-ignore
   const promData = char.ascension_costs?.sort((a, b) => a.level - b.level);
   if (promData && promData?.length > 0) {
      for (let i = 0; i < promData?.length; i++) {
         const material_qty = promData?.[i]?.items;
         if (!material_qty) break;
         for (let j = 0; j < material_qty.length; j++) {
            const currMat = { ...material_qty?.[j] } as ItemQtyFrameProps;
            const existIndex = promotionTotal.findIndex(
               (a) => a.item?.id == currMat.item?.id,
            );
            if (existIndex == -1) {
               promotionTotal.push(currMat);
            } else {
               //@ts-ignore
               promotionTotal[existIndex].cnt += currMat.cnt;
            }
         }
      }
   }

   // 2) Calculate Skill Tree total
   // ======================
   let skillTreeTotal = [] as ItemQtyFrameProps[];
   const exists = (id: string) =>
      skillTreeTotal.findIndex((a) => a.item.id == id);

   if (skillTree && skillTree?.length > 0) {
      for (let i = 0; i < skillTree?.length; i++) {
         const entry = skillTree?.[i];
         if (!entry) continue;
         const single = entry?.item;
         if (single) {
            const existIndex = exists(single.id);
            if (existIndex == -1) {
               skillTreeTotal.push({
                  item: single,
                  cnt: entry?.cnt,
               });
            } else {
               //@ts-ignore
               skillTreeTotal[existIndex].cnt += entry?.cnt;
            }
            continue;
         }
         const material_qty = entry?.items;
         for (let j = 0; j < material_qty.length; j++) {
            const currMat = { ...material_qty?.[j] } as ItemQtyFrameProps;
            const existIndex = exists(currMat.item?.id);
            if (existIndex == -1) {
               skillTreeTotal.push(currMat);
            } else {
               //@ts-ignore
               skillTreeTotal[existIndex].cnt += currMat.cnt;
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
         (a) => a.item?.id == currMat.item?.id,
      );
      if (existIndex == -1) {
         allTotal.push(currMat);
      } else {
         //@ts-ignore
         allTotal[existIndex].cnt += currMat.cnt;
      }
   }
   for (let i = 0; i < skillTreeTotal.length; i++) {
      const currMat = { ...skillTreeTotal[i] };
      const existIndex = allTotal.findIndex(
         (a: any) => a.item?.id == currMat.item?.id,
      );
      if (existIndex == -1) {
         //@ts-ignore
         allTotal.push(currMat);
      } else {
         //@ts-ignore
         allTotal[existIndex].cnt += currMat.cnt;
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
}

// ====================================
// 0a) GENERIC: Item Icon and Quantity Frame
// ------------------------------------
// * PROPS (Arguments) accepted:
// - item: An object from the material_qty structure, with an id, item{}, and qty field.
// ====================================
type ItemQtyFrameProps = {
   item?: any;
   cnt: number;
   id?: string;
};
const ItemQtyFrame = ({ mat }: { mat: ItemQtyFrameProps }) => {
   // Matqty holds material and quantity information
   const qtydisp =
      mat?.cnt > 999999
         ? Math.round(mat?.cnt / 1000) / 1000 + "M"
         : mat?.cnt > 999
           ? mat?.cnt / 1000 + "k"
           : mat?.cnt;

   return (
      <div className="relative inline-block text-center" key={mat?.id}>
         <a href={`/c/items/${mat.item?.id}`}>
            <div className="relative mr-0.5 mt-0.5 inline-block h-11 w-11 align-middle text-xs bg-zinc-700 text-white text-xs leading-none">
               <Image
                  height={44}
                  className="object-contain"
                  url={mat.item?.icon?.url ?? "no_image_42df124128"}
                  options="height=44"
                  alt={mat.item?.name}
               />
            </div>
            <div
               className={`relative mr-0.5 w-11 bg-black align-middle text-xs text-white wuwa-rarity-${mat.item?.rarity?.id}`}
            >
               {qtydisp}
            </div>
         </a>
      </div>
   );
};
