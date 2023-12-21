import type { Character } from "payload/generated-custom-types";
import { Image } from "~/components/Image";

export const ImageGallery = ({
   data,
}: {
   data: {
      character: Character;
   };
}) => {
   const { character } = data;

   let galleryname = [
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
   let gallerylist = [
      character?.icon?.url,
      character?.image_draw?.url,
      character.image_full?.url,
      character?.image_full_bg?.url,
      character?.image_full_front?.url,
      character?.image_action?.url,
      character?.image_round_icon?.url,
      ...(character?.eidolons?.map((e) => e.image?.url) ?? []),
   ];

   return (
      <>
         <div className="mb-3 grid w-full grid-cols-3 gap-3">
            {galleryname.map((img, i) => {
               const gimg = gallerylist[i];
               return (
                  gimg && (
                     <div
                        className="shadow-1 border-color-sub relative inline-block overflow-hidden rounded-lg border text-center shadow-sm"
                        key={img}
                     >
                        <div className="border-color-sub bg-3-sub relative block border-b py-2 text-center text-sm font-bold">
                           {img}
                        </div>
                        <a href={gimg}>
                           <div className="bg-2-sub relative flex w-full items-center justify-center p-3">
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
