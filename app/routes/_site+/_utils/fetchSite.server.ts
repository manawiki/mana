import { redirect } from "@remix-run/server-runtime";
import type { Payload } from "payload";

import type { Site } from "payload/generated-types";
import type { RemixRequestContext } from "remix.env";
import { cacheThis, gql, gqlRequestWithCache } from "~/utils/cache.server";
import { authGQLFetcher, gqlEndpoint } from "~/utils/fetchers.server";

export async function fetchSite({
   siteSlug,
   user,
   request,
   payload,
}: {
   siteSlug: string | undefined;
   user?: RemixRequestContext["user"];
   request: Request;
   payload: Payload;
}): Promise<Site> {
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

   const getSite = await cacheThis(
      () =>
         payload.find({
            collection: "sites",
            where: {
               slug: {
                  equals: siteSlug,
               },
            },
            depth: 0,
         }),
      `sites-slug-${siteSlug}`,
   );

   const siteId = getSite?.docs?.[0]?.id;

   //Fetch from cache if anon
   if (!user) {
      const isPublic = getSite?.docs?.[0]?.isPublic;
      if (!isPublic) throw redirect("/login?redirectTo=/");

      const data = await gqlRequestWithCache(gqlEndpoint({}), QUERY, {
         siteId,
      });

      return updateKeys(data?.site);
   }

   //Otherwise fetch for logged in users
   const data = await authGQLFetcher({
      document: QUERY,
      variables: { siteId },
      request,
   });

   //@ts-ignore
   if (!data.site) throw redirect("/404");

   //@ts-ignore
   return updateKeys(data?.site);
}

const QUERY = gql`
   query ($siteId: String!) {
      site: Site(id: $siteId) {
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
            id
            url
         }
         icon {
            id
            url
         }
         favicon {
            url
         }
         collections {
            id
            name
            slug
            filterGroups {
               label
               filterItem {
                  icon
                  queryString
               }
            }
            sections {
               id
               slug
               name
               showTitle
               viewType
               showAd
               subSections {
                  id
                  showTitle
                  slug
                  name
                  type
               }
            }
            customDatabase
            customEntryTemplate
            customListTemplate
            hiddenCollection
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
         contributors {
            id
            username
            avatar {
               url
            }
         }
      }
   }
`;
