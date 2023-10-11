import type { RelicSet } from "payload/generated-custom-types";

export const SetEffect = ({ pageData }: { pageData: RelicSet }) => {
   const sets = pageData?.set_effect;
   return (
      <>
         <div className="border-color-sub divide-color-sub shadow-1 bg-2-sub divide-y rounded-lg border shadow-sm">
            {sets?.map((eff) => (
               <div key={eff.req_no} className="px-4 py-3 text-sm">
                  <div className="pb-1 font-bold">{eff.req_no}-Pc</div>
                  <div
                     className="text-1"
                     dangerouslySetInnerHTML={{ __html: eff.description ?? "" }}
                  ></div>
               </div>
            ))}
         </div>
      </>
   );
};
