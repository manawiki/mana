import { SubSectionType } from "./Section";

export function CustomTemplateSection({
   subSection,
   customComponents,
   data,
}: {
   subSection?: SubSectionType;
   customComponents: object;
   data: unknown;
}) {
   if (
      subSection?.id &&
      customComponents &&
      Object.keys(customComponents).includes(subSection?.id)
   ) {
      //@ts-ignore
      const CustomComponentView = customComponents[subSection?.id];

      return <CustomComponentView data={data} />;
   }
}
