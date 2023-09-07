import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { Disclosure } from "@headlessui/react";
import type { Descendant } from "slate";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import { EditorBlocks } from "~/routes/_editor+/components/EditorBlocks";
import { Leaf } from "~/routes/_editor+/components/Leaf";
import type {
   CustomText,
   EventsElement,
} from "~/routes/_editor+/functions/types";

type Props = {
   element: EventsElement;
   children: CustomText[];
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

const EventsEditorView = ({ content }: { content: Descendant[] }) => {
   const editor = useMemo(() => withReact(createEditor()), []);
   return (
      <Slate editor={editor} initialValue={content}>
         <Editable
            renderElement={EditorBlocks}
            renderLeaf={Leaf}
            readOnly={true}
         />
      </Slate>
   );
};
