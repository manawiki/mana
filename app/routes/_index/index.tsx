import { json, type LinksFunction, type LoaderArgs } from "@remix-run/node";
import {
   Link,
   useLoaderData,
   useRouteLoaderData,
   useSearchParams,
} from "@remix-run/react";
import type { V2_MetaFunction } from "@remix-run/react";
import clsx from "clsx";
import { LogoFull } from "~/components/LogoFull";
import indexStyles from "./styles.css";

import { useEffect, useState } from "react";
import AOS from "aos";
import aosStyles from "aos/dist/aos.css";
import { Top } from "./components/top";
import {
   ChevronLeft,
   ChevronRight,
   Component,
   Gamepad2,
   Globe2,
   Search,
   X,
} from "lucide-react";
import { zx } from "zodix";
import { z } from "zod";
import { fetchWithCache } from "~/utils/cache.server";
import { settings } from "mana-config";
import { LoggedOut, LoggedOutDropDown } from "~/modules/auth";
import { useDebouncedValue } from "~/hooks";
import type { Site } from "~/db/payload-types";
import { Image } from "~/components";
import { RadioGroup } from "@headlessui/react";

export const meta: V2_MetaFunction = () => [
   { title: "Mana - A new kind of wiki" },
];

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const { q, c, page } = zx.parseQuery(request, {
      q: z.string().optional(),
      c: z
         .union([z.literal("all"), z.literal("gaming"), z.literal("other")])
         .optional(),
      page: z.coerce.number().optional(),
   });

   const { data, errors } = await fetchWithCache(
      `${settings.domainFull}/api/graphql`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            query: `
            query {
               sites: Sites(
                 ${page ? `page:${page}` : ""}
                 where: {
                   status: { equals: verified }
                   ${c != null && "all" ? `category: { equals: ${c} }` : ""}
                   ${
                      q
                         ? `OR: [{ name: { contains: "${q}" } }, { about: { contains: "${q}" } }]`
                         : ""
                   }
                 }
               ) {
                 totalDocs
                 totalPages
                 pagingCounter
                 hasPrevPage
                 prevPage
                 hasNextPage
                 docs {
                   id
                   name
                   slug
                   status
                   about
                   icon {
                     url
                   }
                 }
               }
             }
            `,
            variables: {
               page,
               q,
               c,
            },
         }),
      }
   );

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      throw new Error();
   }
   const sites = data.sites;

   return json(
      { q, sites },
      { headers: { "Cache-Control": "public, s-maxage=60, max-age=60" } }
   );
}

export const links: LinksFunction = () => [
   //preload css makes it nonblocking to html renders
   { rel: "preload", href: indexStyles, as: "style" },
   { rel: "stylesheet", href: indexStyles },

   { rel: "preload", href: aosStyles, as: "style" },
   { rel: "stylesheet", href: aosStyles },
];

export default function IndexMain() {
   const { isMobileApp } = useRouteLoaderData("root") as {
      isMobileApp: Boolean;
   };
   useEffect(() => {
      AOS.init({
         once: true,
         disable: "phone",
         duration: 1000,
         easing: "ease-out-cubic",
      });
   });

   return (
      <div className="bg-zinc-900">
         <main className="flex min-h-screen flex-col overflow-hidden">
            <div className="grow">
               <header className="absolute z-30 w-full">
                  <div className="mx-auto max-w-6xl px-4">
                     <div className="flex h-16 items-center justify-between">
                        <div className="text-dark">
                           <Link className="block" to="/">
                              <LogoFull />
                           </Link>
                        </div>
                        <nav className="">
                           <LoggedOutDropDown />
                           <LoggedOut>
                              <ul className="flex items-center justify-end gap-3">
                                 <li>
                                    <Link
                                       to="/join"
                                       className="group relative inline-flex h-8 items-center justify-center overflow-hidden 
                                 rounded-lg px-3 py-2  text-indigo-600 shadow shadow-zinc-950 transition duration-300 ease-out"
                                    >
                                       <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                                       <span
                                          className="ease absolute bottom-0 right-0 mb-32 mr-4 block h-64 w-64 origin-bottom-left translate-x-24 
                                    rotate-45 transform rounded-lg bg-teal-500 opacity-30 transition duration-500 group-hover:rotate-90"
                                       ></span>
                                       <span className="relative text-xs font-extrabold uppercase text-white">
                                          Sign Up
                                       </span>
                                    </Link>
                                 </li>
                                 <li>
                                    <Link
                                       className="flex h-[34px] items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-center 
                                 text-xs font-extrabold uppercase text-white shadow-sm shadow-zinc-950"
                                       to="/login"
                                    >
                                       Login
                                    </Link>
                                 </li>
                              </ul>
                           </LoggedOut>
                        </nav>
                     </div>
                  </div>
               </header>
               <Top />
               <Discover />
            </div>
         </main>
      </div>
   );
}

