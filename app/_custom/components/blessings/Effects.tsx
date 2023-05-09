import { Image } from "~/components";

export const Effects = ({ pageData }: any) => {
   const effects = pageData?.effects;

   return (
      <>
         {effects?.map((eff: any, i: any) => {
            const lv = eff?.level;
            const desc = eff?.description;
            const descsimple = eff?.description_simple;

            return (
               <>
                  <div className="px-3 py-1 my-2 border rounded-md border-color">
                     <div className="px-3 text-center my-1 text-xl w-full bg-neutral-300 dark:bg-neutral-800 bg-opacity-80 border dark:border-neutral-700">
                        Lv. {lv}
                     </div>
                     <div
                        className="my-1 text-lg"
                        dangerouslySetInnerHTML={{ __html: desc }}
                     ></div>
                  </div>
               </>
            );
         })}
      </>
   );
};
