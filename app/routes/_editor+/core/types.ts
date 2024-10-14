import type { BaseEditor, BaseOperation, Descendant } from "slate";
import type { ReactEditor } from "slate-react";

import type { Site, Collection } from "payload/generated-types";
import type { Time } from "~/routes/_site+/_components/_datepicker/time-picker/types";

interface Editors extends BaseEditor, ReactEditor {}

declare module "slate" {
   interface CustomTypes {
      Editor: Editors;
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
   HTMLBlock = "html-block",
   InlineAd = "inline-ad",
   InfoBox = "info-box",
   InfoBoxItem = "info-box-item",
   Embed = "embed",
   Table = "table",
   TableHead = "table-head",
   TableBody = "table-body",
   TableFooter = "table-footer",
   TableHeaderCell = "header-cell",
   TableRow = "table-row",
   TableCell = "table-cell",
   TableContent = "table-content",
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

export interface ParagraphElement extends BlockElement {
   type: BlockType.Paragraph;
}

export interface CodeBlockElement extends BlockElement {
   type: BlockType.CodeBlock;
   value?: string;
}

export interface HTMLBlockElement extends BlockElement {
   type: BlockType.HTMLBlock;
   value?: string;
}

export type InfoBoxElement = {
   id: string;
   type: BlockType.InfoBox;
   children: [InfoBoxItemElement];
};

export interface InfoBoxItemElement extends BlockElement {
   type: BlockType.InfoBoxItem;
   infoBoxLeftContent?: [Descendant];
   infoBoxRightContent?: [Descendant];
}

export interface InlineAdElement extends BlockElement {
   type: BlockType.InlineAd;
}

export interface HeadingElement extends BlockElement {
   type: BlockType.H2 | BlockType.H3;
}

export interface GroupItemElement extends BlockElement {
   isCustomSite?: boolean;
   siteId: Site["slug"];
   type: BlockType.GroupItem;
   refId: string;
   label?: string;
   name: string;
   labelColor?: string;
   iconUrl?: string;
   path?: string;
   isPost?: boolean;
   subtitle?: string;
   groupContent?: [Descendant];
}

export type GroupElement = {
   id: string;
   type: BlockType.Group;
   itemsViewMode: "list" | "grid";
   collection?: Collection["id"];
   children: [GroupItemElement];
};

export interface EventItemElement extends BlockElement {
   type: BlockType.EventItem;
   label?: string | null;
   startDate?: Date | null;
   startTime?: Time;
   startTimestamp?: Date | null;
   endDate?: Date | null;
   endTime?: Time;
   endTimestamp?: Date | null;
   eventContent?: [Descendant];
}

export type EventsElement = {
   id: string;
   type: BlockType.Events;
   children: [EventItemElement];
};

export interface TabsItemElement extends BlockElement {
   type: BlockType.TabsItem;
   tabContent?: [Descendant];
}

export type TabsElement = {
   id: string;
   type: BlockType.Tabs;
   tabs: string[];
   children: [TabsItemElement];
};

export interface ListElement extends BlockElement {
   type: BlockType.ListItem;
}

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

export interface EmbedElement extends BlockElement {
   type: BlockType.Embed;
   postUrl: string | undefined;
   imageUrl: string | undefined;
   title: string | undefined;
   description: string | undefined;
}

export interface ImageElement extends BlockElement {
   type: BlockType.Image;
   refId: string | null;
   url: string | null;
   containerWidth: number | null;
   caption: boolean | undefined;
   children: [{ text: "" }];
}

export interface ToggleBlockElement extends BlockElement {
   type: BlockType.ToggleBlock;
   isOpen: boolean | undefined;
   children: [{ text: "" }];
   toggleBlockContent?: [Descendant];
}

export interface TwoColumnElement extends BlockElement {
   type: BlockType.TwoColumn;
   columnOneContent?: [Descendant];
   columnTwoContent?: [Descendant];
}

export interface UpdatesElement extends BlockElement {
   type: BlockType.Updates;
}

export interface LinkElement extends BlockElement {
   type: BlockType.Link;
   url: string | undefined;
   icon: {
      url: string | undefined;
   };
   name: string | undefined;
   view: "icon-inline" | "icon-block" | undefined;
   enableTooltip: boolean | undefined;
   removeCircleBorder: boolean | undefined;
   hideLinkText: boolean | undefined;
   iconWidth: number | undefined;
   children: [{ text: "" }];
}

export interface TableElement {
   id: string;
   type: BlockType.Table;
   tableLayout: "auto" | "fixed";
   tableStyle: "rounded" | "default";
   children: Array<
      BlockType.TableHead | BlockType.TableBody | BlockType.TableFooter
   >;
}

export interface TableHeadElement {
   type: BlockType.TableHead;
   children: TableRowElement[];
}

export interface TableBodyElement {
   type: BlockType.TableBody;
   children: TableRowElement[];
}

export interface TableFooterElement {
   type: BlockType.TableFooter;
   children: TableRowElement[];
}

export interface TableRowElement {
   type: BlockType.TableRow;
   children: Array<TableCellElement | TableHeaderCellElement>;
}

export interface TableHeaderCellElement {
   type: BlockType.TableHeaderCell;
   rowSpan?: number;
   colSpan?: number;
   align?: "left" | "center" | "right" | undefined;
   children: CustomText[];
}

export interface TableCellElement {
   type: BlockType.TableCell;
   rowSpan?: number;
   colSpan?: number;
   align?: "left" | "center" | "right" | undefined;
   children: CustomText[];
}

export interface TableContentElement {
   type: BlockType.TableContent;
   children: CustomText[];
}

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
   | HTMLBlockElement
   | InlineAdElement
   | InfoBoxElement
   | InfoBoxItemElement
   | EmbedElement
   | TableElement
   | TableHeadElement
   | TableBodyElement
   | TableFooterElement
   | TableHeaderCellElement
   | TableRowElement
   | TableCellElement
   | TableContentElement;

export type CustomText = {
   text: string;
   link?: boolean;
   bold?: boolean;
   italic?: boolean;
   underline?: boolean;
   strikeThrough?: boolean;
   small?: boolean;
   color?: string;
};

export type Format =
   | "bold"
   | "underline"
   | "strikeThrough"
   | "italic"
   | "small";
