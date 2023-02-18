import type { Note } from "payload-types";
import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote";
import { ErrorBoundary } from "react-error-boundary";
import { deferComponents, ErrorFallback } from "../utils";
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
