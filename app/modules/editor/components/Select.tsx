import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { Fragment } from "react";

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
   const activeSelectItem = (item: any) =>
      items.find((obj) => obj.value === item)?.label;
   return (
      <Listbox value={value ?? defaultValue} onChange={onValueChange}>
         <div className="relative">
            <Listbox.Button
               disabled={disabled}
               className="bg-2 rounded-lg flex items-center
               border border-color text-xs font-bold gap-2 px-3 py-2 bg-1"
            >
               {({ value }) => (
                  <>
                     <span className="block truncate">
                        {activeSelectItem(value)}
                     </span>
                     <ChevronDown size={18} className="text-emerald-500" />
                  </>
               )}
            </Listbox.Button>
            <Transition
               as={Fragment}
               leave="transition ease-in duration-100"
               leaveFrom="opacity-100"
               leaveTo="opacity-0"
            >
               <Listbox.Options
                  className="absolute mt-1 max-h-60 w-40 overflow-auto rounded-md bg-2 py-1 
                  shadow shadow-1 focus:outline-none border border-color"
               >
                  {items.map((item, index) => (
                     <Listbox.Option
                        key={index}
                        className={({ active }) =>
                           `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-zinc-100 dark:bg-bg4Dark" : ""
                           }`
                        }
                        value={item.value}
                     >
                        {({ selected }) => (
                           <>
                              <span className="text-sm font-semibold truncate">
                                 {item.label}
                              </span>
                              {selected ? (
                                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Check
                                       size={18}
                                       className="text-emerald-500"
                                    />
                                 </span>
                              ) : null}
                           </>
                        )}
                     </Listbox.Option>
                  ))}
               </Listbox.Options>
            </Transition>
         </div>
      </Listbox>

      // <SelectPrimitive.Root
      //    defaultValue={defaultValue}
      //    value={value}
      //    onValueChange={onValueChange}
      // >
      //    <SelectPrimitive.Trigger
      //       className="bg-2 rounded-lg flex items-center
      //       border border-color text-xs font-bold gap-2 px-3 py-2 bg-1"
      //       disabled={disabled}
      //    >
      //       <SelectPrimitive.Value />
      //       <ChevronDown size={16} className="text-emerald-500" />
      //    </SelectPrimitive.Trigger>

      //    <SelectPrimitive.Portal>
      //       <SelectPrimitive.Content
      //          className="select-none z-10 shadow-lg shadow-1 -ml-0.5 bg-2 border overflow-hidden border-color rounded-lg w-40"
      //          onBlur={(e) => e.preventDefault()}
      //       >
      //          <SelectPrimitive.ScrollUpButton />
      //          <SelectPrimitive.Viewport>
      //             <div className="divide-y divide-color ">
      //                {items.map((item, index) => {
      //                   return (
      //                      <SelectPrimitive.SelectItem
      //                         key={index}
      //                         value={item.value}
      //                         className="flex items-center hover:bg-3 p-2.5 text-xs font-semibold cursor-default focus:outline-none"
      //                      >
      //                         <SelectPrimitive.SelectItemText>
      //                            {item.label}
      //                         </SelectPrimitive.SelectItemText>
      //                         <SelectPrimitive.SelectItemIndicator className="absolute right-3 flex items-center">
      //                            <Check
      //                               size={16}
      //                               className="text-emerald-500"
      //                            />
      //                         </SelectPrimitive.SelectItemIndicator>
      //                      </SelectPrimitive.SelectItem>
      //                   );
      //                })}
      //             </div>
      //          </SelectPrimitive.Viewport>
      //          <SelectPrimitive.ScrollDownButton />
      //       </SelectPrimitive.Content>
      //    </SelectPrimitive.Portal>
      // </SelectPrimitive.Root>
   );
}
