import { useMemo } from "react";

import { nanoid } from "nanoid";
import type { Operation } from "slate";
import { Editor, Transforms, Range, Element, Point, createEditor } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";

import { LIST_WRAPPER, SHORTCUTS } from "./constants";
import { withLinkify } from "./plugins/link/withLinkify";
import { withLists } from "./plugins/list/withLists";
import type { CustomElement, ParagraphElement } from "./types";
import { BlockType } from "./types";
import { withTable } from "../blocks+/table/src/with-table";

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

   //Break to paragraph if element is H2 or H3
   editor.insertBreak = () => {
      const { selection } = editor;

      if (selection) {
         const [title] = Editor.nodes(editor, {
            match: (n: any) =>
               !Editor.isEditor(n) &&
               Element.isElement(n) &&
               (n.type === BlockType.H2 || n.type === BlockType.H3),
         });

         if (title) {
            Transforms.insertNodes(editor, {
               id: nanoid(),
               children: [{ text: "" }],
               type: BlockType.Paragraph,
            });
            return;
         }
      }
      insertBreak();
   };

   return editor;
}

export function withLayout(editor: Editor) {
   const { normalizeNode } = editor;

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

   editor.normalizeNode = ([node, path]) => {
      // Make sure the document always contains a paragraph
      if (path.length === 0) {
         insertParagraphIfMissing(editor);
      }
      return normalizeNode([node, path]);
   };

   return editor;
}

export function withShortcuts(editor: Editor) {
   const { deleteBackward, insertText } = editor;

   editor.insertText = (text) => {
      const { selection } = editor;

      if (text.endsWith(" ") && selection && Range.isCollapsed(selection)) {
         const { anchor } = selection;
         const block = Editor.above(editor, {
            match: (n) => Editor.isBlock(editor, n),
         });
         const path = block ? block[1] : [];
         const start = Editor.start(editor, path);
         const range = { anchor, focus: start };
         const beforeText = Editor.string(editor, range) + text.slice(0, -1);
         const type = SHORTCUTS[beforeText];
         if (type) {
            Transforms.select(editor, range);

            if (!Range.isCollapsed(range)) {
               Transforms.delete(editor);
            }
            const newProperties: Partial<CustomElement> = {
               type,
            };
            Transforms.setNodes<Element>(editor, newProperties, {
               match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
            });

            if (type === BlockType.ListItem) {
               const list = {
                  id: nanoid(),
                  type: LIST_WRAPPER[beforeText],
                  children: [],
               };
               Transforms.wrapNodes(editor, list, {
                  match: (n) => n.type === BlockType.ListItem,
               });
            }

            return;
         }
      }

      insertText(text);
   };

   editor.deleteBackward = (...args: unknown[]) => {
      const { selection } = editor;

      if (selection && Range.isCollapsed(selection)) {
         const match = Editor.above(editor, {
            match: (n: any) => Editor.isBlock(editor, n),
         });

         if (match) {
            const [block, path] = match;
            const start = Editor.start(editor, path);

            if (
               !Editor.isEditor(block) &&
               Element.isElement(block) &&
               block.type !== BlockType.Paragraph &&
               Point.equals(selection.anchor, start)
            ) {
               const newProperties: Partial<CustomElement> = {
                  type: BlockType.Paragraph,
               };
               Transforms.setNodes(editor, newProperties);
               if (block.type === BlockType.ListItem) {
                  Transforms.unwrapNodes(editor, {
                     match: (n: any) =>
                        n.type === BlockType.BulletedList ||
                        n.type === BlockType.NumberedList,
                     split: true,
                  });
               }
               return;
            }
         }

         // @ts-ignore
         deleteBackward(...args);
      }
   };

   return editor;
}

//Editor Hook
export const useEditor = () =>
   useMemo(
      () =>
         withTable(
            withLists(
               withShortcuts(
                  withNodeId(
                     withLayout(
                        withLinkify(withReact(withHistory(createEditor()))),
                     ),
                  ),
               ),
            ),
            {
               blocks: {
                  table: BlockType.Table,
                  thead: BlockType.TableHead,
                  tbody: BlockType.TableBody,
                  tfoot: BlockType.TableFooter,
                  tr: BlockType.TableRow,
                  th: BlockType.TableHeaderCell,
                  td: BlockType.TableCell,
                  content: BlockType.Paragraph,
               },
            },
         ),
      [],
   );
