import { useCallback, useMemo, useState } from "react";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DndContext, DragOverlay, useDraggable } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
   safePolygon,
   useFloating,
   useHover,
   useInteractions,
} from "@floating-ui/react";
import clsx from "clsx";
import { GripVertical, Trash } from "lucide-react";
import type { Editor } from "slate";
import { Transforms } from "slate";
import type { RenderElementProps } from "slate-react";
import { Editable, ReactEditor, Slate } from "slate-react";

import Button from "~/components/Button";

import { useEditor } from "./plugins";
import type { CustomElement } from "./types";
import { isNodeWithId, onKeyDown } from "./utils";
// eslint-disable-next-line import/no-cycle
import { BlockTypeSelector } from "../components/BlockTypeSelector";
// eslint-disable-next-line import/no-cycle
import { EditorBlocks } from "../components/EditorBlocks";
import { Leaf } from "../components/Leaf";

export function DragOverlayContent({
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

function BlockInlineActions({
   element,
   editor,
   isEditorTrayOpen,
   setEditorTray,
}: {
   element: CustomElement;
   editor: Editor;
   isEditorTrayOpen: any;
   setEditorTray: any;
}) {
   const { listeners, setActivatorNodeRef } = useDraggable({
      id: element.id,
   });
   function onDelete(e: any, element: CustomElement) {
      Transforms.removeNodes(editor, {
         at: ReactEditor.findPath(editor, element),
      });
   }
   return (
      <div
         className="shadow-1 border-color bg-3 relative z-50
         flex items-center overflow-hidden rounded-lg border shadow-sm"
      >
         <Button
            ariaLabel="Drag to reorder"
            ref={setActivatorNodeRef}
            {...listeners}
            className="hover:bg-2 flex h-7 w-7 cursor-grab items-center justify-center"
         >
            <GripVertical size={16} />
         </Button>
         <Button
            className="hover:bg-2 flex h-7 w-7 items-center justify-center"
            onClick={(e) => onDelete(e, element)}
            ariaLabel="Delete"
         >
            <Trash className="text-1" size={14} />
         </Button>
         <BlockTypeSelector
            isEditorTrayOpen={isEditorTrayOpen}
            setEditorTray={setEditorTray}
            element={element}
            editor={editor}
         />
      </div>
   );
}

export function HoverElement({
   attributes,
   element,
   children,
   editor,
}: RenderElementProps & {
   editor: Editor;
}) {
   const [isHoverActive, setHoverState] = useState(false);

   const [isEditorTrayOpen, setEditorTray] = useState(false);

   const sortable = useSortable({ id: element.id });

   const { refs, context } = useFloating({
      open: isHoverActive,
      onOpenChange: setHoverState,
   });

   const hover = useHover(context, {
      handleClose: safePolygon(),
   });

   const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

   return (
      <section className="relative">
         <div
            className="w-full"
            ref={refs.setReference}
            {...getReferenceProps()}
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
                  isHoverActive || isEditorTrayOpen
                     ? "opacity-100"
                     : "opacity-0",
                  "absolute left-0 top-0 z-10 select-none pr-3 laptop:-translate-x-full laptop:translate-y-0"
               )}
               ref={refs.setFloating}
               {...getFloatingProps()}
            >
               <BlockInlineActions
                  isEditorTrayOpen={isEditorTrayOpen}
                  setEditorTray={setEditorTray}
                  editor={editor}
                  element={element}
               />
            </div>
         </div>
      </section>
   );
}

export function EditorWithDnD({ editor }: { editor: Editor }) {
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
      (x) => "id" in x && x.id === activeId
   ) as CustomElement | undefined;

   const renderElement = useCallback((props: RenderElementProps) => {
      const path = ReactEditor.findPath(editor, props.element);
      const isTopLevel = path.length === 1;
      return isTopLevel ? (
         <HoverElement editor={editor} {...props} />
      ) : (
         <EditorBlocks {...props} />
      );
   }, []);

   const items = useMemo(
      () => editor.children.map((element: any) => element.id),
      [editor.children]
   );

   return (
      <DndContext
         onDragStart={handleDragStart}
         onDragEnd={handleDragEnd}
         onDragCancel={handleDragCancel}
         modifiers={[restrictToVerticalAxis]}
      >
         <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <Editable
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
