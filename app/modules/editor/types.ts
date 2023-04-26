import type { LiveList } from "@liveblocks/client";
import type { BaseEditor, BaseOperation } from "slate";
import type { ReactEditor } from "slate-react";

declare module "slate" {
   interface CustomTypes {
      Editor: BaseEditor & ReactEditor;
      Element: CustomElement;
      Text: CustomText;
      Operation: BaseOperation & { isRemote?: boolean };
   }
}

export type Presence = {
   selectedBlockId: string | null;
};

export type Storage = {
   blocks: LiveList<CustomElement>;
};

export type UserMeta = {
   id: string;
   info: {
      name: string;
      avatar: string;
   };
};

export enum BlockType {
   Title = "title",
   H2 = "h2",
   H3 = "h3",
   BulletedList = "bulleted-list",
   ToDo = "todo",
   Paragraph = "paragraph",
   Image = "image",
   Video = "video",
   CodeSandbox = "codesandbox",
   Link = "link",
}

export type TextBlock =
   | BlockType.H2
   | BlockType.H3
   | BlockType.Paragraph
   | BlockType.BulletedList
   | BlockType.ToDo
   | BlockType.Link;

export type BlockElement = {
   id: string;
   children: CustomText[];
   createdBy?: number;
};

export type ParagraphElement = BlockElement & {
   type: BlockType.Paragraph;
};

export type HeadingElement = BlockElement & {
   type: BlockType.H2 | BlockType.H3;
};

export type ListElement = BlockElement & {
   type: BlockType.BulletedList;
};

export type ToDoElement = BlockElement & {
   type: BlockType.ToDo;
   checked: boolean;
};

export type ImageElement = BlockElement & {
   type: BlockType.Image;
   url: string | null;
   alt: string | null;
   children: [{ text: "" }];
};

export type VideoElement = BlockElement & {
   type: BlockType.Video;
   url: string | null;
   children: [{ text: "" }];
};

export type CodeSandboxElement = BlockElement & {
   type: BlockType.CodeSandbox;
   url: string | null;
   children: [{ text: "" }];
};

export type LinkElement = BlockElement & {
   type: BlockType.Link;
   url: string | undefined;
   children: [{ text: "" }];
};

export type CustomElement =
   | ParagraphElement
   | HeadingElement
   | ListElement
   | ToDoElement
   | ImageElement
   | VideoElement
   | CodeSandboxElement
   | LinkElement;

export type CustomText = {
   text: string;
   link?: boolean;
   bold?: boolean;
   italic?: boolean;
   underline?: boolean;
   strikeThrough?: boolean;
} & LeafDecoration;

type LeafDecoration = {
   placeholder?: string;
};

export type Format = "bold" | "underline" | "strikeThrough" | "italic";
