import { createElement, Fragment, useEffect, useRef, useState } from "react";

import type { BaseItem } from "@algolia/autocomplete-core";
import type { AutocompleteOptions } from "@algolia/autocomplete-js";
import { autocomplete } from "@algolia/autocomplete-js";
import clsx from "clsx";
import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";
import { usePagination, useSearchBox } from "react-instantsearch";
import Typesense from "typesense";
//@ts-ignore
import { SearchResponseAdapter } from "typesense-instantsearch-adapter/lib/SearchResponseAdapter";

import { Image } from "~/components/Image";

type SetInstantSearchUiStateOptions = {
   query: string;
};

type AutocompleteProps = Partial<AutocompleteOptions<BaseItem>> & {
   className?: string;
   siteId: string;
};

const searchOnlyTypesenseClient = () =>
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

const search_response_adapter = (result: any) =>
   new SearchResponseAdapter(
      result,
      { params: {} },
      { geoLocationField: "_geoloc" },
   );

export function Autocomplete({
   siteId,
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
      const client = searchOnlyTypesenseClient();

      // https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/

      const autocompleteInstance = autocomplete({
         ...autocompleteProps,
         detachedMediaQuery: "none",
         openOnFocus: true,
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
            panel: "absolute bg-white dark:bg-dark450 z-50 rounded-lg drop-shadow-lg border border-zinc-300 dark:border-zinc-600 -mt-1.5 overflow-hidden",
            item: "px-2.5 py-2 aria-selected:bg-zinc-100 dark:aria-selected:bg-dark400 text-sm font-semibold",
            list: "divide-y divide-zinc-200 dark:divide-zinc-600",
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
         //@ts-ignore
         async getSources({ query }) {
            const results = await client.multiSearch
               .perform({
                  searches: [
                     {
                        collection: "entries",
                        q: query,
                        include_fields: "name,icon,url,category",
                        query_by: "name",
                        highlight_full_fields: "name",
                        highlight_start_tag: "__aa-highlight__",
                        highlight_end_tag: "__/aa-highlight__",
                     },
                     {
                        collection: "posts",
                        q: query,
                        filter_by: `site:=${siteId}`,
                        include_fields: "name,icon,url,category,subtitle,site",
                        query_by: "name",
                        highlight_full_fields: "name",
                        highlight_start_tag: "__aa-highlight__",
                        highlight_end_tag: "__/aa-highlight__",
                     },
                  ],
               })
               .then((result) => {
                  return result.results.flatMap(
                     (result: any) =>
                        search_response_adapter(result).adapt().hits,
                  );
               });

            return [
               {
                  sourceId: "search",
                  getItems() {
                     return results;
                  },
                  getItemInputValue({ item }) {
                     return item.name;
                  },
                  getItemUrl({ item }) {
                     return item.url;
                  },
                  templates: {
                     item({ item, html, components }) {
                        return html`<a
                           className="aa-ItemLink flex items-center justify-between gap-2"
                        >
                           <div
                              className="[&>mark]:bg-zinc-300 dark:[&>mark]:bg-zinc-500 dark:[&>mark]:text-white [&>mark]:rounded-sm"
                           >
                              ${components.Highlight({
                                 hit: item,
                                 attribute: "name",
                              })}
                              <div
                                 className="text-xs text-1 flex items-center gap-1 font-normal"
                              >
                                 ${item.subtitle
                                    ? item.subtitle ?? "Post"
                                    : item.category}
                              </div>
                           </div>
                           ${item.icon && (
                              <Image
                                 height={80}
                                 alt="Post Banner"
                                 options={`${
                                    item.category == "Post"
                                       ? "aspect_ratio=1.9:1"
                                       : "aspect_ratio=1:1"
                                 }`}
                                 className={clsx(
                                    item.category == "Post"
                                       ? "w-16 h-9 rounded"
                                       : "rounded-lg size-9",
                                    "overflow-hidden shadow-sm shadow-1",
                                 )}
                                 url={`${item.icon}`}
                              />
                           )}
                        </a>`;
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
