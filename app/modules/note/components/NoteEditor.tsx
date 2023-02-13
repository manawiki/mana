import type { Note } from "@mana/db";
import { Form, useNavigate, useNavigation } from "@remix-run/react";
import { useRef, Suspense, Fragment, useState, useEffect } from "react";
import { Modal } from "~/components/Modal";
import { NoteViewer } from "./NoteViewer";
import useWindowDimensions from "~/hooks/use-window-dimensions";
import { Tab } from "@headlessui/react";
import { NoteSelector } from "../gui/NoteSelector";
import type { MDXComponents } from "mdx/types";
import { Loader2, Save, X } from "lucide-react";
import { isAdding } from "~/utils";

export type NoteEditorType = {
   note: Note;
   components?: MDXComponents;
   scope?: Record<string, any>;
};

//Renders a Note Editor as responsive modal
export default function NoteEditor({
   note,
   components,
   scope,
}: NoteEditorType) {
   const { width } = useWindowDimensions();
   const transition = useNavigation();
   const adding = isAdding(transition, "saveNote");
   const ref = useRef() as React.MutableRefObject<HTMLButtonElement>;

   //decide which layout to render
   const NoteLayout = width && width > 1024 ? NoteSideLayout : NoteTabLayout;
   const [isOpen, setIsOpen] = useState(true);
   return (
      <Modal
         show={isOpen}
         onClose={() => {
            ref.current.click();
            setIsOpen(false);
         }}
      >
         <section>
            <div
               className="max-laptop:px-4 max-laptop:bg-1 sticky left-0 
               top-0 z-40 flex h-16 w-full items-center justify-between"
            >
               <div
                  className="flex items-center gap-3 rounded-lg py-2 
               laptop:bg-white/90 laptop:px-4 dark:laptop:bg-zinc-800/90"
               >
                  <span className="font-bold">
                     {typeof note?.ui === "object" && note?.ui?.name}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  <span className="text-sm">
                     {typeof note?.ui === "object" && note?.ui?.description}
                  </span>
               </div>
               <div className="flex items-center gap-3">
                  <button
                     type="submit"
                     name="intent"
                     value="saveNote"
                     //This associates the submit with the form outside hierachy
                     form="note-editor"
                     ref={ref}
                     className="font-boldtext-white flex h-10 items-center justify-center gap-2
                     rounded-full bg-blue-500 px-5 font-bold text-white shadow-blue-900 hover:bg-blue-600
                     dark:bg-blue-900 dark:focus:bg-blue-800 laptop:shadow"
                  >
                     {adding ? (
                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-white" />
                     ) : null}
                     <span>Done</span>
                  </button>
               </div>
            </div>
            <Form id="note-editor" key={note.id} method="post">
               <NoteLayout note={note}>
                  <Suspense fallback={<div>Loading...</div>}>
                     {note?.source && (
                        <NoteViewer
                           note={note}
                           components={components}
                           scope={scope}
                        />
                     )}
                  </Suspense>
               </NoteLayout>
            </Form>
         </section>
      </Modal>
   );
}
export function NoteSideLayout({
   note,
   children,
}: React.PropsWithChildren<{ note: Note }>) {
   return (
      <div
         className="bg-1 min-[1520px]:w-[1520px] relative grid min-h-[calc(100vh-200px)] 
         w-[calc(100vw-18px)] min-w-full grid-cols-2 gap-6 rounded-lg
         p-5 shadow-lg dark:shadow-black/50"
      >
         <div className="min-w-full max-w-[728px]">
            <NoteSelector note={note} />
         </div>
         <div className="min-w-full max-w-[728px]">{children}</div>
      </div>
   );
}

export function NoteTabLayout({
   note,
   children,
}: React.PropsWithChildren<{ note: Note }>) {
   return (
      <div className="bg-1 min-h-screen min-w-[100vw]">
         <Tab.Group>
            <Tab.List
               className="border-color bg-2 sticky left-0
              top-16 grid h-12 w-full grid-cols-2 
              border-y"
            >
               <Tab as={Fragment}>
                  {({ selected }) => (
                     <button
                        className={`
                              ${
                                 selected
                                    ? "bg-blue-100 font-bold text-blue-500 dark:bg-blue-900/50 dark:text-white"
                                    : ""
                              } focus:outline-none`}
                     >
                        Edit
                     </button>
                  )}
               </Tab>
               <Tab as={Fragment}>
                  {({ selected }) => (
                     <button
                        className={`
                      ${
                         selected
                            ? "bg-blue-100 font-bold text-blue-500 dark:bg-blue-900/50 dark:text-white"
                            : ""
                      } focus:outline-none`}
                     >
                        Preview
                     </button>
                  )}
               </Tab>
            </Tab.List>
            <Tab.Panels>
               <Tab.Panel className="p-4">
                  <NoteSelector note={note} />
               </Tab.Panel>
               <Tab.Panel className="p-4">{children}</Tab.Panel>
            </Tab.Panels>
         </Tab.Group>
      </div>
   );
}
