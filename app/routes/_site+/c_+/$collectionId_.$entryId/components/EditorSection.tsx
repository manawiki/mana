import { useFetcher, useMatches } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";

import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/utils/useIsStaffSiteAdminOwner";
import { EditorCommandBar } from "~/routes/_editor+/core/components/EditorCommandBar";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { initialValue } from "~/routes/_editor+/core/utils";
import { ManaEditor } from "~/routes/_editor+/editor";
import type { loader as entryLoaderType } from "~/routes/_site+/c_+/$collectionId_.$entryId/_entry";

import type { SubSectionType } from "./Section";

export function EditorSection({ subSection }: { subSection?: SubSectionType }) {
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
