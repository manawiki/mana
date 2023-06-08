import isHotkey, { isKeyHotkey } from "is-hotkey";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { Node } from "slate";
import {
   type Descendant,
   createEditor,
   Editor,
   Element,
   Point,
   Range,
   Transforms,
} from "slate";
import {
   Editable,
   ReactEditor,
   Slate,
   withReact,
   type RenderElementProps,
} from "slate-react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
   SortableContext,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import type { CustomElement } from "~/modules/editor/types";
import { BlockType } from "~/modules/editor/types";
import {
   removeGlobalCursor,
   setGlobalCursor,
   toggleMark,
   withLayout,
   withNodeId,
} from "~/modules/editor/utils";
import Leaf from "~/modules/editor/blocks/Leaf";
import Block, { CreateNewBlockFromBlock } from "~/modules/editor/blocks/Block";
import { HOTKEYS, PROSE_CONTAINER_ID } from "~/modules/editor/constants";
import {
   BlockInlineActions,
   Button,
   Toolbar,
   Tooltip,
} from "~/modules/editor/components";
import { nanoid } from "nanoid";
import { Loader2, MoreVertical, Save, Trash } from "lucide-react";
import { withHistory } from "slate-history";
import { useDebouncedValue, useIsMount } from "~/hooks";
import { useFetcher } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";
import { type ActionArgs, redirect } from "@remix-run/node";
import { isAdding, isProcessing } from "~/utils";

const SHORTCUTS: Record<string, BlockType> = {
   "*": BlockType.BulletedList,
   "-": BlockType.BulletedList,
   "+": BlockType.BulletedList,
   "##": BlockType.H2,
   "###": BlockType.H3,
   "[]": BlockType.ToDo,
};

const useEditor = () =>
   useMemo(
      () =>
         withShortcuts(
            withNodeId(withLayout(withReact(withHistory(createEditor()))))
         ),
      []
   );

function isNodeWithId(editor: Editor, id: string) {
   return (node: Node) => Editor.isBlock(editor, node) && node.id === id;
}

export const SoloEditor = ({
   defaultValue,
   siteId,
   collectionEntity,
   pageId,
   sectionId,
   intent,
}: {
   defaultValue: Descendant[] | undefined;
   siteId: string;
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

   editor.isInline = (element) => ["link"].includes(element.type);

   const isMount = useIsMount();
   const fetcher = useFetcher();
   const [value, setValue] = useState("");
   const isAutoSaving =
      fetcher.state === "submitting" &&
      fetcher.formData.get("intentType") === "update";
   const isPublishing =
      fetcher.state === "submitting" &&
      fetcher.formData.get("intentType") === "publish";

   const disabled = isProcessing(fetcher.state);

   const debouncedValue = useDebouncedValue(value, 1000);

   useEffect(() => {
      if (!isMount) {
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

            // Default paragraph new line
            const paragraphBlock: CustomElement = {
               type: BlockType.Paragraph,
               children: [{ text: "" }],
               id: nanoid(),
            };

            // If caret at position 0, convert previous block to empty paragraph
            if (editor.selection.anchor.offset === 0) {
               Transforms.setNodes(editor, paragraphBlock, {
                  at: editor.selection,
               });

               // Pass state of old block to new block
               newBlock = previousBlock;
            }

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

            if (!newBlock) {
               newBlock = paragraphBlock;
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
      <div className="relative min-h-screen cursor-text pb-4 max-desktop:px-3">
         <div
            className="mx-auto max-w-[728px]"
            id={PROSE_CONTAINER_ID}
            onClick={(e) => e.stopPropagation()}
         >
            <div className="mx-auto w-full pb-12">
               <div
                  className="shadow-1 border-color bg-2 fixed inset-x-0 bottom-40 z-40 mx-auto flex
                  max-w-[320px] items-center justify-between rounded-full border p-2 shadow-sm"
               >
                  <div
                     className="shadow-1 border-color bg-3 flex h-10
                     w-10 items-center justify-center rounded-full border shadow-sm"
                  >
                     {isAutoSaving ? (
                        <Loader2 size={18} className="animate-spin" />
                     ) : (
                        <MoreVertical size={18} />
                     )}
                  </div>
                  {isPublishing ? (
                     <div
                        className="shadow-1 inline-flex items-center justify-center rounded-lg border 
                        border-blue-200/80 bg-gradient-to-b
                        from-blue-50 to-blue-100 p-2 text-sm font-bold text-white shadow-sm transition
                        dark:border-blue-900 dark:from-blue-950 dark:to-blue-950/80 
                        dark:shadow-blue-950"
                     >
                        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                     </div>
                  ) : (
                     <Tooltip
                        id="save-home-changes"
                        side="top"
                        content="Save Changes"
                     >
                        <button
                           className="shadow-1 inline-flex items-center justify-center gap-1.5 rounded-full 
                                    border border-blue-200/80 bg-gradient-to-b from-blue-50
                                    to-blue-100 p-2 px-3.5 text-sm font-bold text-blue-500 shadow-sm transition
                                    dark:border-blue-900 dark:from-blue-950 dark:to-blue-950/80 
                                    dark:shadow-blue-950"
                           disabled={disabled}
                           onClick={() => {
                              fetcher.submit(
                                 {
                                    intent: "homeContent",
                                    intentType: "publish",
                                    siteId,
                                 },
                                 {
                                    method: "post",
                                    action: "/editors/SoloEditor",
                                 }
                              );
                           }}
                        >
                           Publish
                        </button>
                     </Tooltip>
                  )}
               </div>
               <Slate
                  onChange={(e) => setValue(e)}
                  editor={editor}
                  value={defaultValue}
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
                                    Editor.string(editor, [path[0]]) === "" &&
                                    Range.includes(editor.selection, path) &&
                                    Range.isCollapsed(editor.selection)
                                 ) {
                                    return [
                                       {
                                          ...editor.selection,
                                          placeholder: "Type something here…",
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
               className="absolute -top-10 select-none pr-3 opacity-0 group-hover:opacity-100
               laptop:-top-0.5 laptop:left-0 laptop:-translate-x-full laptop:translate-y-0"
               contentEditable={false}
            >
               <BlockInlineActions
                  blockId={element.id}
                  onInsertBelow={onInsertBelow}
               />
            </div>
            <div
               className="absolute -top-10 right-0 z-40 select-none pl-3
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
      <Slate editor={editor} value={value}>
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
   const { intent, intentType, siteId, pageId, collectionEntity } =
      await zx.parseForm(request, {
         intent: z.string(),
         intentType: z.string(),
         siteId: z.string(),
         pageId: z.string().optional(),
         collectionEntity: z.string().optional(),
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

            default:
               return null;
         }
      }
      case "publish": {
         switch (intent) {
            case "homeContent": {
               console.log("asda herere");
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

// case "publish": {
//    const embedId = await payload.find({
//       collection: "contentEmbeds",
//       where: {
//          site: {
//             equals: siteId,
//          },
//          relationId: {
//             equals: pageId,
//          },
//       },
//       overrideAccess: false,
//       user,
//    });

//    return await payload.update({
//       collection: "contentEmbeds",
//       id: embedId.docs[0].id,
//       data: {
//          _status: "published",
//       },
//       overrideAccess: false,
//       user,
//    });
// }
