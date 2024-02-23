import { useState } from "react";

import { useLocation, useParams } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import type { Collection } from "~/db/payload-types";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { AddSection } from "./AddSection";
import { CollectionEdit } from "./CollectionEdit";
import { SectionCommandBar } from "./SectionCommandBar";
import { SectionList } from "./SectionList";

export type Section = {
   id: string;
   slug: string;
   name?: string;
   showTitle?: boolean;
   showAd?: boolean;
   subSections?: [{ id: string; slug: string; name: string; type: string }];
};

export function Sections() {
   const { site } = useSiteLoaderData();

   //Get path for custom site
   const { pathname } = useLocation();
   const collectionSlug = pathname.split("/")[2];
   const collectionId = useParams()?.collectionId ?? collectionSlug;
   const collection = site?.collections?.find(
      (collection) => collection.slug === collectionId,
   ) as Collection;

   const [isSectionsOpen, setSectionsOpen] = useState<boolean>(false);
   const [isChanged, setIsChanged] = useState(false);
   const [allSections, setAllSections] = useState(collection?.sections);

   return (
      <div className="relative">
         <div className="flex items-center gap-3 absolute -top-8 right-0 z-10">
            <button
               onClick={() => setSectionsOpen(!isSectionsOpen)}
               className="flex items-center dark:hover:border-zinc-400/50 gap-2 justify-center shadow-1 shadow-sm h-7 
             dark:bg-dark450 bg-white rounded-lg border border-zinc-200 dark:border-zinc-500/60 hover:border-zinc-300/80 overflow-hidden"
            >
               <div className="flex items-center gap-1.5 h-full">
                  <div className="text-[10px] font-bold text-1 pl-2.5">
                     Sections
                  </div>
                  <Icon
                     name="chevron-down"
                     className={clsx(
                        isSectionsOpen ? "rotate-180" : "",
                        "transform transition duration-300 text-1 ease-in-out",
                     )}
                     size={14}
                  />
                  <div
                     className="text-[10px] font-bold border-l border-zinc-200 dark:border-zinc-600 
                     h-full text-1 bg-zinc-50 flex items-center justify-center dark:bg-dark400 px-2"
                  >
                     {collection?.sections?.length}
                  </div>
               </div>
            </button>
            <CollectionEdit collection={collection} />
         </div>
         {isSectionsOpen && (
            <div className="pt-2">
               <AddSection
                  collection={collection}
                  setAllSections={setAllSections}
               />
               <SectionList
                  setIsChanged={setIsChanged}
                  setAllSections={setAllSections}
                  allSections={allSections}
                  collection={collection}
               />
            </div>
         )}
         <SectionCommandBar
            collection={collection}
            allSections={allSections}
            setAllSections={setAllSections}
            isChanged={isChanged}
            setIsChanged={setIsChanged}
         />
      </div>
   );
}
