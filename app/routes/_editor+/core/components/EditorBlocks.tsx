/* eslint-disable import/no-cycle */
import { Suspense } from "react";

import { lazily } from "react-lazily";
import { type RenderElementProps, useReadOnly } from "slate-react";
import urlSlug from "url-slug";

import { CustomBlocks } from "~/_custom/blocks";
// import { BlockCodeBlock } from "../../blocks+/codeblock";
// import { BlockEventItem, BlockEvents } from "../../blocks+/events/_events";
import { Loading } from "~/components/Loading";

import {
   BlockEventItemView,
   BlockEventsView,
} from "../../blocks+/events/events-view";
// import { BlockGroup, BlockGroupItem } from "../../blocks+/group/_group";
import {
   BlockGroupItemView,
   BlockGroupView,
} from "../../blocks+/group/group-view";
import { BlockHTMLBlock } from "../../blocks+/htmlblock";
import { BlockImage } from "../../blocks+/image";
import { BlockInfoBox, BlockInfoBoxItem } from "../../blocks+/infobox";
import { BlockInlineAd } from "../../blocks+/inline-ad";
// import { BlockLink } from "../../blocks+/link/_link";
import { BlockLinkView } from "../../blocks+/link/link-view";
import { BlockTabs, BlockTabsItem } from "../../blocks+/tabs/_tabs";
import { BlockToggleBlock } from "../../blocks+/toggleblock";
import { BlockTwoColumn } from "../../blocks+/two-column";
// import { BlockUpdates } from "../../blocks+/updates/_updates";
import { BlockUpdatesView } from "../../blocks+/updates/updates-view";
import { BlockType } from "../types";

const { BlockLink } = lazily(() => import("../../blocks+/link/_link"));
const { BlockGroup, BlockGroupItem } = lazily(
   () => import("../../blocks+/group/_group"),
);
const { BlockCodeBlock } = lazily(() => import("../../blocks+/codeblock"));
const { BlockUpdates } = lazily(() => import("../../blocks+/updates/_updates"));
const { BlockEventItem, BlockEvents } = lazily(
   () => import("../../blocks+/events/_events"),
);

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
      case BlockType.Link: {
         if (readOnly)
            return (
               <BlockLinkView
                  element={element}
                  children={children}
                  attributes={attributes}
               />
            );
         return (
            <BlockLink
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      case BlockType.Updates: {
         if (readOnly)
            return (
               <BlockUpdatesView
                  element={element}
                  children={children}
                  attributes={attributes}
               />
            );
         return (
            <BlockUpdates
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      case BlockType.ToggleBlock: {
         return (
            <BlockToggleBlock
               readOnly={readOnly}
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      case BlockType.Tabs: {
         return (
            <BlockTabs
               readOnly={readOnly}
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      case BlockType.TabsItem: {
         //@ts-ignore
         return (
            <BlockTabsItem
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      case BlockType.TwoColumn: {
         return (
            <BlockTwoColumn
               readOnly={readOnly}
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      case BlockType.Paragraph: {
         return (
            <p className="mb-3" {...attributes}>
               {children}
            </p>
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
      case BlockType.HTMLBlock: {
         return (
            <BlockHTMLBlock
               readOnly={readOnly}
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      case BlockType.InfoBox: {
         return (
            <BlockInfoBox
               readOnly={readOnly}
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      case BlockType.InfoBoxItem: {
         return (
            <BlockInfoBoxItem
               readOnly={readOnly}
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      case BlockType.H2: {
         //@ts-ignore
         const id = urlSlug(element?.children[0]?.text ?? undefined);
         return (
            <h2
               id={id}
               className="mb-2.5 mt-8 dark:shadow-black/30 border-color relative overflow-hidden rounded-lg block
               border-2 font-header text-xl font-bold shadow-sm shadow-zinc-100 dark:bg-dark350
               scroll-mt-44 laptop:scroll-mt-52"
               {...attributes}
            >
               <div
                  className="pattern-dots absolute left-0
                   top-0 -z-0 h-full
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                     pattern-size-4 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
               />
               <div className="relative h-full w-full px-3.5 py-2.5">
                  {children}
               </div>
            </h2>
         );
      }
      case BlockType.H3: {
         //@ts-ignore
         const id = urlSlug(element?.children[0]?.text ?? undefined);
         return (
            <h3
               id={id}
               className="flex items-center gap-3 py-2 font-header text-lg scroll-mt-32 laptop:scroll-mt-16"
               {...attributes}
            >
               <div className="min-w-[10px] flex-none">{children}</div>
               <div
                  contentEditable={false}
                  className="h-0.5 w-full rounded-full bg-zinc-100 dark:bg-dark400"
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
      case BlockType.Events: {
         if (readOnly)
            return (
               <BlockEventsView
                  element={element}
                  children={children}
                  attributes={attributes}
               />
            );
         return (
            <BlockEvents
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      case BlockType.EventItem: {
         if (readOnly)
            return (
               <BlockEventItemView
                  element={element}
                  children={children}
                  attributes={attributes}
               />
            );
         return (
            <BlockEventItem
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      case BlockType.Group: {
         if (readOnly)
            return (
               <BlockGroupView
                  element={element}
                  children={children}
                  attributes={attributes}
               />
            );
         return (
            <BlockGroup
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      case BlockType.GroupItem: {
         if (readOnly)
            return (
               <BlockGroupItemView
                  element={element}
                  children={children}
                  attributes={attributes}
               />
            );
         return (
            <BlockGroupItem
               element={element}
               children={children}
               attributes={attributes}
            />
         );
      }
      case BlockType.Image: {
         return (
            <BlockImage
               element={element}
               children={children}
               attributes={attributes}
            />
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
