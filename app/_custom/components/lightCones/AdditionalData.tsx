import type { LightCone } from "payload/generated-custom-types";

export const AdditionalData = ({ data }: { data: LightCone }) => {
   const adata = [
      { name: "Max Promotion", value: data.max_promotion },
      { name: "EXP Provided", value: data.exp_provide },
      { name: "Coin Cost", value: data.coin_cost },
   ];

   return (
      <>
         <div className="divide-color-sub shadow-1 border-color-sub divide-y overflow-hidden rounded-lg border shadow-sm">
            {adata.map((stat, index) => {
               return (
                  <div
                     className={`
                      /*2b) Alternating background stats for 5 or 6 stats depending on bonus stat */
                      ${
                         index % 2 == 0
                            ? "bg-2-sub relative block"
                            : "bg-3-sub relative block"
                      } flex items-center p-3`}
                     key={index}
                  >
                     {/* 2bi) Stat Icon */}
                     <div className="flex flex-grow items-center space-x-2">
                        <div>{stat.name}</div>
                     </div>
                     {/* 2biii) Stat value */}
                     <div className="">{stat.value}</div>
                  </div>
               );
            })}
         </div>
      </>
   );
};
