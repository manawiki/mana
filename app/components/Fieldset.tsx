import React from "react";

import {
   Description as HeadlessDescription,
   Field as HeadlessField,
   Fieldset as HeadlessFieldset,
   Label as HeadlessLabel,
   Legend as HeadlessLegend,
   type DescriptionProps as HeadlessDescriptionProps,
   type FieldProps as HeadlessFieldProps,
   type FieldsetProps as HeadlessFieldsetProps,
   type LabelProps as HeadlessLabelProps,
   type LegendProps as HeadlessLegendProps,
} from "@headlessui/react";
import clsx from "clsx";

interface FieldsetProps extends HeadlessFieldsetProps {
   disabled?: boolean;
}

export function Fieldset({ className, ...props }: FieldsetProps) {
   return (
      <HeadlessFieldset
         {...props}
         className={clsx(
            className,
            "[&>*+[data-slot=control]]:mt-6 [&>[data-slot=text]]:mt-1",
         )}
      />
   );
}

export function Legend({ ...props }: HeadlessLegendProps) {
   return (
      <HeadlessLegend
         {...props}
         data-slot="legend"
         className={clsx(
            props.className,
            "font-bold data-[disabled]:opacity-50",
         )}
      />
   );
}

export function FieldGroup({
   className,
   ...props
}: React.ComponentPropsWithoutRef<"div">) {
   return (
      <div
         {...props}
         data-slot="control"
         className={clsx(className, "space-y-6")}
      />
   );
}

export function Field({ className, ...props }: HeadlessFieldProps) {
   return (
      <HeadlessField
         className={clsx(
            className,
            "[&>[data-slot=label]+[data-slot=control]]:mt-2",
            "[&>[data-slot=label]+[data-slot=description]]:mt-1",
            "[&>[data-slot=description]+[data-slot=control]]:mt-2",
            "[&>[data-slot=control]+[data-slot=description]]:mt-2",
            "[&>[data-slot=control]+[data-slot=error]]:mt-2",
            "[&>[data-slot=label]]:font-medium",
         )}
         {...props}
      />
   );
}

interface LabelProps extends HeadlessLabelProps {
   className?: string;
}

export function Label({ className, ...props }: LabelProps) {
   return (
      <HeadlessLabel
         {...props}
         data-slot="label"
         className={clsx(
            className,
            "select-none !font-semibold data-[disabled]:opacity-50 text-sm",
         )}
      />
   );
}

interface DescriptionProps extends HeadlessDescriptionProps {
   className?: string;
   disabled?: boolean;
}

export function Description({
   className,
   disabled,
   ...props
}: DescriptionProps) {
   return (
      <HeadlessDescription
         {...props}
         data-slot="description"
         className={clsx(
            className,
            "text-sm text-zinc-500 data-[disabled]:opacity-50 dark:text-zinc-400",
         )}
      />
   );
}

export function ErrorMessage({
   className,
   disabled,
   ...props
}: DescriptionProps) {
   return (
      <HeadlessDescription
         {...props}
         data-slot="error"
         className={clsx(
            className,
            "text-sm text-red-600 data-[disabled]:opacity-50 tablet:text-tablet/6 dark:text-red-500",
         )}
      />
   );
}
