import { useEffect, useState } from "react";

import { json } from "@remix-run/node";
import type {
   ActionFunction,
   LoaderFunctionArgs,
   MetaFunction,
   SerializeFrom,
} from "@remix-run/node";
import { useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import type { ExternalScriptsHandle } from "remix-utils/external-scripts";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import { settings } from "mana-config";
import type { Site, User } from "payload/generated-types";
import customConfig from "~/_custom/config.json";
import { isStaffOrSiteAdminOrStaffOrOwnerServer } from "~/routes/_auth+/src/functions";
import * as gtag from "~/routes/_site+/$siteId+/src/utils/gtags.client";
import { assertIsPost } from "~/utils";
import { fetchWithCache } from "~/utils/cache.server";

import {
   MobileTray,
   UserTrayContent,
   ColumnOne,
   MobileHeader,
   ColumnTwo,
   ColumnFour,
   ColumnThree,
   FollowingTrayContent,
   GAScripts,
} from "./src/components";
import { RampScripts } from "./src/components/RampScripts";

export { ErrorBoundary } from "~/components/ErrorBoundary";

export async function loader({
   context: { user },
   params,
}: LoaderFunctionArgs) {
   const siteId = params?.siteId ?? customConfig?.siteId;

   const site = await fetchSite({ siteId, user });

   if (!site) {
      throw new Response(null, {
         status: 404,
         statusText: "Not Found",
      });
   }

   //If site is not set to public, limit access to staff and site admins/owners only
   const hasAccess = isStaffOrSiteAdminOrStaffOrOwnerServer(user, site);

   if (!hasAccess && !site.isPublic) {
      throw new Response(null, {
         status: 404,
         statusText: "Not Found",
      });
   }

   return await json(
      { site },
      {
         headers: {
            "Cache-Control": `public, s-maxage=60${user ? "" : ", max-age=60"}`,
         },
      },
   );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
   return [
      {
         title: data?.site.name,
      },
   ];
};

export let handle: ExternalScriptsHandle<SerializeFrom<typeof loader>> = {
   scripts({ data }) {
      const enableAds = data.site.enableAds;
      const gaTag = data.site.gaTagId;

      //disable scripts in development
      if (process.env.NODE_ENV === "development") return [];

      if (enableAds || gaTag) {
         const gAnalytics = {
            src: `https://www.googletagmanager.com/gtag/js?id=${gaTag}`,
            async: true,
         };
         //Load GTag with ads if enabled
         if (enableAds) {
            const rampConfig = {
               src: "//cdn.intergient.com/1025133/74686/ramp_config.js",
               async: true,
            };
            const rampCore = {
               src: "//cdn.intergient.com/ramp_core.js",
               async: true,
            };
            return [gAnalytics, rampConfig, rampCore];
         }
         //Otherwise just load analytics
         return [gAnalytics];
      }

      return [];
   },
};

export default function SiteIndex() {
   const { site } = useLoaderData<typeof loader>() || {};
   const fetcher = useFetcher();
   const location = useLocation();
   const [isFollowerMenuOpen, setFollowerMenuOpen] = useState(false);
   const [isUserMenuOpen, setUserMenuOpen] = useState(false);
   const [searchToggle, setSearchToggle] = useState(false);
   const gaTag = site?.gaTagId;
   const enableAds = site?.enableAds;

   useEffect(() => {
      if (process.env.NODE_ENV === "production" && gaTag) {
         gtag.pageview(location.pathname, gaTag);
      }
      //Hide the search on path change
      setSearchToggle(false);
   }, [location, gaTag]);

   return (
      <>
         <MobileHeader
            location={location}
            site={site}
            fetcher={fetcher}
            setFollowerMenuOpen={setFollowerMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
         />
         <main>
            <div
               className="laptop:grid laptop:min-h-screen laptop:auto-cols-[76px_60px_1fr_334px] 
                     laptop:grid-flow-col desktop:auto-cols-[76px_230px_1fr_334px]"
            >
               <ColumnOne site={site} />
               <ColumnTwo site={site} />
               <ColumnThree
                  searchToggle={searchToggle}
                  setSearchToggle={setSearchToggle}
                  site={site}
                  fetcher={fetcher}
               />
               <ColumnFour site={site} />
            </div>

            {/* ==== Follows: Mobile ==== */}
            <MobileTray
               onOpenChange={setFollowerMenuOpen}
               open={isFollowerMenuOpen}
            >
               <FollowingTrayContent
                  site={site}
                  setFollowerMenuOpen={setFollowerMenuOpen}
               />
            </MobileTray>

            {/* ==== User Menu: Mobile ==== */}
            <MobileTray onOpenChange={setUserMenuOpen} open={isUserMenuOpen}>
               <UserTrayContent onOpenChange={setUserMenuOpen} />
            </MobileTray>
         </main>
         <GAScripts gaTrackingId={gaTag} />
         <RampScripts enableAds={enableAds} />
      </>
   );
}

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
   params,
}) => {
   assertIsPost(request);
   const siteId = params?.siteId ?? customConfig?.siteId;

   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   switch (intent) {
      case "followSite": {
         //We need to get the current sites of the user, then prepare the new sites array
         const userId = user?.id;
         invariant(userId);
         const userData = user
            ? await payload.findByID({
                 collection: "users",
                 id: userId,
                 user,
              })
            : undefined;
         const userCurrentSites = userData?.sites || [];
         //@ts-ignore
         const sites = userCurrentSites.map(({ id }: { id }) => id);
         //Finally we update the user with the new site id

         const siteData = await payload.find({
            collection: "sites",
            where: {
               slug: {
                  equals: siteId,
               },
            },
            user,
         });
         const siteUID = siteData?.docs[0]?.id;
         await payload.update({
            collection: "users",
            id: userId ?? "",
            data: { sites: [...sites, siteUID] },
            overrideAccess: false,
            user,
         });

         const { totalDocs } = await payload.find({
            collection: "users",
            where: {
               sites: {
                  equals: siteUID,
               },
            },
            depth: 0,
         });

         return await payload.update({
            collection: "sites",
            id: siteUID as string,
            data: { followers: totalDocs },
         });
      }
      case "unfollow": {
         const userId = user?.id;

         const siteData = await payload.find({
            collection: "sites",
            where: {
               slug: {
                  equals: siteId,
               },
            },
            user,
         });
         const siteUID = siteData?.docs[0]?.id;
         const site = await payload.findByID({
            collection: "sites",
            id: siteUID as string,
            user,
         });

         // Prevent site creator from leaving own site
         //@ts-ignore
         if (site.owner?.id === userId) {
            return json(
               {
                  errors: "Cannot unfollow your own site",
               },
               { status: 400 },
            );
         }

         invariant(userId);

         const userData = user
            ? await payload.findByID({
                 collection: "users",
                 id: userId,
                 user,
              })
            : undefined;

         const userCurrentSites = userData?.sites || [];
         //@ts-ignore
         const sites = userCurrentSites.map(({ id }: { id }) => id);

         //Remove the current site from the user's sites array
         const index = sites.indexOf(site.id);
         if (index > -1) {
            // only splice array when item is found
            sites.splice(index, 1); // 2nd parameter means remove one item only
         }

         await payload.update({
            collection: "users",
            id: userId ?? "",
            data: { sites },
            overrideAccess: false,
            user,
         });

         const { totalDocs } = await payload.find({
            collection: "users",
            where: {
               sites: {
                  equals: siteUID,
               },
            },
            depth: 0,
         });

         return await payload.update({
            collection: "sites",
            id: siteUID as string,
            data: { followers: totalDocs },
         });
      }
      default:
         return null;
   }
};

const fetchSite = async ({
   siteId,
   user,
}: {
   siteId: string;
   user?: User;
}): Promise<Site> => {
   const QUERY = {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         query: `
         query {
            site: Sites(
              where: {
                slug: { equals: "${siteId}" }
              }
            ) {
               docs {
                  id
                  name
                  type
                  slug
                  status
                  about
                  isPublic
                  gaTagId
                  domain
                  followers
                  enableAds
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
         `,
         variables: {
            siteId,
         },
      }),
   };

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

   const updateKeys = (data: Site) =>
      JSON.parse(
         JSON.stringify(data).replace(
            pattern,
            //@ts-ignore
            (m) => `"${swaps[m.slice(1, -2)]}":`,
         ),
      );

   //Fetch from cache if anon
   if (!user) {
      const { data } = await fetchWithCache(
         `${settings.domainFull}/api/graphql`,
         QUERY,
      );
      return updateKeys(data.site.docs[0]);
   }

   //Otherwise fresh pull
   const { data } = await fetch(
      `${settings.domainFull}/api/graphql`,
      QUERY,
   ).then((res) => res.json());
   return updateKeys(data.site.docs[0]);
};
