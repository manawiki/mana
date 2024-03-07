import { Fragment, useEffect, useState } from "react";

import { Tab } from "@headlessui/react";
import { useSearchParams } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import clsx from "clsx";

import { Button } from "~/components/Button";
import { H2Plain } from "~/components/Headers";
import type { Collection } from "~/db/payload-types";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/utils/useIsStaffSiteAdminOwner";
import type { loader as entryLoaderType } from "~/routes/_site+/c_+/$collectionId_.$entryId/_entry";

import type { Flatten } from "./Section";
import { SectionTitle } from "./SectionTitle";
import { SubSection } from "./SubSection";

export function SubSectionTabs({
   section,
   customData,
   customComponents,
   entry,
}: {
   section: Flatten<Collection["sections"]>;
   customData: unknown;
   customComponents: unknown;
   entry: SerializeFrom<typeof entryLoaderType>["entry"];
}) {
   // Hide null tabs
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();
   const tabs = section?.subSections
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

   //On initial load, this will set the section active tab if url param exists
   const [searchParams] = useSearchParams();
   const subSectionId = searchParams.get("section");
   const activeTabIndex = tabs?.findIndex(({ slug }) => slug == subSectionId);
   const [selectedIndex, setSelectedIndex] = useState(activeTabIndex);

   useEffect(() => {
      //Update active tab if ToC is clicked after initial load
      if (subSectionId) {
         setSelectedIndex(activeTabIndex);
      }
      //If section param is empty, set first tab to default
      if (!searchParams.has("section")) {
         setSelectedIndex(0);
      }
   }, [searchParams]);

   const tabLength = tabs && tabs.length;

   const hasMany = tabLength && tabLength > 1 ? true : false;

   const viewType = section?.viewType;

   return (
      <>
         <div
            data-section
            id={section?.slug ?? ""}
            className="scroll-mt-32 laptop:scroll-mt-[126px]"
         >
            <SectionTitle section={section} />
            {hasMany ? (
               <>
                  {viewType == "tabs" && (
                     <div className="shadow-sm shadow-1 bg-clip-padding border border-color-sub rounded-lg">
                        <Tab.Group
                           selectedIndex={selectedIndex}
                           onChange={setSelectedIndex}
                        >
                           <Tab.List
                              className="relative flex bg-zinc-50 dark:bg-dark350 scrollbar 
                            dark:scrollbar-thumb-zinc-500 dark:scrollbar-track-dark450
                            scrollbar-thumb-zinc-300 scrollbar-track-zinc-100
                              overflow-auto border-b border-color-sub p-3 items-center gap-3 rounded-t-lg"
                           >
                              {tabs?.map((subSection) => {
                                 return (
                                    <Tab key={subSection.id} as={Fragment}>
                                       {({ selected }) => (
                                          //@ts-ignore
                                          <Button
                                             color={
                                                selected
                                                   ? "dark/white"
                                                   : undefined
                                             }
                                             plain={selected ? undefined : true}
                                             className={clsx(
                                                !selected &&
                                                   "bg-zinc-200/50 dark:shadow-none dark:bg-dark450",
                                                "!py-1.5 !px-3 flex-none",
                                             )}
                                          >
                                             {subSection.name}
                                          </Button>
                                       )}
                                    </Tab>
                                 );
                              })}
                           </Tab.List>
                           <Tab.Panels className="p-3">
                              {section?.subSections?.map((subSection) => (
                                 <Tab.Panel key={subSection.id} unmount={false}>
                                    <SubSection
                                       customData={customData}
                                       //@ts-ignore
                                       subSection={subSection}
                                       customComponents={customComponents}
                                    />
                                 </Tab.Panel>
                              ))}
                           </Tab.Panels>
                        </Tab.Group>
                     </div>
                  )}
                  {viewType == "rows" && (
                     <div className="space-y-6">
                        {tabs?.map((section) => {
                           return (
                              <div key={section.id}>
                                 <H2Plain
                                    text={section?.name}
                                    className="text-xl dark:text-zinc-300"
                                 />
                                 <SubSection
                                    customData={customData}
                                    //@ts-ignore
                                    subSection={section}
                                    customComponents={customComponents}
                                 />
                              </div>
                           );
                        })}
                     </div>
                  )}
               </>
            ) : (
               <SubSection
                  customData={customData}
                  //@ts-ignore
                  subSection={section?.subSections[0]}
                  customComponents={customComponents}
               />
            )}
         </div>
      </>
   );
}
