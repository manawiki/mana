import type { SerializeFrom } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Icon } from "~/components/Icon";
import type { Collection } from "~/db/payload-types";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/src/functions";
import type { loader as entryLoaderType } from "~/routes/_site+/$siteId.c_+/$collectionId_.$entryId";

export function TableOfContents({
   sections,
   entry,
}: {
   sections: Collection["sections"];
   entry?: SerializeFrom<typeof entryLoaderType>["entry"];
}) {
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   //hide nested ToC rows if empty
   const sectionsWithContent = sections?.map((section) => {
      const subSection = section?.subSections
         ?.filter((subSection) => {
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

   return (
      <>
         {sectionsList && sectionsList?.length > 1 && (
            <section className="relative text-sm border border-color-sub overflow-hidden shadow-sm shadow-1 rounded-lg mb-4 bg-zinc-50 dark:bg-dark350">
               <div className="py-3 px-2.5 font-bold text-xs flex items-center gap-2.5 border-b border-color shadow-zinc-100/70 dark:shadow-zinc-800/70 shadow-sm">
                  <Icon
                     name="list"
                     size={18}
                     className="dark:text-zinc-500 text-zinc-400"
                  />
                  <span>Table of Contents</span>
               </div>
               <div className="py-1.5">
                  {sectionsList?.map((section) => (
                     <div key={section.id}>
                        <div className="py-2 group flex items-center relative -ml-1.5 hover:underline dark:decoration-zinc-500 decoration-zinc-300">
                           <div
                              className="w-3 h-3 border group-hover:bg-zinc-200 dark:border-zinc-600 border-zinc-300 dark:group-hover:border-zinc-500
                  bg-zinc-100 dark:bg-dark500 rounded-full dark:shadow-zinc-800 dark:group-hover:bg-dark500"
                           />
                           <div className="w-2.5 h-[1px] dark:bg-zinc-700 bg-zinc-200" />
                           <Link
                              to={`#${section?.id}`}
                              className="font-bold pl-1.5 pr-3"
                           >
                              {section.name}
                           </Link>
                           <div className="border-t border-dashed border-zinc-200 dark:border-zinc-700 flex-grow" />
                        </div>
                        {section.subSections &&
                           section.subSections?.length > 1 && (
                              <div className="pb-1 pl-0.5 -ml-[3px]">
                                 {section.subSections?.map(
                                    (subSection, index) =>
                                       index != 0 && (
                                          <div
                                             key={subSection.id}
                                             className="group py-1 flex items-center relative hover:underline dark:decoration-zinc-500 decoration-zinc-300"
                                          >
                                             <div
                                                className="w-[5px] h-4 group-hover:bg-zinc-300 -ml-[1px]
                                 bg-zinc-200 dark:bg-dark500 rounded-r-sm dark:group-hover:bg-dark500"
                                             />
                                             <Link
                                                to={`?section=${subSection?.id}#${section?.id}`}
                                                className="font-semibold text-xs pl-[19px] text-1"
                                             >
                                                {subSection.name}
                                             </Link>
                                          </div>
                                       ),
                                 )}
                              </div>
                           )}
                     </div>
                  ))}
               </div>
            </section>
         )}
      </>
   );
}
