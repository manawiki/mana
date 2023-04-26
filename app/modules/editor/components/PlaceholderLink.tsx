import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import Button from "./Button";
import * as PopoverPrimitive from "@radix-ui/react-popover";

type Input = {
   type: string;
   label: string;
   placeholder: string;
   title?: string;
   required?: boolean;
   pattern?: string;
};

type Values = Record<string, string>;

type Props = {
   icon: ComponentType;
   inputs: Record<string, Input>;
   onSubmit: (values: Values) => void;
   defaultOpen: boolean;
};

export default function Placeholder({ inputs, onSubmit, defaultOpen }: Props) {
   const [values, setValues] = useState<Values>({});
   const [open, setOpen] = useState(defaultOpen);
   const [ready, setReady] = useState(false);

   // Focus has to be changed in Editor.tsx which closes the menu, workaround
   useEffect(() => {
      setTimeout(() => setReady(true), 100);
   }, []);

   return (
      <>
         <PopoverPrimitive.Root
            open={open}
            onOpenChange={ready ? setOpen : () => {}}
         >
            <PopoverPrimitive.Anchor />
            <PopoverPrimitive.Portal>
               <PopoverPrimitive.Content
                  className="border-color bg-1 shadow-1 w-[320px] rounded-xl border p-5 shadow-lg laptop:w-[400px]"
                  sideOffset={-20}
               >
                  <form
                     className="block space-y-3.5"
                     onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(values);
                     }}
                  >
                     {Object.entries(inputs).map(
                        (
                           [
                              name,
                              {
                                 type,
                                 label,
                                 placeholder,
                                 title = undefined,
                                 required = false,
                                 pattern = undefined,
                              },
                           ],
                           index
                        ) => (
                           <div key={name} className="">
                              <label
                                 className="text-1 pb-1 pl-0.5 text-xs font-bold uppercase"
                                 htmlFor={name}
                              >
                                 {label}
                              </label>
                              <input
                                 className="input-text"
                                 id={name}
                                 type={type}
                                 placeholder={placeholder}
                                 title={title}
                                 required={required}
                                 pattern={pattern}
                                 value={values[name] || ""}
                                 onChange={(e) =>
                                    setValues((vals) => ({
                                       ...vals,
                                       [name]: e.target.value,
                                    }))
                                 }
                              />
                           </div>
                        )
                     )}
                     <div className="flex justify-end">
                        <Button
                           className="mt-2 block h-10 w-20 rounded-lg bg-emerald-500 text-sm font-bold text-white"
                           ariaLabel="Toggle Strikethrough"
                           type="submit"
                        >
                           Add Link
                        </Button>
                     </div>
                  </form>
                  <PopoverPrimitive.Arrow className="fill-white dark:fill-bg4Dark" />
               </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
         </PopoverPrimitive.Root>
      </>
   );
}
