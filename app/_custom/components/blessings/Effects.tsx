import { H2 } from "../custom";

export const Effects = ({ pageData }: any) => {
   const effects = pageData?.effects;

   return (
      <>
         <H2 text="Effect" />
         <section className="divide-color shadow-1 bg-2 border-color divide-y overflow-hidden rounded-md border shadow-sm">
            {effects?.map((eff: any, i: any) => {
               const lv = eff?.level;
               const desc = eff?.description;
               const descsimple = eff?.description_simple;

               return (
                  <div key={i} className="p-3">
                     <div className="pb-1 font-bold"> Lv. {lv}</div>
                     <div
                        className="text-1"
                        dangerouslySetInnerHTML={{ __html: desc }}
                     ></div>
                  </div>
               );
            })}
         </section>
      </>
   );
};
