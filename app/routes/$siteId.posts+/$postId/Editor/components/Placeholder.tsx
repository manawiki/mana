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
               <button className="relative flex items-center w-full rounded select-none cursor-pointer">
                  <span className="flex items-center mr-1">
                     <Icon />
                  </span>
                  {text}
               </button>
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Anchor />

            <PopoverPrimitive.Portal>
               <PopoverPrimitive.Content
                  className="w-[280px] bg-2 shadow shadow-1 rounded-lg"
                  sideOffset={-20}
               >
                  <form
                     className="p-4"
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
                           <div key={name} className="input-text block">
                              <label className="text-xs pb-1" htmlFor={name}>
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
                     <Button ariaLabel="Toggle Strikethrough" type="submit">
                        Embed
                     </Button>
                  </form>
                  <PopoverPrimitive.Arrow className="fill-white dark:fill-bg4Dark" />
               </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
         </PopoverPrimitive.Root>
      </>
   );
}
