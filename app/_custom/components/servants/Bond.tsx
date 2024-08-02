import type { Servant as ServantType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";

const thformat =
   "p-2 leading-none text-center border border-color-sub bg-zinc-50 dark:bg-zinc-800";
const tdformat = "p-2 leading-none text-center border border-color-sub";

export function Bond({ data }: { data: any }) {
   const servant = data.servant;
   const ce = data.ceData;
   return (
      <>
         <Bond_Table data={servant} />
         <Bond_CE ce={ce} />
      </>
   );
}

function Bond_Table({ data: servant }: { data: ServantType }) {
   const bond = servant?.bond_experience;

   return (
      <>
         <div className="my-1">
            <table className="text-sm w-full ">
               <tbody>
                  <tr>
                     <th className={thformat}>Bond Lv</th>
                     {bond?.map((exp: any, ind: any) => (
                        <th className={thformat} key={"bond_exp_header_" + ind}>
                           {ind + 1}
                        </th>
                     ))}
                  </tr>
                  <tr>
                     <th className={thformat}>Bond EXP</th>
                     {bond?.map((exp: any, ind: any) => (
                        <td className={tdformat} key={"bond_exp_value_" + ind}>
                           {exp.toLocaleString()}
                        </td>
                     ))}
                  </tr>
               </tbody>
            </table>
         </div>
      </>
   );
}

function Bond_CE({ ce }: { ce: any }) {
   const bond_ce = ce?.filter((a) => a.is_bond_ce == true);
   return (
      <>
         {bond_ce?.map((bc: any) => {
            return (
               <>
                  <div className="my-1 border border-color-sub rounded-sm p-3">
                     <div className="inline-block mr-1 align-middle">
                        <a href={`/c/craft-essences/${bc?.slug ?? bc?.id}`}>
                           <div className="relative mr-0.5 inline-block h-14 w-14 align-middle text-xs">
                              <img
                                 src={bc?.icon?.url ?? "no_image_42df124128"}
                                 className={`object-contain h-14`}
                                 alt={bc?.name}
                                 loading="lazy"
                              />
                           </div>
                        </a>
                     </div>
                     <div className="inline-block align-middle">
                        <div>
                           <a href={`/c/craft-essences/${bc?.slug ?? bc?.id}`}>
                              <div className="text-base text-blue-500">
                                 {bc?.name}
                              </div>
                           </a>
                        </div>
                        <div
                           className="text-sm"
                           dangerouslySetInnerHTML={{ __html: bc?.description }}
                        ></div>
                     </div>
                  </div>
               </>
            );
         })}
      </>
   );
}
