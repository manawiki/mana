import { useEffect, useState } from "react";

import {
   useLoaderData,
   useSearchParams,
   Form,
   useNavigation,
} from "@remix-run/react";

import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { isLoading } from "~/utils/form";
import { useDebouncedValue } from "~/utils/use-debounce";

import { PostListPagination } from "./PostListPagination";
import { PublishedPostRow } from "./PublishedPostRow";
import type { loader } from "../_posts";

export function PublishedPosts() {
   const { publishedPosts } = useLoaderData<typeof loader>();
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
                     <div className="size-6 flex items-center justify-center">
                        {isSearching ? (
                           <Icon
                              name="loader-2"
                              className="size-4 animate-spin text-1"
                           />
                        ) : (
                           <Icon name="search" className="size-4 text-1" />
                        )}
                     </div>
                     <input
                        type="text"
                        autoFocus
                        placeholder="Search or create a post..."
                        className="w-full text-sm !border-0 bg-transparent focus:outline-none focus:ring-0"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                     />
                  </div>
                  <button
                     className="absolute -right-1 top-3.5 size-6 hover:bg-zinc-100 dark:hover:bg-dark400 flex items-center 
                     justify-center rounded-full"
                     onClick={() => {
                        setSearchParams((searchParams) => {
                           searchParams.delete("q");
                           return searchParams;
                        });
                        setQuery("");
                        setSearchToggle(false);
                     }}
                  >
                     <Icon
                        name="x"
                        title="Close"
                        size={18}
                        className="text-1"
                     />
                  </button>
               </>
            ) : (
               <>
                  <div className="text-1 font-bold">Latest</div>
                  <button
                     onClick={() => {
                        setSearchToggle(true);
                     }}
                     className="size-7 hover:bg-zinc-100 dark:hover:bg-dark400 flex items-center 
                     justify-center rounded-full -mr-1"
                  >
                     <Icon name="search" size={20} className="text-zinc-500" />
                  </button>
               </>
            )}
         </div>
         <section className="border-color divide-y overflow-hidden border-y dark:divide-zinc-700">
            {publishedPosts && publishedPosts?.docs?.length > 0 ? (
               publishedPosts.docs.map((post: any) => (
                  <PublishedPostRow key={post.id} post={post} />
               ))
            ) : (
               <div className="pt-4 pb-3 space-y-3">
                  {searchParams.get("q") ? (
                     <>
                        <div className="text-1 italic font-bold">
                           No results...
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                           <span className="text-1">Would you like to </span>
                           <Form method="post">
                              <Button
                                 name="intent"
                                 value="createWithTitle"
                                 type="submit"
                                 color="blue"
                                 className="!pr-4"
                              >
                                 <input
                                    type="hidden"
                                    value={searchParams.get("q") ?? ""}
                                    name="name"
                                 />
                                 <Icon
                                    name="plus"
                                    className="text-white -ml-0.5"
                                    size={18}
                                 />
                                 Create a Post
                              </Button>
                           </Form>
                           <span className="text-1"> titled</span>
                           <Badge color="blue">{searchParams.get("q")}</Badge>
                        </div>
                        <div></div>
                     </>
                  ) : (
                     <>No published posts...</>
                  )}
               </div>
            )}
         </section>
         <PostListPagination
            myPosts={publishedPosts}
            setSearchParams={setSearchParams}
         />
      </>
   );
}
