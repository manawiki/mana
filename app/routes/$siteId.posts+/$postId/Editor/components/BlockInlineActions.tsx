import styles from "./BlockInlineActions.module.css";
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
      <div className={styles.inline_actions}>
         <Tooltip content="Delete">
            <Button
               appearance="ghost"
               onClick={onDelete}
               ariaLabel="Delete"
               isSquare
            >
               <Minus />
            </Button>
         </Tooltip>
         <BlockTypeSelector onSelect={onInsertBelow}>
            <Button appearance="ghost" ariaLabel="Insert block below" isSquare>
               <Plus />
            </Button>
         </BlockTypeSelector>
         <Tooltip content="Drag to reorder">
            <Button
               appearance="ghost"
               ariaLabel="Drag to reorder"
               ref={setActivatorNodeRef}
               {...listeners}
               isSquare
               className={styles.button_drag}
            >
               <GripVertical />
            </Button>
         </Tooltip>
      </div>
   );
}
