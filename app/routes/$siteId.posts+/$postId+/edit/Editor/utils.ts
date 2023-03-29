import { nanoid } from "nanoid";
import type { Operation, Path } from "slate";
import { Editor } from "slate";
import type { Format } from "./types";

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
