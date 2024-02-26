import { Fragment } from "react";

import { Popover, Transition } from "@headlessui/react";
import { Link } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";

import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import type { Collection } from "~/db/payload-types";
import type { loader as entryLoaderType } from "~/routes/_site+/c_+/$collectionId_.$entryId/_entry";

import type { Flatten } from "./Section";
import { SectionTitle } from "./SectionTitle";
// eslint-disable-next-line import/no-cycle
import { SubSection } from "./SubSection";
import { SubSectionTabs } from "./SubSectionTabs";
import { TableOfContents } from "../../_components/TableOfContents";

export function SectionParent({
   section,
   sections,
   customData,
   customComponents,
   entry,
   activeSection,
   hasAccess,
}: {
   section: Flatten<Collection["sections"]>;
   sections: Collection["sections"];
   customData: unknown;
   customComponents: unknown;
   entry: SerializeFrom<typeof entryLoaderType>["entry"];
   activeSection: string | null;
   hasAccess: Boolean;
}) {
   if (sections && section?.subSections) {
      const isSingle =
         section?.subSections && section?.subSections?.length == 1;

      const isEmbedEmpty =
         !entry?.embeddedContent || entry?.embeddedContent.length == 0;

      const isActiveSection = activeSection === section?.slug;

      const activeSectionName = sections?.find(
         (element) => isActiveSection && element.slug === activeSection,
      )?.name;

      const activeSectionIndex = sections?.findIndex(
         (element) => isActiveSection && element.slug === activeSection,
      );

      const prevToCItem =
         sections[
            (activeSectionIndex + sections?.length - 1) % sections?.length
         ];

      const nextToCItem = sections[(activeSectionIndex + 1) % sections?.length];

      const showToBottomArrow = activeSectionIndex == 0;

      const showToTopArrow = activeSectionIndex == sections?.length - 1;

      return (
         <>
            {isActiveSection && (
               <div
                  className="fixed top-[117px] max-tablet:left-0 max-tablet:px-3 laptop:top-[50px] 
                  flex items-center h-[76px] bg-3 w-full tablet:w-[736px] laptop:-mx-1 z-30"
               >
                  <div
                     className="flex items-center w-full justify-between bg-3-sub shadow shadow-1 
                     px-2.5 py-2 border rounded-xl dark:border-zinc-600/50 laptop:mt-3"
                  >
                     <div className="flex items-center gap-2.5">
                        <Popover>
                           {({ open }) => (
                              <>
                                 <Popover.Button className="w-6 h-6 dark:bg-dark450 bg-zinc-100 hover:bg-zinc-200 dark:hover:bg-dark500 flex items-center justify-center rounded-md">
                                    {open ? (
                                       <Icon
                                          name="chevron-left"
                                          className="text-1"
                                          size={14}
                                       />
                                    ) : (
                                       <Icon
                                          name="list"
                                          size={16}
                                          className="text-1"
                                       />
                                    )}
                                 </Popover.Button>
                                 <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                 >
                                    <Popover.Panel className="max-laptop:px-3 absolute w-full mt-4 drop-shadow-xl left-0 transform">
                                       <TableOfContents
                                          entry={entry}
                                          sections={sections}
                                       />
                                    </Popover.Panel>
                                 </Transition>
                              </>
                           )}
                        </Popover>
                        <div className="font-bold text-sm">
                           {activeSectionName}
                        </div>
                     </div>
                     {isActiveSection && (
                        <div className="flex items-center gap-1">
                           <Tooltip setDelay={1000} placement="top">
                              <TooltipTrigger title="Next Section" asChild>
                                 <Link
                                    to={`#${prevToCItem?.id}`}
                                    className="p-1.5 block rounded-md hover:bg-zinc-100 dark:hover:bg-dark450"
                                 >
                                    <Icon
                                       name={
                                          showToBottomArrow
                                             ? "chevrons-down"
                                             : "arrow-up"
                                       }
                                       size={16}
                                       className="text-1"
                                    />
                                 </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                 {showToBottomArrow ? "To Last" : "To Previous"}
                              </TooltipContent>
                           </Tooltip>
                           <Tooltip setDelay={1000} placement="top">
                              <TooltipTrigger title="Previous Section" asChild>
                                 <Link
                                    to={`#${nextToCItem?.id}`}
                                    className="p-1.5 block rounded-md hover:bg-zinc-100 dark:hover:bg-dark450"
                                 >
                                    <Icon
                                       name={
                                          showToTopArrow
                                             ? "chevrons-up"
                                             : "arrow-down"
                                       }
                                       size={16}
                                       className="text-1"
                                    />
                                 </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                 {showToTopArrow ? "To First" : "To Next"}
                              </TooltipContent>
                           </Tooltip>
                        </div>
                     )}
                  </div>
               </div>
            )}

            {/* If no embed data is returned and user is anon or doesn't have access, render as single section */}
            {isSingle || (isEmbedEmpty && !hasAccess) ? (
               <div
                  data-section
                  id={section?.slug ?? ""}
                  className="scroll-mt-32 laptop:scroll-mt-[126px]"
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
