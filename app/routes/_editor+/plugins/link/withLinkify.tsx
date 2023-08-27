import type { Editor } from "slate";
import { Element, Range, Transforms, Node } from "slate";

import { isLink, LINK, wrapLink, tryWrapLink } from "./utils";

export const withLinkify = (editor: Editor) => {
   const { insertData, insertBreak, insertText, isInline, normalizeNode } =
      editor;

   editor.isInline = (element) =>
      Element.isElementType(element, LINK) || isInline(element);

   editor.insertBreak = () => {
      if (Range.isCollapsed(editor.selection)) {
         tryWrapLink(editor);
      }
      insertBreak();
   };

   editor.insertText = (text) => {
      if (
         [" ", ",", "."].includes(text) &&
         Range.isCollapsed(editor.selection)
      ) {
         tryWrapLink(editor);
      } else if (isLink(text)) {
         wrapLink(editor, text);
      }
      insertText(text);
   };

   editor.insertData = (data) => {
      const text = data.getData("text/plain");

      // For pasting links, but we ignore it if snippet contains html.
      if (!data.types.includes("text/html") && text && isLink(text)) {
         wrapLink(editor, text);
      } else {
         insertData(data);
      }
   };

   //If child field is empty, we remove the link node as well. Otherwise an empty orphaned link node will remain.
   editor.normalizeNode = (entry) => {
      const [node, path] = entry;

      if (Element.isElement(node) && node.type === "paragraph") {
         const children = Array.from(Node.children(editor, path));
         for (const [child, childPath] of children) {
            // remove link nodes whose text value is empty string.
            // empty text links happen when you move from link to next line or delete link line.
            if (
               Element.isElement(child) &&
               child.type === "link" &&
               child.children[0].text === ""
            ) {
               Transforms.removeNodes(editor, { at: childPath });
               return;
            }
         }
      }
      // Fall back to the original `normalizeNode` to enforce other constraints.
      normalizeNode(entry);
   };

   return editor;
};
