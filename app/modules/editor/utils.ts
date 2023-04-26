import { nanoid } from "nanoid";
import type { Operation, Path } from "slate";
import { Editor } from "slate";
import type { Format } from "./types";
import { BlockType } from "./types";
import { Range, Transforms } from "slate";

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

export function toggleLinkAtSelection(editor) {
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

export function isLinkNodeAtSelection(editor: Editor, selection: Selection) {
   if (selection == null) {
      return false;
   }

   return (
      Editor.above(editor, {
         at: selection,
         match: (n) => n.type === "link",
      }) != null
   );
}

function createLinkForRange(editor, range, linkText, linkURL, isInsertion) {
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
