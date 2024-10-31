import React, { Fragment } from "react";

import {
   Dialog as HeadlessDialog,
   DialogPanel as HeadlessDialogPanel,
   Transition as HeadlessTransition,
   TransitionChild as HeadlessTransitionChild,
   type DialogProps as HeadlessDialogProps,
} from "@headlessui/react";
import clsx from "clsx";
import { Icon } from "./Icon";

const sizes = {
   xs: "tablet:max-w-xs",
   tablet: "tablet:max-w-sm",
   md: "tablet:max-w-md",
   lg: "tablet:max-w-lg",
   xl: "tablet:max-w-xl",
   "2xl": "tablet:max-w-2xl",
   "3xl": "tablet:max-w-3xl",
   "4xl": "tablet:max-w-4xl",
   "5xl": "tablet:max-w-5xl",
};

export function Dialog({
   open,
   onClose,
   size = "lg",
   className,
   children,
   ...props
}: {
   size?: keyof typeof sizes;
   children: React.ReactNode;
} & HeadlessDialogProps) {
   return (
      <HeadlessTransition appear as={Fragment} show={open} {...props}>
         <HeadlessDialog onClose={onClose}>
            <HeadlessTransitionChild
               as={Fragment}
               enter="ease-out duration-100"
               enterFrom="opacity-0"
               enterTo="opacity-100"
               leave="ease-in duration-100"
               leaveFrom="opacity-100"
               leaveTo="opacity-0"
            >
               <div
                  className="z-50 fixed inset-0 flex w-screen justify-center overflow-y-auto bg-zinc-950/25 
               px-2 py-2 focus:outline-0 tablet:px-6 tablet:py-8 laptop:px-8 laptop:py-16 dark:bg-zinc-950/50"
               />
            </HeadlessTransitionChild>
            <HeadlessTransitionChild
               as="div"
               className="fixed z-50 inset-0 w-screen overflow-y-auto pt-14 tablet:pt-0"
               enter="ease-out duration-100"
               enterFrom="opacity-0 translate-y-12 tablet:translate-y-0"
               enterTo="opacity-100 translate-y-0"
               leave="ease-in duration-100"
               leaveFrom="opacity-100 translate-y-0"
               leaveTo="opacity-0 translate-y-12 tablet:translate-y-0"
            >
               <div className="grid min-h-full grid-rows-[1fr_auto] justify-items-center tablet:grid-rows-[1fr_auto_3fr] tablet:p-6">
                  <HeadlessTransitionChild
                     as={HeadlessDialogPanel}
                     className={clsx(
                        className,
                        sizes[size],
                        "row-start-2 w-full min-w-0 rounded-t-3xl max-tablet:pb-20 bg-3 p-[--gutter] shadow-lg ring-1 ring-zinc-950/10 [--gutter:theme(spacing.5)] tablet:mb-auto tablet:rounded-2xl  dark:ring-white/20 forced-colors:outline",
                     )}
                     enter="ease-out duration-100"
                     enterFrom="tablet:scale-95"
                     enterTo="tablet:scale-100"
                     leave="ease-in duration-100"
                     leaveFrom="tablet:scale-100"
                     leaveTo="tablet:scale-100"
                  >
                     {children}
                  </HeadlessTransitionChild>
                  <div className="z-50 flex tablet:hidden items-center justify-center fixed bottom-0 left-0 w-full px-3 pb-6">
                     <button
                        onClick={() => onClose(false)}
                        className="z-50 inline-flex tablet:hidden items-center gap-1 text-zinc-100 font-semibold dark:text-zinc-900
                     text-sm justify-between dark:bg-zinc-100 bg-zinc-900 py-2 rounded-full pl-3 pr-4 shadow-lg shadow-zinc-200  dark:shadow-zinc-900/50"
                     >
                        <span>Close</span>
                        <Icon name="chevron-down" size={16} />
                     </button>
                  </div>
               </div>
            </HeadlessTransitionChild>
         </HeadlessDialog>
      </HeadlessTransition>
   );
}
