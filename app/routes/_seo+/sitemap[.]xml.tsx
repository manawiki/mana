import type { LoaderFunctionArgs } from "@remix-run/node";

import type { Collection } from "payload/generated-types";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";

import { fetchSite } from "../_site+/_utils/fetchSite.server";
import { fetchPublishedPosts } from "../_site+/posts+/utils/fetchPublishedPosts";

import {
   authGQLFetcher,
   authRestFetcher,
   gqlFormat,
} from "~/utils/fetchers.server";
import { gql } from "graphql-request";

interface CustomEntry {
   slug?: string;
   id: string;
}

interface TotalCustomEntries {
   entries: {
      docs: CustomEntry[];
   };
}

const toXmlSitemap = (urls: string[]) => {
   const urlsAsXml = urls
      .map((url) => `<url><loc>${url}</loc></url>`)
      .join("\n");

   return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
      >
        ${urlsAsXml}
      </urlset>
    `;
};

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);

   const { origin } = new URL(request.url);

   const site = await fetchSite({ siteSlug, request, payload });

   // console.log("site: ", site);

   const collections = site?.collections;

   // console.log("collections: ", collections);

   const { docs: posts } = await fetchPublishedPosts({
      payload,
      siteSlug,
   });

   // console.log("posts: ", posts);

   const { docs: entries } = await payload.find({
      collection: "entries",
      depth: 1,
      where: {
         "site.slug": {
            equals: siteSlug,
         },
      },
      limit: 0,
      overrideAccess: false,
   });

   const processCustomEntries = await Promise.all(
      collections!.map(async (collection: Collection) => {
         if (!collection.customDatabase) return [];

         const label = gqlFormat(collection?.slug as string, "list");

         const CUSTOM_ENTRIES_QUERY = gql`
            query {
               entries: ${label}(limit:12000) {
                  docs {
                     id
                     slug
                  }
               }
            }
         `;

         const totalCustomEntries = (await authGQLFetcher({
            isAuthOverride: true,
            isCustomDB: true,
            document: CUSTOM_ENTRIES_QUERY,
         })) as TotalCustomEntries;

         return totalCustomEntries.entries.docs.map(
            ({ slug, id }: CustomEntry) =>
               `${origin}/c/${collection.slug}/${slug ?? id}`,
         );
      }),
   );

   const customEntries = processCustomEntries
      ? processCustomEntries.flatMap((items) => items)
      : [];

   // console.log("customEntries: ", customEntries);

   try {
      const sitemap = toXmlSitemap([
         `${origin}`,
         `${origin}/collections`,
         `${origin}/posts`,
         ...posts.map(
            //@ts-ignore
            ({ slug }) => `${origin}/p/${slug}`,
         ),
         ...collections!.map(({ slug }) => `${origin}/c/${slug}`),
         ...entries.map(
            ({ id, collectionEntity, slug }) =>
               `${origin}/c/${collectionEntity?.slug}/${slug ?? id}`,
         ),
         ...customEntries,
      ]);
      return new Response(sitemap, {
         status: 200,
         headers: {
            "Content-Type": "application/xml",
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "public, max-age=3600",
         },
      });
   } catch (e) {
      console.log(e);
      throw new Response("Internal Server Error", { status: 500 });
   }
}
