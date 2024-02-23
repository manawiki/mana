import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import { Popover, Tab, Transition } from "@headlessui/react";
import {
   Link,
   useFetcher,
   useLocation,
   useMatches,
   useSearchParams,
} from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import clsx from "clsx";

import { Button } from "~/components/Button";
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
            <div key={section.id}>
               {section.showAd && (
                  <AdPlaceholder>
                     <div
                        className={`flex items-center justify-center mx-auto ${
                           section.showAd ? "min-h-[90px]" : ""
                        }`}
                     >
                        <AdUnit
                           enableAds={section.showAd}
                           adType="desktopLeaderBTF"
                           selectorId={`sectionDesktopLeaderBTF-${section.id}`}
                        />
                     </div>
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
            </div>
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
                              <TooltipTrigger asChild>
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
                              <TooltipTrigger asChild>
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

   return (
      <>
         <div
            data-section
            id={section?.slug ?? ""}
            className="scroll-mt-32 laptop:scroll-mt-[126px]"
         >
            <SectionTitle section={section} />
            {hasMany ? (
               <div className="shadow-sm shadow-1 bg-clip-padding border border-color-sub rounded-lg">
                  <Tab.Group
                     selectedIndex={selectedIndex}
                     onChange={setSelectedIndex}
                  >
                     <Tab.List
                        className={clsx(
                           "relative flex bg-zinc-50 dark:bg-dark350 border-b border-color-sub p-3 items-center gap-3 rounded-t-lg",
                        )}
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
                                          "!py-1.5 !px-3",
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

   return (
      <>
         {hasAccess ? (
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
               <div className="absolute right-0 top-0 tablet_editor:-right-16 h-full laptop:z-40">
                  <div className="tablet_editor:top-[136px] sticky laptop:top-[76px] max-tablet_editor:top-[194px] w-full left-0">
                     <EditorCommandBar
                        isSection
                        collectionSlug="contentEmbeds"
                        collectionId={entry.collectionSlug}
                        entryId={entry?.id}
                        pageId={data?.id}
                        fetcher={fetcher}
                        isChanged={data?.isChanged}
                     />
                  </div>
               </div>
            </main>
         ) : (
            <EditorView data={data?.content ?? initialValue()} />
         )}
      </>
   );
}

function SectionTitle({
   section,
}: {
   section: Flatten<Collection["sections"]>;
}) {
   const hasTitle = section?.showTitle && section.name;

   if (hasTitle)
      return (
         <Link to={`#${section?.slug}`}>
            <h2
               className={clsx(
                  `border-color relative  mt-8 overflow-hidden  rounded-lg shadow-sm dark:shadow-black/20 mb-2.5 border-2
                    font-header text-xl font-bold  dark:bg-dark350 `,
               )}
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
