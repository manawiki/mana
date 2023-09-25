import type { Enemy } from "payload/generated-custom-types";
import { H2 } from "~/components/H2";

export const Selector = ({
   pageData,
   version,
   setVersion,
}: {
   pageData: Enemy;
   version: number;
   setVersion: React.Dispatch<React.SetStateAction<number>>;
}) => {
   // Show all versions of enemy available as a selector button array
   const varlist = pageData.enemy_variations?.map((a, i) => {
      return {
         name: a?.name,
         id: a?.data_key,
         index: i,
      };
   });
   return (
      <>
         <H2 text="Select Enemy Version" />
         <select
            className="mb-2 w-full rounded-md dark:bg-neutral-800"
            onChange={(e) => setVersion(parseInt(e.target.value))}
         >
            {varlist?.map((opt) => (
               <option key={opt.index} value={opt.index}>
                  {opt?.name} ({opt?.id})
               </option>
            ))}
         </select>
      </>
   );
};
