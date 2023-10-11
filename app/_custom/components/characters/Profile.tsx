import type { Character } from "payload/generated-custom-types";
import { H2Default } from "~/components/H2";

export const Profile = ({ pageData }: { pageData: Character }) => {
   const adata = [
      { name: "CN CV", value: pageData.cv_cn },
      { name: "JP CV", value: pageData.cv_jp },
      { name: "KR CV", value: pageData.cv_kr },
      { name: "EN CV", value: pageData.cv_en },
      { name: "Affiliation", value: pageData.camp },
   ];

   return (
      <>
         {pageData.cv_cn ? (
            <>
               <H2Default text="Profile" />
               <div className="divide-color-sub shadow-1 border-color-sub divide-y overflow-hidden rounded-lg border shadow-sm">
                  {adata.map((stat, index) => {
                     return (
                        <div
                           className={`${
                              index % 2 == 0
                                 ? "bg-2-sub relative block"
                                 : "bg-3-sub relative block"
                           } flex items-center p-3`}
                           key={index}
                        >
                           {/* 2bi) Stat Icon */}
                           <div className="flex flex-grow items-center space-x-2">
                              <div>{stat.name}</div>
                           </div>
                           {/* 2biii) Stat value */}
                           <div className="">{stat.value}</div>
                        </div>
                     );
                  })}
               </div>
            </>
         ) : null}
      </>
   );
};
