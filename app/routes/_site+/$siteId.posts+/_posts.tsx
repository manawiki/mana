import { useState, useEffect } from "react";

import { Listbox, Transition } from "@headlessui/react";
import { redirect, json } from "@remix-run/node";
import type {
   LoaderFunctionArgs,
   MetaFunction,
   SerializeFrom,
} from "@remix-run/node";
import {
   Form,
   Link,
   useLoaderData,
   useSearchParams,
   useNavigation,
} from "@remix-run/react";
import dt from "date-and-time";
import {
   ChevronLeft,
   ChevronRight,
   ChevronsUpDown,
   Loader2,
   PenSquare,
   Search,
   X,
} from "lucide-react";
import type { Payload } from "payload";
import type { PaginatedDocs } from "payload/dist/database/types";
import { select, type Select } from "payload-query";
import { z } from "zod";
import { zx } from "zodix";

import type {
   Post,
   Site,
   User,
   Image as PayloadImage,
} from "payload/generated-types";
import { Image } from "~/components";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/src/components";
import { initialValue } from "~/routes/_editor+/core/utils";
import { isLoading, safeNanoID, useDebouncedValue } from "~/utils";
import { cacheWithSelect } from "~/utils/cache.server";

import { mainContainerStyle } from "../$siteId+/_index";

export const meta: MetaFunction = ({ matches }: { matches: any }) => {
   const site = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/$siteId+/_layout",
   );
   const siteName = site?.data?.site.name;
   return [
      {
         title: `Posts - ${siteName}`,
      },
   ];
};

type setSearchParamsType = ReturnType<typeof useSearchParams>[1];

export const handle = {};

const PostsAllSchema = z.object({
   q: z.string().optional(),
   status: z.union([z.literal("draft"), z.literal("published")]).optional(),
   page: z.coerce.number().optional(),
});

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });

   const { q, status, page } = zx.parseQuery(request, PostsAllSchema);

   const myPosts = await fetchMyPosts({
      status,
      page,
      payload,
      siteId,
      user,
   });

   const publishedPosts = await fetchPublishedPosts({
      q,
      payload,
      siteId,
      user,
   });

   return json({ q, myPosts, publishedPosts, siteId });
}

