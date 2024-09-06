import { Fragment, useCallback, useMemo, useState } from "react";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
   DndContext,
   DragOverlay,
   MeasuringStrategy,
   closestCenter,
   useDraggable,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import type { AnimateLayoutChanges } from "@dnd-kit/sortable";
import {
   SortableContext,
   defaultAnimateLayoutChanges,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FloatingDelayGroup } from "@floating-ui/react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import clsx from "clsx";
import type { Descendant, Editor } from "slate";
import { Transforms, createEditor } from "slate";
import type { RenderElementProps } from "slate-react";
import {
   Editable,
   ReactEditor,
   Slate,
   useReadOnly,
   withReact,
} from "slate-react";

import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";

import { BlockSelector } from "./components/BlockSelector";
// eslint-disable-next-line import/no-cycle
import { EditorBlocks } from "./components/EditorBlocks";
import { Leaf } from "./components/Leaf";
import { Toolbar } from "./components/Toolbar";
import { useEditor } from "./plugins";
import { BlockType, type CustomElement } from "./types";
import { initialValue, isNodeWithId, onKeyDown } from "./utils";

export function EditorWithDnD({
   editor,
   isTwoColumn,
   isNested,
}: {
   editor: Editor;
   isTwoColumn?: boolean;
   isNested?: boolean;
}) {
   const [activeId, setActiveId] = useState<string | null>(null);

   function clearSelection(editor: Editor) {
      ReactEditor.blur(editor);
      Transforms.deselect(editor);
   }

   function handleDragStart(event: DragStartEvent) {
      if (event.active) {
         clearSelection(editor);
         setActiveId(event.active.id as string);
      }
   }
   function handleDragEnd(event: DragEndEvent) {
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
   }
   function handleDragCancel() {
      setActiveId(null);
   }

   const activeElement = editor.children.find(
      (x) => "id" in x && x.id === activeId,
   ) as CustomElement | undefined;

   const renderElement = useCallback(
      (props: RenderElementProps) => {
         const path = ReactEditor.findPath(editor, props.element);
         const isTopLevel = path.length === 1;
         return isTopLevel ? (
            <HoverElement
               isNested={isNested}
               isTwoColumn={isTwoColumn}
               editor={editor}
               activeId={activeId}
               {...props}
            />
         ) : (
            <EditorBlocks {...props} />
         );
      },
      [activeId],
   );

   const items = useMemo(
      () => editor.children.map((element: any) => element.id),
      [editor.children],
   );
   const measuringConfig = {
      droppable: {
         strategy: MeasuringStrategy.Always,
      },
   };

   return (
      <DndContext
         onDragStart={handleDragStart}
         onDragEnd={handleDragEnd}
         onDragCancel={handleDragCancel}
         modifiers={[restrictToVerticalAxis]}
         collisionDetection={closestCenter}
         measuring={measuringConfig}
      >
         <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <Editable
               placeholder="Start typing..."
               className="outline-none"
               renderElement={renderElement}
               renderLeaf={Leaf}
               onKeyDown={(e) => onKeyDown(e, editor)}
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
   );
}

function BlockInlineActions({
   element,
   editor,
   sortable,
   isParentTwoColumn,
}: {
   element: CustomElement;
   editor: Editor;
   sortable: any;
   isParentTwoColumn: boolean;
}) {
   const { listeners, setActivatorNodeRef } = useDraggable({
      //@ts-ignore
      id: element.id,
   });
   function onDelete(e: any, element: CustomElement) {
      Transforms.removeNodes(editor, {
         at: ReactEditor.findPath(editor, element),
      });
   }
   return (
      <div
         className="border-color-sub bg-white dark:bg-dark350 z-50 relative
         flex items-center rounded-r-lg rounded-l-md border drop-shadow-sm dark:drop-shadow"
      >
         <Popover>
            {({ open, close }) => (
               <div className="flex items-center" onMouseLeave={() => close()}>
                  <PopoverButton className="flex focus:outline-none border-color-sub h-7 w-5 border-r select-none items-center justify-center">
                     {open ? (
                        <div>
                           <Icon
                              name="chevron-left"
                              className="text-1"
                              size={14}
                           />
                        </div>
                     ) : (
                        <Icon name="more-vertical" size={14} />
                     )}
                  </PopoverButton>
                  <PopoverPanel className="h-[30px] divide-x divide-color-sub -mt-[1px] z-20 overflow-hidden flex items-center">
                     <FloatingDelayGroup delay={{ open: 1000, close: 200 }}>
                        <Tooltip>
                           <TooltipTrigger
                              className={clsx(
                                 sortable.isDragging
                                    ? "cursor-grabbing"
                                    : "cursor-move",
                                 "flex items-center group w-7 h-full justify-center touch-none",
                              )}
                              aria-label="Drag to reorder"
                              ref={setActivatorNodeRef}
                              {...listeners}
                           >
                              <Icon
                                 title="More options"
                                 name="grip-vertical"
                                 className="group-hover:text-blue-400"
                                 size={14}
                              />
                           </TooltipTrigger>
                           <TooltipContent>Move</TooltipContent>
                        </Tooltip>
                        {/* <Tooltip>
                              <TooltipTrigger className="group h-full w-8 flex items-center justify-center">
                                 <Icon
                                    name="copy"
                                    className="group-hover:text-green-400"
                                    size={12}
                                 />
                              </TooltipTrigger>
                              <TooltipContent>Copy</TooltipContent>
                           </Tooltip> */}
                        {(element.type == BlockType.Image && !element?.refId) ||
                        element.type !== BlockType.Image ? (
                           <Tooltip>
                              <TooltipTrigger
                                 className="flex w-7 h-full items-center group justify-center"
                                 onClick={(e) => onDelete(e, element)}
                                 aria-label="Delete"
                              >
                                 <Icon
                                    name="trash"
                                    className="group-hover:text-red-400"
                                    size={12}
                                 />
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                           </Tooltip>
                        ) : null}
                     </FloatingDelayGroup>
                  </PopoverPanel>
                  <BlockSelector
                     element={element}
                     editor={editor}
                     isSelectorOpen={open}
                  />
               </div>
            )}
         </Popover>
      </div>
   );
}

