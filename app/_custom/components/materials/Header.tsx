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
               <div className="bg-4 relative w-full rounded-md text-center">
                  {/* Rarity */}
                  <div className="absolute bottom-3 left-3 z-20 h-8 w-20">
                     <img
                        alt="Material Rarity"
                        className="z-20 h-8 w-20 rounded-full bg-black bg-opacity-20 object-contain"
                        src={rarityurl}
                     />
                  </div>

                  <div className="relative inline-block h-96 w-full text-center">
                     {/* Main Image */}
                     {iconurl ? (
                        <img
                           alt="Materials Icon"
                           src={iconurl}
                           className="absolute h-96 w-full object-contain"
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

               <div className="divide-y overflow-hidden rounded-md border dark:divide-neutral-700 dark:border-neutral-700">
                  {statobj.map((stat: any, index) => {
                     return (
                        /*2b) Alternating background stats for 5 or 6 stats depending on bonus stat */
                        <div
                           className={`
                      ${
                         index % 2 == 1
                            ? "relative block bg-gray-50 dark:bg-neutral-800"
                            : "relative block bg-gray-100 dark:bg-neutral-900"
                      } flex items-center p-2`}
                           key={index}
                        >
                           {/* 2bi) Stat Icon */}
                           <div className="flex flex-grow items-center space-x-2">
                              <div>
                                 {stat.hash ? (
                                    <div
                                       className="relative inline-flex h-6 w-6 items-center 
                          justify-center rounded-full bg-gray-600 align-middle"
                                    >
                                       <img
                                          src={
                                             stat.hash ?? "no_image_42df124128"
                                          }
                                          className="h-full w-full object-contain"
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

               <div className="my-2 mb-3 rounded-md border bg-gray-50 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-900">
                  {pageData?.description}
                  {pageData?.bg_description ? (
                     <>
                        <div
                           className="mt-2 border-t pt-2 text-sm text-gray-500 dark:border-neutral-700"
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
