import { ReactEditor, useReadOnly, useSlate } from "slate-react";
import type { CustomElement, TierElement } from "../types";
import { BlockType } from "../types";
import { Transforms } from "slate";
import { useDebouncedValue, useIsMount } from "~/hooks";
import { useEffect, useState } from "react";
import { useZorm } from "react-zorm";
import { z } from "zod";
import { DndContext, DragOverlay, useDraggable } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { CSS } from "@dnd-kit/utilities";
import Tooltip from "~/components/Tooltip";
import { GripVertical } from "lucide-react";
import { createPortal } from "react-dom";

type Props = {
   element: TierElement;
};

const FormSchema = z.object({
   name: z.string().min(1),
});

const initialValue: CustomElement[] = [
   {
      id: nanoid(),
      type: BlockType.TierList,
      tierLabel: "S Tier",
      tierItems: [
         {
            id: "1",
         },
      ],
      children: [
         {
            text: "",
         },
      ],
   },
];

function handleDragEnd(event) {
   const { active, over } = event;

   if (active.id !== over.id) {
      setItems((items) => {
         const oldIndex = items.indexOf(active.id);
         const newIndex = items.indexOf(over.id);

         return arrayMove(items, oldIndex, newIndex);
      });
   }
}

export default function BlockTierList({ element }: Props) {
   const editor = useSlate();
   const isMount = useIsMount();

   const [value, setValue] = useState("");

   const debouncedValue = useDebouncedValue(value, 500);
   useEffect(() => {
      if (!isMount) {
         const path = ReactEditor.findPath(editor, element);
         const newProperties: Partial<CustomElement> = {
            tierLabel: "S Tier",
            tierItems: [
               {
                  id: "1",
               },
            ],
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
   console.log(tierItems);
   const readOnly = useReadOnly();
   return (
      <div className="border-color bg-2 relative my-3 min-h-[200px] rounded-lg border">
         {readOnly ? (
            <>hello</>
         ) : (
            <>
               {tierItems && (
                  <DndContext modifiers={[restrictToVerticalAxis]}>
                     <SortableContext
                        items={tierItems}
                        strategy={verticalListSortingStrategy}
                     >
                        {tierItems?.map(({ id }) => (
                           <SortableItem key={id} id={id} />
                        ))}
                     </SortableContext>
                     {/* {createPortal(
                        <DragOverlay adjustScale={false}>
                           <DragOverlayContent
                              element={activeElement}
                              renderElement={renderElement}
                           />
                        </DragOverlay>,
                        document.getElementById(PROSE_CONTAINER_ID) ||
                           document.body
                     )} */}
                  </DndContext>
               )}
               <form ref={zo.ref}>
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
               </form>
            </>
         )}
      </div>
   );
}

export const SortableItem = ({ id }: { id: string }) => {
   const sortable = useSortable({ id });

   const { listeners, setActivatorNodeRef } = useDraggable({
      id,
   });

   return (
      <div className="relative flex items-center">
         <div
            className=""
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
            Helllo {id}
         </div>
         <Tooltip id="drag" content="Drag to reorder">
            <button
               aria-label="Drag to reorder"
               ref={setActivatorNodeRef}
               {...listeners}
               className="hover:bg-1 shadow-1 flex h-7 w-7 cursor-grab items-center justify-center rounded-md hover:shadow"
            >
               <GripVertical size={16} />
            </button>
         </Tooltip>
      </div>
   );
};
