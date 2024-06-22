import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

export function WeaponsAscension({ data: full }: { data: any }) {
   const char = full.Weapon;

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
               <TableRow>
                  <TableHeader>Level</TableHeader>
                  <TableHeader>Gold</TableHeader>
                  <TableHeader>Materials</TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {char.ascension_costs?.map((promo: any, index: number) =>
                  promo.items?.length > 0 ? (
                     <TableRow key={index}>
                        <TableCell>Lv {index + 1}</TableCell>
                        <TableCell>{promo.gold}</TableCell>
                        <TableCell>
                           {promo.items?.map((mat: any, key: number) => (
                              <ItemQtyFrame mat={mat} key={key} />
                           ))}
                        </TableCell>
                     </TableRow>
                  ) : null,
               )}
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
   cnt?: number;
   id?: string;
};
const ItemQtyFrame = ({ mat }: { mat: ItemQtyFrameProps }) => {
   // Matqty holds material and quantity information

   return (
      <div className="relative inline-block text-center" key={mat?.id}>
         <a href={`/c/items/${mat.item?.id}`}>
            <div className="relative mr-0.5 mt-0.5 inline-block h-11 w-11 align-middle text-xs bg-zinc-700 text-white leading-none">
               <Image
                  height={44}
                  width={44}
                  className="object-contain"
                  url={mat.item?.icon?.url ?? "/favicon.ico"}
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
