import { Combobox, Transition } from "@headlessui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
   Link,
   useFetcher,
   useNavigate,
   useParams,
   useRouteLoaderData,
} from "@remix-run/react";
import {
   Component,
   Database,
   FileText,
   Layout,
   Loader2,
   X,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zx } from "zodix";
import type { Search, Site } from "payload/generated-types";
import { useDebouncedValue } from "~/hooks";
import { Image } from "~/components";
import { isAdding } from "~/utils";
import { clsx } from "clsx";
import { settings } from "mana-config";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });
   const { q, type } = zx.parseQuery(request, {
      q: z.string(),
      type: z.string(),
   });

   if (type == "core") {
      try {
         const searchUrl = `${settings.domainFull}/api/search?where[site.slug][equals]=${siteId}&where[name][contains]=${q}&depth=1&sort=-priority`;
         const { docs: searchResults } = (await (
            await fetch(searchUrl, {
               headers: {
                  cookie: request.headers.get("cookie") ?? "",
               },
            })
         ).json()) as Search[];
         return json(
            { searchResults },
            { headers: { "Cache-Control": "public, s-maxage=60, max-age=60" } }
         );
      } catch (e) {
         throw new Response("Internal Server Error", { status: 500 });
      }
   }
   if (type == "custom") {
      try {
         const searchUrl = `${settings.domainFull}/api/search?where[site.slug][equals]=${siteId}&where[name][contains]=${q}&depth=1&sort=-priority`;
         const customSearchUrl = `https://${siteId}-db.${settings.domain}/api/search?where[name][contains]=${q}&depth=1&sort=-priority`;

         const [{ docs: coreSearchResults }, { docs: customSearchResults }] =
            await Promise.all([
               await (await fetch(searchUrl)).json(),
               await (await fetch(customSearchUrl)).json(),
            ]);

         const combineResults = [...coreSearchResults, ...customSearchResults];
         const searchResults = combineResults.sort(
            (a, b) => b.priority - a.priority
         );
         return json(
            { searchResults },
            { headers: { "Cache-Control": "public, s-maxage=60, max-age=60" } }
         );
      } catch (e) {
         throw new Response("Internal Server Error", { status: 500 });
      }
   }
   return null;
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
         const id = item.id;
         const collection = item.collectionEntity;
         return `/${siteSlug}/collections/${collection}/${id}`;
      }
      case "posts": {
         const id = item.id;
         const slug = item.slug;
         return `/${siteSlug}/posts/${id}/${slug}`;
      }
      //Custom site
      default:
         const id = item.doc.value;
         const collection = item.doc.relationTo;
         return `/${siteSlug}/collections/${collection}/${id}`;
   }
};

const SearchType = ({ type }: { type: any }) => {
   const searchType = type.doc?.relationTo;
   switch (searchType) {
      case "customPages": {
         return <Layout className="text-1 mr-2" size={14} />;
      }
      case "collections": {
         return <Database className="text-1 mr-2" size={14} />;
      }
      case "entries": {
         return <Component className="text-1 mr-2" size={14} />;
      }
      case "posts": {
         return <FileText className="text-1 mr-2" size={14} />;
      }
      //Custom site
      default:
         return <Component className="text-1 mr-2" size={14} />;
   }
};

const LabelType = ({ type }: { type: any }) => {
   const labelType = type.doc?.relationTo;
   switch (labelType) {
      case "customPages": {
         return null;
      }
      case "collections": {
         return "List";
      }
      case "entries": {
         return "Entry";
      }
      case "posts": {
         return "Post";
      }
      //Custom site
      default:
         return labelType;
   }
};

export function SearchComboBox({
   setSearchToggle,
   siteType,
}: {
   setSearchToggle: any;
   siteType: Site["type"];
}) {
   //use local loader to pull searchResults
   const fetcher = useFetcher();
   const [query, setQuery] = useState("");
   const debouncedValue = useDebouncedValue(query, 100);
   const { siteId } = useParams();

   //leave searchListItems as an empty array until fetcher is loaded
   const searchListItems = useMemo(
      () => fetcher.data?.searchResults ?? [],
      [fetcher.data?.searchResults]
   );
   const navigate = useNavigate();

   const loaderRoute = `/${siteId}/resource/Search`;

   useEffect(() => {
      if (debouncedValue) {
         return fetcher.submit(
            { q: query ?? "", intent: "search", type: siteType },
            { method: "get", action: loaderRoute }
         );
      }
   }, [debouncedValue]);

   const handleChange = (e: any) => {
      navigate(searchLinkUrlGenerator(e, siteId));
      return setSearchToggle(false);
   };
   const isSearching = isAdding(fetcher, "search");
   const { isMobileApp } = useRouteLoaderData("root") as any;

   return (
      <div className="h-full w-full">
         <Combobox onChange={handleChange}>
            <div className="relative h-full w-full focus:outline-none">
               <Combobox.Input
                  autoFocus
                  className={clsx(
                     isMobileApp ? "bg-3" : "bg-2",
                     "h-full w-full border-0 pl-1 outline-none !ring-transparent"
                  )}
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
                  className="bg-2 outline-color shadow-1 border-color divide-color absolute left-0 z-20 max-h-80 w-full divide-y
                  overflow-auto shadow-xl outline-1 max-laptop:border-y laptop:mt-2 laptop:rounded-lg laptop:outline"
               >
                  {searchListItems.length === 0
                     ? query && (
                          <div className="text-1 p-3 text-sm">
                             No results...
                          </div>
                       )
                     : searchListItems?.map((item: Search) => (
                          <Combobox.Option
                             className={({ active }) =>
                                `relative cursor-default select-none ${
                                   active
                                      ? "bg-blue-50 dark:bg-bg1Dark"
                                      : "text-1"
                                }`
                             }
                             key={item?.id}
                             value={item}
                          >
                             <>
                                <Link
                                   prefetch="intent"
                                   to={searchLinkUrlGenerator(item, siteId)}
                                   className="flex items-center justify-between gap-2.5 truncate p-2 text-sm font-bold"
                                >
                                   <div className="flex items-center gap-2.5 truncate">
                                      <div
                                         className="shadow-1 border-color bg-3 flex h-8 w-8 items-center 
                                       overflow-hidden rounded-full border shadow-sm"
                                      >
                                         {item?.icon?.url ? (
                                            <Image
                                               url={item.icon.url}
                                               options="aspect_ratio=1:1&height=60&width=60"
                                               alt="Search Result Icon"
                                            />
                                         ) : (
                                            <Component
                                               className="text-1 mx-auto"
                                               size={18}
                                            />
                                         )}
                                      </div>
                                      <div>
                                         <div>{item?.name}</div>
                                         <div className="text-1 text-xs font-normal capitalize">
                                            <LabelType type={item} />
                                         </div>
                                      </div>
                                   </div>
                                   <SearchType type={item} />
                                </Link>
                             </>
                          </Combobox.Option>
                       ))}
               </Combobox.Options>
            </Transition>
         </Combobox>
         <button
            className="absolute right-4 top-[18px]"
            onClick={() => {
               setSearchToggle(false);
            }}
         >
            {isSearching ? (
               <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            ) : (
               <X size={22} className="text-red-400" />
            )}
         </button>
      </div>
   );
}

export default SearchComboBox;
