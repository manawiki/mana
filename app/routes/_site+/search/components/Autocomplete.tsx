import { createElement, Fragment, useEffect, useRef, useState } from "react";

import type { BaseItem } from "@algolia/autocomplete-core";
import type { AutocompleteOptions } from "@algolia/autocomplete-js";
import { autocomplete } from "@algolia/autocomplete-js";
import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";
import { usePagination, useSearchBox } from "react-instantsearch";
import Typesense from "typesense";

import "@algolia/autocomplete-theme-classic";

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

      const autocompleteInstance = autocomplete({
         ...autocompleteProps,
         container: autocompleteContainer.current,
         initialState: { query },
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

   return <div className={className} ref={autocompleteContainer} />;
}
