import type { RenderElementProps } from "slate-react";

export const ExampleBlock = ({
   element,
   children,
   attributes,
}: RenderElementProps) => {
   return (
      <div
         className=""
         // You must mix the attributes into your component's top-most element.
         {...attributes}
      >
         {children}
      </div>
   );
};
