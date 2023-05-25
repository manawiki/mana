import { useState, useEffect } from "react";

export const Achievements = ({ pageData }: any) => {
   return (
      <>
         {pageData?.map((a: any) => {
            const [checked, setChecked] = useState(null);
            useEffect(() => {
               setChecked(
                  JSON.parse(
                     localStorage.getItem(
                        "HSR_manawiki_achievement-" + a?.data_key
                     )
                  )
               );
            }, []);

            return (
               <>
                  <div className="relative block p-2 my-1 align-middle border-b">
                     {/* Checkbox section */}
                     <div className="w-1/12 mr-3 text-center inline-block align-middle">
                        <div
                           className={`border rounded-full h-10 w-10 font-bold text-green-500 text-3xl pt-0.5  cursor-pointer ${
                              checked ? " bg-green-700 bg-opacity-60" : ""
                           }`}
                           onClick={() => {
                              localStorage.setItem(
                                 "HSR_manawiki_achievement-" + a?.data_key,
                                 JSON.stringify(!checked)
                              );

                              setChecked(!checked);
                           }}
                        >
                           {checked ? "" : ""}
                        </div>
                     </div>

                     {/* Achievement Description section */}
                     <div className="w-5/6 inline-block align-middle">
                        <div className="text-xl font-bold">{a.name}</div>
                        <div
                           className=""
                           dangerouslySetInnerHTML={{ __html: a.description }}
                        ></div>
                     </div>
                  </div>
               </>
            );
         })}
      </>
   );
};
