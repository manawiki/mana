import type { Material as MaterialType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

export function Main({ data }: { data: any }) {
   const material = data?.entry?.data?.Material;
   const icon = material?.icon?.url;
   const desc = material?.description;

   return (
      <>
         <div className="text-center my-2 border border-color-sub rounded-md p-3">
            <div>
               <Image
                  options="height=80&width=80"
                  className="object-contain inline-block"
                  url={icon}
                  alt="material_icon"
                  loading="lazy"
               />
            </div>
            <div
               className="whitespace-pre-wrap mt-2"
               dangerouslySetInnerHTML={{ __html: desc }}
            ></div>
         </div>
      </>
   );
}
