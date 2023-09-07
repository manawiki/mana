import type { ReactNode } from "react";
import { useState } from "react";

import { Disclosure } from "@headlessui/react";

import type { EventsElement } from "~/routes/_editor+/functions/types";

type Props = {
   element: EventsElement;
   children: ReactNode;
};

export function BlockEventsView({ element, children }: Props) {
   const [disclosureState, setDisclosureState] = useState(0);

   function handleDisclosureChange(state: number) {
      if (state === disclosureState) {
         setDisclosureState(0); // close all of them
      } else {
         setDisclosureState(state); // open the clicked disclosure
      }
   }

   return (
      <section className="my-6">
         <>
            {element.children.map((row, index) => {
               return (
                  <Disclosure key={row.id}>
                     {({ open, close }) => (
                        <>
                           <Disclosure.Button
                              className="flex items-center"
                              onClick={() => handleDisclosureChange(index)}
                           >
                              <span>{row.label}</span>
                              {open ? <div>Up</div> : <div>Down</div>}
                           </Disclosure.Button>
                           {disclosureState === index && (
                              <Disclosure.Panel>
                                 <div>{children}</div>
                              </Disclosure.Panel>
                           )}
                        </>
                     )}
                  </Disclosure>
               );
            })}
         </>
      </section>
   );
}
