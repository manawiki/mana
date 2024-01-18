import React, { Fragment } from "react";

import {
   Description as HeadlessDescription,
   Dialog as HeadlessDialog,
   DialogPanel as HeadlessDialogPanel,
   DialogTitle as HeadlessDialogTitle,
   Transition as HeadlessTransition,
   TransitionChild as HeadlessTransitionChild,
   type DialogProps as HeadlessDialogProps,
} from "@headlessui/react";
import clsx from "clsx";

import { Text } from "./Text";

const sizes = {
   xs: "tablet:max-w-xs",
   sm: "tablet:max-w-sm",
   md: "tablet:max-w-md",
   lg: "tablet:max-w-lg",
   xl: "tablet:max-w-xl",
   "2xl": "tablet:max-w-2xl",
   "3xl": "tablet:max-w-3xl",
   "4xl": "tablet:max-w-4xl",
   "5xl": "tablet:max-w-5xl",
};

export function Alert({
   open,
   onClose,
   size = "md",
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
                  className="z-50 fixed inset-0 flex w-screen justify-center overflow-y-auto bg-zinc-950/25 px-2 py-2 
               focus:outline-0 tablet:px-6 tablet:py-8 desktop:px-8 desktop:py-16 dark:bg-zinc-950/50"
               />
            </HeadlessTransitionChild>
            <HeadlessTransitionChild
               className="fixed z-50 inset-0 w-screen overflow-y-auto pt-6 tablet:pt-0"
               enter="ease-out duration-100"
               enterFrom="opacity-0"
               enterTo="opacity-100"
               leave="ease-in duration-100"
               leaveFrom="opacity-100"
               leaveTo="opacity-0"
            >
               <div className="grid min-h-full grid-rows-[1fr_auto_1fr] justify-items-center p-8 tablet:grid-rows-[1fr_auto_3fr] tablet:p-4">
                  <HeadlessTransitionChild
                     as={HeadlessDialogPanel}
                     className={clsx(
                        className,
                        sizes[size],
                        "row-start-2 w-full rounded-2xl bg-3 p-8 shadow-lg ring-1 ring-zinc-950/10 tablet:rounded-2xl tablet:p-6 dark:ring-white/20 forced-colors:outline",
                     )}
                     enter="ease-out duration-100"
                     enterFrom="scale-95"
                     enterTo="scale-100"
                     leave="ease-in duration-100"
                     leaveFrom="scale-100"
                     leaveTo="scale-100"
                  >
                     {children}
                  </HeadlessTransitionChild>
               </div>
            </HeadlessTransitionChild>
         </HeadlessDialog>
      </HeadlessTransition>
   );
}

export function AlertTitle({
   className,
   ...props
}: React.ComponentPropsWithoutRef<"div">) {
   return (
      <HeadlessDialogTitle
         {...props}
         className={clsx(
            className,
            "text-balance text-center text-base/6 font-semibold tablet:text-wrap tablet:text-left tablet:text-sm/6",
         )}
      />
   );
}

export function AlertDescription({
   className,
   ...props
}: React.ComponentPropsWithoutRef<"div">) {
   return (
      <HeadlessDescription
         as={Text}
         {...props}
         className={clsx(
            className,
            "mt-2 text-pretty text-center tablet:text-left",
         )}
      />
   );
}

export function AlertBody({
   className,
   ...props
}: React.ComponentPropsWithoutRef<"div">) {
   return <div {...props} className={clsx(className, "mt-4")} />;
}

export function AlertActions({
   className,
   ...props
}: React.ComponentPropsWithoutRef<"div">) {
   return (
      <div
         {...props}
         className={clsx(
            className,
            "mt-6 flex flex-col-reverse items-center justify-end gap-3 *:w-full tablet:mt-4 tablet:flex-row tablet:*:w-auto",
         )}
      />
   );
}
