import isHotkey, { isKeyHotkey } from "is-hotkey";
import { nanoid } from "nanoid";
import type { Path, Node } from "slate";
import { Editor, Transforms, Range } from "slate";

import { HOTKEYS } from "./constants";
import { indentItem, undentItem } from "./plugins/list/utils";
import { BlockType, type CustomElement, type Format } from "./types";

//Helpers
export function topLevelPath(path: Path): Path {
   return [path[0]!];
}

export function initialValue(): CustomElement[] {
   const id = nanoid();
   return [
      {
         id,
         type: BlockType.Paragraph,
         children: [{ text: " " }],
      },
   ];
}
export function isNodeWithId(editor: Editor, id: string) {
   //@ts-ignore
   return (node: Node) => Editor.isBlock(editor, node) && node.id === id;
}

//Hot keys
export function onKeyDown(event: any, editor: Editor) {
   const { selection } = editor;

   // Default left/right behavior is unit:'character'. Used to escape links
   // This fails to distinguish between two cursor positions, such as
   // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
   // Here we modify the behavior to unit:'offset'.
   // This lets the user step into and out of the inline without stepping over characters.
   // You may wish to customize this further to only use unit:'offset' in specific cases.
   if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = event;
      if (isKeyHotkey("left", nativeEvent)) {
         event.preventDefault();
         Transforms.move(editor, { unit: "offset", reverse: true });
         return;
      }
      if (isKeyHotkey("right", nativeEvent)) {
         event.preventDefault();
         Transforms.move(editor, { unit: "offset" });
         return;
      }
      //UL and OL key logic
      if (isKeyHotkey("shift+tab", nativeEvent)) {
         // attempt to un-indent on shift+tab within list
         event.preventDefault();
         undentItem(editor);
      } else if (isKeyHotkey("tab", nativeEvent)) {
         // attempt to indent on tab within list
         event.preventDefault();
         indentItem(editor);
      }
   }

   //Render mark commands
   for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event as any) && editor.selection) {
         event.preventDefault();
         const mark = HOTKEYS[hotkey];
         if (mark) toggleMark(editor, mark);
      }
   }
}

//Marks
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
