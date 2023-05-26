export const SetEffect = ({ pageData }: any) => {
   const sets = pageData?.set_effect;
   return (
      <>
         <div className="border-color divide-color shadow-1 bg-2 divide-y rounded-lg border shadow-sm">
            {sets?.map((eff: any) => {
               return (
                  <>
                     <div className="px-4 py-3">
                        <div className="pb-1 font-bold text-yellow-600 dark:text-yellow-200">
                           {eff.req_no}-Pc
                        </div>
                        <div
                           className=""
                           dangerouslySetInnerHTML={{ __html: eff.description }}
                        ></div>
                     </div>
                  </>
               );
            })}
         </div>
      </>
   );
};
