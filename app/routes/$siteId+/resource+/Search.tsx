import { Combobox, Transition } from "@headlessui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
   useFetcher,
   useLoaderData,
   useNavigate,
   useParams,
} from "@remix-run/react";
import { Component, Loader2, X } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zx } from "zodix";
import type { Search } from "~/db/payload-types";
import { useDebouncedValue } from "~/hooks";
import { Image } from "~/components";
import { isAdding } from "~/utils";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });
   const { q } = zx.parseQuery(request, {
      q: z.string(),
   });

   const url = new URL(request.url).origin;

   try {
      const searchUrl = `${url}/api/search?where[site.slug][equals]=${siteId}&where[name][contains]=${q}&depth=1`;
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

const searchLinkUrlGenerator = (item: any, siteSlug?: string) => {
   const type = item.doc?.relationTo;
   switch (type) {
      case "customPages": {
         const slug = item.slug;
         return `/${siteSlug}/${slug}`;
      }
      case "collections": {
         const slug = item.slug;
         return `/${siteSlug}/collections/${slug}`;
      }
      case "entries": {
         const slug = item.slug;
         const id = item.id;
         const collection = item.collectionEntity;
         return `/${siteSlug}/collections/${collection}/${id}/${slug}`;
      }
      case "posts": {
         const id = item.id;
         const slug = item.slug;
         return `/${siteSlug}/posts/${id}/${slug}`;
      }
      default:
         return `/${siteSlug}`;
   }
};

export function SearchComboBox({ setSearchToggle }: { setSearchToggle: any }) {
   //use local loader to pull searchResults
   const fetcher = useFetcher();
   const { q } = useLoaderData<typeof loader>();
   const [query, setQuery] = useState(q);
   const debouncedValue = useDebouncedValue(query, 500);
   const { siteId } = useParams();

   //leave searchListItems as an empty array until fetcher is loaded
   const searchListItems = useMemo(
      () => fetcher.data?.searchResults.docs ?? [],
      [fetcher.data?.searchResults.docs]
   );
   const navigate = useNavigate();

   const loaderRoute = `/${siteId}/resource/Search`;

   useEffect(() => {
      if (debouncedValue) {
         return fetcher.submit(
            { q: query ?? "", intent: "search" },
            { method: "get", action: loaderRoute }
         );
      }
   }, [debouncedValue]);

   const handleChange = (e) => {
      navigate(searchLinkUrlGenerator(e, siteId));
      return setSearchToggle(false);
   };
   const isSearching = isAdding(fetcher, "search");

   return (
      <div className="h-full w-full">
         <Combobox onChange={handleChange}>
            <div className="relative h-full w-full focus:outline-none">
               <Combobox.Input
                  autoFocus
                  className="bg-2 h-full w-full border-0 pl-3  outline-none !ring-transparent"
                  displayValue={(item: Search) => item?.name ?? ""}
                  placeholder="Search..."
                  onChange={(e) => setQuery(e.target.value)}
               />
            </div>
            <Transition
               as={Fragment}
               leave="transition ease-in duration-100"
               leaveFrom="opacity-100"
               leaveTo="opacity-0"
               afterLeave={() => setQuery("")}
            >
               <Combobox.Options
                  className="bg-3 border-color absolute left-0 z-20 
                  max-h-60 w-full rounded-b-lg border"
               >
                  {isSearching && (
                     <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  )}

                  {searchListItems.length === 0
                     ? null
                     : searchListItems?.map((item: Search) => (
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
                                   <div
                                      className={`flex items-center gap-2 truncate p-2 text-sm font-bold ${
                                         selected &&
                                         "dark:bg-dark_100 bg-gray-100"
                                      }`}
                                   >
                                      <div className="shadow-1 flex h-8 w-8 items-center overflow-hidden rounded-full border shadow-sm">
                                         {item?.icon?.url ? (
                                            <Image
                                               url={item.icon.url}
                                               options="fit=crop,width=60,height=60,gravity=auto"
                                               alt="Search Result Icon"
                                            />
                                         ) : (
                                            <Component
                                               className="text-1 mx-auto"
                                               size={18}
                                            />
                                         )}
                                      </div>
                                      <div>{item?.name}</div>
                                   </div>
                                </>
                             )}
                          </Combobox.Option>
                       ))}
               </Combobox.Options>
            </Transition>
         </Combobox>
         <button
            className="absolute right-5 top-5"
            onClick={() => {
               setSearchToggle(false);
            }}
         >
            <X size={22} className="text-red-400" />
         </button>
      </div>
   );
}

export default SearchComboBox;
