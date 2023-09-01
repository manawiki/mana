import isHotkey, { isKeyHotkey } from "is-hotkey";
import { nanoid } from "nanoid";
import type { Operation, Path } from "slate";
import { Editor, Transforms, Range, Element } from "slate";

import {
   BlockType,
   type CustomElement,
   type Format,
   type ParagraphElement,
} from "./types";

export const HOTKEYS: Record<string, Format> = {
   "mod+b": "bold",
   "mod+i": "italic",
   "mod+u": "underline",
   "mod+s": "strikeThrough",
};

export function withNodeId(editor: Editor) {
   const makeNodeId = () => nanoid(16);
   const { apply, insertFragment, insertBreak } = editor;

   /* 
    Check if we need to re-write the id on paste
    In packages\slate-react\src\components\editable.tsx, it would be called on these events:

    1. onDOMBeforeInput, when event.inputType === insertFromPaste
    2. onDrop
    3. onPaste
 */
   editor.insertFragment = (fragment) => {
      fragment.forEach((node: any) => {
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

   //Break to paragraph if element is any of the following
   editor.insertBreak = () => {
      const { selection } = editor;

      if (selection) {
         const [title] = Editor.nodes(editor, {
            match: (n: any) =>
               !Editor.isEditor(n) &&
               Element.isElement(n) &&
               [BlockType.EventItem, BlockType.H2, BlockType.H3].includes(
                  n.type
               ),
         });

         if (title) {
            Transforms.insertNodes(
               editor,
               {
                  id: nanoid(),
                  children: [{ text: "" }],
                  type: BlockType.Paragraph,
               },
               { at: [editor.children.length] }
            );
            Transforms.move(editor, { distance: 1, unit: "line" });
            return;
         }
      }
      insertBreak();
   };

   return editor;
}

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

export function initialValue(): CustomElement[] {
   const id = nanoid();

   return [
      {
         id,
         type: BlockType.Paragraph,
         children: [{ text: "" }],
      },
   ];
}

export function onKeyDown(event: any, editor: any) {
   const { selection } = editor;

   if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = event;
      if (isKeyHotkey("left", nativeEvent)) {
         event.preventDefault();
         Transforms.move(editor, { unit: "offset", reverse: true });
         return;
      }
      if (isKeyHotkey("right", nativeEvent)) {
         event.preventDefault();
         Transforms.move(editor, { unit: "offset" });
         return;
      }
   }

   //Render mark commands
   for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event as any) && editor.selection) {
         event.preventDefault();
         const mark = HOTKEYS[hotkey];
         toggleMark(editor, mark);
      }
   }
}
