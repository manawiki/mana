import { Image } from "~/components";

export const Eidolons = ({ pageData }) => {
   const eidolons = pageData.eidolons;

   return (
      <div
         className="bg-2 divide-color border-color shadow-1 mb-4 
      divide-y overflow-hidden rounded-lg border shadow"
      >
         {eidolons.map((eid: any, index: any) => {
            return (
               <>
                  <div className="p-3" key={index}>
                     {/* Header with Skill Icon and Name */}
                     <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 rounded-full bg-bg4Dark">
                           <Image
                              className="object-contain"
                              url={eid.icon?.url}
                              alt={eid.name}
                           />
                        </div>
                        <div>
                           <div className="font-bold">{eid.name}</div>
                           <div className="text-1">Lv {eid.rank}</div>
                        </div>
                     </div>
                     {/* Description */}
                     <div
                        className="pt-2 text-sm"
                        dangerouslySetInnerHTML={{
                           __html: eid?.description,
                        }}
                     ></div>
                  </div>
               </>
            );
         })}
      </div>
   );
};
