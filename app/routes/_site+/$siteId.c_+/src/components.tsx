import type { ReactNode } from "react";

import { offset } from "@floating-ui/react";
import { Float } from "@headlessui-float/react";
import {
   useFetcher,
   useLocation,
   useMatches,
   useParams,
} from "@remix-run/react";
import { lazily } from "react-lazily";

import { H2Default } from "~/components/H2";
import type { Site } from "~/db/payload-types";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/src/functions";
import { EditorCommandBar } from "~/routes/_editor+/core/components/EditorCommandBar";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { initialValue } from "~/routes/_editor+/core/utils";

import { CollectionHeader } from "../$collectionId";

// we'll lazy load the editor and viewer to make sure they get tree-shaken when not used
//@ts-ignore
const { ManaEditor } = lazily(() => import("~/routes/_editor+/editor.tsx"));

export function EntryContentEmbed({
   title,
   sectionId,
}: {
   title: string;
   sectionId?: string;
}) {
   const fetcher = useFetcher();

   //Site data should live in layout, this may be potentially brittle if we shift site architecture around
   const { site } = (useMatches()?.[1]?.data as { site: Site | null }) ?? {
      site: null,
   };

   //Get path for custom site
   const { pathname } = useLocation();
   const collectionSlug = pathname.split("/")[3];
   const collectionId = useParams()?.collectionId ?? collectionSlug;

   const collection = site?.collections?.find(
      (collection) => collection.slug === collectionId,
   );

   //Entry data should live in $collectionId_$entryId, this may be potentially brittle if we shift site architecture around
   const { entry } = useMatches()?.[2]?.data as any;

   //Filter out content based on sectionId
   const data = entry?.embeddedContent?.find(
      (item: any) => item?.sectionId === sectionId,
   );

   const hasContent = data?.content && data?.content[0].children[0].text != "";
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   return (
      <>
         {hasAccess ? (
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
               <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px]">
                  <H2Default text={title} />
                  <ManaEditor
                     key={data?.id}
                     collectionSlug="contentEmbeds"
                     sectionId={sectionId}
                     siteId={entry?.siteId}
                     fetcher={fetcher}
                     entryId={entry?.id}
                     pageId={data?.id}
                     collectionEntity={collection?.id}
                     defaultValue={data?.content ?? initialValue()}
                  />
               </main>
               <div>
                  <EditorCommandBar
                     collectionSlug="contentEmbeds"
                     collectionId={collection?.slug}
                     siteId={site?.slug}
                     entryId={entry?.id}
                     pageId={data?.id}
                     fetcher={fetcher}
                     isChanged={data?.isChanged}
                  />
               </div>
            </Float>
         ) : (
            <>
               {hasContent && (
                  <>
                     <H2Default text={title} />
                     <EditorView data={data?.content} />
                  </>
               )}
            </>
         )}
      </>
   );
}
export function Entry({ children }: { children: ReactNode }) {
   return (
      <div className="mx-auto max-w-[728px] max-laptop:pt-14 max-tablet:px-3 pb-5 laptop:pb-14">
         <CollectionHeader />
         {children}
      </div>
   );
}
