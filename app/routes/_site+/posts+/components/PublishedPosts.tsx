import { useEffect, useState } from "react";

import {
   useLoaderData,
   useSearchParams,
   Form,
   useNavigation,
} from "@remix-run/react";

import { Icon } from "~/components/Icon";
import { isLoading } from "~/utils/form";
import { useDebouncedValue } from "~/utils/use-debounce";

import { PublishedPostRow } from "./PublishedPostRow";
import type { loader } from "../_posts";

export function PublishedPosts() {
   const { publishedPosts, siteId } = useLoaderData<typeof loader>();
   const transition = useNavigation();
   const isSearching = isLoading(transition);
   const [searchParams, setSearchParams] = useSearchParams({});
   const [searchToggle, setSearchToggle] = useState(false);

   const [query, setQuery] = useState("");

   const debouncedValue = useDebouncedValue(query, 500);

   useEffect(() => {
      if (debouncedValue) {
         setSearchParams((searchParams) => {
            searchParams.set("q", debouncedValue);
            return searchParams;
         });
      } else {
         setSearchParams((searchParams) => {
            searchParams.delete("q");
            return searchParams;
         });
      }
   }, [debouncedValue, setSearchParams]);

   return (
      <>
         <div className="relative flex h-12 items-center justify-between">
            {searchToggle ? (
               <>
                  <div className="relative flex w-full items-center gap-2">
                     <span className="absolute left-0">
                        {isSearching ? (
                           <Icon
                              name="loader-2"
                              className="h-6 w-6 animate-spin text-zinc-500"
                           />
                        ) : (
                           <Icon name="search" className="text-zinc-500" />
                        )}
                     </span>
                     <input
                        type="text"
                        autoFocus
                        placeholder="Search or create a post..."
                        className="w-full !border-0 bg-transparent pl-10 focus:ring-0"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                     />
                  </div>
                  <button
                     className="absolute right-0 top-3.5"
                     onClick={() => {
                        setSearchParams((searchParams) => {
                           searchParams.delete("q");
                           return searchParams;
                        });
                        setQuery("");
                        setSearchToggle(false);
                     }}
                  >
                     <Icon name="x" size={22} className="text-red-500" />
                  </button>
               </>
            ) : (
               <>
                  <div className="text-1 font-bold">Latest</div>
                  <button
                     onClick={() => {
                        setSearchToggle(true);
                     }}
                  >
                     <Icon name="search" size={22} className="text-zinc-500" />
                  </button>
               </>
            )}
         </div>
         <section className="border-color divide-y overflow-hidden border-y dark:divide-zinc-700 mb-6">
            {publishedPosts && publishedPosts?.docs?.length > 0 ? (
               publishedPosts.docs.map((post: any) => (
                  <PublishedPostRow key={post.id} post={post} />
               ))
            ) : (
               <div className="flex items-center justify-between py-3 text-sm">
                  <div className="flex items-center gap-1">
                     {searchParams.get("q") ? (
                        <>
                           <span className="text-1">
                              No results... Create new post with title
                           </span>
                           <span className="font-bold">
                              "{searchParams.get("q")}"
                           </span>
                           <Form method="post" className="flex items-center">
                              <button
                                 name="intent"
                                 className="group flex items-center gap-1"
                                 value="createWithTitle"
                                 type="submit"
                              >
                                 <input
                                    type="hidden"
                                    value={searchParams.get("q") ?? ""}
                                    name="name"
                                 />
                                 <span className="font-bold text-zinc-500 underline-offset-2 group-hover:underline">
                                    New Post
                                 </span>
                                 <Icon
                                    name="chevron-right"
                                    className="text-zinc-400"
                                    size={18}
                                 />
                              </button>
                           </Form>
                        </>
                     ) : (
                        <>No published posts...</>
                     )}
                  </div>
               </div>
            )}
         </section>
      </>
   );
}
