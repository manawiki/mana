import isHotkey, { isKeyHotkey } from "is-hotkey";
import { Range, Transforms } from "slate";

import { HOTKEYS } from "./constants";
import { toggleMark } from "./utils";

export const onKeyDown = (event, editor) => {
   const { selection } = editor;

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
   }

   //Render mark commands
   for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event as any) && editor.selection) {
         event.preventDefault();
         const mark = HOTKEYS[hotkey];
         toggleMark(editor, mark);
      }
   }
};
