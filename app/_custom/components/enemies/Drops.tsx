import type { Material, Enemy } from "payload/generated-custom-types";

export const Drops = ({
   pageData,
   version,
}: {
   pageData: Enemy;
   version: number;
}) => {
   const drops = pageData?.enemy_variations?.[version]?.rewards;

   return (
      <>
         {drops && drops?.length > 0 ? (
            <>
               <table className="w-full">
                  <thead>
                     <tr>
                        <th className="px-2 py-1 text-center">World Lv</th>
                        <th className="px-2 py-1 text-center">EXP</th>
                        <th className="px-2 py-1 text-center">Rewards</th>
                     </tr>
                  </thead>

                  <tbody>
                     {drops?.map((d, key) => (
                        <tr key={key}>
                           <td className="px-2 py-1 text-center">
                              {d?.world_level ?? 0}
                           </td>
                           <td className="px-2 py-1 text-center">
                              {d?.exp_reward ?? 0}
                           </td>
                           <td className="px-2 py-1">
                              {d?.drop_list?.map((mat) => {
                                 return <ItemFrame mat={mat} key={mat?.id} />;
                              })}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </>
         ) : (
            "N/A"
         )}
      </>
   );
};

// ====================================
// 0a) GENERIC: Item Icon Frame
// ------------------------------------
// * PROPS (Arguments) accepted:
// - item: An object from the material_qty structure, with an id, item{}, and qty field.
// ====================================
const ItemFrame = ({ mat }: { mat: Material }) => {
   // mat holds material information

   return (
      <div className="relative inline-block text-center" key={mat?.id}>
         <a href={`/c/materials/${mat?.id}`}>
            <div className="relative mr-0.5 mt-0.5 inline-block h-11 w-11 align-middle text-xs">
               <img
                  src={mat?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     mat?.rarity?.display_number ?? "1"
                  } material-frame`}
                  alt={mat?.name}
                  loading="lazy"
                  width="44"
                  height="44"
               />
            </div>
         </a>
      </div>
   );
};
