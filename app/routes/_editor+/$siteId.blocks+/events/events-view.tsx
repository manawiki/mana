import type { ReactNode } from "react";

import { Disclosure } from "@headlessui/react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

import type {
   EventItemElement,
   EventsElement,
} from "~/routes/_editor+/core/types";

import { CountdownTimer } from "./CountdownTimer";

type EventProps = {
   element: EventsElement;
   children: ReactNode;
};

type EventItemProps = {
   element: EventItemElement;
   children: ReactNode;
};

export function BlockEventsView({ children }: EventProps) {
   return (
      <div
         className="divide-color shadow-1 border-color
         bg-3 relative z-10 divide-y overflow-hidden rounded-lg border  shadow-sm [&>*:nth-of-type(4n+1)]:bg-zinc-50
          [&>*:nth-of-type(4n+1)]:dark:bg-bg2Dark [&>*:nth-of-type(4n+3)]:bg-white [&>*:nth-of-type(4n+3)]:dark:bg-neutral-800/50"
      >
         {children}
      </div>
   );
}

export function BlockEventItemView({ element, children }: EventItemProps) {
   return (
      <Disclosure>
         {({ open }) => (
            <>
               <div className="flex justify-between gap-3 p-2.5 pl-4">
                  <div className="flex items-center text-sm font-bold">
                     {element.label}
                  </div>
                  <section className="flex items-center gap-2.5">
                     <CountdownTimer element={element} />
                     <Disclosure.Button className="flex items-center justify-between">
                        <div
                           contentEditable={false}
                           className="bg-3 shadow-1 border-color flex h-8 w-8 flex-none items-center 
                        justify-center rounded-full border pt-0.5 shadow-sm"
                        >
                           <ChevronDown
                              className={clsx(
                                 open ? "rotate-180" : "",
                                 "transform transition duration-300 ease-in-out"
                              )}
                              size={18}
                           />
                        </div>
                     </Disclosure.Button>
                  </section>
               </div>
               <Disclosure.Panel className="px-4 py-3 text-sm" unmount={false}>
                  {children}
               </Disclosure.Panel>
            </>
         )}
      </Disclosure>
   );
}
