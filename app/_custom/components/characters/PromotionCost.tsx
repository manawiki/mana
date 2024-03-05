import type { Character } from "payload/generated-custom-types";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

export const PromotionCost = ({
   data,
}: {
   data: {
      character: Character;
   };
}) => {
   const { character } = data;

   return (
      <>
         <Table grid framed>
            <TableHead>
               <TableRow>
                  <TableHeader center>Level</TableHeader>
                  <TableHeader>Materials</TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {character.promotion_cost?.map((promo, index) => (
                  <TableRow key={index}>
                     <TableCell bold center>
                        Lv {promo.max_level}
                     </TableCell>
                     <TableCell>
                        {promo.material_qty?.map((mat, key) => (
                           <div
                              className="relative inline-block text-center"
                              key={mat?.id}
                           >
                              <a href={`/c/materials/${mat.materials?.id}`}>
                                 <div className="relative mr-0.5 mt-0.5 inline-block h-11 w-11 align-middle text-xs">
                                    <img
                                       src={
                                          mat.materials?.icon?.url ??
                                          "no_image_42df124128"
                                       }
                                       className={`object-contain color-rarity-${
                                          mat.materials?.rarity
                                             ?.display_number ?? "1"
                                       } material-frame`}
                                       alt="Material Icon"
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
                        ))}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </>
   );
};
