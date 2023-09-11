import { useCallback, useMemo, useState } from "react";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash } from "lucide-react";
import type { Editor } from "slate";
import { Transforms } from "slate";
import type { RenderElementProps } from "slate-react";
import { Editable, ReactEditor, Slate } from "slate-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "~/components";
import Button from "~/components/Button";

import { useEditor } from "./plugins";
import type { CustomElement } from "./types";
import { isNodeWithId, onKeyDown } from "./utils";
import { BlockInlineActions } from "../components/BlockInlineActions";
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

export function SortableElement({
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
               <Tooltip>
                  <TooltipTrigger>
                     <Button
                        className="hover:bg-2 shadow-1 border-color bg-3 flex
                       h-8 w-8 items-center justify-center rounded-md border shadow-sm"
                        onClick={onDelete}
                        ariaLabel="Delete"
                     >
                        <Trash className="text-1" size={14} />
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
               </Tooltip>
            </div>
         </div>
      </div>
   );
}

export function EditorWithDnD({
   editor,
   setActiveId,
   activeId,
}: {
   editor: Editor;
   setActiveId: (state: string | null) => void;
   activeId: string | null;
}) {
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

   const renderElement = useCallback((props: RenderElementProps) => {
      const path = ReactEditor.findPath(editor, props.element);
      const isTopLevel = path.length === 1;

      return isTopLevel ? (
         <SortableElement
            {...props}
            renderElement={EditorBlocks}
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
            }}
         />
      ) : (
         <EditorBlocks {...props} />
      );
   }, []);

   const items = useMemo(
      () => editor.children.map((element: any) => element.id),
      [editor.children]
   );

   const activeElement = editor.children.find(
      (x) => "id" in x && x.id === activeId
   ) as CustomElement | undefined;

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
