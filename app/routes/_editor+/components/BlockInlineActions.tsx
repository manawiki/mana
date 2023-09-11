import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";

import Button from "~/components/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";

import { BlockTypeSelector } from "./BlockTypeSelector";
import type { CustomElement } from "../core/types";

type Props = {
   blockId: string;
   onInsertBelow: (block: CustomElement) => void;
};

export function BlockInlineActions({ blockId, onInsertBelow }: Props) {
   const { listeners, setActivatorNodeRef } = useDraggable({
      id: blockId,
   });

   return (
      <div
         className="shadow-1 border-color bg-3 relative z-50
         flex items-center overflow-hidden rounded-lg border shadow-sm"
      >
         <Tooltip>
            <TooltipTrigger>
               <Button
                  ariaLabel="Drag to reorder"
                  ref={setActivatorNodeRef}
                  {...listeners}
                  className="hover:bg-2 flex h-7 w-7 cursor-grab items-center justify-center"
               >
                  <GripVertical size={16} />
               </Button>
            </TooltipTrigger>
            <TooltipContent>Drag to reorder</TooltipContent>
         </Tooltip>
         <BlockTypeSelector onSelect={onInsertBelow} />
      </div>
   );
}
