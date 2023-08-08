import type { LightCone } from "payload/generated-custom-types";

import { H2 } from "../custom";

export const Description = ({ pageData }: { pageData: LightCone }) => {
   const description = pageData.description;
   const bgdescription = pageData.bg_description;

   return (
      <>
         <H2 text="Description" />
         {/* Description */}
         <section className="border-color shadow-1 overflow-hidden rounded-lg border shadow-sm">
            <div className="bg-1 border-color border-b p-3 text-base">
               <div
                  dangerouslySetInnerHTML={{ __html: description ?? "" }}
               ></div>
            </div>
            <div className="bg-2 text-1 p-3 text-sm">
               <div
                  dangerouslySetInnerHTML={{ __html: bgdescription ?? "" }}
               ></div>
            </div>
         </section>
      </>
   );
};
