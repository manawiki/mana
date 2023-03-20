import styles from "./Select.module.css";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

type Props = {
   defaultValue?: string;
   value?: string;
   onValueChange?: (value: string) => void;
   disabled?: boolean;
   items: {
      label: string;
      value: string;
      disabled?: boolean;
   }[];
};

export default function Select({
   defaultValue,
   value,
   onValueChange,
   disabled,
   items,
}: Props) {
   return (
      <SelectPrimitive.Root
         defaultValue={defaultValue}
         value={value}
         onValueChange={onValueChange}
      >
         <SelectPrimitive.Trigger
            className={styles.select_trigger}
            disabled={disabled}
         >
            <SelectPrimitive.Value />
            <ChevronDown className={styles.select_trigger_chevron} />
         </SelectPrimitive.Trigger>

         <SelectPrimitive.Portal>
            <SelectPrimitive.Content
               className={styles.select_content}
               onBlur={(e) => e.preventDefault()}
            >
               <SelectPrimitive.ScrollUpButton />
               <SelectPrimitive.Viewport>
                  {items.map((item, index) => {
                     return (
                        <SelectPrimitive.SelectItem
                           key={index}
                           value={item.value}
                           className={styles.select_item}
                        >
                           <SelectPrimitive.SelectItemText>
                              {item.label}
                           </SelectPrimitive.SelectItemText>
                           <SelectPrimitive.SelectItemIndicator
                              className={styles.select_item_indicator}
                           >
                              <Check />
                           </SelectPrimitive.SelectItemIndicator>
                        </SelectPrimitive.SelectItem>
                     );
                  })}
               </SelectPrimitive.Viewport>
               <SelectPrimitive.ScrollDownButton />
            </SelectPrimitive.Content>
         </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
   );
}
