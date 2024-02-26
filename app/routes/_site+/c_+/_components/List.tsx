import { useState, type ReactNode } from "react";

import { useLocation, useParams } from "@remix-run/react";

import type { Collection } from "~/db/payload-types";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { CollectionHeader } from "./CollectionHeader";

export type Section = {
   id: string;
   slug: string;
   name?: string;
   showTitle?: boolean;
   showAd?: boolean;
   subSections?: [{ id: string; slug: string; name: string; type: string }];
};

export function List({ children }: { children: ReactNode }) {
   const { site } = useSiteLoaderData();

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
            allSections={allSections}
            setAllSections={setAllSections}
            setIsChanged={setIsChanged}
            isChanged={isChanged}
         />
         <div className="mx-auto max-w-[728px] space-y-1 max-tablet:px-3 py-3 laptop:pb-14">
            {children}
         </div>
      </>
   );
}
