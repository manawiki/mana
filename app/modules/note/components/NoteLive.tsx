import { evaluate, EvaluateOptions } from "@mdx-js/mdx";
import { evaluateSync } from "@mdx-js/mdx";
import { useMDXComponents } from "@mdx-js/react";
import { MDXContent, MDXModule } from "mdx/types";
import { Fragment, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import * as runtime from "react/jsx-dev-runtime";
import { ErrorFallback } from "./ErrorFallback";

const mdxOptions = {
   //    outputFormat: "function-body",
   useDynamicImport: true,
   development: true,
   useMDXComponents,
   ...runtime,
} as EvaluateOptions;

//todo perf comparison with async
export function NoteLive2({
   mdx,
   className = "mdx-content",
}: {
   mdx: string;
   className?: string;
}) {
   const { default: Content } = useMemo(() => {
      console.log("evaluating");
      return evaluateSync(mdx, mdxOptions);
   }, [mdx]);

   return (
      <div className={className}>
         <ErrorBoundary FallbackComponent={ErrorFallback}>
            {Content && Content({})}
         </ErrorBoundary>
      </div>
   );
}

export function NoteLive({
   mdx,
   className = "mdx-content",
}: {
   mdx: string;
   className?: string;
}) {
   // const { default: Content } = useMemo(
   //    () => evaluateSync(mdx, mdxOptions),
   //    [mdx]
   // );

   const [module, setModule] = useState<MDXModule | null>(null);

   useEffect(() => {
      const mdxModule = evaluateSyncMDX(mdx);
      if (mdxModule) setModule(mdxModule);
   }, [mdx]);

   return (
      <div className={className}>
         <ErrorBoundary FallbackComponent={ErrorFallback}>
            {module && <module.default />}
         </ErrorBoundary>
      </div>
   );
}

function evaluateSyncMDX(mdx: string) {
   try {
      const mdxModule = evaluateSync(mdx, mdxOptions);
      console.log(mdxModule);
      if (mdxModule) return mdxModule;
   } catch (e) {
      console.error(e);
   }
}
