/* eslint-disable import/no-cycle */
import { Suspense } from "react";

import { lazily } from "react-lazily";
import { type RenderElementProps, useReadOnly } from "slate-react";
import urlSlug from "url-slug";

import { CustomBlocks } from "~/_custom/blocks";
import { Loading } from "~/components/Loading";
import { TableHead } from "~/components/Table";

import { BlockEmbed } from "../../blocks+/embed";
import { BlockEventItem, BlockEvents } from "../../blocks+/events/_events";
import {
   BlockEventItemView,
   BlockEventsView,
} from "../../blocks+/events/events-view";
import { BlockGroup, BlockGroupItem } from "../../blocks+/group/_group";
import {
   BlockGroupItemView,
   BlockGroupView,
} from "../../blocks+/group/group-view";
import { BlockHTMLBlock } from "../../blocks+/htmlblock";
import { BlockImage } from "../../blocks+/image/_image";
import { BlockImageView } from "../../blocks+/image/BlockImageView";
import { BlockInfoBox, BlockInfoBoxItem } from "../../blocks+/infobox";
import { BlockInlineAd } from "../../blocks+/inline-ad";
import { BlockLink } from "../../blocks+/link/_link";
import { BlockLinkView } from "../../blocks+/link/link-view";
import {
   BlockTable,
   BlockTableBody,
   BlockTableCell,
   BlockTableHeaderCell,
   BlockTableRow,
} from "../../blocks+/table/_table";
import {
   BlockTableView,
   BlockTableHeaderCellView,
   BlockTableCellView,
} from "../../blocks+/table/TableView";
import { BlockTabs, BlockTabsItem } from "../../blocks+/tabs/_tabs";
import { BlockToggleBlock } from "../../blocks+/toggleblock";
import { BlockTwoColumn } from "../../blocks+/two-column";
import { BlockUpdatesView } from "../../blocks+/updates/updates-view";
import { BlockType } from "../types";

//@ts-ignore
const { BlockCodeBlock } = lazily(() => import("../../blocks+/codeblock"));
//@ts-ignore
const { BlockUpdates } = lazily(() => import("../../blocks+/updates/_updates"));

