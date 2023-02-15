import type { Note } from "~/payload-types";
import { Await } from "@remix-run/react";
import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function NoteViewer({
   note,
   className,
   scope,
   components,
}: {
   note: Note;
   className?: string;
   components?: MDXComponents;
   scope?: Record<string, any>;
}) {
   return note?.source ? (
      <div className={className ? `${className} post-content` : "post-content"}>
         <ErrorBoundary FallbackComponent={ErrorFallback}>
            <MDXRemote
               compiledSource={note.source}
               components={
                  components
                     ? deferComponents({ components, scope })
                     : undefined
               }
            />
         </ErrorBoundary>
      </div>
   ) : null;
}

//This allows components to accept deferred data
function deferComponents({
   components,
   scope,
}: {
   components: MDXComponents;
   scope?: Record<string, any>;
}) {
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
