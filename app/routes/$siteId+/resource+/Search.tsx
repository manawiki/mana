import { Combobox, Transition } from "@headlessui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import { Check, ChevronDown, X } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zx } from "zodix";
import type { Search } from "~/db/payload-types";
import { useDebouncedValue } from "~/hooks";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   console.log("gg");
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });
   console.log("pogg");
   const { q } = zx.parseQuery(request, {
      q: z.string().optional(),
   });

   const url = new URL(request.url).origin;

   try {
      const searchUrl = `${url}/api/search?where[site.slug][equals]=${siteId}&where[title][contains]=${q}&depth=1`;
      console.log(searchUrl);
      const searchResults = (await (
         await fetch(searchUrl, {
            headers: {
               cookie: request.headers.get("cookie") ?? "",
            },
         })
      ).json()) as Search[];

      return json(
         { q, searchResults },
         { headers: { "Cache-Control": "public, s-maxage=60" } }
      );
   } catch (e) {
      throw new Response("Internal Server Error", { status: 500 });
   }
}

//This should match the component route
const loaderRoute = "$siteId+/components/Search";

export function SearchComboBox({
   searchResult,
   setSearchResult,
}: {
   searchResult: Search | string;
   setSearchResult: (item: Search | string) => void;
}) {
   //use local loader to pull searchResults
   const fetcher = useFetcher();
   const { q } = useLoaderData<typeof loader>();
   const [query, setQuery] = useState(q);
   const debouncedValue = useDebouncedValue(query, 500);
   const [searchParams, setSearchParams] = useSearchParams({});

   //leave searchListItems as an empty array until fetcher is loaded
   const searchListItems = useMemo(
      () => fetcher.data?.searchResults ?? [],
      [fetcher.data?.searchResults]
   );

   useEffect(() => {
      //initialize loader with initial Seach result
      if (fetcher.type === "init") {
         let q =
            typeof searchResult === "object" ? searchResult.id : searchResult;
         fetcher.submit(
            {
               q,
            },
            { action: loaderRoute }
         );
      }
   }, [fetcher, searchResult]);

   useEffect(() => {
      if (debouncedValue) {
         setSearchParams((searchParams) => {
            searchParams.set("q", debouncedValue);
            fetcher.submit(
               { q: query ?? "" },
               { method: "get", action: loaderRoute }
            );
            return searchParams;
         });
      } else {
         setSearchParams((searchParams) => {
            searchParams.delete("q");
            return searchParams;
         });
      }
   }, [debouncedValue]);

   //switch in Search object if exact match is found
   useEffect(() => {
      if (
         searchResult &&
         typeof searchResult === "string" &&
         fetcher.type === "done"
      ) {
         let foundItem = searchListItems.find((item: Search) => {
            return item?.id === searchResult;
         });

         if (foundItem) {
            setSearchResult(foundItem);
         }
      }
   }, [fetcher, searchListItems, searchResult, setSearchResult]);

   return (
      <div>
         <Combobox value={searchResult} onChange={setSearchResult}>
            <div
               className="bg-primary border-color-primary relative h-11 w-full cursor-default
                    overflow-hidden rounded-md border-2 
                    text-left focus:outline-none"
            >
               <Combobox.Input
                  className="bg-primary h-full pl-3 text-sm font-bold 
                          text-gray-500 outline-none focus:outline-none dark:text-gray-400"
                  displayValue={(item: Search) => item?.name}
                  placeholder="Search..."
                  onChange={(e) => setQuery(e.target.value)}
               />
               <Combobox.Button
                  className="border-color-primary absolute inset-y-0 right-0 flex w-10 items-center
                   justify-center border-l-2 transition"
               >
                  <ChevronDown />
               </Combobox.Button>
            </div>
            <Transition
               as={Fragment}
               leave="transition ease-in duration-100"
               leaveFrom="opacity-100"
               leaveTo="opacity-0"
               // afterLeave={() => setQuery("")}
            >
               <Combobox.Options
                  className="bg-primary absolute z-20 !mt-1.5 max-h-60
          w-full divide-y-2 overflow-auto rounded-md border-2 border-gray-200 shadow-xl 
        focus:outline-none dark:divide-gray-800 dark:border-gray-800"
               >
                  {searchListItems.length === 0 ? (
                     <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        Nothing found.
                     </div>
                  ) : (
                     searchListItems?.map((item: Search) => (
                        <Combobox.Option
                           className={({ active }) =>
                              `relative cursor-default select-none text-gray-500 dark:text-gray-400 ${
                                 active ? "dark:bg-dark_100 bg-gray-100" : ""
                              }`
                           }
                           key={item?.id}
                           value={item}
                        >
                           {({ selected }) => (
                              <>
                                 <span
                                    className={`flex items-center gap-2 truncate p-2.5 text-sm font-bold ${
                                       selected &&
                                       "dark:bg-dark_100 bg-gray-100"
                                    }`}
                                 >
                                    {item?.name}
                                 </span>
                                 {selected ? (
                                    <span
                                       className="absolute inset-y-0 right-0 flex items-center 
                                      pr-2 text-gray-500 dark:text-gray-300"
                                    >
                                       <Check />
                                    </span>
                                 ) : null}
                              </>
                           )}
                        </Combobox.Option>
                     ))
                  )}
               </Combobox.Options>
            </Transition>
         </Combobox>
         {searchResult && (
            <button
               className="absolute right-11 -mt-[34px] mr-0.5  flex h-6 w-6 items-center justify-center 
        rounded-full hover:bg-gray-100 hover:dark:bg-gray-800"
               onClick={() => setSearchResult("")}
            >
               <X className="text-red-300" />
            </button>
         )}
      </div>
   );
}

export default SearchComboBox;
