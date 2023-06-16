import { type RenderElementProps, useReadOnly } from "slate-react";
import { DefaultElement } from "slate-react";
import BlockImage from "./BlockImage";
import BlockVideo from "./BlockVideo";
import BlockCodeSandbox from "./BlockCodeSandbox";
import type { CustomElement } from "../types";
import { BlockType } from "../types";
import BlockToDo from "./BlockToDo";
import BlockList from "./BlockList";
import { nanoid } from "nanoid";
import BlockLink from "./BlockLink";
import BlockGroup from "./BlockGroup";
import BlockGroupView from "./BlockGroupView";
import { BlockUpdates } from "~/routes/$siteId+/blocks+/BlockUpdates";
import { BlockUpdatesView } from "~/routes/$siteId+/blocks+/BlockUpdates/view";
import { CustomBlocks } from "~/_custom/blocks";

// If new block created when old block selected, create the following block
// Example: create checkbox block, press enter, new unchecked checkbox is created
export const CreateNewBlockFromBlock: Record<string, () => CustomElement> = {
   [BlockType.ToDo]: () => ({
      type: BlockType.ToDo,
      checked: false,
      id: nanoid(),
      children: [],
   }),
   [BlockType.BulletedList]: () => ({
      type: BlockType.BulletedList,
      id: nanoid(),
      children: [],
   }),
};

// Note: {children} must be rendered in every element otherwise bugs occur
// https://docs.slatejs.org/api/nodes/element#rendering-void-elements
// https://github.com/ianstormtaylor/slate/issues/3930
export default function Block({
   element,
   children,
   attributes,
}: RenderElementProps) {
   const readOnly = useReadOnly();

   switch (element.type) {
      case BlockType.Link: {
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
      case BlockType.UpdatesInline: {
         return <div {...attributes}>{children}</div>;
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
         rounded-lg border-2 text-xl shadow-sm shadow-zinc-50"
            >
               <div
                  className="pattern-dots absolute left-0
                   top-0 h-full
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                     pattern-size-4 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
               ></div>
               <div
                  className="absolute left-0 top-0 h-full w-full 
            bg-gradient-to-r from-zinc-100/40 dark:from-zinc-900/20"
               ></div>
               <div className="relative z-10 h-full w-full px-4 py-3">
                  {children}
               </div>
            </h2>
         );
      }
      case BlockType.H3: {
         return (
            <h3 className="flex items-center gap-3" {...attributes}>
               <div className="min-w-[100px] flex-none">{children}</div>
               <div
                  contentEditable={false}
                  className="h-0.5 w-full rounded-full bg-zinc-100 dark:bg-bg4Dark"
               ></div>
            </h3>
         );
      }
      case BlockType.BulletedList: {
         return (
            <div {...attributes}>
               <BlockList element={element}>{children}</BlockList>
            </div>
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
         const isCustomBlock = CustomBlocks({ element, children, attributes });
         if (isCustomBlock) {
            return (
               <CustomBlocks
                  element={element}
                  children={children}
                  attributes={attributes}
               />
            );
         }
         return (
            <DefaultElement element={element} attributes={attributes}>
               {children}
            </DefaultElement>
         );
   }
}
