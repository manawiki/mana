import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

export function ResonatorAscension({ data: full }: { data: any }) {
   const char = full.Resonator;
   //@ts-ignore
   const asc_cost = char.ascension_costs?.sort((a, b) => a.level - b.level);

   return (
      <>
         <div
            dangerouslySetInnerHTML={{
               __html: `<style>
                    div.wuwa-rarity-1 {
                        border-top: 2px solid #efece1;
                    }
                    div.wuwa-rarity-2 {
                        border-top: 2px solid #efece1;
                    }
                    div.wuwa-rarity-3 {
                        border-top: 2px solid #efece1;
                    }
                    div.wuwa-rarity-4 {
                        border-top: 2px solid #ca6dff;
                    }
                    div.wuwa-rarity-5 {
                        border-top: 2px solid #ffe65a;
                    }
                  </style>`,
            }}
         ></div>

         <Table grid framed>
            <TableHead>
               <TableRow className="text-sm">
                  <TableHeader>Level</TableHeader>
                  <TableHeader>Materials</TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {asc_cost?.map((promo, index) => {
                  return (
                     <>
                        {promo.items?.length > 0 ? (
                           <TableRow key={index}>
                              <TableCell>Lv {promo.level}</TableCell>
                              <TableCell>
                                 {promo.items?.map((mat, key) => (
                                    <ItemQtyFrame mat={mat} key={key} />
                                 ))}
                              </TableCell>
                           </TableRow>
                        ) : null}
                     </>
                  );
               })}
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
   item?: Item;
   cnt?: number;
   id?: string;
};
const ItemQtyFrame = ({ mat }: { mat: ItemQtyFrameProps }) => {
   // Matqty holds material and quantity information

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
               {mat?.cnt}
            </div>
         </a>
      </div>
   );
};
