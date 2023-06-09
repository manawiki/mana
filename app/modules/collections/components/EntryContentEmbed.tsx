import { SoloEditor } from "~/routes/editors+/SoloEditor";
import { initialValue } from "~/routes/$siteId.collections+/$collectionId.$entryId+/_index";

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

   return (
      <div className="mx-auto max-w-[728px] max-laptop:px-3">
         <h2>{title}</h2>
         <SoloEditor
            intent="customCollectionEmbed"
            sectionId={sectionId}
            siteId={siteId}
            fetcher={fetcher}
            collectionEntity={collectionEntity}
            pageId={entryId}
            defaultValue={content ?? initialValue}
         />
      </div>
   );
};
