import type { BaseEditor, BaseOperation, Descendant } from "slate";
import type { ReactEditor } from "slate-react";

import type { Site, Collection } from "payload/generated-types";
import type { Time } from "~/components/datepicker/time-picker/types";

declare module "slate" {
   interface CustomTypes {
      Editor: BaseEditor & ReactEditor;
      Element: CustomElement;
      Text: CustomText;
      Operation: BaseOperation & { isRemote?: boolean };
   }
}

export enum BlockType {
   H2 = "h2",
   H3 = "h3",
   BulletedList = "bulleted-list",
   NumberedList = "numbered-list",
   ListItem = "list-item",
   Paragraph = "paragraph",
   Image = "image",
   Link = "link",
   Group = "group",
   GroupItem = "group-item",
   Updates = "updates",
   ToggleBlock = "toggle-block",
   Tabs = "tabs",
   TabsItem = "tabs-item",
   Events = "events",
   EventItem = "event-item",
   TwoColumn = "two-column",
   CodeBlock = "code-block",
   InlineAd = "inline-ad",
}

export type TextBlock =
   | BlockType.H2
   | BlockType.H3
   | BlockType.Paragraph
   | BlockType.BulletedList
   | BlockType.NumberedList
   | BlockType.Link;

export type BlockElement = {
   id: string;
   children: CustomText[];
};

export type ParagraphElement = BlockElement & {
   type: BlockType.Paragraph;
};

export type CodeBlockElement = BlockElement & {
   type: BlockType.CodeBlock;
   value: string;
};

export type InlineAdElement = BlockElement & {
   type: BlockType.InlineAd;
};

export type HeadingElement = BlockElement & {
   type: BlockType.H2 | BlockType.H3;
};
export type GroupItemElement = BlockElement & {
   isCustomSite?: boolean;
   siteId: Site["slug"];
   type: BlockType.GroupItem;
   refId: string;
   label?: string;
   name: string;
   labelColor?: string;
   iconUrl?: string;
   path?: string;
   groupContent?: [Descendant];
};

export type GroupElement = {
   id: string;
   type: BlockType.Group;
   itemsViewMode: "list" | "grid";
   collection?: Collection["id"];
   children: [GroupItemElement];
};

export type EventItemElement = BlockElement & {
   type: BlockType.EventItem;
   label?: string | null;
   startDate?: Date | null;
   startTime?: Time;
   startTimestamp?: Date | null;
   endDate?: Date | null;
   endTime?: Time;
   endTimestamp?: Date | null;
   eventContent?: [Descendant];
};

export type EventsElement = {
   id: string;
   type: BlockType.Events;
   children: [EventItemElement];
};

export type TabsItemElement = BlockElement & {
   type: BlockType.TabsItem;
   tabContent?: [Descendant];
};

export type TabsElement = {
   id: string;
   type: BlockType.Tabs;
   tabs: string[];
   children: [TabsItemElement];
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
      },
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
      },
   ];
};

export type ImageElement = BlockElement & {
   type: BlockType.Image;
   refId: string | null;
   url: string | null;
   children: [{ text: "" }];
};

export type ToggleBlockElement = BlockElement & {
   type: BlockType.ToggleBlock;
   isOpen: boolean | undefined;
   children: [{ text: "" }];
   toggleBlockContent?: [Descendant];
};

export type TwoColumnElement = BlockElement & {
   type: BlockType.TwoColumn;
   columnOneContent?: [Descendant];
   columnTwoContent?: [Descendant];
};

export type UpdatesElement = BlockElement & {
   type: BlockType.Updates;
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

export type CustomElement =
   | ParagraphElement
   | HeadingElement
   | BulletedListElement
   | NumberedListElement
   | ImageElement
   | LinkElement
   | UpdatesElement
   | ToggleBlockElement
   | TabsElement
   | TabsItemElement
   | ListElement
   | GroupElement
   | GroupItemElement
   | EventsElement
   | EventItemElement
   | TwoColumnElement
   | CodeBlockElement
   | InlineAdElement;

export type CustomText = {
   text: string;
   link?: boolean;
   bold?: boolean;
   italic?: boolean;
   underline?: boolean;
   strikeThrough?: boolean;
};

export type Format = "bold" | "underline" | "strikeThrough" | "italic";
