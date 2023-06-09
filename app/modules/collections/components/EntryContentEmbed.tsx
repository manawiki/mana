import { SoloEditor } from "~/routes/editors+/SoloEditor";
import { initialValue } from "~/routes/$siteId.collections+/$collectionId.$entryId+/_index";
import { H2 } from "./H2";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/modules/auth";
import type { RenderElementProps } from "slate-react";
import { Editable, Slate, withReact } from "slate-react";
import Block from "~/modules/editor/blocks/Block";
import Leaf from "~/modules/editor/blocks/Leaf";
import { useMemo, useCallback } from "react";
import { createEditor } from "slate";

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
   const editor = useMemo(() => withReact(createEditor()), []);
   const renderElement = useCallback((props: RenderElementProps) => {
      return <Block {...props} />;
   }, []);
   return (
      <div className="mx-auto max-w-[728px] max-laptop:px-3">
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
                     <Slate editor={editor} value={content}>
                        <Editable
                           renderElement={renderElement}
                           renderLeaf={Leaf}
                           readOnly={true}
                        />
                     </Slate>
                  </>
               )}
            </>
         )}
      </div>
   );
};