export default function PostsAll() {
   const { publishedPosts, q, myPosts, siteId } =
      useLoaderData<typeof loader>();
   const [query, setQuery] = useState(q);
   const debouncedValue = useDebouncedValue(query, 500);
   const transition = useNavigation();
   const isSearching = isLoading(transition);
   const [searchParams, setSearchParams] = useSearchParams({});
   const [selectedStatus, setSelectedStatus] = useState("All");
   const [searchToggle, setSearchToggle] = useState(false);

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
         <main className={mainContainerStyle}>
            <div className="relative flex items-center pb-5">
               <h1 className="font-header text-3xl font-bold pr-3">Posts</h1>
               <span className="dark:bg-zinc-700 bg-zinc-100 rounded-l-full flex-grow h-0.5" />
               <AdminOrStaffOrOwner>
                  <Form method="post">
                     <button
                        className="flex py-2.5 items-center text-xs font-bold gap-2 dark:border-zinc-600 dark:hover:border-zinc-500
                        border border-zinc-200 rounded-full hover:border-zinc-300 bg-zinc-50 dark:bg-dark450 px-4 shadow-sm shadow-1"
                        name="intent"
                        value="createPost"
                        type="submit"
                     >
                        <PenSquare className="text-zinc-400" size={13} />
                        New Post
                     </button>
                  </Form>
               </AdminOrStaffOrOwner>
            </div>
            <AdminOrStaffOrOwner>
               <section className="pt-3 pb-6">
                  <div className="flex items-center justify-between pb-2">
                     <div className="text-1 text-sm font-bold">Last Edited</div>
                     <Listbox
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                     >
                        <div className="relative z-10">
                           <Listbox.Button className="text-1 flex items-center gap-2 text-sm font-semibold hover:underline">
                              {selectedStatus}
                              <ChevronsUpDown
                                 className="text-zinc-500"
                                 size={16}
                              />
                           </Listbox.Button>
                           <Transition
                              enter="transition duration-100 ease-out"
                              enterFrom="transform scale-95 opacity-0"
                              enterTo="transform scale-100 opacity-100"
                              leave="transition duration-75 ease-out"
                              leaveFrom="transform scale-100 opacity-100"
                              leaveTo="transform scale-95 opacity-0"
                           >
                              <Listbox.Options
                                 className="border-color text-1 bg-3 shadow-1 absolute right-0
                                 mt-2 w-[120px] rounded-lg border p-1.5 shadow-lg"
                              >
                                 <Listbox.Option key="draft" value="Drafts">
                                    {({ selected }) => (
                                       <>
                                          <button
                                             className="text-1 relative flex w-full items-center gap-3 rounded-md
                                              px-2 py-1 text-sm hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                             onClick={() =>
                                                setSearchParams(
                                                   (searchParams) => {
                                                      searchParams.set(
                                                         "status",
                                                         "draft",
                                                      );
                                                      return searchParams;
                                                   },
                                                )
                                             }
                                          >
                                             {selected ? (
                                                <span
                                                   className="absolute right-2 h-1.5 w-1.5 rounded-full
                                                 bg-zinc-500"
                                                />
                                             ) : null}
                                             Draft
                                          </button>
                                       </>
                                    )}
                                 </Listbox.Option>
                                 <Listbox.Option
                                    key="published"
                                    value="Published"
                                 >
                                    {({ selected }) => (
                                       <>
                                          <button
                                             className="text-1 relative flex w-full items-center gap-3 rounded-md
                                           px-2 py-1 text-sm hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                             onClick={() =>
                                                setSearchParams(
                                                   (searchParams) => {
                                                      searchParams.set(
                                                         "status",
                                                         "published",
                                                      );
                                                      return searchParams;
                                                   },
                                                )
                                             }
                                          >
                                             {selected ? (
                                                <span
                                                   className="absolute right-2 h-1.5 w-1.5 rounded-full
                                                 bg-zinc-500"
                                                />
                                             ) : null}
                                             Published
                                          </button>
                                       </>
                                    )}
                                 </Listbox.Option>
                                 <Listbox.Option key="all" value="All">
                                    {({ selected }) => (
                                       <>
                                          <button
                                             className="text-1 relative flex w-full items-center gap-3 rounded-md
                                           px-2 py-1 text-sm hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                             onClick={() =>
                                                setSearchParams(
                                                   (searchParams) => {
                                                      searchParams.delete(
                                                         "status",
                                                      );
                                                      return searchParams;
                                                   },
                                                )
                                             }
                                          >
                                             {selected ? (
                                                <span
                                                   className="absolute right-2 h-1.5 w-1.5 rounded-full
                                                 bg-zinc-500"
                                                />
                                             ) : null}
                                             All
                                          </button>
                                       </>
                                    )}
                                 </Listbox.Option>
                              </Listbox.Options>
                           </Transition>
                        </div>
                     </Listbox>
                  </div>
                  <section className="border-color divide-color divide-y border-y">
                     {myPosts && myPosts?.docs.length === 0 ? (
                        <div className="py-3 text-sm ">No drafts...</div>
                     ) : (
                        myPosts?.docs?.map((post) => (
                           <Link
                              prefetch="intent"
                              to={`/${siteId}/p/${post.id}`}
                              key={post.id}
                              className="group flex items-center justify-between gap-2 py-3"
                           >
                              <span className="truncate text-sm font-bold group-hover:underline">
                                 {post.name}
                              </span>
                              {post.updatedAt && (
                                 <div className="flex flex-none items-center gap-4">
                                    <time
                                       className="text-1 flex items-center gap-1.5 text-sm"
                                       dateTime={post?.updatedAt}
                                    >
                                       {dt.format(
                                          new Date(post?.updatedAt),
                                          "MMM D",
                                       )}
                                    </time>
                                    {post._status == "published" ? (
                                       <Tooltip>
                                          <TooltipTrigger>
                                             <div className="h-2 w-2 rounded-full bg-green-300 dark:bg-green-400" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                             Published
                                          </TooltipContent>
                                       </Tooltip>
                                    ) : (
                                       <Tooltip>
                                          <TooltipTrigger>
                                             <div className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-500" />
                                          </TooltipTrigger>
                                          <TooltipContent>Draft</TooltipContent>
                                       </Tooltip>
                                    )}
                                 </div>
                              )}
                           </Link>
                        ))
                     )}
                  </section>
                  <Pagination
                     myPosts={myPosts}
                     setSearchParams={setSearchParams}
                  />
               </section>
            </AdminOrStaffOrOwner>
            <div className="relative flex h-12 items-center justify-between">
               {searchToggle ? (
                  <>
                     <div className="relative flex w-full items-center gap-2">
                        <span className="absolute left-0">
                           {isSearching ? (
                              <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                           ) : (
                              <Search size={20} className="text-zinc-500" />
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
                        <X size={22} className="text-red-500" />
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
                        <Search size={22} className="text-zinc-500" />
                     </button>
                  </>
               )}
            </div>
            <section className="border-color divide-y overflow-hidden border-y dark:divide-zinc-700 mb-6">
               {publishedPosts && publishedPosts?.docs?.length > 0 ? (
                  publishedPosts.docs.map((post: any) => (
                     <FeedItem key={post.id} siteId={siteId} post={post} />
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
                                    <ChevronRight
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
         </main>
      </>
   );
}

export const action = async ({
   context: { payload, user },
   request,
   params,
}: LoaderFunctionArgs) => {
   if (!user || !user.id) throw redirect("/login", { status: 302 });

   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });

   const slug = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteId,
         },
      },
      user,
   });
   const site = slug?.docs[0];

   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   switch (intent) {
      case "createWithTitle": {
         const { name } = await zx.parseForm(request, {
            name: z.string(),
         });

         const post = await payload.create({
            collection: "posts",
            data: {
               id: safeNanoID(),
               name,
               //@ts-ignore
               author: user?.id,
               //@ts-ignore
               site: site.id,
            },
            user,
            draft: true,
            overrideAccess: false,
         });
         return redirect(`/${siteId}/p/${post.id}`);
      }
      case "createPost": {
         const post = await payload.create({
            collection: "posts",
            data: {
               id: safeNanoID(),
               name: "Untitled",
               //@ts-ignore
               author: user?.id,
               //@ts-ignore
               site: site.id,
               content: initialValue(),
            },
            user,
            draft: true,
            overrideAccess: false,
         });

         return redirect(`/${siteId}/p/${post.id}`);
      }
   }
};

