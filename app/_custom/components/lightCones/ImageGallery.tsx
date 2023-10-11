import type { LightCone } from "payload/generated-custom-types";
import { Image } from "~/components";
import { H2, H2Default } from "~/components/H2";

export const ImageGallery = ({ pageData }: { pageData: LightCone }) => {
   var galleryname = ["Icon", "Full Image"];
   var gallerylist = [pageData?.icon?.url, pageData.image_full?.url];

   return (
      <>
         <H2Default text="Image Gallery" />
         <div className="mb-3 grid w-full grid-cols-3 gap-2">
            {galleryname.map((img: any, i) => (
               <div
                  key={img}
                  className="shadow-1 border-color-sub relative inline-block overflow-hidden rounded-lg border text-center shadow-sm"
               >
                  <div className="border-color-sub bg-3-sub relative block border-b py-2 text-center text-sm font-bold">
                     {img}
                  </div>
                  <div className="bg-2-sub relative flex w-full items-center justify-center p-3">
                     <div className="relative h-24 w-24 text-center">
                        <Image
                           options="height=120"
                           url={gallerylist[i]}
                           className="h-24 w-24 object-contain"
                           alt={galleryname[i]}
                        />
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </>
   );
};
