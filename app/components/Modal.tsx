import { Fragment } from "react";

import {
   Dialog,
   DialogPanel,
   Transition,
   TransitionChild,
} from "@headlessui/react";

//A modal generic wrapper, pass in show and onClose to control the modal state, otherwise use it as a route modal
export function Modal({
   show = true,
   onClose = () => {},
   children,
   unmount = true,
}: {
   show?: boolean;
   onClose: () => void;
   children?: React.ReactNode;
   unmount?: boolean;
}) {
   return (
      <Transition appear show={show} as={Fragment}>
         <Dialog
            unmount={unmount}
            onClose={onClose}
            as="div"
            className="relative z-50"
         >
            <div className="h-full w-full">
               <TransitionChild
                  //backdrop transition
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
               >
                  <div
                     className="fixed inset-0 bg-slate-600/70 dark:bg-black/70"
                     aria-hidden="true"
                  />
               </TransitionChild>
               <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center">
                     <TransitionChild
                        //modal transition
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                     >
                        {/* Container to center the panel */}
                        {/* The actual dialog panel  */}
                        <DialogPanel>{children}</DialogPanel>
                     </TransitionChild>
                  </div>
               </div>
            </div>
         </Dialog>
      </Transition>
   );
}
