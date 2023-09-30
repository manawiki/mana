import { type ReactNode } from "react";

import { useSlate } from "slate-react";

// eslint-disable-next-line import/no-cycle
import { NestedEditor } from "../core/dnd";
import type { TwoColumnElement } from "../core/types";

type Props = {
   element: TwoColumnElement;
   children: ReactNode;
   readOnly: boolean;
};

export function BlockTwoColumn({ element, children, readOnly }: Props) {
   const editor = useSlate();

   return (
      <section
         contentEditable={false}
         className="grid laptop:grid-cols-2 laptop:gap-4"
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
