import { Image } from "~/components";
import type { Character } from "payload/generated-custom-types";

export const ImageGallery = ({ pageData }: { pageData: Character }) => {
   var galleryname = [
      "Icon",
      "Full",
      "Figure",
      "Background",
      "Foreground",
      "Team Icon",
      "Round Icon",
      "Eidolon 1",
      "Eidolon 2",
      "Eidolon 3",
      "Eidolon 4",
      "Eidolon 5",
      "Eidolon 6",
   ];
   var gallerylist = [
      pageData?.icon?.url,
      pageData?.image_draw?.url,
      pageData.image_full?.url,
      pageData?.image_full_bg?.url,
      pageData?.image_full_front?.url,
      pageData?.image_action?.url,
      pageData?.image_round_icon?.url,
      ...(pageData?.eidolons?.map((e) => e.image?.url) ?? []),
   ];

   return (
      <>
         <div className="mb-3 grid w-full grid-cols-3 gap-3">
            {galleryname.map((img, i) => {
               const gimg = gallerylist[i];
               return (
                  gimg && (
                     <div
                        className="shadow-1 border-color relative inline-block overflow-hidden rounded-lg border text-center shadow-sm"
                        key={img}
                     >
                        <div className="border-color bg-2 relative block border-b py-2 text-center text-sm font-bold">
                           {img}
                        </div>
                        <a href={gimg}>
                           <div className=" bg-1 relative flex w-full items-center justify-center p-3">
                              <div className="relative h-24 w-24 text-center">
                                 <Image
                                    options="aspect_ratio=1:1&height=120&width=120"
                                    alt="Gallery Item"
                                    url={gimg}
                                    className="h-24 w-24 object-contain"
                                 />
                              </div>
                           </div>
                        </a>
                     </div>
                  )
               );
            })}
         </div>
      </>
   );
};
