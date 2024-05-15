import React, { Fragment } from "react";

import {
   Description as HeadlessDescription,
   Label as HeadlessLabel,
   Menu as HeadlessMenu,
   MenuButton as HeadlessMenuButton,
   MenuHeading as HeadlessMenuHeading,
   MenuItem as HeadlessMenuItem,
   MenuItems as HeadlessMenuItems,
   MenuSection as HeadlessMenuSection,
   MenuSeparator as HeadlessMenuSeparator,
   Transition as HeadlessTransition,
   type DescriptionProps as HeadlessDescriptionProps,
   type LabelProps as HeadlessLabelProps,
   type MenuHeadingProps as HeadlessMenuHeadingProps,
   type MenuItemProps as HeadlessMenuItemProps,
   type MenuItemsProps as HeadlessMenuItemsProps,
   type MenuProps as HeadlessMenuProps,
   type MenuSectionProps as HeadlessMenuSectionProps,
   type MenuSeparatorProps as HeadlessMenuSeparatorProps,
} from "@headlessui/react";
import clsx from "clsx";

import { Button } from "./Button";
import { Link } from "./Link";

export function Dropdown(props: HeadlessMenuProps) {
   return <HeadlessMenu {...props} />;
}

export function DropdownButton<T extends React.ElementType = typeof Button>(
   props: React.ComponentProps<typeof HeadlessMenuButton<T>>,
) {
   return <HeadlessMenuButton as={Button} {...props} />;
}

interface DropdownMenuProps extends Omit<HeadlessMenuItemsProps, "anchor"> {
   anchor?: NonNullable<HeadlessMenuItemsProps["anchor"]>["to"];
}

export function DropdownMenu({
   anchor = "bottom",
   ...props
}: DropdownMenuProps) {
   return (
      <HeadlessTransition
         as={Fragment}
         leave="duration-100 ease-in"
         leaveTo="opacity-0"
      >
         <HeadlessMenuItems
            {...props}
            anchor={{
               to: anchor,
               gap: "var(--anchor-gap)",
               offset: "var(--anchor-offset)",
               padding: "var(--anchor-padding)",
            }}
            className={clsx(
               props.className,

               // Anchor positioning
               "[--anchor-gap:theme(spacing.2)] [--anchor-padding:theme(spacing.3)] data-[anchor~=end]:[--anchor-offset:4px] data-[anchor~=start]:[--anchor-offset:-4px]",

               // Base styles
               "isolate w-max rounded-xl p-1",

               // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
               "outline outline-1 outline-transparent focus:outline-none",

               // Handle scrolling when menu won't fit in viewport
               "overflow-y-auto",

               // Popover background
               "bg-white/75 backdrop-blur-xl dark:bg-dark400",

               // Shadows
               "shadow-lg ring-1 ring-zinc-950/10 dark:ring-inset dark:ring-white/10",
            )}
         />
      </HeadlessTransition>
   );
}

interface DropdownItemProps extends HeadlessMenuItemProps<"button"> {
   href?: string;
}

export function DropdownItem(props: DropdownItemProps) {
   return (
      <HeadlessMenuItem
         as={props.href ? Link : "button"}
         type={props.href ? undefined : "button"}
         {...props}
         className={clsx(
            props.className,

            // Base styles
            "group cursor-pointer rounded-lg px-3.5 py-2.5 focus:outline-none tablet:px-3 tablet:py-1.5 block w-full",

            // Text styles
            "text-left text-base/6 tablet:text-sm/6 forced-colors:text-[CanvasText]",

            // Focus
            "data-[focus]:bg-zinc-200/70 dark:data-[focus]:bg-dark500",

            // Disabled state
            "data-[disabled]:opacity-50",

            // Forced colors mode
            "forced-color-adjust-none forced-colors:data-[focus]:bg-[Highlight] forced-colors:data-[focus]:text-[HighlightText] forced-colors:[&>[data-slot=icon]]:data-[focus]:text-[HighlightText]",

            // Use subgrid when available but fallback to an explicit grid layout if not
            "items-center flex gap-2.5",
         )}
      />
   );
}

export function DropdownHeader({
   className,
   ...props
}: React.ComponentPropsWithoutRef<"div">) {
   return (
      <div
         {...props}
         className={clsx(
            className,
            "col-span-5 px-3.5 pb-1 pt-2.5 tablet:px-3",
         )}
      />
   );
}

export function DropdownSection({
   className,
   ...props
}: HeadlessMenuSectionProps) {
   return <HeadlessMenuSection {...props} className={clsx(className)} />;
}

export function DropdownHeading({
   className,
   ...props
}: HeadlessMenuHeadingProps) {
   return (
      <HeadlessMenuHeading
         {...props}
         className={clsx(
            className,
            "px-3.5 pb-1 pt-2 text-sm/5 font-medium text-zinc-500 tablet:px-3 tablet:text-xs/5 dark:text-zinc-400",
         )}
      />
   );
}

export function DropdownSeparator({
   className,
   ...props
}: HeadlessMenuSeparatorProps) {
   return (
      <HeadlessMenuSeparator
         {...props}
         className={clsx(
            className,
            "mx-3.5 my-1 h-px border-0 bg-zinc-950/5 tablet:mx-3 dark:bg-white/10 forced-colors:bg-[CanvasText]",
         )}
      />
   );
}

export function DropdownLabel({ className, ...props }: HeadlessLabelProps) {
   return (
      <HeadlessLabel
         {...props}
         data-slot="label"
         className={clsx(className)}
         {...props}
      />
   );
}

export function DropdownDescription({
   className,
   ...props
}: HeadlessDescriptionProps) {
   return (
      <HeadlessDescription
         data-slot="description"
         {...props}
         className={clsx(
            className,
            "text-sm/5 text-zinc-500 group-data-[focus]:text-white tablet:text-xs/5 dark:text-zinc-400 forced-colors:group-data-[focus]:text-[HighlightText]",
         )}
      />
   );
}

interface DropdownShortcutProps extends HeadlessDescriptionProps<"kbd"> {
   keys: string | string[];
}

export function DropdownShortcut({
   className,
   keys,
   ...props
}: DropdownShortcutProps) {
   return (
      <HeadlessDescription
         as="kbd"
         {...props}
         className={clsx(
            className,
            "col-start-5 row-start-1 flex justify-self-end",
         )}
      >
         {(Array.isArray(keys) ? keys : keys.split("")).map((char, index) => (
            <kbd
               key={index}
               className={clsx([
                  "min-w-[2ch] text-center font-sans capitalize text-zinc-400 group-data-[focus]:text-white forced-colors:group-data-[focus]:text-[HighlightText]",

                  // Make sure key names that are longer than one character (like "Tab") have extra space
                  index > 0 && char.length > 1 && "pl-1",
               ])}
            >
               {char}
            </kbd>
         ))}
      </HeadlessDescription>
   );
}
