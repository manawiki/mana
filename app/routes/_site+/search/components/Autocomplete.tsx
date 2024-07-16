import React, { createElement, Fragment, useEffect, useRef } from "react";

import { autocomplete } from "@algolia/autocomplete-js";
import { createRoot } from "react-dom/client";

export function Autocomplete() {
   const containerRef = useRef(null);
   const panelRootRef = useRef(null);
   const rootRef = useRef(null);

   useEffect(() => {
      if (!containerRef.current) {
         return undefined;
      }

      const search = autocomplete({
         container: containerRef.current,
         renderer: { createElement, Fragment, render: () => {} },
         render({ children }, root) {
            if (!panelRootRef.current || rootRef.current !== root) {
               rootRef.current = root;

               panelRootRef.current?.unmount();
               panelRootRef.current = createRoot(root);
            }

            panelRootRef.current.render(children);
         },
         ...props,
      });

      return () => {
         search.destroy();
      };
   }, [props]);

   return <div ref={containerRef} />;
}
