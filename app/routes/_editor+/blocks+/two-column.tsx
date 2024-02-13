import { type RenderElementProps, useSlate } from "slate-react";

// eslint-disable-next-line import/no-cycle
import { NestedEditor } from "../core/dnd";
import type { TwoColumnElement } from "../core/types";

export function BlockTwoColumn({
   element,
   children,
   attributes,
   readOnly,
}: RenderElementProps & { element: TwoColumnElement; readOnly: Boolean }) {
   const editor = useSlate();

   return (
      <section
         contentEditable={false}
         className="grid laptop:grid-cols-2 laptop:gap-4"
         {...attributes}
      >
         <div>
            <NestedEditor
               isTwoColumn
               field="columnOneContent"
               element={element}
               editor={editor}
            />
         </div>
         <div>
            <NestedEditor
               isTwoColumn
               field="columnTwoContent"
               element={element}
               editor={editor}
            />
         </div>
      </section>
   );
}
