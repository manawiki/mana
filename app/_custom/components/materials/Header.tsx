export const Header = ({ pageData }: any) => {
   const iconurl = pageData?.icon?.url;
   const rarityurl = pageData?.rarity?.icon?.url;

   const statobj = [
      { stat: "Rarity", value: pageData?.rarity?.display_number },
      { stat: "Max Limit", value: pageData?.max_limit },
   ];

   return (
      <>
         <div className="grid gap-3 laptop:grid-cols-2">
            {/* ======================== */}
            {/* 1) Character Image div */}
            {/* ======================== */}
            <div>
               <div className="relative w-full text-center bg-gray-100 dark:bg-neutral-900 rounded-md">
                  {/* Rarity */}
                  <div className="absolute bottom-3 left-3 w-20 z-20 h-8">
                     <img
                        className="object-contain w-20 z-20 h-8 rounded-full bg-black bg-opacity-20"
                        src={rarityurl}
                     />
                  </div>

                  <div className="relative inline-block text-center h-96 w-full">
                     {/* Main Image */}
                     {iconurl ? (
                        <img
                           src={iconurl}
                           className="object-contain absolute h-96 w-full"
                        />
                     ) : null}
                  </div>
               </div>
            </div>

            {/* ======================== */}
            {/* 2) Info Block Section */}
            {/* ======================== */}
            <div>
               {/* <div className="flex rounded-md border bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 mb-3 p-3">
                  <div className="flex flex-grow items-center space-x-2">
                     <div className="relative bg-gray-800 rounded-full h-10 w-20">
                        <img
                           className="relative inline-block object-contain"
                           src={rarityurl}
                        />
                     </div>
                  </div>
                  <div className="flex flex-grow items-center space-x-2">
                     Rarity
                  </div>
               </div> */}

               <div className="border divide-y dark:divide-neutral-700 dark:border-neutral-700 rounded-md overflow-hidden">
                  {statobj.map((stat: any, index) => {
                     return (
                        /*2b) Alternating background stats for 5 or 6 stats depending on bonus stat */
                        <div
                           className={`
                      ${
                         index % 2 == 1
                            ? "block relative bg-gray-50 dark:bg-neutral-800"
                            : "block relative bg-gray-100 dark:bg-neutral-900"
                      } p-2 flex items-center`}
                           key={index}
                        >
                           {/* 2bi) Stat Icon */}
                           <div className="flex flex-grow items-center space-x-2">
                              <div>
                                 {stat.hash ? (
                                    <div
                                       className="inline-flex relative items-center align-middle justify-center 
                          bg-gray-600 rounded-full h-6 w-6"
                                    >
                                       <img
                                          src={
                                             stat.hash ?? "no_image_42df124128"
                                          }
                                          className="object-contain h-full w-full"
                                       />
                                    </div>
                                 ) : null}
                              </div>
                              <div>{stat.stat}</div>
                           </div>
                           {/* 2biii) Stat value */}
                           <div className="">{stat.value}</div>

                           {/* 2bii.a) Show bonus icon if stat is Secondary Stat ? */}
                           {/* 
                    {stat.bonus ? (
                      <div className="inline-flex absolute items-center align-middle justify-center rounded-full h-4 w-4 mt-1 right-2/3 bg-gray-400 text-center">
                        <img
                          src="https://res.cloudinary.com/genshinimpact-nalu/image/upload/v1631645303/UI_Icon_Arrow_Point_1a06775238.png"
                          height="15"
                          width="15"
                        ></img>
                      </div>
                    ) : null}
                     */}
                        </div>
                     );
                  })}
               </div>

               <div className="rounded-md my-2 border bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 mb-3 p-3 text-sm">
                  {pageData?.description}
                  {pageData?.bg_description ? (
                     <>
                        <div
                           className="border-t mt-2 pt-2 dark:border-neutral-700 text-gray-500 text-sm"
                           dangerouslySetInnerHTML={{
                              __html: pageData?.bg_description,
                           }}
                        ></div>
                     </>
                  ) : null}
               </div>
            </div>
         </div>
      </>
   );
};
