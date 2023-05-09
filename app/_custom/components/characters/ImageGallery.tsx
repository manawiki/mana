import { Image } from "~/components";

export const ImageGallery = ({ pageData }) => {
   var galleryname = [
      "Icon",
      "Full",
      "Figure",
      "Background",
      "Foreground",
      "Team Icon",
      "Round Icon",
   ];
   var gallerylist = [
      pageData?.icon?.url,
      pageData?.image_draw?.url,
      pageData.image_full?.url,
      pageData?.image_full_bg?.url,
      pageData?.image_full_front?.url,
      pageData?.image_action?.url,
      pageData?.image_round_icon?.url,
   ];

   return (
      <>
         <div className="mb-3 grid w-full grid-cols-3 gap-3">
            {galleryname.map((img: any, i) => {
               return (
                  <>
                     {/* Header */}
                     <div className="relative inline-block text-center">
                        <div className="border-color bg-2 relative block rounded-t-lg border py-2 text-center text-sm font-bold">
                           {img}
                        </div>
                        <a href={gallerylist[i]}>
                           <div
                              className="border-color bg-1 relative flex w-full items-center
                           justify-center rounded-b-lg border border-t-0 p-3"
                           >
                              <div className="relative h-24 w-24 text-center">
                                 <Image
                                    alt="Gallery Item"
                                    url={gallerylist[i]}
                                    className="h-24 w-24 object-contain"
                                 />
                              </div>
                           </div>
                        </a>
                     </div>
                  </>
               );
            })}
         </div>
      </>
   );
};
