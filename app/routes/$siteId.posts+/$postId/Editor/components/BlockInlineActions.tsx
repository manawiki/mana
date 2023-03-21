import Button from "./Button";
import Tooltip from "./Tooltip";
import BlockTypeSelector from "./BlockTypeSelector";
import type { CustomElement } from "../types";
import { GripVertical, Minus, Plus } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

type Props = {
   blockId: string;
   onDelete: () => void;
   onInsertBelow: (block: CustomElement) => void;
};

export default function BlockInlineActions({
   blockId,
   onDelete,
   onInsertBelow,
}: Props) {
   const { listeners, setActivatorNodeRef } = useDraggable({
      id: blockId,
   });

   return (
      <div className="flex items-center justify-space-between">
         <Tooltip content="Delete">
            <Button
               className="hover:bg-1 flex items-center justify-center hover:shadow shadow-1 h-7 w-7 rounded-md"
               onClick={onDelete}
               ariaLabel="Delete"
            >
               <Minus size={16} />
            </Button>
         </Tooltip>
         <BlockTypeSelector onSelect={onInsertBelow}>
            <Button
               className="hover:bg-1 flex items-center justify-center hover:shadow shadow-1 h-7 w-7 rounded-md"
               ariaLabel="Insert block below"
            >
               <Plus size={16} />
            </Button>
         </BlockTypeSelector>
         <Tooltip content="Drag to reorder">
            <Button
               ariaLabel="Drag to reorder"
               ref={setActivatorNodeRef}
               {...listeners}
               className="hover:bg-1 cursor-grab flex items-center justify-center hover:shadow shadow-1 h-7 w-7 rounded-md"
            >
               <GripVertical size={16} />
            </Button>
         </Tooltip>
      </div>
   );
}
