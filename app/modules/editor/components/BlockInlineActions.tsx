import Button from "./Button";
import Tooltip from "../../../components/Tooltip";
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
      <div className="justify-space-between flex items-center">
         <Tooltip id="delete" content="Delete">
            <Button
               className="hover:bg-1 shadow-1 flex h-7 w-7 items-center justify-center rounded-md hover:shadow"
               onClick={onDelete}
               ariaLabel="Delete"
            >
               <Minus size={16} />
            </Button>
         </Tooltip>
         <BlockTypeSelector onSelect={onInsertBelow}>
            <Button
               className="hover:bg-1 shadow-1 flex h-7 w-7 items-center justify-center rounded-md hover:shadow"
               ariaLabel="Insert block below"
            >
               <Plus size={16} />
            </Button>
         </BlockTypeSelector>
         <Tooltip id="drag" content="Drag to reorder">
            <Button
               ariaLabel="Drag to reorder"
               ref={setActivatorNodeRef}
               {...listeners}
               className="hover:bg-1 shadow-1 flex h-7 w-7 cursor-grab items-center justify-center rounded-md hover:shadow"
            >
               <GripVertical size={16} />
            </Button>
         </Tooltip>
      </div>
   );
}
