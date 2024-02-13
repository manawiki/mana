import { nanoid } from "nanoid";
import type { RenderElementProps } from "slate-react";
import { DefaultElement, useReadOnly } from "slate-react";

import { Icon } from "~/components/Icon";

import { ExampleBlock } from "./Example";

enum BlockType {
   CustomComponent = "customComponent",
}

export const CustomBlocks = ({
   element,
   children,
   attributes,
}: RenderElementProps) => {
   const readOnly = useReadOnly();

   switch (element.type) {
      // @ts-expect-error make sure to update BlockType at app\routes\_editor+\core\types.ts
      case BlockType.CustomComponent: {
         return (
            <ExampleBlock
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      default:
         //Render default element if no custom blocks match
         return (
            <DefaultElement element={element} attributes={attributes}>
               {children}
            </DefaultElement>
         );
   }
};

export const CustomBlocksAddConfig = (onSelect: any) => {
   return {
      label: "Custom",
      items: [
         {
            label: "Sample Component",
            icon: <Icon name="component" size={20} />,
            description: "Sample component description",
            onSelect: () => {
               onSelect({
                  id: nanoid(),
                  stringField: "test",
                  type: BlockType.CustomComponent,
                  children: [{ text: "" }],
               });
            },
         },
      ],
   };
};
