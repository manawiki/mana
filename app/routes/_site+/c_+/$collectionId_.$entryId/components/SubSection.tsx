import { CustomTemplateSection } from "./CustomTemplateSection";
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
