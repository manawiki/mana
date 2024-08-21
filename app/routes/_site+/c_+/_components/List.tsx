import { Suspense, useState, type ReactNode } from "react";

import { Await, useLoaderData, useLocation, useParams } from "@remix-run/react";
import type {
   VisibilityState,
   AccessorKeyColumnDef,
   AccessorKeyColumnDefBase,
   SortingState,
} from "@tanstack/react-table";

import { Loading } from "~/components/Loading";
import type { Collection } from "~/db/payload-types";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { AddEntry } from "./AddEntry";
import { CollectionHeader } from "./CollectionHeader";
import { ListTable } from "./ListTable";
import { AdUnit } from "../../_components/RampUnit";

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
   defaultViewType,
   gridView,
   defaultSort,
}: {
   children?: ReactNode;
   columns: AccessorKeyColumnDefBase<any>[];
   filters?: TableFilters;
   defaultViewType?: "list" | "grid";
   gridView?: AccessorKeyColumnDef<any>;
   columnViewability?: VisibilityState;
   defaultSort?: SortingState;
}) {
   //@ts-ignore
   const { list } = useLoaderData();
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
            collection={collection}
            allSections={allSections}
            setAllSections={setAllSections}
            setIsChanged={setIsChanged}
            isChanged={isChanged}
         />
         <AdUnit
            enableAds={site.enableAds}
            adType={{
               desktop: "leaderboard_atf",
               tablet: "leaderboard_atf",
               mobile: "med_rect_atf",
            }}
            className="mt-6 mb-4 mx-auto flex items-center justify-center"
            selectorId="listDesktopLeaderATF"
         />
         <div className="mx-auto max-w-[728px] space-y-1 max-tablet:px-3 py-4 laptop:pb-14">
            {!collection?.customDatabase && <AddEntry />}
            {children ? (
               children
            ) : (
               <Suspense fallback={<Loading />}>
                  <Await resolve={list} errorElement={<Loading />}>
                     {(list) => (
                        <ListTable
                           defaultSort={defaultSort}
                           defaultViewType={defaultViewType}
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
