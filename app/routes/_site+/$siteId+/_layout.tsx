import { Suspense, useEffect, useState } from "react";

import { json } from "@remix-run/node";
import type {
   ActionFunction,
   LoaderFunctionArgs,
   MetaFunction,
} from "@remix-run/node";
import {
   Await,
   useFetcher,
   useLoaderData,
   useLocation,
   useRouteLoaderData,
} from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";

import { settings } from "mana-config";
import type { Site, User } from "payload/generated-types";
import customConfig from "~/_custom/config.json";
import { isStaffOrSiteAdminOrStaffOrOwnerServer } from "~/routes/_auth+/src/functions";
import * as gtag from "~/routes/_site+/$siteId+/src/utils/gtags.client";
import { assertIsPost } from "~/utils";
import { fetchWithCache } from "~/utils/cache.server";
import { useIsBot } from "~/utils/isBotProvider";

import {
   MobileTray,
   UserTrayContent,
   ColumnOne,
   Header,
   ColumnTwo,
   ColumnFour,
   ColumnThree,
   FollowingTrayContent,
} from "./src/components";

export { ErrorBoundary } from "~/components/ErrorBoundary";

export async function loader({
   context: { user },
   params,
   request,
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

export const meta: MetaFunction = ({ data }) => {
   return [
      {
         title: data.site.name,
      },
   ];
};

export const handle = {
   i18n: "site",
};

export default function SiteIndex() {
   const { site } = useLoaderData<typeof loader>() || {};
   const fetcher = useFetcher();
   const location = useLocation();
   const { user } = useRouteLoaderData("root") as { user: User };
   const [isFollowerMenuOpen, setFollowerMenuOpen] = useState(false);
   const [isUserMenuOpen, setUserMenuOpen] = useState(false);
   const [searchToggle, setSearchToggle] = useState(false);
   const gaTrackingId = site?.gaTagId;
   let isBot = useIsBot();

   useEffect(() => {
      if (process.env.NODE_ENV === "production" && gaTrackingId) {
         gtag.pageview(location.pathname, gaTrackingId);
      }
      setSearchToggle(false);
   }, [location, gaTrackingId]);

   return (
      <>
         <Header
            location={location}
            site={site}
            fetcher={fetcher}
            setFollowerMenuOpen={setFollowerMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
         />
         <Suspense fallback="Loading...">
            <Await resolve={{ site }}>
               {({ site }) => (
                  <main>
                     <div
                        className="laptop:grid laptop:min-h-screen laptop:auto-cols-[76px_60px_1fr_334px] 
                     laptop:grid-flow-col desktop:auto-cols-[76px_220px_1fr_334px]"
                     >
                        {/* ==== Desktop Following Menu ==== */}
                        <ColumnOne site={site} user={user} />

                        {/* ==== Site Menu ==== */}
                        <ColumnTwo site={site} user={user} />

                        {/* ==== Main Content ==== */}
                        <ColumnThree
                           location={location}
                           searchToggle={searchToggle}
                           setSearchToggle={setSearchToggle}
                           site={site}
                           fetcher={fetcher}
                        />

                        {/* ==== Right Sidebar ==== */}
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
                     <MobileTray
                        onOpenChange={setUserMenuOpen}
                        open={isUserMenuOpen}
                     >
                        <UserTrayContent onOpenChange={setUserMenuOpen} />
                     </MobileTray>
                  </main>
               )}
            </Await>
         </Suspense>
         {/* ==== Google Analytics ==== */}
         {process.env.NODE_ENV === "production" && gaTrackingId && !isBot ? (
            <>
               <script
                  defer
                  src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
               />
               <script
                  defer
                  id="gtag-init"
                  dangerouslySetInnerHTML={{
                     __html: `
                              window.dataLayer = window.dataLayer || [];
                              function gtag(){dataLayer.push(arguments);}
                              gtag('js', new Date());

                              gtag('config', '${gaTrackingId}', {
                                 page_path: window.location.pathname,
                              });
                           `,
                  }}
               />
            </>
         ) : null}
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
         const userCurrentSites = user?.sites || [];
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
            id: siteUID,
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
            id: siteUID,
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
         const userCurrentSites = user?.sites || [];
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
            id: siteUID,
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
   siteId: Site["slug"];
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
