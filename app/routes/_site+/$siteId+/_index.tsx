import { Suspense } from "react";

import { offset, shift } from "@floating-ui/react";
import { Float } from "@headlessui-float/react";
import {
   redirect,
   type ActionFunctionArgs,
   type LoaderFunctionArgs,
} from "@remix-run/node";
import { Await, useFetcher, useLoaderData } from "@remix-run/react";
import { deferIf } from "defer-if";
import type { Payload } from "payload";
import type { Select } from "payload-query";
import { select } from "payload-query";
import qs from "qs";
import type { Descendant } from "slate";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import { settings } from "mana-config";
import type { HomeContent, Site, Update, User } from "payload/generated-types";
import customConfig from "~/_custom/config.json";
import { isSiteOwnerOrAdmin } from "~/access/site";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/modules/auth";
import { EditorCommandBar } from "~/routes/_editor+/core/components/EditorCommandBar";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { ManaEditor } from "~/routes/_editor+/editor";
import { isNativeSSR } from "~/utils";
import { fetchWithCache } from "~/utils/cache.server";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const siteId = params?.siteId ?? customConfig?.siteId;
   const { page } = zx.parseQuery(request, {
      page: z.coerce.number().optional(),
   });

   const { isMobileApp } = isNativeSSR(request);

   const updateResults = await fetchHomeUpdates({
      payload,
      siteId,
      user,
      request,
   });

   const { home, isChanged, versions } = await fetchHomeContent({
      page,
      payload,
      siteId,
      user,
      request,
   });

   return await deferIf(
      { home, isChanged, updateResults, versions, siteId },
      isMobileApp,
   );
}

export default function SiteIndexMain() {
   const { home, siteId, isChanged } = useLoaderData<typeof loader>();
   const fetcher = useFetcher();
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   return (
      <>
         {hasAccess ? (
            <Float
               middleware={[
                  shift({
                     padding: {
                        top: 80,
                     },
                  }),
                  offset({
                     mainAxis: 50,
                     crossAxis: 0,
                  }),
               ]}
               zIndex={20}
               autoUpdate
               placement="right-start"
               show
            >
               <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] laptop:pt-12">
                  <Suspense fallback="Loading...">
                     <Await resolve={home}>
                        <ManaEditor
                           key={siteId}
                           collectionSlug="homeContents"
                           fetcher={fetcher}
                           siteId={siteId}
                           defaultValue={home as Descendant[]}
                        />
                     </Await>
                  </Suspense>
               </main>
               <div>
                  <EditorCommandBar
                     collectionSlug="homeContents"
                     siteId={siteId}
                     fetcher={fetcher}
                     isChanged={isChanged}
                  />
               </div>
            </Float>
         ) : (
            home && (
               <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] laptop:pt-12">
                  <EditorView data={home} />
               </main>
            )
         )}
      </>
   );
}

async function fetchHomeUpdates({
   payload,
   siteId,
   user,
   request,
}: {
   payload: Payload;
   siteId: Site["slug"];
   user?: User;
   request: Request;
}): Promise<Update[]> {
   if (user) {
      const { docs } = await payload.find({
         collection: "updates",
         where: {
            "site.slug": {
               equals: siteId,
            },
         },
         sort: "-createdAt",
         depth: 0,
         user,
      });

      const select2: Select<Update> = { entry: true, createdAt: true };

      const selectUpdateResults = select(select2);

      //@ts-expect-error
      return docs.map((doc) => selectUpdateResults(doc));
   }

   const updatesQuery = qs.stringify(
      {
         where: {
            "site.slug": {
               equals: siteId,
            },
         },
         select: {
            entry: true,
            createdAt: true,
         },
         sort: "-createdAt",
      },
      { addQueryPrefix: true },
   );
   const updatesUrl = `${settings.domainFull}/api/updates${updatesQuery}`;

   const { docs: updateResults } = await fetchWithCache(updatesUrl, {
      headers: {
         cookie: request.headers.get("cookie") ?? "",
      },
   });
   return updateResults;
}

async function fetchHomeContent({
   payload,
   siteId,
   user,
   request,
   page = 1,
}: {
   payload: Payload;
   siteId: Site["slug"];
   user?: User;
   request: Request;
   page: number | undefined;
}) {
   //Use local API and bypass cache for logged in users
   if (user) {
      const { docs } = await payload.find({
         collection: "homeContents",
         where: {
            "site.slug": {
               equals: siteId,
            },
         },
         user,
      });

      const homeData = docs[0];
      invariant(homeData, "Site has no data");

      //If site admin, pull the latest draft and update isChanged
      const hasAccess = isSiteOwnerOrAdmin(user?.id, homeData.site);

      if (hasAccess) {
         const data = await payload.findByID({
            collection: "homeContents",
            id: homeData.id,
            depth: 1,
            draft: true,
            user,
         });

         //We disable perms since ID is not a paramater we can use, if above perms pass, we pull versions.
         const versionData = await payload.findVersions({
            collection: "homeContents",
            depth: 2,
            where: {
               parent: {
                  equals: homeData.id,
               },
            },
            limit: 20,
            user,
            page,
         });

         const versions = versionData.docs
            .filter((doc) => doc.version._status === "published")
            .map((doc) => {
               const versionRow = select({ id: true, updatedAt: true }, doc);
               const version = select(
                  {
                     id: false,
                     content: true,
                     _status: true,
                  },
                  doc.version,
               );

               //Combine final result
               const result = {
                  ...versionRow,
                  version,
               };

               return result;
            });

         const home = select({ id: false, content: true }, data).content;

         const isChanged =
            JSON.stringify(home) != JSON.stringify(homeData.content);

         return { home, isChanged, versions };
      }

      //If no access, return content field from original query
      const home = docs[0]?.content;

      return { home, isChanged: false };
   }

   //For anon users, use cached endpoint call.
   const homeContentQuery = qs.stringify(
      {
         where: {
            "site.slug": {
               equals: siteId,
            },
         },
         select: {
            content: true,
         },
         depth: 1,
      },
      { addQueryPrefix: true },
   );

   const homeContentUrl = `${settings.domainFull}/api/homeContents${homeContentQuery}`;

   const { docs } = await fetchWithCache(homeContentUrl, {
      headers: {
         cookie: request.headers.get("cookie") ?? "",
      },
   });

   const home = docs[0]?.content as HomeContent["content"];

   return { home, isChanged: false };
}

export async function action({
   context: { payload, user },
   request,
}: ActionFunctionArgs) {
   const { intent } = await zx.parseForm(request, {
      intent: z.enum(["publish"]),
   });

   if (!user) throw redirect("/login", { status: 302 });

   switch (intent) {
      case "publish": {
         const { siteId } = await zx.parseForm(request, {
            siteId: z.string(),
         });
         const { docs } = await payload.find({
            collection: "homeContents",
            where: {
               "site.slug": {
                  equals: siteId,
               },
            },
            overrideAccess: false,
            user,
         });
         invariant(docs[0]);
         return await payload.update({
            collection: "homeContents",
            id: docs[0].id,
            data: {
               _status: "published",
            },
            overrideAccess: false,
            user,
         });
      }
   }
}
