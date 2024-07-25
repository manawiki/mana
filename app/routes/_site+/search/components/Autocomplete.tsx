import { createElement, Fragment, useEffect, useRef, useState } from "react";

import type { BaseItem } from "@algolia/autocomplete-core";
import type { AutocompleteOptions } from "@algolia/autocomplete-js";
import { autocomplete } from "@algolia/autocomplete-js";
import clsx from "clsx";
import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";
import { usePagination, useSearchBox } from "react-instantsearch";
import Typesense from "typesense";

type SetInstantSearchUiStateOptions = {
   query: string;
};

type AutocompleteProps = Partial<AutocompleteOptions<BaseItem>> & {
   className?: string;
};

const typesense_client = () =>
   new Typesense.Client({
      apiKey: "9QPWKRfSIdts42aQUyeqyNT1ct0levtm", // Be sure to use an API key that only allows search operations
      nodes: [
         {
            host: "tif2s7d9m8bqwypzp-1.a1.typesense.net",
            port: 443,
            protocol: "https",
         },
      ],
      connectionTimeoutSeconds: 2,
   });

export function Autocomplete({
   className,
   ...autocompleteProps
}: AutocompleteProps) {
   const autocompleteContainer = useRef<HTMLDivElement>(null);
   const panelRootRef = useRef<Root | null>(null);
   const rootRef = useRef<HTMLElement | null>(null);

   const { query, refine: setQuery } = useSearchBox();
   const { refine: setPage } = usePagination();

   const [instantSearchUiState, setInstantSearchUiState] =
      useState<SetInstantSearchUiStateOptions>({ query });

   useEffect(() => {
      setQuery(instantSearchUiState.query);
      setPage(0);
   }, [instantSearchUiState]);

   useEffect(() => {
      if (!autocompleteContainer.current) {
         return;
      }
      const client = typesense_client();

      // https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/

      const autocompleteInstance = autocomplete({
         ...autocompleteProps,
         container: autocompleteContainer.current,
         initialState: { query },
         autoFocus: true,
         classNames: {
            root: "relative w-full h-full",
            input: "w-full h-full bg-transparent pl-8 [&::-webkit-search-cancel-button]:hidden focus:outline-none",
            form: "w-full h-full",
            inputWrapper: "w-full h-full",
            inputWrapperPrefix: "absolute top-5 left-0",
            inputWrapperSuffix: "absolute top-5 right-0",
            sourceNoResults: "p-3 text-sm",
            panel: "absolute bg-white dark:bg-dark400 z-50 rounded-lg drop-shadow-lg border border-zinc-300 dark:border-zinc-600 -mt-1.5 overflow-hidden",
            item: "px-3 py-2 aria-selected:bg-zinc-100 dark:aria-selected:bg-dark450",
         },
         onReset() {
            setInstantSearchUiState({ query: "" });
         },
         onSubmit({ state }) {
            setInstantSearchUiState({ query: state.query });
         },
         onStateChange({ prevState, state }) {
            if (prevState.query !== state.query) {
               setInstantSearchUiState({
                  query: state.query,
               });
            }
         },
         renderer: { createElement, Fragment, render: () => {} },
         render({ children }, root) {
            if (!panelRootRef.current || rootRef.current !== root) {
               rootRef.current = root;

               panelRootRef.current?.unmount();
               panelRootRef.current = createRoot(root);
            }

            panelRootRef.current.render(children);
         },
         async getSources({ query }) {
            const results = await client
               .collections("posts")
               .documents()
               .search({
                  q: query,
                  query_by: "name",
                  highlight_full_fields: "name",
                  include_fields: "name",
               });

            return [
               {
                  sourceId: "posts",

                  getItems() {
                     return results.hits;
                  },
                  getItemInputValue({ item }) {
                     return item.document.name;
                  },
                  templates: {
                     item({ item, html }) {
                        // Get the highlighted HTML fragment from Typesense results
                        const html_fragment = html`${item.highlights.find(
                           (h) => h.field === "name" || {},
                        )?.value || item.document["name"]}`;

                        // Send the html_fragment to `html` tagged template
                        // Reference: https://github.com/developit/htm/issues/226#issuecomment-1205526098
                        return html`<div
                           dangerouslySetInnerHTML=${{ __html: html_fragment }}
                        ></div>`;
                     },
                     noResults() {
                        return "No results found.";
                     },
                  },
               },
            ];
         },
      });

      return () => autocompleteInstance.destroy();
   }, []);

   return (
      <div
         className={clsx(className, "w-full h-full max-laptop:px-3")}
         ref={autocompleteContainer}
      />
   );
}
