import { Fragment, useEffect, useState } from "react";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
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
            const getContent = embeddedContent?.find(
               ({ subSectionId }) => subSectionId == subSection.id,
            );
            const isEmpty =
               //@ts-ignore
               (getContent?.content?.length == 1 ||
                  //@ts-ignore
                  getContent?.content?.length == 0) &&
               //@ts-ignore
               getContent?.content[0]?.type == "paragraph" &&
               //@ts-ignore
               getContent?.content[0]?.children[0]?.text == "";

            if ((isEmpty && !hasAccess) || (!getContent && !hasAccess)) {
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

   const viewType = section?.viewType;

   return (
      <>
         <div
            data-section
            id={section?.slug ?? ""}
            className="scroll-mt-32 laptop:scroll-mt-20"
         >
            <SectionTitle section={section} />
            <>
               {viewType == "tabs" && (
                  <div className="shadow-sm dark:shadow-zinc-800/60 bg-clip-padding border-y tablet:border border-color-sub tablet:rounded-xl max-w-[754px] mx-auto max-tablet:-mx-3">
                     <TabGroup
                        selectedIndex={selectedIndex}
                        onChange={setSelectedIndex}
                     >
                        <TabList
                           className="relative flex bg-zinc-50 dark:bg-dark350 scrollbar 
                            dark:scrollbar-thumb-zinc-500 dark:scrollbar-track-dark450
                            scrollbar-thumb-zinc-300 scrollbar-track-zinc-100
                              overflow-auto border-b border-color-sub p-3 items-center gap-3 tablet:rounded-t-xl"
                        >
                           {tabs?.map((subSection) => {
                              return (
                                 <Tab key={subSection.id} as={Fragment}>
                                    {({ selected }) => (
                                       //@ts-ignore
                                       <Button
                                          color={
                                             selected ? "dark/white" : undefined
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
                        </TabList>
                        <TabPanels className="p-3">
                           {section?.subSections?.map((subSection) => (
                              <TabPanel key={subSection.id} unmount={false}>
                                 <SubSection
                                    customData={customData}
                                    //@ts-ignore
                                    subSection={subSection}
                                    customComponents={customComponents}
                                 />
                              </TabPanel>
                           ))}
                        </TabPanels>
                     </TabGroup>
                  </div>
               )}
               {viewType == "rows" && (
                  <div className="space-y-6">
                     {tabs?.map((section) => {
                        return (
                           <div
                              id={section?.slug ?? ""}
                              className="scroll-mt-32 laptop:scroll-mt-20"
                              key={section.id}
                           >
                              {section.showTitle && (
                                 <H2Plain
                                    text={section?.name}
                                    className="text-xl dark:text-zinc-300"
                                 />
                              )}
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
         </div>
      </>
   );
}
