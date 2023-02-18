import { Await } from "@remix-run/react";
import type { MDXComponents } from "mdx/types";
import { Suspense } from "react";
import * as jsxDevRuntime from "react/jsx-dev-runtime";
import * as jsxRuntime from "react/jsx-runtime";

//This allows components to accept deferred data
export function deferComponents({
   components,
   scope,
}: {
   components?: MDXComponents;
   scope?: Record<string, any>;
}) {
   if (!components) return undefined;

   return Object.fromEntries(
      Object.entries(components).map(([key, Component]) => [
         key,
         ({ name }: { name: string }) => (
            <Suspense fallback={"<div>Loading...</div>"}>
               <Await resolve={scope?.[name]} errorElement={<div>Error</div>}>
                  {(data) => <Component data={data?.data} />}
               </Await>
            </Suspense>
         ),
      ])
   );
}

type ErrorFallbackProps = {
   error: Error;
   resetErrorBoundary: () => void;
};

//This fallback catches certain categories of errors
export const ErrorFallback = ({
   error,
   resetErrorBoundary,
}: ErrorFallbackProps) => (
   <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button
         type="button"
         className="h-10 w-full  rounded border-2 !border-blue-500 !border-opacity-20 bg-blue-500/10 text-center font-bold text-red-500 focus:outline-none dark:border-gray-700"
         onClick={resetErrorBoundary}
      >
         Try again
      </button>
   </div>
);

//return jsx runtime based on environment
export function runtime() {
   if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV === "development"
   ) {
      return jsxDevRuntime;
   } else {
      return jsxRuntime;
   }
}

//if (process.env.NODE_ENV === 'development') {
//    module.exports.jsxRuntime = require('react/jsx-dev-runtime')
// } else {
//   module.exports.jsxRuntime = require('react/jsx-runtime')
// }
