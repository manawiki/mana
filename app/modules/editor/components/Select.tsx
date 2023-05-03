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
               className="bg-2 border-color bg-1 flex
               items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold"
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
                  className="bg-2 shadow-1 border-color absolute mt-1 max-h-60 w-40 overflow-auto 
                  rounded-md border py-1 shadow focus:outline-none"
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
                              <span className="truncate text-sm font-semibold">
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
   );
}
