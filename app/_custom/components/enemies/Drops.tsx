export const Drops = ({ pageData }: any) => {
   const drops = pageData.rewards;

   return (
      <>
         {drops?.length > 0 ? (
            <>
               <table className="w-full">
                  <thead>
                     <tr>
                        <th className="text-center py-1 px-2">World Lv</th>
                        <th className="text-center py-1 px-2">EXP</th>
                        <th className="text-center py-1 px-2">Rewards</th>
                     </tr>
                  </thead>

                  <tbody>
                     {drops?.map((d: any) => {
                        return (
                           <>
                              <tr>
                                 <td className="text-center py-1 px-2">
                                    {d.world_level ?? 0}
                                 </td>
                                 <td className="text-center py-1 px-2">
                                    {d.exp_reward ?? 0}
                                 </td>
                                 <td className="py-1 px-2">
                                    {d.drop_list?.map((mat: any) => {
                                       return <ItemFrame mat={mat} />;
                                    })}
                                 </td>
                              </tr>
                           </>
                        );
                     })}
                  </tbody>
               </table>
            </>
         ) : null}
      </>
   );
};

// ====================================
// 0a) GENERIC: Item Icon Frame
// ------------------------------------
// * PROPS (Arguments) accepted:
// - item: An object from the material_qty structure, with an id, item{}, and qty field.
// ====================================
const ItemFrame = ({ mat }: any) => {
   // mat holds material information

   return (
      <div className="relative inline-block text-center" key={mat?.id}>
         <a href={`/starrail/collections/materials/${mat?.id}/c`}>
            <div className="relative mt-0.5 mr-0.5 inline-block h-11 w-11 align-middle text-xs">
               <img
                  src={mat?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     mat?.rarity?.display_number ?? "1"
                  } material-frame`}
                  alt={mat?.name}
               />
            </div>
         </a>
      </div>
   );
};
