import { nanoid } from "nanoid";
import type { BaseEditor, BaseRange, Operation, Path } from "slate";
import { Range, Transforms, Editor, Element } from "slate";
import type { Format, ParagraphElement } from "./types";
import { BlockType } from "./types";
import type { ReactEditor } from "slate-react";
import { useCallback, useRef, useState } from "react";

import areEqual from "deep-equal";
export function toPx(value: number | undefined): string | undefined {
   return value ? `${Math.round(value)}px` : undefined;
}

export const makeNodeId = () => nanoid(16);

export const withNodeId = (editor: Editor) => {
   const { apply } = editor;

   editor.apply = (operation: Operation) => {
      if (operation.type === "insert_node" && operation.path.length === 1) {
         return apply(operation);
      }

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

export function hasActiveLinkAtSelection(editor: Editor) {
   return isLinkNodeAtSelection(editor, editor.selection);
}

export function toggleLinkAtSelection(editor: Editor) {
   if (editor.selection == null) {
      return;
   }
   if (hasActiveLinkAtSelection(editor)) {
      Transforms.unwrapNodes(editor, {
         match: (n) => Element.isElement(n) && n.type === "link",
      });
   } else {
      const isSelectionCollapsed =
         editor.selection == null || Range.isCollapsed(editor.selection);
      if (isSelectionCollapsed) {
         createLinkForRange(editor, null, "link", "", true /*isInsertion*/);
      } else {
         createLinkForRange(editor, editor.selection, "", "", false);
      }
   }
}

export function isLinkNodeAtSelection(
   editor: Editor,
   selection: Editor["selection"]
) {
   if (selection == null) {
      return false;
   }
   return (
      Editor.above(editor, {
         at: selection,
         match: (n: any) => n.type === "link",
      }) != null
   );
}

function createLinkForRange(
   editor: BaseEditor & ReactEditor,
   range: BaseRange | null,
   linkText: string,
   linkURL: string,
   isInsertion: boolean
) {
   isInsertion
      ? Transforms.insertNodes(
           editor,
           {
              type: BlockType.Link,
              url: linkURL,
              children: [{ text: linkText }],
           },
           range != null ? { at: range } : undefined
        )
      : Transforms.wrapNodes(
           editor,
           {
              type: BlockType.Link,
              url: linkURL,
              children: [{ text: linkText }],
           },
           { split: true, at: range }
        );
}

export function useSelection(editor: Editor) {
   const [selection, setSelection] = useState(editor.selection);
   const previousSelection = useRef(null);
   const setSelectionOptimized = useCallback(
      (newSelection) => {
         if (areEqual(selection, newSelection)) {
            return;
         }
         previousSelection.current = selection;
         setSelection(newSelection);
      },
      [setSelection, selection]
   );

   return [previousSelection.current, selection, setSelectionOptimized];
}
