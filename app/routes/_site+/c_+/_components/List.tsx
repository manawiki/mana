import { Suspense, useState, type ReactNode } from "react";

import { Await, useLoaderData, useLocation, useParams } from "@remix-run/react";
import type {
   VisibilityState,
   AccessorKeyColumnDef,
   AccessorKeyColumnDefBase,
} from "@tanstack/react-table";

import { Loading } from "~/components/Loading";
import type { Collection } from "~/db/payload-types";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { AddEntry } from "./AddEntry";
import { CollectionHeader } from "./CollectionHeader";
import { ListTable } from "./ListTable";
import { AdPlaceholder, AdUnit } from "../../_components/RampUnit";

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

export type TableFilters = {
   id: string;
   label: string;
   cols?: 1 | 2 | 3 | 4 | 5;
   options: { label: string; value: string; icon?: string }[];
}[];

export function List({
   children,
   columns,
   columnViewability,
   filters,
   viewType,
   gridView,
}: {
   children?: ReactNode;
   columns: AccessorKeyColumnDefBase<any>[];
   filters?: TableFilters;
   viewType: "list" | "grid";
   gridView?: AccessorKeyColumnDef<any>;
   columnViewability?: VisibilityState;
}) {
   //@ts-ignore
   const { list } = useLoaderData();
   const { site } = useSiteLoaderData();

   //Get path for custom site, cant use useParams since it doesn't exist when using a custom template
   const { pathname } = useLocation();
   const collectionSlug = pathname.split("/")[2];
   const collectionId = useParams()?.collectionId ?? collectionSlug;
   const collection = site?.collections?.find(
      //@ts-ignore
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
         <AdPlaceholder>
            <AdUnit
               className="mt-5"
               enableAds={site.enableAds}
               adType="leaderboard_atf"
               selectorId="listDesktopLeaderATF"
            />
         </AdPlaceholder>
         <div className="mx-auto max-w-[728px] space-y-1 max-tablet:px-3 py-4 laptop:pb-14">
            {!collection?.customDatabase && <AddEntry />}
            {children ? (
               children
            ) : (
               <Suspense fallback={<Loading />}>
                  <Await resolve={list}>
                     {(list) => (
                        <ListTable
                           viewType={viewType}
                           key={collectionId}
                           data={list}
                           columns={columns}
                           collection={collection}
                           filters={filters}
                           columnViewability={columnViewability}
                           gridView={gridView}
                        />
                     )}
                  </Await>
               </Suspense>
            )}
         </div>
      </>
   );
}
