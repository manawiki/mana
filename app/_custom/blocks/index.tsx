import { nanoid } from "nanoid";
import { DefaultElement, useReadOnly } from "slate-react";

import { Icon } from "~/components/Icon";

import { ExampleBlock } from "./Example";
enum BlockType {
   CustomComponent = "customComponent",
}

type CustomComponent = {
   id: string;
   type: BlockType.CustomComponent;
   stringField: string | null;
   children: [{ text: "" }];
};

export const CustomBlocks = ({ element, children, attributes }: any) => {
   const readOnly = useReadOnly();

   switch (element.type) {
      case BlockType.CustomComponent: {
         return <ExampleBlock element={element} children={children} />;
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
      // label: "Custom",
      // items: [
      //    {
      //       label: "Sample Component",
      //       icon: <Icon name="component" size={20} />,
      //       description: "Sample component description",
      //       onSelect: () => {
      //          onSelect({
      //             id: nanoid(),
      //             stringField: "test",
      //             type: BlockType.CustomComponent,
      //             children: [{ text: "" }],
      //          });
      //       },
      //    },
      // ],
   };
};
