import { Fragment, useEffect, useRef, useState } from "react";

import { useMatches } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";

import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/utils/useIsStaffSiteAdminOwner";
import type { loader as entryLoaderType } from "~/routes/_site+/c_+/$collectionId_.$entryId/_entry";

import { ScrollToHashElement } from "./ScrollToHashElement";
import { SectionParent } from "./SectionParent";
import { AdPlaceholder, AdUnit } from "../../../_components/RampUnit";
import { TableOfContents } from "../../_components/TableOfContents";

export type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

export type SubSectionType = {
   id: string;
   slug: string;
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
         const sectionOffsetTop = section.offsetTop + 164;
         const sectionHeight = section.offsetHeight;

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
      <div className="relative">
         <div className="max-tablet:-mx-3 desktop:flex items-center justify-center mb-4">
            <div className="max-w-[728px] w-full mx-auto">
               <TableOfContents entry={entry} sections={entry.sections} />
            </div>
         </div>
         {entry.sections?.map((section: any) => (
            <Fragment key={section.id}>
               {section.showAd ? (
                  <AdPlaceholder>
                     <div
                        className={`flex items-center justify-center mx-auto ${
                           section.showAd ? "laptop:min-h-[90px] my-8" : ""
                        }`}
                     >
                        <AdUnit
                           enableAds={section.showAd}
                           adType={{
                              desktop: "leaderboard_btf",
                              tablet: "leaderboard_btf",
                              mobile: "med_rect_btf",
                           }}
                           selectorId={`sectionBTF-${section.id}`}
                        />
                     </div>
                  </AdPlaceholder>
               ) : null}
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
            </Fragment>
         ))}
         <ScrollToHashElement />
      </div>
   );
}