const Pagination = ({
   myPosts,
   setSearchParams,
}: {
   myPosts: SerializeFrom<typeof loader>["myPosts"];
   setSearchParams: setSearchParamsType;
}) =>
   myPosts &&
   myPosts?.totalPages > 1 && (
      <div className="text-1 flex items-center justify-between py-3 pl-1 text-sm">
         <div>
            Showing <span className="font-bold">{myPosts?.pagingCounter}</span>{" "}
            to{" "}
            <span className="font-bold">
               {myPosts?.docs?.length + myPosts.pagingCounter - 1}
            </span>{" "}
            of <span className="font-bold">{myPosts?.totalDocs}</span> results
         </div>
         <div className="flex items-center gap-3 text-xs">
            {myPosts?.hasPrevPage ? (
               <button
                  className="flex items-center gap-1 font-semibold uppercase hover:underline"
                  onClick={() =>
                     setSearchParams((searchParams) => {
                        searchParams.set("page", myPosts.prevPage as any);
                        return searchParams;
                     })
                  }
               >
                  <ChevronLeft size={18} className="text-zinc-500" />
                  Prev
               </button>
            ) : null}
            {myPosts.hasNextPage && myPosts.hasPrevPage && (
               <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            )}
            {myPosts.hasNextPage ? (
               <button
                  className="flex items-center gap-1 font-semibold uppercase hover:underline"
                  onClick={() =>
                     setSearchParams((searchParams) => {
                        searchParams.set("page", myPosts.nextPage as any);
                        return searchParams;
                     })
                  }
               >
                  Next
                  <ChevronRight size={18} className="text-zinc-500" />
               </button>
            ) : null}
         </div>
      </div>
   );

const fetchPublishedPosts = async ({
   q,
   payload,
   siteId,
   user,
}: typeof PostsAllSchema._type & {
   payload: Payload;
   siteId: Site["slug"];
   user?: User;
}) => {
   const postSelect: Select<Post> = {
      slug: true,
      name: true,
      author: true,
      publishedAt: true,
      updatedAt: true,
      subtitle: true,
      banner: true,
   };

   if (user) {
      const data = await payload.find({
         collection: "posts",
         where: {
            "site.slug": {
               equals: siteId,
            },
            _status: {
               equals: "published",
            },
            ...(q
               ? {
                    name: {
                       contains: q,
                    },
                 }
               : {}),
         },
         depth: 2,
         overrideAccess: false,
         user,
         sort: "-publishedAt",
      });

      const { docs } = filterAuthorFields(data, postSelect);

      return { docs };
   }

   const result = await cacheWithSelect(
      () =>
         payload.find({
            collection: "posts",
            where: {
               "site.slug": {
                  equals: siteId,
               },
               _status: {
                  equals: "published",
               },
               ...(q
                  ? {
                       name: {
                          contains: q,
                       },
                    }
                  : {}),
            },
            depth: 2,
            overrideAccess: false,
            user,
            sort: "-publishedAt",
         }),
      filterAuthorFields,
      postSelect,
   );
   return result;
};

