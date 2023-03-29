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
            className="bg-2 rounded-lg flex items-center 
            border border-color text-xs font-bold gap-2 px-3 py-2 bg-1"
            disabled={disabled}
         >
            <SelectPrimitive.Value />
            <ChevronDown size={16} className="text-emerald-500" />
         </SelectPrimitive.Trigger>

         <SelectPrimitive.Portal>
            <SelectPrimitive.Content
               className="select-none z-10 shadow-lg shadow-1 -ml-0.5 bg-2 border overflow-hidden border-color rounded-lg w-40"
               onBlur={(e) => e.preventDefault()}
            >
               <SelectPrimitive.ScrollUpButton />
               <SelectPrimitive.Viewport>
                  <div className="divide-y divide-color ">
                     {items.map((item, index) => {
                        return (
                           <SelectPrimitive.SelectItem
                              key={index}
                              value={item.value}
                              className="flex items-center hover:bg-3 p-2.5 text-xs font-semibold cursor-default focus:outline-none"
                           >
                              <SelectPrimitive.SelectItemText>
                                 {item.label}
                              </SelectPrimitive.SelectItemText>
                              <SelectPrimitive.SelectItemIndicator className="absolute right-3 flex items-center">
                                 <Check
                                    size={16}
                                    className="text-emerald-500"
                                 />
                              </SelectPrimitive.SelectItemIndicator>
                           </SelectPrimitive.SelectItem>
                        );
                     })}
                  </div>
               </SelectPrimitive.Viewport>
               <SelectPrimitive.ScrollDownButton />
            </SelectPrimitive.Content>
         </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
   );
}
