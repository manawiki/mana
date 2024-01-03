import { clsx } from "clsx";

import { Link } from "./Link";

export function Text({
   className,
   ...props
}: React.ComponentPropsWithoutRef<"p">) {
   return (
      <p
         {...props}
         data-slot="text"
         className={clsx(
            className,
            "text-zinc-500 tablet:text-sm dark:text-zinc-400",
         )}
      />
   );
}

export function TextLink({
   className,
   ...props
}: React.ComponentPropsWithoutRef<typeof Link>) {
   return (
      <Link
         {...props}
         className={clsx(
            className,
            "text-zinc-950 underline decoration-zinc-950/50 data-[hover]:decoration-zinc-950 dark:text-white dark:decoration-white/50 dark:data-[hover]:decoration-white",
         )}
      />
   );
}

export function Strong({
   className,
   ...props
}: React.ComponentPropsWithoutRef<"strong">) {
   return (
      <strong
         {...props}
         className={clsx(
            className,
            "font-medium text-zinc-950 dark:text-white",
         )}
      />
   );
}

export function Code({
   className,
   ...props
}: React.ComponentPropsWithoutRef<"code">) {
   return (
      <code
         {...props}
         className={clsx(
            className,
            "rounded border border-zinc-950/10 bg-zinc-950/[2.5%] px-0.5 text-tablet font-medium text-zinc-950 tablet:text-[0.8125rem] dark:border-white/20 dark:bg-white/5 dark:text-white",
         )}
      />
   );
}
