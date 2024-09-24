import { ColumnFiltersState } from "@tanstack/react-table";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { FilterSection, TableSearchSection } from "./ListTop";
import { TableFilters } from "./List";
import clsx from "clsx";

export const TableFilterContext = createContext<{
   globalColumnFilters: ColumnFiltersState;
   setGlobalColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
   globalSearchFilter: string;
   setGlobalSearchFilter: Dispatch<SetStateAction<string>>;
} | null>(null);

export default function ListTableContainer({
   children,
   filters,
   className,
}: {
   children: React.ReactNode;
   filters?: TableFilters;
   className?: string;
}) {
   const [globalColumnFilters, setGlobalColumnFilters] =
      useState<ColumnFiltersState>([]);

   const [globalSearchFilter, setGlobalSearchFilter] = useState<string>("");

   return (
      <TableFilterContext.Provider
         value={{
            globalColumnFilters,
            setGlobalColumnFilters,
            globalSearchFilter,
            setGlobalSearchFilter,
         }}
      >
         <div className="flex justify-between gap-3 py-3 sticky top-[61px] bg-3 z-20">
            <TableSearchSection />
            <FilterSection filters={filters} />
         </div>
         <div className={clsx(className)}>{children}</div>
      </TableFilterContext.Provider>
   );
}
