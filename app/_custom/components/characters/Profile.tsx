import type { Character } from "payload/generated-custom-types";

export const Profile = ({
   data,
}: {
   data: {
      character: Character;
   };
}) => {
   const { character } = data;

   const adata = [
      { name: "CN CV", value: character.cv_cn },
      { name: "JP CV", value: character.cv_jp },
      { name: "KR CV", value: character.cv_kr },
      { name: "EN CV", value: character.cv_en },
      { name: "Affiliation", value: character.camp },
   ];

   return (
      <>
         {character.cv_cn ? (
            <>
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
