import type { CraftEssence as CraftEssenceType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";

export function Effect({ data: ce }: { data: CraftEssenceType }) {
   const dispData = [
      {
         header: "Effect",
         value: ce?.description,
         image: ce?._ce_Type_Image?.icon?.url,
      },
      {
         header: "Limit Break",
         value: ce?.description_limit_break,
         image: ce?._ce_Type_Image?.icon?.url,
      },
      {
         header: "Craft Essence Detail",
         value: ce?.description_flavor,
      },
   ];

   const mainStatDisplay = [
      {
         label: "Illustrator",
         value: ce.illustrator?.name,
      },
      {
         label: "CV",
         value: ce.cv?.name,
      },
   ];

   return (
      <>
         <EffectSection dispData={dispData} />
         <StatSection mainStatDisplay={mainStatDisplay} />
      </>
   );
}

const EffectSection = ({ dispData }: any) => {
   return (
      <>
         {dispData.map((data) => {
            // console.log(data.value);
            return (
               <>
                  <H2 text={data.header} />
                  <div className="mx-2">
                     {data.image ? (
                        <div className="inline-block h-auto w-[10%] align-top mr-4">
                           <Image
                              options="aspect_ratio=1:1&height=80&width=80"
                              className="object-contain"
                              url={data.image}
                              alt="skill_icon"
                              loading="lazy"
                           />
                        </div>
                     ) : null}

                     <div className="inline-block w-[85%] align-top">
                        {/* Description */}
                        <div
                           className="text-sm whitespace-pre-wrap"
                           dangerouslySetInnerHTML={{
                              __html: data.value ?? "",
                           }}
                        ></div>
                     </div>
                  </div>
               </>
            );
         })}
      </>
   );
};

const StatSection = ({ mainStatDisplay }: any) => {
   return (
      <>
         <div
            className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
         mb-3 [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden mt-3"
         >
            {mainStatDisplay?.map((row) => (
               <>
                  {row.value ? (
                     <>
                        <div className="p-3 justify-between flex items-center gap-2">
                           <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">
                                 {row.label}
                              </span>
                           </div>
                           <div className="text-sm font-semibold">
                              {row.value}
                           </div>
                        </div>
                     </>
                  ) : null}
               </>
            ))}
         </div>
      </>
   );
};
