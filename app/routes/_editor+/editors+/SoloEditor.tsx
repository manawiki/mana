import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type ActionArgs, redirect } from "@remix-run/node";
import isHotkey, { isKeyHotkey } from "is-hotkey";
import { Trash } from "lucide-react";
import { nanoid } from "nanoid";
import {
   type Node,
   type Descendant,
   createEditor,
   Editor,
   Element,
   Point,
   Range,
   Transforms,
} from "slate";
import { withHistory } from "slate-history";
import {
   Editable,
   ReactEditor,
   Slate,
   withReact,
   type RenderElementProps,
} from "slate-react";
import { z } from "zod";
import { zx } from "zodix";

import { useDebouncedValue, useIsMount } from "~/hooks";
import { Block, CreateNewBlockFromBlock } from "~/routes/_editor+/blocks/Block";
import { Leaf } from "~/routes/_editor+/blocks/Leaf";
import {
   BlockInlineActions,
   Button,
   Toolbar,
   Tooltip,
} from "~/routes/_editor+/components";
import {
   HOTKEYS,
   PROSE_CONTAINER_ID,
} from "~/routes/_editor+/functions/constants";
import {
   indentItem,
   removeGlobalCursor,
   setGlobalCursor,
   toggleMark,
   undentItem,
   withLayout,
   withLists,
   withNodeId,
} from "~/routes/_editor+/functions/utils";
import type { CustomElement } from "~/routes/_editor+/types";
import { BlockType } from "~/routes/_editor+/types";

import { withLinkify } from "../functions/plugins/link/withLinkify";

const LIST_WRAPPER: Record<string, BlockType> = {
   "*": BlockType.BulletedList,
   "-": BlockType.BulletedList,
   "+": BlockType.BulletedList,
   "1.": BlockType.NumberedList,
};

const SHORTCUTS: Record<string, BlockType> = {
   "*": BlockType.ListItem,
   "-": BlockType.ListItem,
   "+": BlockType.ListItem,
   "1.": BlockType.ListItem,
   "##": BlockType.H2,
   "###": BlockType.H3,
   "[]": BlockType.ToDo,
};

const useEditor = () =>
   useMemo(
      () =>
         withLists(
            withShortcuts(
               withNodeId(
                  withLayout(
                     withLinkify(withReact(withHistory(createEditor())))
                  )
               )
            )
         ),
      []
   );

function isNodeWithId(editor: Editor, id: string) {
   return (node: Node) => Editor.isBlock(editor, node) && node.id === id;
}

