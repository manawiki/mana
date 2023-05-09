import Button from "./Button";
import Tooltip from "~/components/Tooltip";
import BlockTypeSelector from "./BlockTypeSelector";
import type { CustomElement } from "../types";
import { GripVertical, Plus } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

type Props = {
   blockId: string;
   onInsertBelow: (block: CustomElement) => void;
};

export default function BlockInlineActions({ blockId, onInsertBelow }: Props) {
   const { listeners, setActivatorNodeRef } = useDraggable({
      id: blockId,
   });

   return (
      <div
         className="shadow-1 border-color bg-3 
         flex items-center overflow-hidden rounded-lg border shadow-sm"
      >
         <Tooltip id="drag" content="Drag to reorder">
            <Button
               ariaLabel="Drag to reorder"
               ref={setActivatorNodeRef}
               {...listeners}
               className="hover:bg-2 flex h-7 w-7 cursor-grab items-center justify-center"
            >
               <GripVertical size={16} />
            </Button>
         </Tooltip>
         <BlockTypeSelector onSelect={onInsertBelow}>
            <Button
               className="hover:bg-2 flex h-7 w-7 items-center justify-center focus:outline-none"
               ariaLabel="Insert block below"
            >
               <Plus size={16} />
            </Button>
         </BlockTypeSelector>
      </div>
   );
}
