import { lazily } from "react-lazily";

import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/modules/auth";
import { initialValue } from "~/routes/_site+/$siteId.collections+/$collectionId.$entryId+/_index.tsx";

import { H2 } from "./H2";

// import { SoloEditor } from "~/routes/editors+/SoloEditor";
// import { EntryViewer } from "./EntryViewer";
// we'll lazy load the editor and viewer to make sure they get tree-shaken when not used
const { SoloEditor } = lazily(() => import("~/routes/editors+/SoloEditor.tsx"));
const { EntryViewer } = lazily(() => import("./EntryViewer.tsx"));

export const EntryContentEmbed = ({
   title,
   fetcher,
   defaultValue,
   siteId,
   collectionEntity,
   entryId,
   sectionId,
}: {
   title: string;
   fetcher: any;
   defaultValue: any;
   siteId: any;
   collectionEntity?: string;
   entryId?: string;
   sectionId?: string;
}) => {
   //Filter out content based on sectionId
   const content =
      defaultValue &&
      defaultValue.find((item: any) => item.sectionId === sectionId)?.content;
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();
   return (
      <div className="mx-auto max-w-[728px]">
         {hasAccess ? (
            <>
               <H2 text={title} />
               <SoloEditor
                  intent="customCollectionEmbed"
                  sectionId={sectionId}
                  siteId={siteId}
                  fetcher={fetcher}
                  collectionEntity={collectionEntity}
                  pageId={entryId}
                  defaultValue={content ?? initialValue}
               />
            </>
         ) : (
            <>
               {content && (
                  <>
                     <H2 text={title} />
                     <EntryViewer content={content} />
                  </>
               )}
            </>
         )}
      </div>
   );
};
