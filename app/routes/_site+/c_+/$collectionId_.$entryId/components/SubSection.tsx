import { EditorSection } from "./EditorSection";
import type { SubSectionType } from "./Section";

export const subSectionOptions = {
   editor: EditorSection,
   customTemplate: CustomTemplateSection,
   qna: <></>,
   comments: <></>,
};

export function SubSection({
   subSection,
   customData,
   customComponents,
}: {
   subSection?: SubSectionType;
   customData: unknown;
   customComponents: unknown;
}) {
   if (subSection?.type) {
      const SubSectionView = subSectionOptions[subSection?.type];

      return (
         //@ts-ignore
         <SubSectionView
            customComponents={customComponents}
            subSection={subSection}
            data={customData}
         />
      );
   }
}

function CustomTemplateSection({
   subSection,
   customComponents,
   data,
}: {
   subSection?: SubSectionType;
   customComponents: object;
   data: unknown;
}) {
   if (
      subSection?.slug &&
      customComponents &&
      Object.keys(customComponents).includes(subSection?.slug)
   ) {
      //@ts-ignore
      const CustomComponentView = customComponents[subSection?.slug];

      return <CustomComponentView subSection={subSection} data={data} />;
   }
}
