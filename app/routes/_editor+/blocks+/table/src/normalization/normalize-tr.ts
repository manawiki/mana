import type { Element } from "slate";
import { Editor, Node, Transforms } from "slate";

import type { WithTableOptions } from "../options";
import { isElement } from "../utils/is-element";
import { isOfType } from "../utils/is-of-type";

/**
 * Normalizes the `tr` node by wrapping each of its child nodes within a td or th
 * element, depending on whether the row is inside the thead section or not.
 */
export function normalizeTr<T extends Editor>(
   editor: T,
   { blocks: { tr, td, th } }: WithTableOptions,
): T {
   const { normalizeNode } = editor;

   editor.normalizeNode = (entry, options) => {
      const [node, path] = entry;
      if (isElement(node) && node.type === tr) {
         for (const [child, childPath] of Node.children(editor, path)) {
            if (!isElement(child) || (child.type !== td && child.type !== th)) {
               const [thead] = Editor.nodes(editor, {
                  match: isOfType(editor, "thead"),
                  at: path,
               });

               return Transforms.wrapNodes(
                  editor,
                  {
                     type: thead ? th : td,
                     children: [child],
                  } as Element,
                  { at: childPath },
               );
            }
         }
      }

      normalizeNode(entry, options);
   };

   return editor;
}
