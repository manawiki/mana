import { redirect } from "@remix-run/server-runtime";

import type { Site, User } from "payload/generated-types";
import { gql, gqlRequestWithCache } from "~/utils/cache.server";
import { authGQLFetcher, gqlEndpoint } from "~/utils/fetchers.server";

export async function fetchSite({
   siteSlug,
   user,
   request,
}: {
   siteSlug: string | undefined;
   user?: User;
   request: Request;
}): Promise<Site> {
   const QUERY = gql`
      query ($siteSlug: String!) {
         site: Sites(where: { slug: { equals: $siteSlug } }) {
            docs {
               id
               name
               type
               slug
               status
               about
               isPublic
               gaTagId
               gaPropertyId
               domain
               followers
               enableAds
               totalEntries
               totalPosts
               trendingPages
               banner {
                  url
               }
               icon {
                  url
               }
               favicon {
                  url
               }
               collections {
                  id
                  name
                  slug
                  sections {
                     id
                     name
                     showTitle
                  }
                  customDatabase
                  icon {
                     id
                     url
                  }
               }
               pinned {
                  id
                  relation {
                     relationTo
                     value {
                        ... on Entry {
                           id
                           entryName: name
                           collectionEntity {
                              slug
                           }
                           icon {
                              url
                           }
                        }
                        ... on CustomPage {
                           customPageName: name
                           customPageSlug: slug
                           icon {
                              url
                           }
                        }
                        ... on Post {
                           id
                           postName: name
                        }
                        ... on Collection {
                           collectionName: name
                           collectionSlug: slug
                           icon {
                              url
                           }
                        }
                     }
                  }
               }
               owner {
                  id
                  username
                  avatar {
                     url
                  }
               }
               admins {
                  id
                  username
                  avatar {
                     url
                  }
               }
            }
         }
      }
   `;
   //Rename keys to "name"
   const swaps = {
      collectionName: "name",
      entryName: "name",
      customPageName: "name",
   };
   const pattern = new RegExp(
      Object.keys(swaps)
         .map((e) => `(?:"(${e})":)`)
         .join("|"),
      "g",
   );

   function updateKeys(data: Site) {
      return JSON.parse(
         JSON.stringify(data)?.replace(
            pattern,
            //@ts-ignore
            (m) => `"${swaps[m.slice(1, -2)]}":`,
         ),
      );
   }

   //Fetch from cache if anon
   if (!user) {
      const data = await gqlRequestWithCache(gqlEndpoint({}), QUERY, {
         siteSlug,
      });
      let site = data?.site?.docs?.[0];
      if (!site) throw redirect("/login?redirectTo=/");

      return updateKeys(site);
   }

   //Otherwise fresh pull
   const data = await authGQLFetcher({
      document: QUERY,
      variables: { siteSlug },
      request,
   });

   //@ts-ignore
   let site = data?.site?.docs?.[0];
   if (!site) throw redirect("/404");

   //@ts-ignore
   return updateKeys(site);
}
