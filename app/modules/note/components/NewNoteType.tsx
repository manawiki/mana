import { Tab } from "@headlessui/react";
import { Form, useNavigate, useNavigation } from "@remix-run/react";
import { Loader2, Plus, Type, X } from "lucide-react";
import { Fragment, useRef, useState } from "react";
import { Modal } from "~/components/Modal";
import { isAdding } from "~/utils";

export const NewNoteType = ({ noteTypes }) => {
   const navigate = useNavigate();

   const transition = useNavigation();
   const adding = isAdding(transition, "addNewSection");
   let formRef = useRef();
   const [isOpen, setIsOpen] = useState(true);

   return (
      <Modal
         show={isOpen}
         onClose={() => {
            setIsOpen(false);
            navigate(-1);
         }}
      >
         <div
            className="border-color bg-1 w-full max-w-lg transform
            rounded-2xl border-2 py-6 px-5 text-left align-middle shadow-xl transition-all"
         >
            <Tab.Group>
               <Tab.List className="grid grid-cols-2 gap-4 pb-4">
                  <Tab as={Fragment}>
                     {({ selected }) => (
                        <button
                           className={`
                            ${
                               selected
                                  ? "bg-blue-50 font-bold text-blue-500 dark:bg-blue-900/50 dark:text-white"
                                  : ""
                            } bg-2 h-10 rounded-lg focus:outline-none`}
                        >
                           Default
                        </button>
                     )}
                  </Tab>
                  <Tab as={Fragment}>
                     {({ selected }) => (
                        <button
                           className={`
                            ${
                               selected
                                  ? "bg-blue-50 font-bold text-blue-500 dark:bg-blue-900/50 dark:text-white"
                                  : ""
                            } bg-2 h-10 rounded-lg focus:outline-none`}
                        >
                           Custom
                        </button>
                     )}
                  </Tab>
               </Tab.List>
               <Tab.Panels>
                  <Tab.Panel>
                     {noteTypes?.docs.length === 0 ? null : (
                        <>
                           <div className="">
                              {noteTypes?.docs.map((type) => (
                                 <div key={type.id}>
                                    {
                                       <Form
                                          //@ts-ignore
                                          ref={formRef}
                                          className="bg-2 border-color flex items-center gap-3 rounded-lg border p-3"
                                          method="post"
                                       >
                                          <div
                                             className="flex h-11 w-11 flex-none items-center justify-center overflow-hidden rounded-full
                                                                border border-blue-100 bg-blue-50 text-blue-500 dark:border-blue-900 dark:bg-blue-900/20"
                                          >
                                             <Type size={20} />
                                          </div>
                                          <div className="flex-grow">
                                             <div>{type.name}</div>
                                             <div className="text-1 text-sm">
                                                {type.description}
                                             </div>
                                          </div>
                                          <input
                                             type="hidden"
                                             name="ui"
                                             value={type.id}
                                          />
                                          <button
                                             type="submit"
                                             name="intent"
                                             value="addNewSection"
                                             className="bg-1 border-color flex h-10 items-center justify-center gap-2 rounded-full
                                                            border pl-3 pr-5 font-bold shadow shadow-zinc-100 hover:bg-blue-50 focus:shadow-none
                                                            dark:shadow-zinc-900 dark:hover:bg-blue-900/50"
                                          >
                                             {adding ? (
                                                <Loader2 className="mx-auto h-5 w-5 animate-spin text-zinc-300" />
                                             ) : (
                                                <Plus
                                                   className="text-blue-500"
                                                   size={20}
                                                />
                                             )}
                                             <span>Add</span>
                                          </button>
                                       </Form>
                                    }
                                 </div>
                              ))}
                           </div>
                        </>
                     )}
                  </Tab.Panel>
                  <Tab.Panel>None</Tab.Panel>
               </Tab.Panels>
            </Tab.Group>
            <button
               className="absolute -right-4 -top-4 flex h-8 w-8
                                        items-center justify-center rounded-full border-2 border-red-300 bg-white
                                      hover:bg-red-50 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
               onClick={() => {
                  setIsOpen(false);
                  navigate(-1);
               }}
            >
               <X className="h-5 w-5 text-red-400" />
            </button>
         </div>
      </Modal>
   );
};
