import { useEffect } from "react";

import { Tab } from "@headlessui/react";
import {
   json,
   redirect,
   type LinksFunction,
   type LoaderFunctionArgs,
} from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import AOS from "aos";
import aosStyles from "aos/dist/aos.css";
import clsx from "clsx";
import { z } from "zod";
import { zx } from "zodix";

import { Icon } from "~/components/Icon";
import { gql, gqlRequestWithCache } from "~/utils/cache.server";
import { gqlEndpoint } from "~/utils/fetchers.server";

import { Discover } from "./components/Discover";
import { EditorDemo } from "./components/EditorDemo";
import { TopHome } from "./components/TopHome";
import indexStyles from "./styles.css";

export const meta: MetaFunction = () => [
   { title: "Mana - A new kind of wiki" },
];

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   if (user) return redirect("/home");

   const { q, c, page } = zx.parseQuery(request, {
      q: z.string().optional(),
      c: z
         .union([z.literal("all"), z.literal("gaming"), z.literal("other")])
         .optional(),
      page: z.coerce.number().optional(),
   });

   const QUERY = gql`query {
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
          type
          slug
          status
          about
          icon {
            url
          }
        }
      }
    }
   `;

   const data = await gqlRequestWithCache(gqlEndpoint({}), QUERY);

   const sites = data.sites;

   return json(
      { q, sites, dev: process.env.NODE_ENV === "development" ?? undefined },
      { headers: { "Cache-Control": "public, s-maxage=60, max-age=60" } },
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
   useEffect(() => {
      AOS.init({
         once: true,
         disable: "phone",
         duration: 1000,
         easing: "ease-out-cubic",
      });
   });

   return (
      <>
         <TopHome />
         <Discover />
         <div className="bg-zinc-50 dark:bg-zinc-800/20 w-full z-10 relative max-laptop:px-5 border-y border-color">
            <div className="max-w-[770px] mx-auto pt-14 pb-5 border-b border-color">
               <div className="font-header text-center text-2xl pb-1.5">
                  Building blocks for your wiki
               </div>
               <div className="text-1 text-center">
                  The tools you need to build a collaborative wiki for your
                  community
               </div>
            </div>
            <div className="max-w-[770px] mx-auto gap-4 w-full pt-6 pb-20">
               <Tab.Group>
                  <Tab.List className="grid max-laptop:grid-cols-2 gap-3 grid-cols-4 pb-4">
                     <Tab
                        className={({ selected }) =>
                           clsx(
                              selected
                                 ? "bg-white dark:bg-dark450 border-zinc-200 dark:border-zinc-600"
                                 : "dark:bg-dark400 bg-zinc-100",
                              "focus-visible:outline-none shadow-sm shadow-zinc-200 dark:shadow-zinc-800 w-full pl-4 pr-6 py-2.5 font-bold text-left flex items-center gap-2 text-xs laptop:text-sm rounded-lg truncate border border-transparent",
                           )
                        }
                     >
                        <div className="size-3.5 bg-blue-500 rounded-full" />
                        <span>Editor</span>
                     </Tab>
                     <Tab
                        className={({ selected }) =>
                           clsx(
                              selected
                                 ? "bg-white dark:bg-dark450 border-zinc-200 dark:border-zinc-600"
                                 : "dark:bg-dark400 bg-zinc-100",
                              "focus-visible:outline-none shadow-sm shadow-zinc-200 dark:shadow-zinc-800 w-full pl-4 pr-6 py-2.5 font-bold text-left flex items-center gap-2 text-xs laptop:text-sm rounded-lg truncate border border-transparent",
                           )
                        }
                     >
                        <Icon
                           name="pen-square"
                           className="text-emerald-500"
                           size={16}
                        />
                        Posts
                     </Tab>
                     <Tab
                        className={({ selected }) =>
                           clsx(
                              selected
                                 ? "bg-white dark:bg-dark450 border-zinc-200 dark:border-zinc-600"
                                 : "dark:bg-dark400 bg-zinc-100",
                              "focus-visible:outline-none shadow-sm shadow-zinc-200 dark:shadow-zinc-800 w-full pl-4 pr-6 py-2.5 font-bold text-left flex items-center gap-2 text-xs laptop:text-sm rounded-lg truncate border border-transparent",
                           )
                        }
                     >
                        <Icon
                           name="database"
                           className="text-amber-500"
                           size={16}
                        />
                        Collections
                     </Tab>
                     <Tab
                        className={({ selected }) =>
                           clsx(
                              selected
                                 ? "bg-white dark:bg-dark450 border-zinc-200 dark:border-zinc-600"
                                 : "dark:bg-dark400 bg-zinc-100",
                              "focus-visible:outline-none shadow-sm shadow-zinc-200 dark:shadow-zinc-800 w-full pl-4 pr-6 py-2.5 font-bold text-left flex items-center gap-2 text-xs laptop:text-sm rounded-lg truncate border border-transparent",
                           )
                        }
                     >
                        <Icon
                           name="message-circle"
                           className="text-purple-500"
                           size={16}
                        />
                        Community
                     </Tab>
                  </Tab.List>
                  <Tab.Panels className="flex-grow">
                     <Tab.Panel>
                        <EditorDemo />
                     </Tab.Panel>
                     <Tab.Panel></Tab.Panel>
                     <Tab.Panel></Tab.Panel>
                     <Tab.Panel></Tab.Panel>
                  </Tab.Panels>
               </Tab.Group>
            </div>
         </div>
      </>
   );
}
