/* eslint-disable import/no-cycle */
import { nanoid } from "nanoid";
import { type RenderElementProps, useReadOnly } from "slate-react";

import { CustomBlocks } from "~/_custom/blocks";

import {
   BlockEventItem,
   BlockEvents,
} from "../$siteId.blocks+/events/_events-edit";
import {
   BlockEventItemView,
   BlockEventsView,
} from "../$siteId.blocks+/events/events-view";
import { BlockGroup } from "../$siteId.blocks+/group/_group";
import { BlockGroupView } from "../$siteId.blocks+/group/BlockGroupView";
import { BlockImage } from "../$siteId.blocks+/image/BlockImage";
import { BlockLink } from "../$siteId.blocks+/link/_link";
import { BlockLinkView } from "../$siteId.blocks+/link/BlockLinkView";
import { BlockUpdates } from "../$siteId.blocks+/updates/_updates";
import { BlockUpdatesView } from "../$siteId.blocks+/updates/BlockUpdatesView";
import { BlockAccordion } from "../blocks//BlockAccordion";
import { BlockCodeSandbox } from "../blocks//BlockCodeSandbox";
import { BlockToDo } from "../blocks//BlockToDo";
import { BlockVideo } from "../blocks/BlockVideo";
import type { CustomElement } from "../functions/types";
import { BlockType } from "../functions/types";

// If new block created when old block selected, create the following block
// Example: create checkbox block, press enter, new unchecked checkbox is created
export const CreateNewBlockFromBlock: Record<string, () => CustomElement> = {
   [BlockType.ToDo]: () => ({
      type: BlockType.ToDo,
      checked: false,
      id: nanoid(),
      children: [],
   }),
};

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
            return <BlockLinkView element={element} children={children} />;
         return <BlockLink element={element} children={children} />;
      }
      case BlockType.Group: {
         if (readOnly) return <BlockGroupView element={element} />;
         return (
            <div {...attributes} contentEditable={false}>
               <BlockGroup element={element} />
               <div style={{ display: "none" }}>{children}</div>
            </div>
         );
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
      case BlockType.Accordion: {
         return (
            <BlockAccordion
               readOnly={readOnly}
               element={element}
               children={children}
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
      case BlockType.H2: {
         return (
            <h2
               {...attributes}
               className="shadow-1 border-color relative mb-2.5 mt-8 overflow-hidden
         rounded-lg border-2 font-header text-xl font-bold shadow-sm shadow-zinc-50"
            >
               <div
                  className="pattern-dots absolute left-0 top-0 -z-0 h-full
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                     pattern-size-4 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
               />
               <div
                  className="absolute left-0 top-0 -z-10 h-full w-full
            bg-gradient-to-r from-zinc-100/40 dark:from-zinc-900/20"
               />
               <div className="relative h-full w-full px-4 py-3">
                  {children}
               </div>
            </h2>
         );
      }
      case BlockType.H3: {
         return (
            <h3 className="flex items-center gap-3 font-header" {...attributes}>
               <div className="min-w-[10px] flex-none">{children}</div>
               <div
                  contentEditable={false}
                  className="h-0.5 w-full rounded-full bg-zinc-100 dark:bg-bg4Dark"
               ></div>
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
         return (
            <BlockEventItem
               element={element}
               children={children}
               {...attributes}
            />
         );
      }
      case BlockType.ToDo: {
         return (
            <div {...attributes}>
               <BlockToDo element={element}>{children}</BlockToDo>
            </div>
         );
      }
      case BlockType.Image: {
         return (
            <div {...attributes} contentEditable={false} className="embed">
               <BlockImage element={element} />
               <div style={{ display: "none" }}>{children}</div>
            </div>
         );
      }
      case BlockType.Video: {
         return (
            <div {...attributes} contentEditable={false} className="embed">
               <BlockVideo element={element} />
               <div style={{ display: "none" }}>{children}</div>
            </div>
         );
      }
      case BlockType.CodeSandbox: {
         return (
            <div {...attributes} contentEditable={false} className="embed">
               <BlockCodeSandbox element={element} />
               <div style={{ display: "none" }}>{children}</div>
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
