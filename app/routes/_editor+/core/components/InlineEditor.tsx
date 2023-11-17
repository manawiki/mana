import { useMemo } from "react";

import { Transforms, createEditor } from "slate";
import type { Descendant, Editor } from "slate";
import {
   Editable,
   ReactEditor,
   Slate,
   useReadOnly,
   withReact,
} from "slate-react";

// eslint-disable-next-line import/no-cycle
import { EditorBlocks } from "./EditorBlocks";
import { Leaf } from "./Leaf";
import { Toolbar } from "./Toolbar";
import { useEditor } from "../plugins";
import type { CustomElement } from "../types";
import { initialValue, onKeyDown } from "../utils";

export function InlineEditor({
   element,
   editor,
   field,
   readOnly = false,
}: {
   element: any;
   editor: Editor;
   field: string;
   readOnly?: boolean;
}) {
   const isEditorReadOnlyMode = useReadOnly();
   const inlineEditor = useEditor();
   const viewEditor = useMemo(() => withReact(createEditor()), []);

   if (isEditorReadOnlyMode == true || readOnly == true) {
      return (
         <Slate
            editor={viewEditor}
            initialValue={element[field] ?? initialValue()}
         >
            <Editable
               renderElement={EditorBlocks}
               renderLeaf={Leaf}
               readOnly={true}
            />
         </Slate>
      );
   }

   const path = ReactEditor.findPath(editor, element);

   function updateEditorValue(event: Descendant[]) {
      Transforms.setNodes<CustomElement>(
         editor,
         {
            [field]: event,
         },
         {
            at: path,
         },
      );
   }

   return (
      <Slate
         onChange={updateEditorValue}
         editor={inlineEditor}
         initialValue={element[field] ?? initialValue()}
      >
         <Toolbar />
         <Editable
            className="focus:outline outline-zinc-200 dark:outline-zinc-600 rounded-md"
            renderElement={EditorBlocks}
            renderLeaf={Leaf}
            onKeyDown={(e) => onKeyDown(e, editor)}
         />
      </Slate>
   );
}
