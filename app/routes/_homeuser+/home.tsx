import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { gql } from "graphql-request";
import { z } from "zod";
import { zx } from "zodix";

import { gqlRequestWithCache } from "~/utils/cache.server";
import { gqlEndpoint } from "~/utils/fetchers.server";

import { Discover } from "../_home+/components/Discover";
import { ColumnOneMenu } from "../_site+/_components/Column-1-Menu";
import { MobileHeader } from "../_site+/_components/MobileHeader";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   if (!user) throw redirect("/login");

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
        sort:"-followers"
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
          domain
          followers
          icon {
            url
          }
          banner {
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

export default function Home() {
   return (
      <>
         <MobileHeader />
         <main
            className="max-laptop:pt-14 grid min-h-screen laptop:auto-cols-[70px_1fr] 
               laptop:grid-flow-col"
         >
            <section className="bg-1 border-color relative top-0 z-50 max-laptop:fixed max-laptop:w-full shadow-sm shadow-1 laptop:border-r">
               <div
                  className="top-0 hidden max-laptop:py-2 laptop:fixed laptop:left-0 laptop:block 
                  laptop:h-full laptop:w-[70px] laptop:overflow-y-auto laptop:pt-3 no-scrollbar"
               >
                  <ColumnOneMenu />
               </div>
            </section>
            <div className="bg-3 pt-11">
               <Discover />
            </div>
         </main>
      </>
   );
}
