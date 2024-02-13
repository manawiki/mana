import { Disclosure } from "@headlessui/react";
import clsx from "clsx";
import type { RenderElementProps } from "slate-react";

import { Icon } from "~/components/Icon";
import type {
   EventItemElement,
   EventsElement,
} from "~/routes/_editor+/core/types";

import { CountdownTimer } from "./CountdownTimer";

export function BlockEventsView({
   attributes,
   children,
   element,
}: RenderElementProps & { element: EventsElement }) {
   return (
      <div
         className="shadow-1 bg-3 divide-color-sub border-color-sub relative z-10 mb-3 divide-y overflow-hidden
      rounded-lg border shadow-sm [&>*:nth-last-child(2)]:rounded-b-lg [&>*:nth-of-type(4n+1)]:bg-zinc-50
   [&>*:nth-of-type(4n+1)]:dark:bg-dark350 [&>*:nth-of-type(4n+3)]:bg-white [&>*:nth-of-type(4n+3)]:dark:bg-bg3Dark"
         {...attributes}
      >
         {children}
      </div>
   );
}

export function BlockEventItemView({
   element,
   children,
   attributes,
}: RenderElementProps & { element: EventItemElement }) {
   return (
      <Disclosure {...attributes}>
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
                           <Icon
                              name="chevron-down"
                              className={clsx(
                                 open ? "rotate-180" : "",
                                 "transform transition duration-300 ease-in-out",
                              )}
                              size={18}
                           />
                        </div>
                     </Disclosure.Button>
                  </section>
               </div>
               <Disclosure.Panel
                  className="px-3 pb-1 pt-3 text-sm"
                  unmount={false}
               >
                  {children}
               </Disclosure.Panel>
            </>
         )}
      </Disclosure>
   );
}