export const SoloEditor = ({
   fetcher,
   defaultValue,
   siteId,
   collectionEntity,
   pageId,
   sectionId,
   intent,
}: {
   fetcher: any;
   defaultValue: Descendant[];
   siteId: string | undefined;
   collectionEntity?: string;
   pageId?: string;
   sectionId?: string;
   intent?: string;
}) => {
   const editor = useEditor();

   const [activeId, setActiveId] = useState<string | null>(null);
   const activeElement = editor.children.find(
      (x) => "id" in x && x.id === activeId
   ) as CustomElement | undefined;

   const isMount = useIsMount();
   const [value, setValue] = useState();

   const debouncedValue = useDebouncedValue(value, 1000);

   useEffect(() => {
      if (!isMount && value != null) {
         fetcher.submit(
            {
               content: JSON.stringify(debouncedValue),
               intentType: "update",
               siteId,
               pageId,
               intent,
               collectionEntity,
               sectionId,
            },
            { method: "patch", action: "/editors/SoloEditor" }
         );
      }
   }, [debouncedValue]);

   useEffect(() => {
      const { insertBreak } = editor;
      // Override editor to insert paragraph or element after inserting new line
      editor.insertBreak = () => {
         if (editor.selection) {
            const previousBlock = editor.children[
               editor.selection.anchor.path[0]
            ] as CustomElement;

            let newBlock;

            // Create different current element on new line if set in Block.tsx
            if (
               !newBlock &&
               previousBlock?.type &&
               Object.keys(CreateNewBlockFromBlock).includes(
                  previousBlock?.type
               )
            ) {
               newBlock = CreateNewBlockFromBlock[previousBlock.type]();
            }

            insertBreak();
            Transforms.setNodes(editor, newBlock as any, {
               at: editor.selection,
            });
         } else {
            insertBreak();
         }
      };
   }, [editor]);

   const handleDragStart = (event: DragStartEvent) => {
      if (event.active) {
         clearSelection();
         setActiveId(event.active.id as string);
      }

      setGlobalCursor("grabbing");
   };

   const handleDragEnd = (event: DragEndEvent) => {
      removeGlobalCursor("grabbing");

      const overId = event.over?.id;
      if (overId == null) {
         setActiveId(null);
      }

      const overIndex = editor.children.findIndex((x: any) => x.id === overId);
      if (overId !== activeId && overIndex !== -1) {
         Transforms.moveNodes(editor, {
            at: [],
            match: isNodeWithId(editor, activeId as string),
            to: [overIndex],
         });
      }

      setActiveId(null);
   };

   const handleDragCancel = () => {
      setActiveId(null);
   };

   const clearSelection = () => {
      ReactEditor.blur(editor);
      Transforms.deselect(editor);
      window.getSelection()?.empty();
   };

   const renderElement = useCallback((props: RenderElementProps) => {
      const path = ReactEditor.findPath(editor, props.element);
      const isTopLevel = path.length === 1;

      return isTopLevel ? (
         <SortableElement
            {...props}
            renderElement={Block}
            onDelete={() =>
               Transforms.removeNodes(editor, {
                  at: ReactEditor.findPath(editor, props.element),
               })
            }
            onInsertBelow={(block: CustomElement) => {
               const path = [
                  ReactEditor.findPath(editor, props.element)[0] + 1,
               ];

               Transforms.insertNodes(editor, block, {
                  at: path,
               });

               // Defer selection to be able to focus the element we just inserted
               setTimeout(() => {
                  ReactEditor.focus(editor);
                  Transforms.select(editor, {
                     anchor: { path: [path[0], 0], offset: 0 },
                     focus: { path: [path[0], 0], offset: 0 },
                  });
               }, 0);
            }}
         />
      ) : (
         <Block {...props} />
      );
   }, []);

   const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
      const { selection } = editor;

      // Default left/right behavior is unit:'character'.
      // This fails to distinguish between two cursor positions, such as
      // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
      // Here we modify the behavior to unit:'offset'.
      // This lets the user step into and out of the inline without stepping over characters.
      // You may wish to customize this further to only use unit:'offset' in specific cases.
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
         //UL and OL key logic
         if (isHotkey("shift+tab", event)) {
            // attempt to un-indent on shift+tab within list
            event.preventDefault();
            undentItem(editor);
         } else if (isHotkey("tab", event)) {
            // attempt to indent on tab within list
            event.preventDefault();
            indentItem(editor);
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

   const items = useMemo(
      () => editor.children.map((element: any) => element.id),
      [editor.children]
   );

   return (
      <div className="relative pb-4">
         <div
            className="mx-auto max-w-[728px]"
            id={PROSE_CONTAINER_ID}
            onClick={(e) => e.stopPropagation()}
         >
            <div className="mx-auto w-full">
               <Suspense fallback={<div>Loading...</div>}>
                  <Slate
                     onChange={setValue}
                     editor={editor}
                     initialValue={defaultValue}
                  >
                     <Toolbar />
                     <DndContext
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                        modifiers={[restrictToVerticalAxis]}
                     >
                        <SortableContext
                           items={items}
                           strategy={verticalListSortingStrategy}
                        >
                           <Editable
                              className="outline-none"
                              renderElement={renderElement}
                              renderLeaf={Leaf}
                              /**
                               * Inspired by this great article from https://twitter.com/_jkrsp
                               * https://jkrsp.com/slate-js-placeholder-per-line/
                               **/
                              decorate={([node, path]) => {
                                 if (editor.selection != null) {
                                    if (
                                       !Editor.isEditor(node) &&
                                       Editor.string(editor, [path[0]]) ===
                                          "" &&
                                       Range.includes(editor.selection, path) &&
                                       Range.isCollapsed(editor.selection)
                                    ) {
                                       return [
                                          {
                                             ...editor.selection,
                                             placeholder:
                                                "Type something here…",
                                          },
                                       ];
                                    }
                                 }

                                 return [];
                              }}
                              onKeyDown={onKeyDown}
                           />
                        </SortableContext>
                        <DragOverlay adjustScale={false}>
                           {activeElement && (
                              <DragOverlayContent
                                 element={activeElement}
                                 renderElement={renderElement}
                              />
                           )}
                        </DragOverlay>
                     </DndContext>
                  </Slate>
               </Suspense>
            </div>
         </div>
      </div>
   );
};

function SortableElement({
   attributes,
   element,
   children,
   renderElement,
   onDelete,
   onInsertBelow,
}: RenderElementProps & {
   renderElement: any;
   onDelete: () => void;
   onInsertBelow: (block: CustomElement) => void;
}) {
   const sortable = useSortable({ id: element.id });

   return (
      <div
         className="group relative flex flex-col 
         border-y border-dashed border-transparent 
         hover:border-y hover:border-zinc-200 dark:hover:border-zinc-700"
         {...attributes}
      >
         <div
            className="outline-none"
            {...sortable.attributes}
            ref={sortable.setNodeRef}
            style={
               {
                  transition: sortable.transition,
                  transform: CSS.Transform.toString(sortable.transform),
                  pointerEvents: sortable.isSorting ? "none" : undefined,
                  opacity: sortable.isDragging ? 0 : 1,
               } as React.CSSProperties /* cast because of css variable */
            }
         >
            {renderElement({ element, children })}
            <div
               className="absolute -top-10 z-10 select-none pr-3 opacity-0
               group-hover:opacity-100 laptop:-top-0.5 laptop:left-0 laptop:-translate-x-full laptop:translate-y-0"
               contentEditable={false}
            >
               <BlockInlineActions
                  blockId={element.id}
                  onInsertBelow={onInsertBelow}
               />
            </div>
            <div
               className="absolute -top-10 right-0 z-10 select-none pl-3
                opacity-0 group-hover:opacity-100 laptop:-right-11 laptop:-top-0.5"
               contentEditable={false}
            >
               <Tooltip id="delete" content="Delete">
                  <Button
                     className="hover:bg-2 shadow-1 border-color bg-3 flex
                      h-8 w-8 items-center justify-center rounded-md border shadow-sm"
                     onClick={onDelete}
                     ariaLabel="Delete"
                  >
                     <Trash className="text-1" size={14} />
                  </Button>
               </Tooltip>
            </div>
         </div>
      </div>
   );
}

function DragOverlayContent({
   element,
   renderElement,
}: {
   element: CustomElement;
   renderElement: (props: RenderElementProps) => JSX.Element;
}) {
   const editor = useEditor();
   const [value] = useState([JSON.parse(JSON.stringify(element))]); // clone

   return (
      <Slate editor={editor} initialValue={value}>
         <Editable
            readOnly={true}
            renderElement={renderElement}
            renderLeaf={Leaf}
         />
      </Slate>
   );
}

function withShortcuts(editor: Editor) {
   const { deleteBackward, insertText } = editor;

   editor.insertText = (text) => {
      const { selection } = editor;

      if (text.endsWith(" ") && selection && Range.isCollapsed(selection)) {
         const { anchor } = selection;
         const block = Editor.above(editor, {
            match: (n) => Editor.isBlock(editor, n),
         });
         const path = block ? block[1] : [];
         const start = Editor.start(editor, path);
         const range = { anchor, focus: start };
         const beforeText = Editor.string(editor, range) + text.slice(0, -1);
         const type = SHORTCUTS[beforeText];
         if (type) {
            Transforms.select(editor, range);

            if (!Range.isCollapsed(range)) {
               Transforms.delete(editor);
            }

            const newProperties: Partial<CustomElement> = {
               type,
            };
            Transforms.setNodes<Element>(editor, newProperties, {
               match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
            });

            if (type === BlockType.ListItem) {
               const list = {
                  id: nanoid(),
                  type: LIST_WRAPPER[beforeText],
                  children: [],
               };
               Transforms.wrapNodes(editor, list, {
                  match: (n) => n.type === BlockType.ListItem,
               });
            }

            return;
         }
      }

      insertText(text);
   };

   editor.deleteBackward = (...args: unknown[]) => {
      const { selection } = editor;

      if (selection && Range.isCollapsed(selection)) {
         const match = Editor.above(editor, {
            match: (n) => Editor.isBlock(editor, n),
         });

         if (match) {
            const [block, path] = match;
            const start = Editor.start(editor, path);

            if (
               !Editor.isEditor(block) &&
               Element.isElement(block) &&
               block.type !== BlockType.Paragraph &&
               Point.equals(selection.anchor, start)
            ) {
               const newProperties: Partial<CustomElement> = {
                  type: BlockType.Paragraph,
               };
               Transforms.setNodes(editor, newProperties);
               if (block.type === BlockType.ListItem) {
                  Transforms.unwrapNodes(editor, {
                     match: (n) =>
                        n.type === BlockType.BulletedList ||
                        n.type === BlockType.NumberedList,
                     split: true,
                  });
               }
               return;
            }
         }

         // @ts-ignore
         deleteBackward(...args);
      }
   };

   return editor;
}

export async function action({
   context: { payload, user },
   request,
}: ActionArgs) {
   const { intent, intentType, siteId, pageId, collectionEntity, sectionId } =
      await zx.parseForm(request, {
         intent: z.string(),
         intentType: z.string(),
         siteId: z.string(),
         pageId: z.string().optional(),
         collectionEntity: z.string().optional(),
         sectionId: z.string().optional(),
      });

   if (!user || !user.id) return redirect("/login", { status: 302 });

   switch (intentType) {
      case "update": {
         //Group of helper functinos to get real id's from slug
         const slug = await payload.find({
            collection: "sites",
            where: {
               slug: {
                  equals: siteId,
               },
            },
            user,
         });
         const realSiteId = slug?.docs[0]?.id;

         const collectionSlug = await payload.find({
            collection: "collections",
            where: {
               slug: {
                  equals: collectionEntity,
               },
               site: {
                  equals: realSiteId,
               },
            },
            user,
         });

         const realCollectionId = collectionSlug?.docs[0]?.id;

         switch (intent) {
            case "customCollectionEmbed": {
               const { content } = await zx.parseForm(request, {
                  content: z.string(),
               });

               const embedId = await payload.find({
                  collection: "contentEmbeds",
                  where: {
                     site: {
                        equals: realSiteId,
                     },
                     relationId: {
                        equals: pageId,
                     },
                     ...(collectionEntity
                        ? {
                             collectionEntity: {
                                equals: realCollectionId,
                             },
                          }
                        : {}),
                     ...(sectionId
                        ? {
                             sectionId: {
                                equals: sectionId,
                             },
                          }
                        : {}),
                  },
                  overrideAccess: false,
                  user,
               });

               //If existing embed doesn't exist, create a new one.
               if (embedId.totalDocs == 0) {
                  return await payload.create({
                     collection: "contentEmbeds",
                     data: {
                        content: JSON.parse(content),
                        relationId: pageId,
                        sectionId: sectionId,
                        site: realSiteId as any,
                        collectionEntity: realCollectionId as any,
                     },
                     draft: true,
                     overrideAccess: false,
                     user,
                  });
               }

               //Otherwise update the existing document
               return await payload.update({
                  collection: "contentEmbeds",
                  id: embedId.docs[0].id,
                  data: {
                     content: JSON.parse(content),
                  },
                  autosave: true,
                  draft: true,
                  overrideAccess: false,
                  user,
               });
            }

            case "homeContent": {
               const { content } = await zx.parseForm(request, {
                  content: z.string(),
               });

               const homeContentId = await payload.find({
                  collection: "homeContents",
                  where: {
                     site: {
                        equals: realSiteId,
                     },
                  },
                  overrideAccess: false,
                  user,
               });

               //If existing embed doesn't exist, create a new one.
               if (homeContentId.totalDocs == 0) {
                  return await payload.create({
                     collection: "homeContents",
                     data: {
                        content: JSON.parse(content),
                        site: realSiteId,
                     },
                     draft: true,
                     overrideAccess: false,
                     user,
                  });
               }

               //Otherwise update the existing document
               return await payload.update({
                  collection: "homeContents",
                  id: homeContentId.docs[0].id,
                  data: {
                     content: JSON.parse(content),
                  },
                  autosave: true,
                  draft: true,
                  overrideAccess: false,
                  user,
               });
            }

            case "updatePostContent": {
               const { content } = await zx.parseForm(request, {
                  content: z.string(),
               });

               //update the existing post
               return await payload.update({
                  collection: "posts",
                  id: pageId,
                  data: {
                     content: JSON.parse(content),
                  },
                  autosave: true,
                  draft: true,
                  overrideAccess: false,
                  user,
               });
            }

            default:
               return null;
         }
      }
      case "publish": {
         switch (intent) {
            case "homeContent": {
               const homeContent = await payload.find({
                  collection: "homeContents",
                  where: {
                     "site.slug": {
                        equals: siteId,
                     },
                  },
                  overrideAccess: false,
                  user,
               });

               return await payload.update({
                  collection: "homeContents",
                  id: homeContent.docs[0].id,
                  data: {
                     _status: "published",
                  },
                  overrideAccess: false,
                  user,
               });
            }

            default:
               return null;
         }
      }
   }
}
