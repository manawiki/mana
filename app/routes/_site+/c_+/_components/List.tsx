import { useState, type ReactNode } from "react";

import { useLocation, useMatches, useParams } from "@remix-run/react";
import type { PaginatedDocs } from "payload/database";

import type { Collection, Entry } from "~/db/payload-types";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { AddEntry } from "./AddEntry";
import { CollectionHeader } from "./CollectionHeader";
import { CollectionListRows } from "./CollectionListRows";
import { CustomDBFilters } from "./CustomDBFilters";

export type Section = {
   id: string;
   slug: string;
   name?: string;
   showTitle?: boolean;
   showAd?: boolean;
   viewType?: "tabs" | "rows";
   subSections?: [
      {
         id: string;
         showTitle?: boolean;
         slug: string;
         name: string;
         type: string;
      },
   ];
};

export function List({
   children,
   RowComponent,
}: {
   children?: ReactNode;
   RowComponent?: unknown;
}) {
   const { site } = useSiteLoaderData();

   //@ts-ignore
   const { entries } = useMatches()?.[2]?.data as PaginatedDocs<Entry>;

   //Get path for custom site, cant use useParams since it doesn't exist when using a custom template
   const { pathname } = useLocation();
   const collectionSlug = pathname.split("/")[2];
   const collectionId = useParams()?.collectionId ?? collectionSlug;
   const collection = site?.collections?.find(
      (collection) => collection.slug === collectionId,
   ) as Collection;

   const [allSections, setAllSections] = useState(
      collection?.sections as Section[],
   );
   const [isChanged, setIsChanged] = useState(false);

   return (
      <>
         <CollectionHeader
            collection={collection}
            allSections={allSections}
            setAllSections={setAllSections}
            setIsChanged={setIsChanged}
            isChanged={isChanged}
         />
         <div className="mx-auto max-w-[728px] space-y-1 max-tablet:px-3 py-4 laptop:pb-14">
            {!collection.customDatabase && <AddEntry />}
            {collection?.filterGroups?.length != 0 &&
               !collection.customListTemplate && (
                  <CustomDBFilters collection={collection} />
               )}
            {!collection.customListTemplate && (
               <CollectionListRows
                  entries={entries}
                  rowComponent={RowComponent}
               />
            )}
            {children}
         </div>
      </>
   );
}
