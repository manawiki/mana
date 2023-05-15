import { H2 } from "../custom";

export const ImageGallery = ({ pageData }: any) => {
   var galleryname = ["Icon", "Full Image"];
   var gallerylist = [pageData?.icon?.url, pageData.image_full?.url];

   return (
      <>
         <H2 text="Image Gallery" />
         <div className="grid grid-cols-3 gap-2 w-full mb-3">
            {galleryname.map((img: any, i) => {
               return (
                  <>
                     {/* Header */}
                     <div className="relative inline-block text-center">
                        <div className="border-color bg-2 relative block rounded-t-lg border py-2 text-center text-sm font-bold">
                           {img}
                        </div>
                        <div className="border-color bg-1 relative flex w-full items-center justify-center rounded-b-lg border border-t-0 p-3">
                           <div className="relative h-24 w-24 text-center">
                              <img
                                 src={gallerylist[i]}
                                 className="inline-block object-contain w-24 h-24"
                                 alt="Gallery Item"
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
