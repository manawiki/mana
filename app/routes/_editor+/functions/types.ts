import type { BaseEditor, BaseOperation } from "slate";
import type { ReactEditor } from "slate-react";

import { type Collection } from "payload/generated-types";

declare module "slate" {
   interface CustomTypes {
      Editor: BaseEditor & ReactEditor;
      Element: CustomElement;
      Text: CustomText;
      Operation: BaseOperation & { isRemote?: boolean };
   }
}

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
   NumberedList = "numbered-list",
   ListItem = "list-item",
   ToDo = "todo",
   Paragraph = "paragraph",
   Image = "image",
   Video = "video",
   CodeSandbox = "codesandbox",
   Link = "link",
   Group = "group",
   Updates = "updates",
   UpdatesInline = "updatesInline",
   Accordion = "accordion",
   Events = "events",
   EventItem = "event-item",
}

export type TextBlock =
   | BlockType.H2
   | BlockType.H3
   | BlockType.Paragraph
   | BlockType.BulletedList
   | BlockType.NumberedList
   | BlockType.ToDo
   | BlockType.Link;

export type BlockElement = {
   id: string;
   children: CustomText[];
};

export type ParagraphElement = BlockElement & {
   type: BlockType.Paragraph;
};

export type HeadingElement = BlockElement & {
   type: BlockType.H2 | BlockType.H3;
};

export type EventItemElement = BlockElement & {
   type: BlockType.EventItem;
   label?: string | null;
   startDate?: string | null;
   endDate?: string | null;
};

export type EventsElement = {
   id: string;
   type: BlockType.Events;
   children: [
      {
         id: string;
         type: BlockType.EventItem;
         children: CustomText[];
      }
   ];
};

export type ListElement = BlockElement & {
   type: BlockType.ListItem;
};

export type NumberedListElement = {
   id: string;
   type: BlockType.NumberedList;
   children: [
      {
         id: string;
         type: BlockType.ListItem;
         children: CustomText[];
      }
   ];
};

export type BulletedListElement = {
   id: string;
   type: BlockType.BulletedList;
   children: [
      {
         id: string;
         type: BlockType.ListItem;
         children: CustomText[];
      }
   ];
};

export type ToDoElement = BlockElement & {
   type: BlockType.ToDo;
   checked: boolean;
};

export type ImageElement = BlockElement & {
   type: BlockType.Image;
   refId: string | null;
   url: string | null;
   children: [{ text: "" }];
};

export type AccordionElement = BlockElement & {
   type: BlockType.Accordion;
   label: string | null;
   isOpen: boolean | undefined;
   children: [{ text: "" }];
};

export type UpdatesElement = BlockElement & {
   type: BlockType.Updates;
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
   icon: {
      url: string | undefined;
   };
   name: string | undefined;
   view: "icon-inline" | undefined;
   children: [{ text: "" }];
};

export interface groupItem {
   id: string;
   isCustomSite?: boolean;
   refId: string;
   label?: string;
   name: string;
   labelColor?: string;
   iconUrl?: string;
   path?: string;
}

export type GroupElement = BlockElement & {
   type: BlockType.Group;
   viewMode: "1-col" | "2-col";
   itemsViewMode: "list" | "grid";
   collection?: Collection["id"];
   groupItems: groupItem[];
   content?: [];
};

export type CustomElement =
   | ParagraphElement
   | HeadingElement
   | BulletedListElement
   | NumberedListElement
   | ToDoElement
   | ImageElement
   | VideoElement
   | CodeSandboxElement
   | LinkElement
   | GroupElement
   | UpdatesElement
   | AccordionElement
   | ListElement
   | EventsElement
   | EventItemElement;

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
