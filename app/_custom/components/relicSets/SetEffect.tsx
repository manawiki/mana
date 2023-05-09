export const SetEffect = ({ pageData }: any) => {
   const sets = pageData?.set_effect;
   return (
      <>
         <div>
            {sets?.map((eff: any) => {
               return (
                  <>
                     <div className="my-1 rounded-md border p-2 px-3 dark:border-gray-700 dark:bg-neutral-800">
                        <div className="inline-block font-bold w-12 align-top text-lg text-green-900 dark:text-green-200">
                           {eff.req_no}-Pc:
                        </div>
                        <div
                           className="inline-block w-11/12 align-top text-lg"
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
