import { Image } from "~/components";
import type { Character } from "payload/generated-custom-types";

export const Eidolons = ({ pageData }: { pageData: Character }) => {
   const eidolons = pageData.eidolons;

   return (
      <div
         className="bg-2 divide-color border-color shadow-1 mb-4 
      divide-y overflow-hidden rounded-lg border shadow"
      >
         {eidolons?.map((eid, index) => {
            return (
               <div className="p-3" key={index}>
                  {eid.image?.url ? (
                     <div className="inline-block h-auto w-[10%] align-middle">
                        <Image
                           options="aspect_ratio=1:1&height=80&width=80"
                           className="object-contain"
                           url={eid.image?.url}
                           alt="eid.name"
                           loading="lazy"
                        />
                     </div>
                  ) : null}

                  <div className="inline-block w-[85%] align-middle">
                     {/* Header with Skill Icon and Name */}
                     <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 rounded-full bg-bg4Dark">
                           <Image
                              options="aspect_ratio=1:1&height=80&width=80"
                              className="object-contain"
                              url={eid.icon?.url}
                              alt={eid.name}
                              loading="lazy"
                           />
                        </div>
                        <div>
                           <div className="font-bold">{eid.name}</div>
                           <div className="text-1">Lv. {eid.rank}</div>
                        </div>
                     </div>
                     {/* Description */}
                     <div
                        className="pt-2 text-sm"
                        dangerouslySetInnerHTML={{
                           __html: eid?.description ?? "",
                        }}
                     ></div>
                  </div>
               </div>
            );
         })}
      </div>
   );
};