const fetchMyPosts = async ({
   status,
   page,
   payload,
   siteId,
   user,
}: typeof PostsAllSchema._type & {
   payload: Payload;
   siteId: Site["slug"];
   user?: User;
}) => {
   /**
    * --------------------------------------------------------
    * If authenticated, pull user's own posts (site-specific).
    * If no posts are returned:
    *    1) User doesn't have permission ["canRead"], so access check returns an empty array.
    *    2) User has no posts.
    * --------------------------------------------------------
    * If we get a result, we prune it before sending it to the client
    */
   if (user) {
      const data = await payload.find({
         collection: "posts",
         where: {
            "site.slug": {
               equals: siteId,
            },
            author: {
               equals: user.id,
            },
            ...(status
               ? {
                    _status: {
                       equals: status,
                    },
                 }
               : {}),
         },
         draft: true,
         page: page ?? 1,
         sort: "-updatedAt",
         depth: 2,
         overrideAccess: false,
         user,
      });

      const postSelect: Select<Post> = {
         name: true,
         _status: true,
         updatedAt: true,
      };

      const result = filterAuthorFields(data, postSelect);

      return result;
   }
   return;
};

const filterAuthorFields = (
   data: PaginatedDocs<Post>,
   selectConfig: Partial<Record<keyof any, boolean>>,
) => {
   const authorSelect: Select<User> = {
      id: false,
      username: true,
      avatar: true,
   };

   const avatarSelect: Select<PayloadImage> = {
      id: false,
      url: true,
   };

   const bannerSelect: Select<PayloadImage> = {
      id: false,
      url: true,
   };

   const filtered = data.docs.map((doc) => {
      const authorFull = select(authorSelect, doc.author);

      const banner = doc.banner && select(bannerSelect, doc.banner);

      const post = select(selectConfig, doc);

      //Combine author object after pruning image fields
      const author = {
         ...authorFull,
         avatar: authorFull?.avatar && select(avatarSelect, authorFull?.avatar),
      };

      //Combine final result
      const result = {
         ...post,
         author,
         banner,
      };

      return result;
   });

   //Extract pagination fields
   const { docs, ...pagination } = data;

   //Combine filtered docs with pagination info
   const result = { docs: filtered, ...pagination };

   return result;
};

function FeedItem({ post, siteId }: { post: Post; siteId: Site["slug"] }) {
   return (
      <>
         <Link
            className="relative block py-4"
            prefetch="intent"
            to={`/${siteId}/p/${post.slug}`}
            key={post.id}
         >
            <div className="flex w-full items-center justify-between gap-3 pb-4 text-sm text-gray-500 dark:text-gray-400">
               <div className="flex items-center gap-3">
                  <div className="h-6 w-6 overflow-hidden rounded-full">
                     {post?.author.avatar?.url ? (
                        <Image
                           width={20}
                           height={20}
                           alt={post.name}
                           options="aspect_ratio=1:1&height=80&width=80"
                           className="w-full object-cover laptop:rounded"
                           url={post?.author.avatar?.url}
                        />
                     ) : (
                        <div className="bg-1 border-color shadow-1 h-6 w-6 overflow-hidden rounded-full border-2 shadow-sm"></div>
                     )}
                  </div>
                  <div className="font-bold">{post.author.username}</div>
               </div>
               <div className="text-xs font-bold uppercase">
                  {/* {post.publishedAt &&
                     formatDistanceStrict(
                        new Date(post.updatedAt ?? ""),
                        new Date(),
                        {
                           addSuffix: true,
                        }
                     )} */}
               </div>
            </div>
            <div className="flex items-start gap-5">
               <div className="relative flex-grow">
                  <div className="pb-2 font-header text-xl font-bold">
                     {post.name}
                  </div>
                  <div className="text-1 text-sm max-laptop:line-clamp-2">
                     {post.subtitle}
                  </div>
               </div>
               {post.banner && (
                  <div className="w-32 flex-none overflow-hidden rounded">
                     <Image
                        alt={post.name}
                        options="height=140"
                        height={200}
                        className="w-full rounded object-cover"
                        url={post?.banner?.url}
                     />
                  </div>
               )}
            </div>
         </Link>
      </>
   );
}
