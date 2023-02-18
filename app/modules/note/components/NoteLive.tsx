import type { EvaluateOptions } from "@mdx-js/mdx";
import { evaluate } from "@mdx-js/mdx";
import { useMDXComponents } from "@mdx-js/react";
import type { MDXModule } from "mdx/types";
import { memo, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import * as runtime from "react/jsx-dev-runtime";
import { ErrorFallback } from "../utils";

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
   mdx, //mdx should be deferred to avoid rendering hangups
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
            // console.log(mdxModule);
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

//We memoize the async component to prevent it from re-rendering when the parent component re-renders
export const NoteLive = memo(NoteLiveAsync);

//Clientside render MDX input using sync evaluationklo\

//note: this is not recommended for production use
// export function NoteLiveSync({
//    mdx,
//    className = "mdx-content",
// }: {
//    mdx: string;
//    className?: string;
// }) {
//    const [module, setModule] = useState<MDXModule | null>(null);

//    useEffect(() => {
//       try {
//          const mdxModule = evaluateSync(mdx, mdxOptions);
//          console.log(mdxModule);
//          if (mdxModule) setModule(mdxModule);
//       } catch (e) {
//          console.error(e);
//       }
//    }, [mdx]);

//    return (
//       <div className={className}>
//          <ErrorBoundary FallbackComponent={ErrorFallback}>
//             {module && <module.default />}
//          </ErrorBoundary>
//       </div>
//    );
// }
