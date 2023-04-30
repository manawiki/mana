import { ReactEditor, useReadOnly, useSlate } from "slate-react";
import type { CustomElement, TierElement, tierRow } from "../types";
import type { BaseEditor } from "slate";
import { Transforms } from "slate";
import { useDebouncedValue, useIsMount } from "~/hooks";
import { useEffect, useMemo, useState } from "react";
import { useZorm } from "react-zorm";
import { z } from "zod";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Tooltip from "~/components/Tooltip";
import { GripVertical } from "lucide-react";
import { useMutation } from "~/liveblocks.config";
import { arrayMoveImmutable } from "array-move";

type Props = {
   element: TierElement;
};

const FormSchema = z.object({
   tierLabel: z.string().min(1),
});

export default function BlockTierList({ element }: Props) {
   const editor = useSlate();

   const isMount = useIsMount();

   const [tierLabel, setTierLabel] = useState(element.tierLabel);

   const debouncedValue = useDebouncedValue(tierLabel, 500);

   useEffect(() => {
      if (!isMount) {
         const path = ReactEditor.findPath(editor, element);
         const newProperties: Partial<CustomElement> = {
            tierLabel: tierLabel,
         };
         return Transforms.setNodes<CustomElement>(editor, newProperties, {
            at: path,
         });
      }
   }, [debouncedValue]);

   const zo = useZorm("signup", FormSchema, {
      onValidSubmit(e) {
         e.preventDefault();
         alert("Form ok!\n" + JSON.stringify(e.data, null, 2));
      },
   });

   const disabled = zo.validation?.success === false;

   const tierItems = element.tierItems;

   //DND kit needs array of strings
   const itemIds = useMemo(() => tierItems.map((item) => item.id), [tierItems]);

   const updateName = useMutation(({ storage }, index, value) => {
      const blocks = storage.get("blocks");
      blocks.set(index, value);
   }, []);

   function handleDragEnd(
      event: DragEndEvent,
      editor: BaseEditor & ReactEditor,
      element: TierElement
   ) {
      const { active, over } = event;

      if (active.id !== over?.id) {
         const tierItems = element.tierItems;

         const oldIndex = tierItems.findIndex((obj) => {
            return obj.id === active.id;
         });

         const newIndex = tierItems.findIndex((obj) => {
            return obj.id === over?.id;
         });

         const updatedTierItems = arrayMoveImmutable(
            tierItems,
            oldIndex,
            newIndex
         );

         const path = ReactEditor.findPath(editor, element);

         const newProperties: Partial<CustomElement> = {
            ...element,
            tierItems: updatedTierItems,
         };

         //Send update to liveblocks
         updateName(path[0], newProperties);

         //Now we update the local SlateJS state
         return Transforms.setNodes<CustomElement>(editor, newProperties, {
            at: path,
         });
      }
   }

   return (
      <div className="mt-3">
         <>
            <input
               className="border-0 bg-transparent p-0 font-bold focus:ring-0"
               type="text"
               placeholder="Enter a tier label..."
               defaultValue={element.tierLabel}
               name={zo.fields.tierLabel()}
               onChange={(event) => setTierLabel(event.target.value)}
            />
            <div className="border-color bg-2 divide-color relative mb-3 mt-2 divide-y rounded-lg border">
               <DndContext
                  onDragEnd={(event) => handleDragEnd(event, editor, element)}
                  modifiers={[restrictToVerticalAxis]}
               >
                  <SortableContext
                     items={itemIds}
                     strategy={verticalListSortingStrategy}
                  >
                     {tierItems?.map((row) => (
                        <SortableItem
                           key={row.id}
                           rowId={row.id}
                           element={element}
                        />
                     ))}
                  </SortableContext>
               </DndContext>
            </div>

            {/* <form ref={zo.ref}>
                  <input
                     type="text"
                     name={zo.fields.name()}
                     className="bg-3 text-header border-color h-9
                w-20 truncate rounded-md border-2 p-0 px-2
                font-bold focus:border-zinc-200
               focus:ring-0 dark:placeholder:text-zinc-300 focus:dark:border-zinc-700"
                  />
                  <button disabled={disabled} type="submit">
                     Add
                  </button>
               </form> */}
         </>
      </div>
   );
}

const SortableItem = ({
   rowId,
   element,
}: {
   rowId: string;
   element: TierElement;
}) => {
   const {
      transition,
      attributes,
      transform,
      isSorting,
      isDragging,
      setActivatorNodeRef,
      setNodeRef,
      listeners,
   } = useSortable({
      id: rowId,
   });

   const row = element.tierItems.find((obj) => {
      return obj.id === rowId;
   });

   return (
      <div
         {...attributes}
         ref={setNodeRef}
         style={
            {
               transition: transition,
               transform: CSS.Transform.toString(transform),
               pointerEvents: isSorting ? "none" : undefined,
               opacity: isDragging ? 0 : 1,
            } as React.CSSProperties /* cast because of css variable */
         }
         className="relative px-4 py-2"
      >
         <div>{row?.id}</div>
         <div
            className="absolute right-2 top-2 select-none opacity-0 group-hover:opacity-100"
            contentEditable={false}
         >
            <Tooltip id="drag" content="Drag to reorder">
               <button
                  type="button"
                  aria-label="Drag to reorder"
                  ref={setActivatorNodeRef}
                  {...listeners}
                  className="hover:bg-1 shadow-1 flex h-7 w-7 cursor-grab items-center justify-center rounded-md hover:shadow"
               >
                  <GripVertical size={16} />
               </button>
            </Tooltip>
         </div>
      </div>
   );
};
