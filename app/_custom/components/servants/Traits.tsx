import type { Servant as ServantType } from "payload/generated-custom-types";
import { H3 } from "~/components/Headers";

export function Traits({ data: servant }: { data: ServantType }) {
   return (
      <>
         <div className="">
            <TraitBlock charData={servant} />

            <TagBlock charData={servant} />
         </div>
      </>
   );
}

// =====================================
// 1) Traits
// =====================================
const TraitBlock = ({ charData }: any) => {
   const traitlist = charData?.traits;

   return (
      <>
         {traitlist.length > 0 ? (
            <>
               <H3 text="Traits" />
               {traitlist.map((trait: any) => {
                  return (
                     <>
                        <div className="m-1 p-1 px-2 rounded-md border inline-block relative dark:border-zinc-700  text-sm">
                           {trait.name}
                        </div>
                     </>
                  );
               })}
            </>
         ) : null}
      </>
   );
};

// =====================================
// 2) Tags
// =====================================
const TagBlock = ({ charData }: any) => {
   const taglist = charData?.tags;

   return (
      <>
         {taglist.length > 0 ? (
            <>
               <H3 text="Tags" />
               {taglist.map((tag: any) => {
                  return (
                     <>
                        <div className="m-1 p-1 px-2 rounded-md border inline-block relative dark:border-zinc-700 text-sm">
                           {/* Show tag icon if applicable */}
                           {tag.icon ? (
                              <div className="inline-block h-5 w-5 relative align-middle mr-1">
                                 <img
                                    className="object-contain w-full h-full"
                                    src={tag.icon?.url}
                                 />
                              </div>
                           ) : null}

                           <span className="align-middle">{tag.name}</span>
                        </div>
                     </>
                  );
               })}
            </>
         ) : null}
      </>
   );
};
