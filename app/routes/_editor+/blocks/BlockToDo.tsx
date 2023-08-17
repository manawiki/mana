import type { ReactNode } from "react";
import { useState } from "react";

import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import type { CustomElement, ToDoElement } from "../types";

type Props = {
   element: ToDoElement;
   children: ReactNode;
};

export default function BlockToDo({ element, children }: Props) {
   const editor = useSlate();
   const [checked, setChecked] = useState(element.checked);

   return (
      <div className="mb-3 ml-2 flex items-start gap-3">
         <div contentEditable={false}>
            <Checkbox.Root
               className="bg-4 mt-1 flex h-5 w-5 items-center justify-center rounded-md bg-zinc-200"
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
               <Checkbox.Indicator className="flex items-center justify-center text-emerald-500">
                  <Check className="stroke-[4px]" size={14} />
               </Checkbox.Indicator>
            </Checkbox.Root>
         </div>
         <div
            className={`${
               checked ? "text-1 line-through" : ""
            } flex-grow outline-none`}
         >
            {children}
         </div>
      </div>
   );
}
