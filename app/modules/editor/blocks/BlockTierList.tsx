import { Editable, ReactEditor, useSlate } from "slate-react";
import type { CustomElement, TierElement } from "../types";
import { Editor, Transforms } from "slate";
import { useDebouncedValue, useIsMount } from "~/hooks";
import { useEffect, useState } from "react";
import { useZorm } from "react-zorm";
import { z } from "zod";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import isHotkey from "is-hotkey";
import { Leaf } from "lucide-react";
import { createPortal } from "react-dom";
import { HOTKEYS, PROSE_CONTAINER_ID } from "../constants";
import { toggleMark } from "../utils";

type Props = {
   element: TierElement;
};

const FormSchema = z.object({
   name: z.string().min(1),
   password: z
      .string()
      .min(10)
      .refine((pw) => /[0-9]/.test(pw), "Password must contain a number"),
});

export default function BlockTierList({ element }: Props) {
   const editor = useSlate();
   const isMount = useIsMount();

   const [value, setValue] = useState("");

   const debouncedValue = useDebouncedValue(value, 500);

   useEffect(() => {
      if (!isMount) {
         const path = ReactEditor.findPath(editor, element);
         const newProperties: Partial<CustomElement> = {
            value,
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
   return (
      <div className="border-color bg-2 relative min-h-[200px] rounded-lg border">
         <DndContext modifiers={[restrictToVerticalAxis]}>
            <SortableContext
               items={element.tierItems}
               strategy={verticalListSortingStrategy}
            >
               <div>pog</div>
               <div>jgjhg</div>
            </SortableContext>
         </DndContext>
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
      </div>
   );
}
