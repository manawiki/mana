import { Suspense, useEffect, useState } from "react";

import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import {
   Await,
   useFetcher,
   useLoaderData,
   useLocation,
   useRouteLoaderData,
} from "@remix-run/react";
import { deferIf } from "defer-if";

import { settings } from "mana-config";
import type { Site, User } from "payload/generated-types";
import customConfig from "~/_custom/config.json";
import * as gtag from "~/routes/_site+/$siteId+/utils/gtags.client";
import { isNativeSSR } from "~/utils";
import { fetchWithCache } from "~/utils/cache.server";
import { useIsBot } from "~/utils/isBotProvider";

import {
   MobileNav,
   MobileTray,
   UserTrayContent,
   ColumnOne,
   Header,
   ColumnTwo,
   ColumnFour,
   ColumnThree,
   FollowingTrayContent,
} from "./$siteId+/components";

export async function loader({
   context: { user },
   params,
   request,
}: LoaderArgs) {
   const siteId = params?.siteId ?? customConfig?.siteId;

   const { isMobileApp } = isNativeSSR(request);

   const site = await fetchSite({ siteId, user });

   return await deferIf({ site }, isMobileApp, {
      init: {
         headers: {
            "Cache-Control": `public, s-maxage=60${user ? "" : ", max-age=60"}`,
         },
      },
   });
}

export const meta: V2_MetaFunction = ({ data }) => {
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

   const { isMobileApp } = useRouteLoaderData("root") as {
      isMobileApp: Boolean;
   };

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
            isMobileApp={isMobileApp}
            setFollowerMenuOpen={setFollowerMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
         />
         <Suspense fallback="Loading...">
            <Await resolve={{ site }}>
               {({ site }) => (
                  <main>
                     <div
                        className="laptop:grid laptop:min-h-screen laptop:auto-cols-[76px_0px_1fr_334px] 
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
                           isMobileApp={isMobileApp}
                           site={site}
                           fetcher={fetcher}
                        />

                        {/* ==== Right Sidebar ==== */}
                        <ColumnFour site={site} isMobileApp={isMobileApp} />
                     </div>

                     {/* ============  Mobile Components ============ */}
                     <MobileNav
                        setUserMenuOpen={setUserMenuOpen}
                        setFollowerMenuOpen={setFollowerMenuOpen}
                        isMobileApp={isMobileApp}
                     />

                     {/* ==== Follows: Mobile ==== */}
                     <MobileTray
                        onOpenChange={setFollowerMenuOpen}
                        open={isFollowerMenuOpen}
                     >
                        <FollowingTrayContent
                           site={site}
                           isMobileApp={isMobileApp}
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
                  icon {
                    url
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
      "g"
   );

   const updateKeys = (data: Site) =>
      JSON.parse(
         JSON.stringify(data).replace(
            pattern,
            //@ts-ignore
            (m) => `"${swaps[m.slice(1, -2)]}":`
         )
      );

   //Fetch from cache if anon
   if (!user) {
      const { data } = await fetchWithCache(
         `${settings.domainFull}/api/graphql`,
         QUERY
      );
      return updateKeys(data.site.docs[0]);
   }

   //Otherwise fresh pull
   const { data } = await fetch(
      `${settings.domainFull}/api/graphql`,
      QUERY
   ).then((res) => res.json());
   return updateKeys(data.site.docs[0]);
};
