import type { Descendant, Editor } from "slate";
import { Node } from "slate";

import type { WithTableOptions } from "./options";
import { isOfType } from "./utils/is-of-type";

export function withFragments<T extends Editor>(
   editor: T,
   { withFragments }: WithTableOptions,
): T {
   if (!withFragments) {
      return editor;
   }

   const { getFragment } = editor;

   editor.getFragment = () => {
      const newFragment: Descendant[] = [];

      for (const fragment of getFragment()) {
         if (!isOfType(editor, "table")(fragment, [])) {
            newFragment.push(fragment);
            continue;
         }

         for (const [node] of Node.nodes(fragment, {
            pass: ([node]) => isOfType(editor, "content")(node, []),
         })) {
            if (isOfType(editor, "content")(node, [])) {
               //@ts-ignore
               newFragment.push(node);
            }
         }
      }

      return newFragment;
   };

   return editor;
}
