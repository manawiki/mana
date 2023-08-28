import { Editor, Transforms, Range } from "slate";

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

export const liftNodes = (editor: Editor) => {
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
