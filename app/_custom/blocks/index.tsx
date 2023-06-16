import { useReadOnly } from "slate-react";
import { ExampleBlock } from "./Example";
import { nanoid } from "nanoid";
import { Component } from "lucide-react";
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
         return null;
   }
};

export const CustomBlocksAddConfig = (onSelect: any) => {
   return {
      label: "custom",
      items: [
         {
            label: "Sample Component",
            icon: <Component size={20} />,
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
