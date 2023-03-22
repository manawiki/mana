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
   text: string;
   inputs: Record<string, Input>;
   onSubmit: (values: Values) => void;
   defaultOpen: boolean;
};

export default function Placeholder({
   icon: Icon,
   text,
   inputs,
   onSubmit,
   defaultOpen,
}: Props) {
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
            <PopoverPrimitive.Trigger asChild>
               <button
                  className="relative border flex dark:border-zinc-600 hover:border-zinc-300 border-zinc-200 border-dotted gap-4 dark:hover:border-zinc-500
                  items-center w-full font-semibold rounded-lg bg-zinc-50 dark:bg-bg4Dark mb-3 p-3 text-sm select-none cursor-pointer"
               >
                  <span className="w-5 flex items-center justify-center text-emerald-500 h-5">
                     <Icon />
                  </span>
                  {text}
               </button>
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Anchor />
            <PopoverPrimitive.Portal>
               <PopoverPrimitive.Content
                  className="w-[320px] laptop:w-[400px] border border-color bg-1 p-5 shadow-lg shadow-1 rounded-xl"
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
                                 className="text-xs uppercase pl-0.5 text-1 font-bold pb-1"
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
                           className="block h-10 font-bold text-sm w-20 mt-2 text-white bg-emerald-500 rounded-lg"
                           ariaLabel="Toggle Strikethrough"
                           type="submit"
                        >
                           Embed
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
