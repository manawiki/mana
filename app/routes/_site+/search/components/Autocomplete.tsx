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
import { settings } from "~/config";
import type { Site } from "~/db/payload-types";

type SetInstantSearchUiStateOptions = {
   query: string;
};

type AutocompleteProps = Partial<AutocompleteOptions<BaseItem>> & {
   className?: string;
   site: Site;
};

const searchOnlyTypesenseClient = () =>
   new Typesense.Client({
      apiKey:
         settings?.typesenseSearchOnlyKey ?? "RHiNS3SKaBlvYQOcp9zi7qUOBJbhxJEo",
      nodes: [
         {
            host: settings.typesenseHost ?? "search.mana.wiki",
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
   site,
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
         detachedMediaQuery: "",
         container: autocompleteContainer.current,
         initialState: { query },
         autoFocus: true,
         placeholder: "Search...",
         classNames: {
            input: "w-full h-full bg-transparent [&::-webkit-search-cancel-button]:hidden focus:outline-none",
            form: "w-full h-full flex items-center gap-3",
            inputWrapper: "w-full h-full",
            label: "flex items-center",
            sourceNoResults:
               "p-3 text-sm flex items-center justify-center pt-24 text-1",
            inputWrapperSuffix: "flex items-center",
            item: "m-2 px-2.5 py-2 rounded-md bg-zinc-50 dark:bg-dark500 dark:border-zinc-500/50 aria-selected:bg-blue-50 dark:aria-selected:bg-zinc-500/70 aria-selected:border-blue-100 dark:aria-selected:border-zinc-400/50 text-sm font-semibold border border-zinc-200/50",
            panel: "h-full overflow-y-auto  flex-grow bg-white shadow-md dark:bg-dark450 -mt-2 scrollbar dark:scrollbar-thumb-zinc-500 dark:scrollbar-track-dark450 scrollbar-thumb-zinc-300 scrollbar-track-zinc-100",
            panelLayout: "mt-2",
            //Modal
            detachedOverlay:
               "fixed inset-0 flex items-start justify-center overflow-hidden bg-black/50 h-full z-[999999] tablet:pt-12 tablet:pb-20",
            detachedContainer:
               "overflow-hidden tablet:max-w-2xl w-full flex flex-col tablet:rounded-lg max-h-full tablet:max-h-[540px] min-h-[320px]",
            detachedFormContainer:
               "flex items-center p-4 pr-5 bg-white shadow-md dark:bg-dark450 tablet:rounded-lg",
            detachedCancelButton:
               "text-xs text-1 hover:text-light dark:hover:text-dark ml-4 border-l dark:border-zinc-600 pl-4",
            detachedSearchButton:
               "flex items-center justify-center gap-2 hover:border-zinc-400 shadow-sm bg-zinc-100 dark:bg-dark500 border border-zinc-300 dark:border-zinc-500 dark:hover:border-zinc-400 rounded-full p-1 size-10",
            detachedSearchButtonQuery: "hidden",
            detachedSearchButtonPlaceholder: "hidden",
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
                        collection: "customPages",
                        q: query,
                        filter_by: `site:=${site.id}`,
                        include_fields:
                           "name,category,icon,relativeURL,site,description",
                        query_by: "name",
                        highlight_full_fields: "name",
                        highlight_start_tag: "__aa-highlight__",
                        highlight_end_tag: "__/aa-highlight__",
                     },
                     {
                        collection: "entries",
                        q: query,
                        filter_by: `site:=${site.id}`,
                        include_fields:
                           "name,category,icon,relativeURL,site,collection",
                        query_by: "name",
                        highlight_full_fields: "name",
                        highlight_start_tag: "__aa-highlight__",
                        highlight_end_tag: "__/aa-highlight__",
                     },
                     {
                        collection: "collections",
                        q: query,
                        filter_by: `site:=${site.id}`,
                        include_fields: "name,category,icon,relativeURL,site",
                        query_by: "name",
                        highlight_full_fields: "name",
                        highlight_start_tag: "__aa-highlight__",
                        highlight_end_tag: "__/aa-highlight__",
                     },
                     {
                        collection: "posts",
                        q: query,
                        filter_by: `site:=${site.id}`,
                        include_fields:
                           "name,category,icon,relativeURL,site,description",
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
                     return item.relativeURL;
                  },

                  templates: {
                     item({ item, html, components }) {
                        return html`<a
                           href="${item.relativeURL}"
                           className="aa-ItemLink flex items-start justify-between gap-2"
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
                                 ${item?.description ??
                                 item?.collection ??
                                 item?.category}
                              </div>
                           </div>
                           ${item.icon && (
                              <Image
                                 height={80}
                                 alt="Icon"
                                 options={`${
                                    item.category == "Post"
                                       ? "aspect_ratio=1.9:1"
                                       : "aspect_ratio=1:1"
                                 }`}
                                 className={clsx(
                                    item.category == "Post"
                                       ? "w-16 h-9 rounded"
                                       : "rounded-lg size-9",
                                    "overflow-hidden flex-none",
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

   return <div ref={autocompleteContainer} />;
}