// Note: {children} must be rendered in every element otherwise bugs occur
// https://docs.slatejs.org/api/nodes/element#rendering-void-elements
// https://github.com/ianstormtaylor/slate/issues/3930
export function EditorBlocks({
   element,
   children,
   attributes,
}: RenderElementProps) {
   const readOnly = useReadOnly();

   switch (element.type) {
      case BlockType.Paragraph: {
         return (
            <p className="mb-3" {...attributes}>
               {children}
            </p>
         );
      }
      case BlockType.H2: {
         //@ts-ignore
         const id = urlSlug(element?.children[0]?.text ?? undefined);
         return (
            <h2
               id={id}
               className="mt-6 flex items-center text-lg scroll-mt-20 relative overflow-hidden pb-0 font-header pl-2.5 mb-3 leading-0"
               {...attributes}
            >
               <span
                  contentEditable={false}
                  className="h-full w-1 select-none bg-zinc-400 dark:bg-zinc-500 absolute left-0 rounded-full border-zinc-300 dark:border-zinc-500 z-20"
               />
               <span className="bg-zinc-50 dark:bg-dark450 px-2.5 overflow-hidden py-1.5 flex-grow rounded-lg border-2 border-color-sub border-zinc-200 relative shadow-sm dark:shadow-zinc-800/70 shadow-zinc-50">
                  <span className="z-10 relative">{children}</span>
                  <div
                     contentEditable={false}
                     className="pattern-dots absolute left-0
                     top-0 z-0 h-full
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                     pattern-size-2 dark:pattern-zinc-400 dark:pattern-bg-bg3Dark"
                  />
               </span>
            </h2>
         );
      }
      case BlockType.H3: {
         //@ts-ignore
         const id = urlSlug(element?.children[0]?.text ?? undefined);
         return (
            <h3
               id={id}
               className="dark:text-zinc-100 mt-8 mb-3 px-2.5 leading-7 dark:bg-dark450/60 bg-zinc-50 block shadow-sm dark:shadow-zinc-800/70 border-zinc-200
            font-header relative text-lg scroll-mt-20 rounded-lg py-1.5 overflow-hidden border-2 dark:border-zinc-600/60 shadow-zinc-50"
               {...attributes}
            >
               <span className="z-10 relative">{children}</span>
               <div
                  contentEditable={false}
                  className="pattern-dots absolute left-0 top-0 z-0 h-full
               w-full pattern-bg-white pattern-zinc-400 dark:pattern-zinc-400 pattern-opacity-10 
               pattern-size-1  dark:pattern-bg-bg3Dark"
               />
            </h3>
         );
      }
      case BlockType.BulletedList: {
         return (
            <ul className="editor-ul" {...attributes}>
               {children}
            </ul>
         );
      }
      case BlockType.NumberedList: {
         return (
            <ol className="editor-ol" {...attributes}>
               {children}
            </ol>
         );
      }
      case BlockType.ListItem: {
         return <li {...attributes}>{children}</li>;
      }
      case BlockType.Link: {
         if (readOnly)
            return <BlockLinkView element={element} children={children} />;
         return <BlockLink element={element} children={children} />;
      }
      case BlockType.Updates: {
         if (readOnly) return <BlockUpdatesView element={element} />;
         return (
            <div {...attributes} contentEditable={false}>
               <BlockUpdates element={element} />
               <div style={{ display: "none" }}>{children}</div>
            </div>
         );
      }
      case BlockType.ToggleBlock: {
         return (
            <BlockToggleBlock
               readOnly={readOnly}
               element={element}
               children={children}
            />
         );
      }
      case BlockType.Tabs: {
         return (
            <BlockTabs
               readOnly={readOnly}
               element={element}
               children={children}
            />
         );
      }
      case BlockType.TabsItem: {
         //@ts-ignore
         return <BlockTabsItem element={element} children={children} />;
      }
      case BlockType.TwoColumn: {
         return (
            <BlockTwoColumn
               readOnly={readOnly}
               element={element}
               children={children}
            />
         );
      }
      case BlockType.CodeBlock: {
         return (
            <Suspense fallback={<Loading />}>
               <BlockCodeBlock
                  readOnly={readOnly}
                  element={element}
                  children={children}
                  attributes={attributes}
               />
            </Suspense>
         );
      }
      case BlockType.Embed: {
         return (
            <BlockEmbed
               readOnly={readOnly}
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      case BlockType.HTMLBlock: {
         return (
            <BlockHTMLBlock
               readOnly={readOnly}
               element={element}
               children={children}
               {...attributes}
            />
         );
      }
      case BlockType.InfoBox: {
         return (
            <BlockInfoBox
               readOnly={readOnly}
               element={element}
               children={children}
               {...attributes}
            />
         );
      }
      case BlockType.InfoBoxItem: {
         return (
            <BlockInfoBoxItem
               readOnly={readOnly}
               element={element}
               {...attributes}
            />
         );
      }
      case BlockType.Events: {
         if (readOnly)
            return (
               <BlockEventsView
                  element={element}
                  children={children}
                  {...attributes}
               />
            );
         return (
            <BlockEvents
               element={element}
               children={children}
               {...attributes}
            />
         );
      }
      case BlockType.EventItem: {
         if (readOnly)
            return (
               <BlockEventItemView
                  element={element}
                  children={children}
                  {...attributes}
               />
            );
         return <BlockEventItem element={element} {...attributes} />;
      }
      case BlockType.Group: {
         if (readOnly)
            return (
               <BlockGroupView
                  element={element}
                  children={children}
                  {...attributes}
               />
            );
         return (
            <BlockGroup element={element} children={children} {...attributes} />
         );
      }
      case BlockType.GroupItem: {
         if (readOnly) return <BlockGroupItemView element={element} />;
         return (
            <BlockGroupItem
               element={element}
               children={children}
               {...attributes}
            />
         );
      }
      case BlockType.Image: {
         if (readOnly)
            return (
               <BlockImageView
                  element={element}
                  children={children}
                  {...attributes}
               />
            );
         return (
            <BlockImage element={element} children={children} {...attributes} />
         );
      }
      case BlockType.InlineAd: {
         return (
            <div contentEditable={false}>
               <BlockInlineAd element={element} {...attributes} />
               <div className="hidden">{children}</div>
            </div>
         );
      }
      case BlockType.Table:
         if (readOnly) {
            return (
               <BlockTableView
                  children={children}
                  element={element}
                  attributes={attributes}
               />
            );
         }
         return (
            <BlockTable
               children={children}
               element={element}
               attributes={attributes}
            />
         );
      case BlockType.TableContent: {
         return children;
      }
      case BlockType.TableHead:
         return <TableHead {...attributes}>{children}</TableHead>;
      case BlockType.TableBody:
         return (
            <BlockTableBody
               children={children}
               element={element}
               attributes={attributes}
            />
         );
      case BlockType.TableFooter:
         return <tfoot {...attributes}>{children}</tfoot>;
      case BlockType.TableRow:
         return (
            <BlockTableRow
               children={children}
               element={element}
               attributes={attributes}
            />
         );
      case BlockType.TableHeaderCell:
         if (readOnly) {
            return (
               <BlockTableHeaderCellView
                  children={children}
                  element={element}
                  attributes={attributes}
               />
            );
         }
         return (
            <BlockTableHeaderCell
               attributes={attributes}
               children={children}
               element={element}
            />
         );
      case BlockType.TableCell:
         if (readOnly) {
            return (
               <BlockTableCellView
                  children={children}
                  element={element}
                  attributes={attributes}
               />
            );
         }
         return (
            <BlockTableCell
               attributes={attributes}
               children={children}
               element={element}
            />
         );
      default:
         //Check if any custom blocks to render
         return (
            <CustomBlocks
               element={element}
               children={children}
               attributes={attributes}
            />
         );
   }
}
