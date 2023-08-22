import type { Editor } from "slate";
import { Element, Range } from "slate";

import { isLink, LINK, wrapLink, tryWrapLink } from "./utils";

export const withLinkify = (editor: Editor) => {
   const { insertData, insertBreak, insertText, isInline } = editor;

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

   return editor;
};
