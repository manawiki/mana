import { H2 } from "../custom";
export const Selector = ({ pageData, version, setVersion }: any) => {
   // Show all versions of enemy available as a selector button array
   const varlist = pageData.enemy_variations?.map((a: any, i: any) => {
      return {
         name: a?.name,
         id: a?.data_key,
         index: i,
      };
   });
   return (
      <>
         {varlist.length > 1 ? (
            <>
               <H2 text="Select Enemy Version" />
               <select
                  className="rounded-md w-full dark:bg-neutral-800 mb-2"
                  onChange={(e) => setVersion(e.target.value)}
               >
                  {varlist.map((opt: any) => {
                     return (
                        <>
                           <option value={opt.index}>
                              {opt.name} ({opt.id})
                           </option>
                        </>
                     );
                  })}
               </select>
            </>
         ) : null}
      </>
   );
};
