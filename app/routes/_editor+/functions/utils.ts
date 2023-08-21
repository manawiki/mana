import { nanoid } from "nanoid";
import type { Operation, Path } from "slate";
import { Editor, Range, Transforms, Point } from "slate";

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

// From https://github.com/York-IE-Labs/slate-lists
// withLists handles behavior regarding ol and ul lists
// more specifically, withLists properly exits the list with `enter` or `backspace`
// from an empty list item, transforming the node to a paragraph

export const withLists = (editor: Editor) => {
   const { insertBreak, deleteBackward } = editor;

   const backspace = (callback) => {
      const { selection } = editor;

      // check that there is a current selection without highlight
      if (selection && Range.isCollapsed(selection)) {
         // find the 'closest' `list-item` element
         const [match] = Editor.nodes(editor, {
            match: (n: any) =>
               n.type === "list-item" &&
               n.children &&
               n.children[0] &&
               (!n.children[0].text || n.children[0].text === ""),
         });

         // check that there was a match
         if (match) {
            const [, path] = match;
            const start = Editor.start(editor, path);

            // if the selection is at the beginning of the list item
            if (Point.equals(selection.anchor, start)) {
               // 'lift' the list-item to the next parent
               liftNodes(editor);
               // check for the new parent
               const [listMatch] = Editor.nodes(editor, {
                  match: (n: any) =>
                     n.type === "bulleted-list" || n.type === "numbered-list",
               });
               // if it is no longer within a ul/ol, turn the element into a normal paragraph
               if (!listMatch) {
                  Transforms.setNodes(
                     editor,
                     { type: "paragraph" },
                     { match: (n) => n.type === "list-item" }
                  );
               }
               return;
            }
         }
      }

      callback();
   };

   // override editor function for break
   editor.insertBreak = () => {
      backspace(insertBreak);
   };

   // override editor function for a backspace
   editor.deleteBackward = (unit) => {
      backspace(() => deleteBackward(unit));
   };

   return editor;
};

export const undentItem = (editor: Editor) => {
   const { selection } = editor;

   // check that there is a current selection without highlight
   if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
         match: (n) => n.type === "list-item",
      });

      // check that there was a match
      if (match) {
         // 'lift' the list-item to the next parent
         liftNodes(editor);
         // check for the new parent
         const [listMatch] = Editor.nodes(editor, {
            match: (n) =>
               n.type === "bulleted-list" || n.type === "numbered-list",
         });
         // if it is no longer within a ul/ol, turn the element into a normal paragraph
         if (!listMatch) {
            Transforms.setNodes(
               editor,
               { type: "paragraph" },
               { match: (n) => n.type === "list-item" }
            );
         }
      }
   }
};

export const indentItem = (editor: Editor) => {
   const maxDepth = 5;

   const { selection } = editor;

   // check that there is a current selection without highlight
   if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
         match: (n) => n.type === "list-item",
      });

      // check that there was a match
      if (match) {
         // wrap the list item into another list to indent it within the DOM
         const [listMatch] = Editor.nodes(editor, {
            mode: "lowest",
            match: (n) =>
               n.type === "bulleted-list" || n.type === "numbered-list",
         });

         if (listMatch) {
            let depth = listMatch[1].length;
            if (depth <= maxDepth) {
               Transforms.wrapNodes(editor, {
                  type: listMatch[0].type,
                  children: [],
               });
            }
         }
      }
   }
};

const liftNodes = (editor: Editor) => {
   // check for the new parent
   const [listMatch] = Editor.nodes(editor, {
      match: (n) => n.type === "bulleted-list" || n.type === "numbered-list",
   });
   // verify there is a list to lift the nodes
   if (listMatch) {
      // 'lift' the list-item to the next parent
      Transforms.liftNodes(editor, { match: (n) => n.type === "list-item" });
   }
};
