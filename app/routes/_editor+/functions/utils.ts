import { nanoid } from "nanoid";
import type { Operation, Path } from "slate";
import { Editor, Transforms } from "slate";

import {
   BlockType,
   type CustomElement,
   type Format,
   type ParagraphElement,
} from "../types";

export const withNodeId = (editor: Editor) => {
   const makeNodeId = () => nanoid(16);
   const { apply, insertFragment } = editor;

   /* 
    Check if we need to re-write the id on paste
    In packages\slate-react\src\components\editable.tsx, it would be called on these events:

    1. onDOMBeforeInput, when event.inputType === insertFromPaste
    2. onDrop
    3. onPaste
 */
   editor.insertFragment = (fragment) => {
      fragment.forEach((node) => {
         if (node.type) {
            node.id = nanoid();
         }
      });
      insertFragment(fragment);
   };

   editor.apply = (operation: Operation) => {
      if (operation.type === "split_node" && operation.path.length === 1) {
         (operation.properties as any).id = makeNodeId();
         return apply(operation);
      }

      return apply(operation);
   };

   return editor;
};

export function withLayout(editor: Editor) {
   const { normalizeNode } = editor;

   editor.normalizeNode = ([node, path]) => {
      // Make sure the document always contains a paragraph
      if (path.length === 0) {
         insertParagraphIfMissing(editor);
      }
      return normalizeNode([node, path]);
   };

   return editor;
}

function insertParagraphIfMissing(editor: Editor) {
   if (editor.children.length < 1) {
      const p: ParagraphElement = {
         id: nanoid(),
         type: BlockType.Paragraph,
         children: [{ text: "" }],
      };
      Transforms.insertNodes(editor, p, { at: [0] });
   }
}

export function toggleMark(editor: Editor, format: Format) {
   const isActive = isMarkActive(editor, format);

   if (isActive) {
      Editor.removeMark(editor, format);
   } else {
      Editor.addMark(editor, format, true);
   }
}

export function isMarkActive(editor: Editor, format: Format) {
   const marks = Editor.marks(editor);
   return marks ? marks[format] === true : false;
}

export function topLevelPath(path: Path): Path {
   return [path[0]];
}

type CursorType = "grab" | "grabbing";

export function setGlobalCursor(type: CursorType) {
   document.body.classList.add(type);
}

export function removeGlobalCursor(type: CursorType) {
   document.body.classList.remove(type);
}

export const initialValue = (): CustomElement[] => {
   const id = nanoid();

   return [
      {
         id,
         type: BlockType.Paragraph,
         children: [{ text: "" }],
      },
   ];
};
