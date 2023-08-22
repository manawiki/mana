import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";

import Tooltip from "~/components/Tooltip";

import { BlockTypeSelector } from "./BlockTypeSelector";
import Button from "./Button";
import type { CustomElement } from "../types";

type Props = {
   blockId: string;
   onInsertBelow: (block: CustomElement) => void;
};

export const BlockInlineActions = ({ blockId, onInsertBelow }: Props) => {
   const { listeners, setActivatorNodeRef } = useDraggable({
      id: blockId,
   });

   return (
      <div
         className="shadow-1 border-color bg-3 relative z-50
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
         <BlockTypeSelector onSelect={onInsertBelow} />
      </div>
   );
};
