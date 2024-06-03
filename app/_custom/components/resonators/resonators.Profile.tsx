export function ResonatorProfile({ data: full }: { data: any }) {
   const char = full.Resonator;

   const adata = [
      { name: "Birthday", value: char.birthday },
      { name: "Gender", value: char.gender },
      { name: "Birthplace", value: char.birthplace },
      { name: "Affiliation", value: char.affiliation },
      { name: "Resonance Power", value: char.resonance_power },
      { name: "English Voice", value: char.vo_en },
      { name: "Japanese Voice", value: char.vo_ja },
      { name: "Korean Voice", value: char.vo_ko },
      { name: "Chinese Voice", value: char.vo_zh },
   ];

   const longdata = [
      {
         name: "Resonance Evaluation Report",
         value: char.resonance_eval_report,
      },
      {
         name: "Overclock Diagnostic Report",
         value: char.overclock_diagnostic_report,
      },
   ];

   return (
      <>
         {/* Short Data */}
         <>
            <div className="divide-color-sub shadow-1 border-color-sub divide-y overflow-hidden rounded-lg border shadow-sm">
               {adata.map((stat, index) => {
                  return (
                     <>
                        {stat.value ? (
                           <>
                              <div
                                 className={`${
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
                                 <div
                                    className=""
                                    dangerouslySetInnerHTML={{
                                       __html: stat.value,
                                    }}
                                 ></div>
                              </div>
                           </>
                        ) : null}
                     </>
                  );
               })}
            </div>
         </>

         {/* Long Data */}
         <>
            <div className="mt-2 divide-color-sub shadow-1 border-color-sub divide-y overflow-hidden rounded-lg border shadow-sm">
               {longdata.map((stat, index) => {
                  return (
                     <>
                        {stat.value ? (
                           <>
                              <div
                                 className={`${
                                    index % 2 == 0
                                       ? "bg-2-sub relative block"
                                       : "bg-3-sub relative block"
                                 } flex-col items-center p-3 `}
                                 key={index}
                              >
                                 {/* 2bi) Stat Icon */}
                                 <div className="flex flex-grow items-center space-x-2 border-b border-color-sub mb-2 font-bold pb-2">
                                    <div>{stat.name}</div>
                                 </div>
                                 {/* 2biii) Stat value */}
                                 <div
                                    className=""
                                    dangerouslySetInnerHTML={{
                                       __html: stat.value,
                                    }}
                                 ></div>
                              </div>
                           </>
                        ) : null}
                     </>
                  );
               })}
            </div>
         </>
      </>
   );
}
