import type { Format } from "./types";
import { BlockType } from "./types";

export const HOTKEYS: Record<string, Format> = {
   "mod+b": "bold",
   "mod+i": "italic",
   "mod+u": "underline",
   "mod+s": "strikeThrough",
};

export const LIST_WRAPPER: Record<string, BlockType> = {
   "*": BlockType.BulletedList,
   "-": BlockType.BulletedList,
   "+": BlockType.BulletedList,
   "1.": BlockType.NumberedList,
};

export const SHORTCUTS: Record<string, BlockType> = {
   "*": BlockType.ListItem,
   "-": BlockType.ListItem,
   "+": BlockType.ListItem,
   "1.": BlockType.ListItem,
   "##": BlockType.H2,
   "###": BlockType.H3,
};
