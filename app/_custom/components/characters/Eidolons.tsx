export const Eidolons = ({ pageData }) => {
   const eidolons = pageData.eidolons;

   return (
      <>
         {eidolons.map((eid: any, index: any) => {
            return (
               <>
                  <div
                     className="border rounded-md dark:border-neutral-700 dark:bg-neutral-900 p-2 my-1 bg-gray-50"
                     key={index}
                  >
                     {/* Header with Skill Icon and Name */}
                     <div className="relative dark:border-slate-700 border-b pb-1">
                        <div className="inline-flex align-middle h-12 w-12 mr-2 rounded-full bg-neutral-700">
                           <div className="flex self-center justify-center h-9 w-full rounded-full bg-neutral-7">
                              <img
                                 className="object-contain "
                                 src={eid.entry?.icon?.url}
                                 alt={eid.name}
                              />
                           </div>
                        </div>
                        <div className="inline-block align-middle w-3/4">
                           <div className="block text-xl font-bold">
                              {eid.name}
                           </div>
                           <div className="block">Lv {eid.rank}</div>
                        </div>
                     </div>

                     {/* Description */}
                     <div
                        className="text-sm mt-1"
                        dangerouslySetInnerHTML={{
                           __html: eid?.description,
                        }}
                     ></div>
                  </div>
               </>
            );
         })}
      </>
   );
};
