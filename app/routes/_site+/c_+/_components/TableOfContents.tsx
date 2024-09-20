import type { SerializeFrom } from "@remix-run/node";

import { TableOfContentsTemplate } from "~/components/TableOfContentsTemplate";
import type { Collection } from "~/db/payload-types";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/utils/useIsStaffSiteAdminOwner";
import type { loader as entryLoaderType } from "~/routes/_site+/c_+/$collectionId_.$entryId/_entry";

export function TableOfContents({
   sections,
   entry,
}: {
   sections: Collection["sections"];
   entry?: SerializeFrom<typeof entryLoaderType>["entry"];
}) {
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   const sectionsWithContent = sections?.map((section) => {
      const subSection = section?.subSections
         ?.filter((subSection) => {
            if (subSection.showTitle == false) return false;
            if (subSection.type == "editor") {
               const embeddedContent = entry?.embeddedContent;
               const hasContent = embeddedContent?.find(
                  ({ subSectionId }) => subSectionId == subSection.id,
               );
               if (!hasContent && !hasAccess) {
                  return false;
               }
            }
            return true;
         })
         .map((subSection) => {
            return subSection;
         });
      return { ...section, subSections: subSection };
   });

   const sectionsList = entry ? sectionsWithContent : sections;

   return <TableOfContentsTemplate sections={sectionsList} />;
}
