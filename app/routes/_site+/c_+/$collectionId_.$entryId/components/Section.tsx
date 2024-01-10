import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import { offset } from "@floating-ui/react";
import { Popover, Tab, Transition } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import {
   Link,
   useFetcher,
   useLocation,
   useMatches,
   useSearchParams,
} from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import type { Collection } from "~/db/payload-types";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/utils/useIsStaffSiteAdminOwner";
import { EditorCommandBar } from "~/routes/_editor+/core/components/EditorCommandBar";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { initialValue } from "~/routes/_editor+/core/utils";
import { ManaEditor } from "~/routes/_editor+/editor";
import type { loader as entryLoaderType } from "~/routes/_site+/c_+/$collectionId_.$entryId/_entry";

import type { Section } from "./Sections";
import { AdPlaceholder, AdUnit } from "../../../_components/Ramp";
import { TableOfContents } from "../../_components/TableOfContents";

// we'll lazy load the editor and viewer to make sure they get tree-shaken when not used
//@ts-ignore

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

type SubSectionType = {
   id: string;
   name?: string;
   type: "editor" | "customTemplate" | "qna" | "comments";
};

export function Section({
   customData,
   customComponents,
}: {
   customData?: unknown;
   customComponents?: unknown;
}) {
   const { entry } = useMatches()?.[2]?.data as SerializeFrom<
      typeof entryLoaderType
   >;

   const [activeSection, setActiveSection] = useState(null);
   const sections = useRef([]);

   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   const handleScroll = () => {
      const pageYOffset = window.scrollY;
      let newActiveSection = null;

      sections.current.forEach((section: any) => {
         const sectionOffsetTop = section.offsetTop - 130;
         const sectionHeight = section.offsetHeight + 130;

         if (
            pageYOffset >= sectionOffsetTop &&
            pageYOffset < sectionOffsetTop + sectionHeight
         ) {
            newActiveSection = section.id;
         }
      });

      setActiveSection(newActiveSection);
   };

   useEffect(() => {
      //@ts-ignore
      sections.current = document.querySelectorAll("[data-section]");
      window.addEventListener("scroll", handleScroll);

      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
   }, []);

   return (
      <>
         <TableOfContents entry={entry} sections={entry.sections} />
         {entry.sections?.map((section) => (
            <>
               {section.showAd && (
                  <AdPlaceholder>
                     <AdUnit
                        enableAds={section.showAd}
                        adType="desktopLeaderBTF"
                        selectorId={`sectionDesktopLeaderBTF-${section.id}`}
                        className="flex items-center justify-center mx-auto [&>div]:my-5"
                     />
                  </AdPlaceholder>
               )}
               <SectionParent
                  activeSection={activeSection}
                  key={section.id}
                  entry={entry}
                  section={section}
                  sections={entry.sections}
                  customData={customData}
                  customComponents={customComponents}
                  hasAccess={hasAccess}
               />
            </>
         ))}
         <ScrollToHashElement />
      </>
   );
}

function SectionParent({
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

      const isActiveSection = activeSection === section?.id;

      const activeSectionName = sections?.find(
         (element) => isActiveSection && element.id === activeSection,
      )?.name;

      const activeSectionIndex = sections?.findIndex(
         (element) => isActiveSection && element.id === activeSection,
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
               <div className="fixed top-[108px] max-tablet:left-0 max-tablet:px-3 laptop:top-[50px] flex items-center h-[76px] bg-3 w-full tablet:w-[736px] laptop:-mx-1 z-30">
                  <div className="flex items-center w-full justify-between bg-3-sub shadow shadow-1 px-2.5 py-2 border rounded-xl dark:border-zinc-600/50 mt-3">
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
                              <TooltipTrigger as="div">
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
                              <TooltipTrigger as="div">
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
            <div
               data-section
               id={section?.id}
               className="scroll-mt-32 laptop:scroll-mt-[126px]"
            >
               <SectionTitle section={section} />
               {/* If no embed data is returned and user is anon or doesn't have access, render as single section */}
               {isSingle || (isEmbedEmpty && !hasAccess) ? (
                  <SubSection
                     subSection={section?.subSections[0]}
                     customData={customData}
                     customComponents={customComponents}
                  />
               ) : (
                  <SubSectionTabs
                     section={section}
                     entry={entry}
                     customData={customData}
                     customComponents={customComponents}
                  />
               )}
            </div>
         </>
      );
   }
}

