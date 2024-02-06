import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

export function ErrorBoundary() {
   const error = useRouteError();

   console.log(error);
   return isRouteErrorResponse(error) ? (
      <div className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-12">
         <h2
            className="shadow-1 border-color relative mb-2.5 mt-8 overflow-hidden rounded-lg
         border-2 font-header text-xl font-bold shadow-sm shadow-zinc-100 dark:bg-dark350"
         >
            <div
               className="pattern-dots absolute left-0
                   top-0 -z-0 h-full
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                     pattern-size-4 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
            />
            <div className="relative h-full w-full px-3.5 py-2.5">
               Error Status: {error.status}
            </div>
         </h2>
         <div className="bg-2-sub divide-color-sub border-color-sub shadow-1 mb-4 divide-y-4 overflow-hidden rounded-lg border shadow-sm">
            <p className="mb-3">{error.data}</p>
         </div>
      </div>
   ) : (
      <div className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-12">
         <h2
            className="shadow-1 border-color relative mb-2.5 mt-8 overflow-hidden rounded-lg
      border-2 font-header text-xl font-bold shadow-sm shadow-zinc-100 dark:bg-dark350"
         >
            <div
               className="pattern-dots absolute left-0
                top-0 -z-0 h-full
                  w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                  pattern-size-4 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
            />
            <div className="relative h-full w-full px-3.5 py-2.5">
               Something Went Wrong!
            </div>
         </h2>
         <div className="bg-2-sub divide-color-sub border-color-sub shadow-1 mb-4 divide-y-4 overflow-hidden rounded-lg border shadow-sm">
            <p className="mb-3">{JSON.stringify(error)}</p>
         </div>
      </div>
   );
}
