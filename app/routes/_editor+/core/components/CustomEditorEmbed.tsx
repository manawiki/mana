import { useFetcher } from "@remix-run/react";

import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/utils/useIsStaffSiteAdminOwner";
import { EditorCommandBar } from "~/routes/_editor+/core/components/EditorCommandBar";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { initialValue } from "~/routes/_editor+/core/utils";
import { ManaEditor } from "~/routes/_editor+/editor";

import type { Descendant } from "slate";

export function CustomEditorEmbed({
   data,
   siteId,
   pageId,
   relationId,
}: {
   data: unknown;
   siteId?: string;
   pageId?: string;
   relationId?: string | undefined | null;
}) {
   const fetcher = useFetcher();

   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   return (
      <>
         {hasAccess ? (
            <main className="mx-auto max-w-[750px] group relative">
               <ManaEditor
                  key={pageId}
                  siteId={siteId}
                  fetcher={fetcher}
                  collectionSlug="contentEmbeds"
                  pageId={pageId}
                  entryId={relationId}
                  defaultValue={(data ?? initialValue()) as Descendant[]}
               />
               <div className="absolute right-0 top-0 tablet_editor:-right-28 h-full laptop:z-40">
                  <div className="tablet_editor:top-[136px] sticky laptop:top-[76px] max-tablet_editor:top-[194px] w-full left-0">
                     <EditorCommandBar
                        isSection
                        collectionSlug="contentEmbeds"
                        entryId={relationId}
                        pageId={pageId}
                        fetcher={fetcher}
                        isChanged={true}
                     />
                  </div>
               </div>
            </main>
         ) : data ? (
            <EditorView data={data ?? initialValue()} />
         ) : undefined}
      </>
   );
}