function SubSectionTabs({
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
   const activeTabIndex = tabs?.findIndex(({ id }) => id == subSectionId);
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

   return (
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
         <Tab.List>
            <div
               className={clsx(
                  tabLength == 2 ? "grid grid-cols-2" : "",
                  tabLength == 3 ? "grid grid-cols-3" : "",
                  `border border-color-sub overflow-hidden rounded-t-lg text-sm laptop:text-[15px] divide-x divide-color-sub 
                  bg-zinc-50 shadow-1 shadow-sm dark:bg-dark350 r z-20 relative flex items-center`,
               )}
            >
               {tabs?.map((subSection) => {
                  return (
                     <Tab key={subSection.id} as={Fragment}>
                        {({ selected }) => (
                           <button
                              className={clsx(
                                 selected && tabLength && tabLength > 1
                                    ? "bg-zinc-100/70 dark:bg-dark400"
                                    : "",
                                 "p-2 flex items-center justify-center gap-2 relative focus-within:outline-none",
                              )}
                           >
                              <div
                                 className={clsx(
                                    selected
                                       ? "bg-zinc-400 dark:bg-zinc-500"
                                       : "",
                                    "h-3 w-3 absolute -bottom-[7px] transform -translate-x-1/2 left-1/2 rounded-lg",
                                 )}
                              />
                              <div
                                 className={clsx(
                                    selected ? "" : "text-1",
                                    "py-1 px-2 rounded-md font-bold font-header relative",
                                 )}
                              >
                                 {subSection.name}
                                 {!selected && (
                                    <span className="absolute -right-2 top-1 flex h-2 w-2">
                                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-300 dark:bg-zinc-400 opacity-75"></span>
                                       <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-300 dark:bg-zinc-500"></span>
                                    </span>
                                 )}
                              </div>
                           </button>
                        )}
                     </Tab>
                  );
               })}
            </div>
         </Tab.List>
         <Tab.Panels className="p-3 bg-3 rounded-b-lg border border-color-sub border-t-0 shadow-sm shadow-1">
            {section?.subSections?.map((subSection) => (
               <Tab.Panel key={subSection.id} unmount={false}>
                  <SubSection
                     customData={customData}
                     subSection={subSection}
                     customComponents={customComponents}
                  />
               </Tab.Panel>
            ))}
         </Tab.Panels>
      </Tab.Group>
   );
}

const subSectionOptions = {
   editor: EditorSection,
   customTemplate: CustomTemplateSection,
   qna: <></>,
   comments: <></>,
};

function SubSection({
   subSection,
   customData,
   customComponents,
}: {
   subSection?: SubSectionType;
   customData: unknown;
   customComponents: unknown;
}) {
   if (subSection?.type) {
      const SubSectionView = subSectionOptions[subSection?.type];

      return (
         //@ts-ignore
         <SubSectionView
            customComponents={customComponents}
            subSection={subSection}
            data={customData}
         />
      );
   }
}

function CustomTemplateSection({
   subSection,
   customComponents,
   data,
}: {
   subSection?: SubSectionType;
   customComponents: object;
   data: unknown;
}) {
   if (
      subSection?.id &&
      customComponents &&
      Object.keys(customComponents).includes(subSection?.id)
   ) {
      //@ts-ignore
      const CustomComponentView = customComponents[subSection?.id];

      return <CustomComponentView data={data} />;
   }
}

function EditorSection({ subSection }: { subSection?: SubSectionType }) {
   const fetcher = useFetcher();

   const { entry } = useMatches()?.[2]?.data as SerializeFrom<
      typeof entryLoaderType
   >;

   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   //Filter out content based on subSectionId
   const data = entry?.embeddedContent?.find(
      (item) => item?.subSectionId === subSection?.id,
   );

   return hasAccess ? (
      <Float
         middleware={[
            offset({
               mainAxis: 50,
               crossAxis: 0,
            }),
         ]}
         autoUpdate
         zIndex={20}
         placement="right-start"
         show
      >
         <main className="mx-auto max-w-[728px] group relative">
            <ManaEditor
               key={data?.id}
               siteId={entry?.siteId}
               fetcher={fetcher}
               collectionSlug="contentEmbeds"
               subSectionId={subSection?.id}
               entryId={entry?.id}
               pageId={data?.id}
               collectionEntity={entry.collectionEntity}
               defaultValue={(data?.content as unknown[]) ?? initialValue()}
            />
         </main>
         <div>
            <EditorCommandBar
               collectionSlug="contentEmbeds"
               collectionId={entry.collectionSlug}
               entryId={entry?.id}
               pageId={data?.id}
               fetcher={fetcher}
               isChanged={data?.isChanged}
            />
         </div>
      </Float>
   ) : (
      <EditorView data={data?.content ?? initialValue()} />
   );
}

function SectionTitle({
   section,
}: {
   section: Flatten<Collection["sections"]>;
}) {
   if (section?.showTitle && section.name)
      return (
         <Link to={`#${section?.id}`}>
            <h2
               className="border-color relative mb-2.5 mt-8 overflow-hidden rounded-lg
               border-2 font-header text-xl font-bold shadow-sm dark:bg-dark350 dark:shadow-black/30"
            >
               <div
                  className="pattern-dots absolute left-0 top-0 -z-0 h-full
                  w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                  pattern-size-4 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
               />
               <div className="flex items-center gap-2">
                  <div className="relative h-full px-3.5 flex-grow py-2.5">
                     {section?.name}
                  </div>
               </div>
            </h2>
         </Link>
      );
}

// OTHER
function ScrollToHashElement() {
   let location = useLocation();

   let hashElement = useMemo(() => {
      let hash = location.hash;
      const removeHashCharacter = (str: string) => {
         const result = str.slice(1);
         return result;
      };

      if (hash) {
         let element = document.getElementById(removeHashCharacter(hash));
         return element;
      } else {
         return null;
      }
   }, [location]);

   useEffect(() => {
      if (hashElement) {
         hashElement.scrollIntoView({
            behavior: "smooth",
            // block: "end",
            inline: "nearest",
         });
      }
   }, [hashElement]);

   return null;
}