enum Position {
   Before = -1,
   After = 1,
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
      <Slate editor={editor} initialValue={value ?? initialValue()}>
         <Editable renderElement={renderElement} renderLeaf={Leaf} />
      </Slate>
   );
}

interface HoverElementProps extends RenderElementProps {
   editor: Editor;
   activeId: string | null;
   isTwoColumn?: boolean;
   isNested?: boolean;
}

function HoverElement({
   attributes,
   element,
   children,
   editor,
   activeId,
   isTwoColumn,
   isNested,
}: HoverElementProps) {
   const animateLayoutChanges: AnimateLayoutChanges = (args) =>
      defaultAnimateLayoutChanges({ ...args, wasDragging: true });

   //@ts-ignore
   const sortable = useSortable({ animateLayoutChanges, id: element.id });

   const activeIndex = editor.children.findIndex(
      (result: any) => result.id === activeId,
   );

   const insertPosition =
      //@ts-ignore
      sortable.over?.id === element.id
         ? sortable.index > activeIndex
            ? Position.After
            : Position.Before
         : undefined;

   const isParentTwoColumn =
      element.type == BlockType.TwoColumn && !isTwoColumn;

   const isVariableWidth =
      element.type === BlockType.Image && element.containerWidth;

   return (
      <section
         style={{
            maxWidth: isNested
               ? undefined
               : isVariableWidth
                 ? `${element.containerWidth}px`
                 : "728px",
         }}
         className="group/editor relative mx-auto max-tablet:!w-full"
      >
         <div
            className={clsx(
               insertPosition === Position.Before
                  ? "after:-top-4 after:left-0 after:right-0 after:h-1"
                  : null,
               insertPosition === Position.After
                  ? "after:-bottom-4 after:left-0 after:right-0 after:h-1"
                  : null,
               "outline-none after:absolute after:rounded-full after:bg-blue-200 after:content-[''] dark:after:bg-gray-700",
            )}
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
            <EditorBlocks
               attributes={attributes}
               element={element}
               children={children}
            />
         </div>
         <div
            contentEditable={false}
            //If editor tray is also open, we keep the menu open
            className={clsx(
               isParentTwoColumn ? "pr-16" : "pr-2",
               isTwoColumn ? "z-20" : "z-10",
               "laptop:-translate-x-full laptop:translate-y-0 left-0 opacity-0 group-hover/editor:opacity-100 absolute select-none duration-100 ease-in top-0",
            )}
         >
            <BlockInlineActions
               isParentTwoColumn={isParentTwoColumn}
               editor={editor}
               sortable={sortable}
               element={element}
            />
         </div>
      </section>
   );
}

export function NestedEditor({
   element,
   editor,
   field,
   readOnly = false,
   isTwoColumn = false,
}: {
   element: any;
   editor: Editor;
   field: string;
   readOnly?: boolean;
   isTwoColumn?: boolean;
}) {
   const isEditorReadOnlyMode = useReadOnly();
   const inlineEditor = useEditor();
   const viewEditor = useMemo(() => withReact(createEditor()), []);

   if (isEditorReadOnlyMode == true || readOnly == true) {
      return (
         <Slate
            editor={viewEditor}
            initialValue={element[field] ?? initialValue()}
         >
            <Editable
               renderElement={EditorBlocks}
               renderLeaf={Leaf}
               readOnly={true}
            />
         </Slate>
      );
   }

   const path = ReactEditor.findPath(editor, element);

   function updateEditorValue(event: Descendant[]) {
      Transforms.setNodes<CustomElement>(
         editor,
         {
            [field]: event,
         },
         {
            at: path,
         },
      );
   }

   return (
      <div className="relative mx-auto max-w-[728px]">
         <Slate
            onChange={updateEditorValue}
            editor={inlineEditor}
            initialValue={element[field] ?? initialValue()}
         >
            <Toolbar />
            <EditorWithDnD
               isNested
               isTwoColumn={isTwoColumn}
               editor={inlineEditor}
            />
         </Slate>
      </div>
   );
}
