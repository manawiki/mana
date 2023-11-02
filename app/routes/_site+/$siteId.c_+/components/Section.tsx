import { Fragment, useEffect, useMemo } from "react";

import { offset } from "@floating-ui/react";
import { Tab } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import { Link, useFetcher, useLocation, useMatches } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import clsx from "clsx";
import { lazily } from "react-lazily";

import type { Collection } from "~/db/payload-types";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/src/functions";
import { EditorCommandBar } from "~/routes/_editor+/core/components/EditorCommandBar";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { initialValue } from "~/routes/_editor+/core/utils";
import type { loader as entryLoaderType } from "~/routes/_site+/$siteId.c_+/$collectionId_.$entryId";

import type { Section } from "./Sections";

// we'll lazy load the editor and viewer to make sure they get tree-shaken when not used
//@ts-ignore
const { ManaEditor } = lazily(() => import("~/routes/_editor+/editor.tsx"));

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

   return (
      <>
         {entry.sections?.map((section) => (
            <SectionParent
               key={section.id}
               entry={entry}
               section={section}
               customData={customData}
               customComponents={customComponents}
            />
         ))}
         <ScrollToHashElement />
      </>
   );
}

function SectionParent({
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
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   if (section?.subSections) {
      const isSingle =
         section?.subSections && section?.subSections?.length == 1;

      const isEmbedEmpty =
         !entry?.embeddedContent || entry?.embeddedContent.length == 0;

      return (
         <div
            id={section?.id}
            className="scroll-mt-36 laptop:scroll-mt-[100px]"
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

   return (
      <Tab.Group>
         <Tab.List>
            <div className="border py-2 px-1.5 border-color-sub overflow-hidden rounded-t-lg text-[13px] bg-zinc-50 shadow-1 shadow-sm dark:bg-dark350 r z-20 relative flex items-center gap-1">
               {tabs?.map((subSection) => {
                  return (
                     <Tab key={subSection.id} as={Fragment}>
                        {({ selected }) => (
                           <button className="rounded-md px-1.5 flex items-center gap-2 relative focus-within:outline-none">
                              <div
                                 className={clsx(
                                    selected
                                       ? "bg-zinc-300 dark:bg-dark500"
                                       : "",
                                    "h-[10px] w-7 absolute -bottom-[13px] transform -translate-x-1/2 left-1/2 rounded-lg",
                                 )}
                              />
                              <div
                                 className={clsx(
                                    selected ? "" : "text-1",
                                    "dark:hover:bg-dark400 hover:bg-white py-1 px-2 rounded-md font-bold",
                                 )}
                              >
                                 {subSection.name}
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
         zIndex={20}
         placement="right-start"
         show
      >
         <main className="mx-auto max-w-[728px] group relative">
            <ManaEditor
               key={data?.id}
               fetcher={fetcher}
               collectionSlug="contentEmbeds"
               subSectionId={subSection?.id}
               siteId={entry?.siteId}
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
               siteId={entry.siteSlug}
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
               className="shadow-1 border-color relative mb-2.5 mt-8 overflow-hidden rounded-lg
               border-2 font-header text-xl font-bold shadow-sm shadow-zinc-50 dark:bg-dark350"
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
