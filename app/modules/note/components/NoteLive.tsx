import type { EvaluateOptions } from "@mdx-js/mdx";
import { evaluate } from "@mdx-js/mdx";
import { evaluateSync } from "@mdx-js/mdx";
import { useMDXComponents } from "@mdx-js/react";
import type { MDXModule } from "mdx/types";
import { memo, Suspense, useDeferredValue, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import * as runtime from "react/jsx-dev-runtime";
import { useDebouncedValue } from "~/hooks";
import { ErrorFallback } from "./ErrorFallback";

const mdxOptions = {
   //    outputFormat: "function-body",
   useDynamicImport: true,
   development: true,
   useMDXComponents,
   ...runtime,
} as EvaluateOptions;

// Client-side render MDX input using async evaluation
// todo perf comparison with sync
export function NoteLiveAsync({
   mdx, //mdx should be debounced
   className = "mdx-content",
}: {
   mdx: string;
   className?: string;
}) {
   const [module, setModule] = useState<MDXModule | null>(null);

   //We'll use deferred values to prevent the MDX from rendering until the user has stopped typing
   // const deferredModule = useDeferredValue(module);
   // const debouncedMDX = useDebouncedValue(mdx, 500);

   useEffect(() => {
      (async () => {
         try {
            const mdxModule = await evaluate(mdx, mdxOptions);
            console.log(mdxModule);
            if (mdxModule) setModule(mdxModule);
         } catch (e) {
            console.error(e);
         }
      })();
   }, [mdx]);

   return (
      <div className={className}>
         <ErrorBoundary FallbackComponent={ErrorFallback}>
            {module && <module.default />}
         </ErrorBoundary>
      </div>
   );
}

export const NoteLive = memo(NoteLiveAsync);

//Clientside render MDX input using sync evaluation
export function NoteLiveSync({
   mdx,
   className = "mdx-content",
}: {
   mdx: string;
   className?: string;
}) {
   const [module, setModule] = useState<MDXModule | null>(null);

   useEffect(() => {
      try {
         const mdxModule = evaluateSync(mdx, mdxOptions);
         console.log(mdxModule);
         if (mdxModule) setModule(mdxModule);
      } catch (e) {
         console.error(e);
      }
   }, [mdx]);

   return (
      <div className={className}>
         <ErrorBoundary FallbackComponent={ErrorFallback}>
            {module && <module.default />}
         </ErrorBoundary>
      </div>
   );
}
