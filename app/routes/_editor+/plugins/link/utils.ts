import LinkifyIt from "linkify-it";
import { Editor, Element, Range, Transforms } from "slate";
import tlds from "tlds";

import type { CustomElement } from "~/routes/_editor+/functions/types";

export const LINK = "link" as const;

const isLinkifyElement = (element: CustomElement) =>
   Element.isElementType(element, LINK);

const linkify = LinkifyIt();

linkify.tlds(tlds);
linkify.tlds(tlds);

//If in link edit mode, double space will exit you out.
export function moveCursorOut(editor: Editor) {
   const { selection } = editor;

   // check that there is a current selection without highlight
   if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
         match: (n) => n.type === "link",
      });

      // check that there was a match
      if (match) {
         Transforms.move(editor, { unit: "offset" });
      }
   }
}

/**
 * If text contains something similar to link `true` will be returned
 */
export const isLink = (text: string): boolean => linkify.test(text);

export function isLinkActive(editor: Editor) {
   const [link] = Editor.nodes(editor, {
      match: isLinkifyElement,
   });
   return !!link;
}

/**
 * We additionally want to return isEdit flag to upper function
 */
function isEditLink(editor: Editor): boolean {
   if (isLinkActive(editor)) {
      unwrapLink(editor);
      return true;
   }
   return false;
}

/**
 * Remove `link` inline from the current caret position
 */
export function unwrapLink(editor: Editor): void {
   const [link] = Editor.nodes(editor, {
      match: isLinkifyElement,
   });
   // we need to select all link text for case when selection is collapsed. In
   // that case we re-create new link for the same text
   Transforms.select(editor, link[1]);
   Transforms.unwrapNodes(editor, {
      match: isLinkifyElement,
   });
}

/**
 * Wrap underlying text into `link` inline
 */
export function wrapLink(editor: Editor, text: string): void {
   const isEdit = isEditLink(editor);
   const isExpanded = Range.isExpanded(editor.selection);

   const link = {
      type: LINK,
      url: text,
      children: isExpanded || isEdit ? [] : [{ text }],
   };

   // if this is a link editing, we shouldn't rename it even if it is not selected
   if (isExpanded || isEdit) {
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: "end" });
      Transforms.move(editor, { distance: 1, unit: "offset" });
   } else {
      Transforms.insertNodes(editor, link);
   }
}

export function insertLink(editor: Editor, url: string): void {
   if (editor.selection) {
      wrapLink(editor, url);
   }
}

/**
 * We are trying to detect links while user typing
 */
export function tryWrapLink(editor: Editor): void {
   /**
    * Find the underlying word under selection
    */
   const getWordUnderCaret = (
      text: string,
      selection: Range
   ): [string, number] => {
      const start = Range.isForward(selection)
         ? selection.anchor
         : selection.focus;
      const wordBeginningOffset = traverseBehind(start.offset, text);
      return [
         text.slice(wordBeginningOffset, start.offset),
         wordBeginningOffset,
      ];
   };

   const { selection } = editor;
   const [start] = Range.edges(selection);
   const [word, wordAnchorOffset] = getWordUnderCaret(
      Editor.string(editor, start.path),
      selection
   );

   // too short word. Probably not the link
   if (word.length < 3) {
      return;
   }

   const links = linkify.match(word);

   if (!links) {
      return;
   }

   // first link will be enough
   const [link] = links;

   if (!link) {
      return;
   }

   Transforms.select(editor, {
      anchor: {
         path: start.path,
         offset: wordAnchorOffset + link.index,
      },
      focus: {
         path: start.path,
         offset: wordAnchorOffset + link.lastIndex,
      },
   });
   const linkWithSSL = `https://${link.text}`;
   wrapLink(editor, linkWithSSL);
}

/**
 * Find the word beginning
 * @param {number} index - current search position
 * @param {string} text
 * @return {number} word beginning position
 */
function traverseBehind(index: number, text: string): number {
   if (index > 0 && !isWhitespace(text[index - 1])) {
      return traverseBehind(index - 1, text);
   }
   return index;
}

/**
 * Whitespace checker
 */
function isWhitespace(value: string): boolean {
   return /[ \f\n\r\t\v\u00A0\u2028\u2029]/.test(value);
}
