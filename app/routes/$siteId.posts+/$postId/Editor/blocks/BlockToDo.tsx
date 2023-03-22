import type { CustomElement, ToDoElement } from "../types";
import type { ReactNode } from "react";
import { useState } from "react";
import { ReactEditor, useSlate } from "slate-react";
import { Transforms } from "slate";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

type Props = {
   element: ToDoElement;
   children: ReactNode;
};

export default function BlockToDo({ element, children }: Props) {
   const editor = useSlate();
   const [checked, setChecked] = useState(element.checked);

   return (
      <div className="flex ml-2 mb-3 gap-3 items-start">
         <div contentEditable={false}>
            <Checkbox.Root
               className="bg-zinc-200 mt-1 bg-4 w-5 h-5 rounded-md flex items-center justify-center"
               checked={checked}
               onCheckedChange={(e: any) => {
                  const path = ReactEditor.findPath(editor, element);
                  const newProperties: Partial<CustomElement> = {
                     checked: e,
                  };
                  Transforms.setNodes<CustomElement>(editor, newProperties, {
                     at: path,
                  });
                  setChecked((prevCheck) => !prevCheck);
               }}
            >
               <Checkbox.Indicator className="text-emerald-500 flex items-center justify-center">
                  <Check className="stroke-[4px]" size={14} />
               </Checkbox.Indicator>
            </Checkbox.Root>
         </div>
         <div
            className={`${
               checked ? "line-through text-1" : ""
            } flex-grow outline-none`}
         >
            {children}
         </div>
      </div>
   );
}
