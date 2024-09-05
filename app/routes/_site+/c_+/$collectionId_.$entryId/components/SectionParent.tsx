import type { SerializeFrom } from "@remix-run/server-runtime";

import type { Collection } from "~/db/payload-types";
import type { loader as entryLoaderType } from "~/routes/_site+/c_+/$collectionId_.$entryId/_entry";

import type { Flatten } from "./Section";
import { SectionTitle } from "./SectionTitle";
// eslint-disable-next-line import/no-cycle
import { SubSection } from "./SubSection";
import { SubSectionTabs } from "./SubSectionTabs";

export function SectionParent({
   section,
   sections,
   customData,
   customComponents,
   entry,
}: {
   section: Flatten<Collection["sections"]>;
   sections: Collection["sections"];
   customData: unknown;
   customComponents: unknown;
   entry: SerializeFrom<typeof entryLoaderType>["entry"];
}) {
   if (sections && section?.subSections) {
      const isSingle =
         section?.subSections && section?.subSections?.length == 1;

      return (
         <>
            {isSingle ? (
               <div
                  data-section
                  id={section?.slug ?? ""}
                  className="scroll-mt-20 max-w-[728px] mx-auto"
               >
                  <SectionTitle section={section} />
                  <SubSection
                     //@ts-ignore
                     subSection={section?.subSections[0]}
                     customData={customData}
                     customComponents={customComponents}
                  />
               </div>
            ) : (
               <SubSectionTabs
                  section={section}
                  entry={entry}
                  customData={customData}
                  customComponents={customComponents}
               />
            )}
         </>
      );
   }
}
