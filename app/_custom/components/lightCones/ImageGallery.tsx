export const ImageGallery = ({ pageData }: any) => {
   var galleryname = ["Icon", "Full Image"];
   var gallerylist = [pageData?.icon?.url, pageData.image_full?.url];

   return (
      <>
         <div className="grid grid-cols-3 gap-2 w-full mb-3">
            {galleryname.map((img: any, i) => {
               return (
                  <>
                     {/* Header */}
                     <div className="relative inline-block text-center">
                        <div className="relative block border dark:border-neutral-700 dark:bg-neutral-800 text-center rounded-t-md">
                           {img}
                        </div>
                        <div className="relative inline-block w-full border border-t-0 dark:border-neutral-700 dark:bg-neutral-900 rounded-b-md">
                           <div className="relative inline-block text-center w-24 h-24">
                              <img
                                 src={gallerylist[i]}
                                 className="inline-block object-contain w-24 h-24"
                              />
                           </div>
                        </div>
                     </div>
                  </>
               );
            })}
         </div>
      </>
   );
};
