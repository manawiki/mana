import React, { createContext, useContext, useState } from "react";

import { clsx } from "clsx";

import { Link } from "./Link";

const TableContext = createContext<{
   bleed: boolean;
   dense: boolean;
   grid: boolean;
   striped: boolean;
   framed: boolean;
}>({
   bleed: false,
   dense: false,
   grid: false,
   striped: false,
   framed: false,
});

interface TableProps extends React.ComponentPropsWithoutRef<"div"> {
   bleed?: boolean;
   dense?: boolean;
   grid?: boolean;
   striped?: boolean;
   framed?: boolean;
}

export function Table({
   bleed = false,
   dense = false,
   grid = false,
   striped = false,
   framed = false,
   className,
   children,
   ...props
}: TableProps) {
   return (
      <TableContext.Provider
         value={
            { bleed, dense, grid, striped, framed } as React.ContextType<
               typeof TableContext
            >
         }
      >
         <div className="flow-root">
            <div
               {...props}
               className={clsx(
                  className,
                  `-mx-[--gutter] overflow-x-auto whitespace-nowrap scrollbar 
                  dark:scrollbar-thumb-zinc-500 dark:scrollbar-track-dark450
                  scrollbar-thumb-zinc-300 scrollbar-track-zinc-100`,
                  framed &&
                     "border-y mobile:border mobile:rounded-lg border-color-sub dark:bg-dark350 shadow-sm shadow-zinc-100 dark:shadow-zinc-800/50",
               )}
            >
               <div
                  className={clsx(
                     "inline-block min-w-full align-middle",
                     !bleed && "tablet:px-[--gutter]",
                  )}
               >
                  <table className="min-w-full text-left text-sm/6">
                     {children}
                  </table>
               </div>
            </div>
         </div>
      </TableContext.Provider>
   );
}

export function TableHead({
   className,
   ...props
}: React.ComponentPropsWithoutRef<"thead">) {
   return <thead className={clsx(className)} {...props} />;
}

export function TableBody(props: React.ComponentPropsWithoutRef<"tbody">) {
   let { striped } = useContext(TableContext);

   return (
      <tbody
         className={clsx(!striped && "divide-y divide-color-sub")}
         {...props}
      />
   );
}

const TableRowContext = createContext<{
   href?: string;
   target?: string;
   title?: string;
   grouped?: boolean;
}>({
   href: undefined,
   target: undefined,
   title: undefined,
   grouped: false,
});

interface TableRowProps extends React.ComponentPropsWithoutRef<"tr"> {
   href?: string;
   target?: string;
   title?: string;
}

export function TableRow({
   href,
   target,
   title,
   className,
   children,
   ...props
}: TableRowProps) {
   let { striped } = useContext(TableContext);

   return (
      <TableRowContext.Provider
         value={
            { href, target, title } as React.ContextType<typeof TableRowContext>
         }
      >
         <tr
            {...props}
            className={clsx(
               className,
               href &&
                  "has-[[data-row-link][data-focus]]:outline has-[[data-row-link][data-focus]]:outline-2 has-[[data-row-link][data-focus]]:-outline-offset-2 has-[[data-row-link][data-focus]]:outline-blue-500 dark:focus-within:bg-white/[2.5%]",
               striped && "even:bg-zinc-950/[2.5%] dark:even:bg-white/[2.5%]",
               href && striped && "hover:bg-zinc-950/5 dark:hover:bg-white/5",
               href &&
                  !striped &&
                  "hover:bg-zinc-950/[2.5%] dark:hover:bg-white/[2.5%]",
            )}
         >
            {children}
         </tr>
      </TableRowContext.Provider>
   );
}

interface TableHeaderProps extends React.ComponentPropsWithoutRef<"th"> {
   center?: boolean;
}

export function TableHeader({ className, center, ...props }: TableHeaderProps) {
   let { grid, framed } = useContext(TableContext);

   return (
      <th
         {...props}
         className={clsx(
            className,
            center && "text-center",
            framed && "bg-zinc-50 dark:bg-dark400",
            "border-b border-color-sub font-semibold px-3 py-2.5 whitespace-normal",
            grid && "border-l border-color-sub first:border-l-0",
         )}
      />
   );
}

interface TableCellProps extends React.ComponentPropsWithoutRef<"td"> {
   center?: boolean;
   bold?: boolean;
}

export function TableCell({
   className,
   children,
   center,
   bold,
   ...props
}: TableCellProps) {
   let { dense, grid, striped, framed } = useContext(TableContext);
   let { href, target, title } = useContext(TableRowContext);
   let [cellRef, setCellRef] = useState<HTMLElement | null>(null);

   return (
      <td
         ref={href ? setCellRef : undefined}
         {...props}
         className={clsx(
            className,
            center && "text-center",
            bold && "font-bold",
            "relative px-3 bg-white dark:bg-dark350 whitespace-normal",
            !striped && !framed && "border-b border-color",
            grid && "border-l border-color-sub first:border-l-0",
            dense ? "py-2.5" : "py-4",
         )}
      >
         {href && (
            <Link
               data-row-link
               href={href}
               target={target}
               aria-label={title}
               tabIndex={cellRef?.previousElementSibling === null ? 0 : -1}
               className="absolute inset-0 focus:outline-none"
            />
         )}
         {children}
      </td>
   );
}