const Discover = () => {
   const { q, sites } = useLoaderData<typeof loader>() || {};
   const [query, setQuery] = useState(q);
   const debouncedValue = useDebouncedValue(query, 500);

   const [searchParams, setSearchParams] = useSearchParams({});
   const [category, setCategory] = useState("all");

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
         <section className="relative z-10 text-dark">
            <section className="min-h-screen border-t border-zinc-700/50 bg-zinc-800/30">
               <div
                  className="pattern-dots absolute left-0
                top-0 h-full
                  w-full pattern-zinc-600 pattern-bg-zinc-800 pattern-opacity-10 pattern-size-4"
               ></div>
               <div className="relative z-10 mx-auto max-w-[680px] max-laptop:px-4">
                  <div className="flex items-center justify-center">
                     <div
                        className="relative -mt-[28px] h-14 w-full  rounded-2xl border
                   border-zinc-700/50 bg-zinc-800 shadow shadow-black/30"
                     >
                        <>
                           <div className="relative flex h-full w-full items-center gap-2">
                              <span className="absolute left-[16px] top-[17px]">
                                 <Search size={20} className="text-zinc-400" />
                              </span>
                              <input
                                 type="text"
                                 placeholder="Search..."
                                 className="h-full w-full border-0 bg-transparent pl-[50px] 
                                 text-dark focus:outline-none focus:ring-0"
                                 value={query}
                                 onChange={(e) => setQuery(e.target.value)}
                              />
                           </div>
                           {searchParams.size >= 1 && (
                              <button
                                 className="absolute right-4 top-4"
                                 onClick={() => {
                                    setSearchParams((searchParams) => {
                                       searchParams.delete("q");
                                       searchParams.delete("c");
                                       setCategory("all");
                                       return searchParams;
                                    });
                                    setQuery("");
                                 }}
                              >
                                 <X size={22} className="text-red-500" />
                              </button>
                           )}
                        </>
                     </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 pb-3 pt-6">
                     <RadioGroup
                        className="flex items-center gap-4"
                        value={category}
                        onChange={(value) => {
                           if (value != "all") {
                              setSearchParams(
                                 (old) => {
                                    const newThing = new URLSearchParams(old);
                                    console.log(newThing);
                                    newThing.set("c", value);
                                    return newThing;
                                 },
                                 { preventScrollReset: false }
                              );
                           } else
                              setSearchParams(
                                 (searchParams) => {
                                    searchParams.delete("c");
                                    return searchParams;
                                 },
                                 { preventScrollReset: false }
                              );
                           setCategory(value);
                        }}
                     >
                        <RadioGroup.Option value="all">
                           {({ checked }) => (
                              <div
                                 className={clsx(
                                    checked
                                       ? "border-blue-800 bg-blue-950"
                                       : "border-zinc-700 bg-zinc-800",
                                    "flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-xs font-bold uppercase shadow shadow-black/30"
                                 )}
                              >
                                 <Globe2 size={15} />
                                 <span className="text-zinc-200">All</span>
                              </div>
                           )}
                        </RadioGroup.Option>
                        <RadioGroup.Option value="gaming">
                           {({ checked }) => (
                              <div
                                 className={clsx(
                                    checked
                                       ? "border-blue-800 bg-blue-950"
                                       : "border-zinc-700 bg-zinc-800",
                                    "flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-xs font-bold uppercase shadow shadow-black/30"
                                 )}
                              >
                                 <Gamepad2 size={16} />
                                 <span className="text-zinc-200">Gaming</span>
                              </div>
                           )}
                        </RadioGroup.Option>
                        <RadioGroup.Option value="other">
                           {({ checked }) => (
                              <div
                                 className={clsx(
                                    checked
                                       ? "border-blue-800 bg-blue-950"
                                       : "border-zinc-700 bg-zinc-800",
                                    "flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-xs font-bold uppercase shadow shadow-black/30"
                                 )}
                              >
                                 <Component size={14} />
                                 <span className="text-zinc-200">Other</span>
                              </div>
                           )}
                        </RadioGroup.Option>
                     </RadioGroup>
                     <div className="pr-0.5 pt-2 text-sm font-bold">
                        <span className="font-bold text-zinc-400">
                           {sites?.totalDocs}
                        </span>{" "}
                        results
                     </div>
                  </div>
                  <div className="flex-grow space-y-4 pt-2">
                     {sites?.docs.length === 0 ? (
                        <div className="py-3 text-sm ">Empty</div>
                     ) : (
                        sites?.docs.map((site: Site) => (
                           <Link
                              prefetch="intent"
                              to={`${site.slug}`}
                              key={site.id}
                              className="flex items-center gap-3.5 rounded-2xl border border-transparent border-zinc-700
                              bg-zinc-800 p-3 shadow shadow-black/30
                              hover:border-zinc-600"
                           >
                              <div
                                 className="h-11 w-11 flex-none overflow-hidden rounded-full
                                 border border-zinc-500 bg-zinc-700 shadow shadow-black/50"
                              >
                                 <Image
                                    height={44}
                                    width={44}
                                    url={`${site.icon?.url}`}
                                 />
                              </div>
                              <div className="truncate">
                                 <div className="font-header font-bold text-dark laptop:text-lg">
                                    {site.name}
                                 </div>
                                 <div className="truncate text-sm text-zinc-400">
                                    {site.about}
                                 </div>
                              </div>
                           </Link>
                        ))
                     )}
                  </div>
                  {sites?.totalPages > 1 && (
                     <div className="text-1 flex items-center justify-between py-3 pl-1 text-sm">
                        <div>
                           Showing{" "}
                           <span className="font-bold">
                              {sites?.pagingCounter}
                           </span>{" "}
                           to{" "}
                           <span className="font-bold">
                              {sites?.docs?.length + sites.pagingCounter - 1}
                           </span>{" "}
                           of{" "}
                           <span className="font-bold">{sites?.totalDocs}</span>{" "}
                           results
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                           {sites?.hasPrevPage ? (
                              <button
                                 className="flex items-center gap-1 font-semibold uppercase hover:underline"
                                 onClick={() =>
                                    setSearchParams((searchParams) => {
                                       searchParams.set(
                                          "page",
                                          sites.prevPage as any
                                       );
                                       return searchParams;
                                    })
                                 }
                              >
                                 <ChevronLeft
                                    size={18}
                                    className="text-emerald-500"
                                 />
                                 Prev
                              </button>
                           ) : null}
                           {sites.hasNextPage && sites.hasPrevPage && (
                              <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                           )}
                           {sites.hasNextPage ? (
                              <button
                                 className="flex items-center gap-1 font-semibold uppercase hover:underline"
                                 onClick={() =>
                                    setSearchParams((searchParams) => {
                                       searchParams.set(
                                          "page",
                                          sites.nextPage as any
                                       );
                                       return searchParams;
                                    })
                                 }
                              >
                                 Next
                                 <ChevronRight
                                    size={18}
                                    className="text-emerald-500"
                                 />
                              </button>
                           ) : null}
                        </div>
                     </div>
                  )}
               </div>
            </section>
         </section>
      </>
   );
};
