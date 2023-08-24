// From https://github.com/York-IE-Labs/slate-lists

import { Editor, Point, Transforms, Range } from "slate";

import { liftNodes } from "./utils";

export const withLists = (editor: Editor) => {
   const { insertBreak, deleteBackward } = editor;

   const backspace = (callback: any) => {
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
