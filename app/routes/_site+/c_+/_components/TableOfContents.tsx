import { useState } from "react";

import type { SerializeFrom } from "@remix-run/node";
import { Link } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
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

   let totalTOCItem = 0;

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
            totalTOCItem++;
            return subSection;
         });
      return { ...section, subSections: subSection };
   });

   const sectionsList = entry ? sectionsWithContent : sections;
   const [seeAllOpen, setSeeAllOpen] = useState<boolean>(false);

   const showAll =
      !seeAllOpen && sectionsList && totalTOCItem && totalTOCItem > 5;

   const showText =
      showAll && sectionsList?.length > 5 && sectionsList?.length - 5;

   return (
      <>
         {sectionsList && sectionsList?.length > 1 && (
            <section className="relative">
               <div
                  className={clsx(
                     seeAllOpen ? "" : "max-h-[230px]",
                     "text-sm border border-color-sub overflow-hidden shadow-sm shadow-1 rounded-lg mb-4 bg-zinc-50 dark:bg-dark350",
                  )}
               >
                  <div className="py-3 px-2.5 font-bold text-xs flex items-center justify-between gap-2.5 border-b border-color shadow-zinc-100/70 dark:shadow-zinc-800/70 shadow-sm">
                     <div className="flex items-center gap-2.5">
                        <Icon
                           name="list"
                           size={18}
                           className="dark:text-zinc-500 text-zinc-400"
                        />
                        <span>Table of Contents</span>
                     </div>
                     {!showAll && (
                        <button
                           onClick={() => setSeeAllOpen(!seeAllOpen)}
                           className="w-6 h-6 bg-white dark:bg-dark450 z-10 shadow-sm shadow-1 hover:border-zinc-300
                           rounded-full flex items-center justify-center border dark:hover:border-zinc-500
                           dark:border-zinc-600"
                        >
                           <Icon
                              name="chevron-up"
                              title="Hide Table of Contents"
                              size={14}
                              className="dark:text-zinc-400 text-zinc-400"
                           />
                        </button>
                     )}
                  </div>
                  <div className="py-1.5">
                     {sectionsList?.map((section) =>
                        section.subSections?.length != 0 ? (
                           <div key={section.id}>
                              <div className="py-2 group flex items-center relative -ml-1.5 hover:underline dark:decoration-zinc-500 decoration-zinc-300">
                                 <div
                                    className="w-3 h-3 border group-hover:bg-zinc-200 dark:border-zinc-600 border-zinc-300 dark:group-hover:border-zinc-500
                               bg-zinc-100 dark:bg-dark500 rounded-full dark:shadow-zinc-800 dark:group-hover:bg-dark500"
                                 />
                                 <div className="w-3 h-[1px] dark:bg-zinc-700 bg-zinc-200" />
                                 <Link
                                    to={`#${section?.slug}`}
                                    className="font-bold pl-2 flex items-center w-full gap-3"
                                 >
                                    <span>{section.name}</span>
                                    <div className="border-t border-dashed border-zinc-200 dark:border-zinc-700 flex-grow" />
                                 </Link>
                              </div>
                              {section.subSections &&
                              section.subSections?.length === 1
                                 ? null
                                 : section.subSections?.map((subSection) => (
                                      <div
                                         key={subSection.id}
                                         className="group flex w-full items-center relative hover:underline dark:decoration-zinc-500 decoration-zinc-300"
                                      >
                                         <div
                                            className="w-[4px] h-4 group-hover:bg-zinc-300 -ml-[1px]
                                 bg-zinc-200 dark:bg-dark450 rounded-r-sm dark:group-hover:bg-dark500"
                                         />
                                         <Link
                                            to={`?section=${subSection?.slug}#${section?.slug}`}
                                            className="font-semibold text-sm rounded-lg pl-2.5 mx-3 dark:hover:bg-dark400 hover:bg-zinc-100 text-1 w-full py-1 block"
                                         >
                                            {subSection.name}
                                         </Link>
                                      </div>
                                   ))}
                           </div>
                        ) : null,
                     )}
                  </div>
               </div>
               {showAll && (
                  <div
                     className="bg-gradient-to-b absolute bottom-0 border border-color-sub border-t-0 w-full group p-3
                  from-transparent to-zinc-50 dark:to-dark400 dark:from-transparent rounded-b-lg"
                  >
                     <button
                        onClick={() => setSeeAllOpen(!seeAllOpen)}
                        className="w-full flex justify-end items-center gap-3"
                     >
                        <div className="text-[11px] group-hover:underline underline-offset-2 font-semibold text-right">
                           Show {showText} more items...
                        </div>
                        <div
                           className="w-6 h-6 bg-white dark:bg-dark450 z-10 shadow-sm shadow-1 group-hover:border-zinc-300
                           rounded-full flex items-center justify-center border dark:group-hover:border-zinc-500
                           dark:border-zinc-600"
                        >
                           <Icon
                              name="chevron-down"
                              size={16}
                              className="dark:text-zinc-400 text-zinc-400 pt-0.5"
                           />
                        </div>
                     </button>
                  </div>
               )}
            </section>
         )}
      </>
   );
}
