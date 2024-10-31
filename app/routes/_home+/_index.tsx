import { useEffect } from "react";

import {
   json,
   redirect,
   type LinksFunction,
   type LoaderFunctionArgs,
} from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import AOS from "aos";
import aosStyles from "aos/dist/aos.css";
import { z } from "zod";
import { zx } from "zodix";

import { gql, gqlRequestWithCache } from "~/utils/cache.server";
import { gqlEndpoint } from "~/utils/fetchers.server";

import { Discover } from "../_exploreuser+/components/Discover";
import { GetStartedOptions } from "./components/GetStartedOptions";
import { ToolKit } from "./components/Toolkit";
import { TopHome } from "./components/TopHome";
import indexStyles from "./styles.css";

export const meta: MetaFunction = () => [
   { title: "Mana - The all-in-one wiki builder" },
];

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   if (user) return redirect("/explore");

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

   //@ts-ignore
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
         <GetStartedOptions />
         <ToolKit />
      </>
   );
}
