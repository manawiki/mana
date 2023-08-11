import { Suspense, useCallback, useMemo } from "react";

import { json, type ActionFunction, type LoaderArgs } from "@remix-run/node";
import { Await, useFetcher, useLoaderData } from "@remix-run/react";
import { deferIf } from "defer-if";
import { Check, History, Loader2, MoreVertical } from "lucide-react";
import { nanoid } from "nanoid";
import type { Payload } from "payload";
import type { Select } from "payload-query";
import { select } from "payload-query";
import qs from "qs";
import { createEditor } from "slate";
import {
   Slate,
   Editable,
   withReact,
   type RenderElementProps,
} from "slate-react";
import { z } from "zod";
import { zx } from "zodix";

import { settings } from "mana-config";
import type { HomeContent, Site, Update, User } from "payload/generated-types";
import customConfig from "~/_custom/config.json";
import { isSiteOwnerOrAdmin } from "~/access/site";
import Tooltip from "~/components/Tooltip";
import {
   AdminOrStaffOrOwner,
   useIsStaffOrSiteAdminOrStaffOrOwner,
} from "~/modules/auth";
import Block from "~/modules/editor/blocks/Block";
import Leaf from "~/modules/editor/blocks/Leaf";
import type { CustomElement } from "~/modules/editor/types";
import { BlockType } from "~/modules/editor/types";
import { SoloEditor } from "~/routes/editors+/SoloEditor";
import { assertIsPost, isNativeSSR, isProcessing } from "~/utils";
import { fetchWithCache } from "~/utils/cache.server";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const siteId = params?.siteId ?? customConfig?.siteId;

   const { isMobileApp } = isNativeSSR(request);

   const updateResults = await fetchHomeUpdates({
      payload,
      siteId,
      user,
      request,
   });

   const { home, isChanged } = await fetchHomeContent({
      payload,
      siteId,
      user,
      request,
   });

   return await deferIf(
      { home, isChanged, updateResults, siteId },
      isMobileApp
   );
}

export default function SiteIndexMain() {
   const { home, isChanged, siteId } = useLoaderData<typeof loader>();
   const editor = useMemo(() => withReact(createEditor()), []);
   const renderElement = useCallback((props: RenderElementProps) => {
      return <Block {...props} />;
   }, []);
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   const fetcher = useFetcher();

   const isAutoSaving =
      fetcher.state === "submitting" &&
      fetcher.formData?.get("intentType") === "update";

   const isPublishing =
      fetcher.state === "submitting" &&
      fetcher.formData?.get("intentType") === "publish";

   const disabled = isProcessing(fetcher.state);

   return (
      <>
         <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3">
            {hasAccess ? (
               <AdminOrStaffOrOwner>
                  <div className="relative min-h-screen">
                     <Suspense fallback="Loading...">
                        <Await resolve={home}>
                           <SoloEditor
                              key={siteId}
                              fetcher={fetcher}
                              siteId={siteId}
                              intent="homeContent"
                              // @ts-ignore
                              defaultValue={home ?? initialValue}
                           />
                        </Await>
                     </Suspense>
                     <div
                        className="shadow-1 border-color bg-2 fixed inset-x-0 bottom-20 z-40 mx-auto flex
                  max-w-[200px] items-center justify-between rounded-full border p-2 shadow-sm"
                     >
                        <div
                           className="shadow-1 border-color bg-3 flex h-10
                     w-10 items-center justify-center rounded-full border shadow-sm"
                        >
                           {isAutoSaving ? (
                              <Loader2 size={18} className="animate-spin" />
                           ) : (
                              <MoreVertical size={18} />
                           )}
                        </div>

                        {isPublishing ? (
                           <div
                              className="shadow-1 inline-flex h-10 w-10 items-center justify-center 
                        rounded-full border border-blue-200/80 bg-gradient-to-b
                        from-blue-50 to-blue-100 text-sm font-bold text-white shadow-sm transition
                        dark:border-blue-900 dark:from-blue-950 dark:to-blue-950/80 
                        dark:shadow-blue-950"
                           >
                              <Loader2 className="mx-auto h-5 w-5 animate-spin text-blue-500" />
                           </div>
                        ) : (
                           <>
                              {isChanged ? (
                                 <Tooltip
                                    id="save-home-changes"
                                    side="top"
                                    content="Publish latest changes"
                                 >
                                    <button
                                       className="shadow-1 inline-flex h-10 items-center justify-center gap-1.5 
                                    rounded-full border border-blue-200/70 bg-gradient-to-b from-blue-50 to-blue-100
                                    px-3.5 text-sm font-bold text-blue-500 shadow-sm transition dark:border-blue-900
                                    dark:from-blue-950 dark:to-blue-950/80 dark:text-blue-300 
                                    dark:shadow-blue-950"
                                       disabled={disabled}
                                       onClick={() => {
                                          fetcher.submit(
                                             //@ts-ignore
                                             {
                                                intent: "homeContent",
                                                intentType: "publish",
                                                siteId,
                                             },
                                             {
                                                method: "post",
                                                action: "/editors/SoloEditor",
                                             }
                                          );
                                       }}
                                    >
                                       Publish
                                    </button>
                                 </Tooltip>
                              ) : (
                                 <Tooltip
                                    id="no-changes"
                                    side="top"
                                    content="No changes to publish..."
                                 >
                                    <div
                                       className="shadow-1 border-color bg-3 flex h-10
                                       w-10 items-center justify-center rounded-full border shadow-sm"
                                    >
                                       <Check size={18} />
                                    </div>
                                 </Tooltip>
                              )}
                           </>
                        )}
                        <Tooltip
                           id="revert-last-publish"
                           side="top"
                           content="History"
                        >
                           <div
                              className="shadow-1 border-color bg-3 flex h-10
                               w-10 items-center justify-center rounded-full border shadow-sm"
                           >
                              <History size={18} />
                           </div>
                        </Tooltip>
                     </div>
                  </div>
               </AdminOrStaffOrOwner>
            ) : (
               <>
                  {home && (
                     <Suspense fallback="Loading...">
                        <Await resolve={home}>
                           {/* @ts-ignore */}
                           <Slate key={siteId} editor={editor} value={home}>
                              <Editable
                                 renderElement={renderElement}
                                 renderLeaf={Leaf}
                                 readOnly={true}
                              />
                           </Slate>
                        </Await>
                     </Suspense>
                  )}
               </>
            )}
         </main>
      </>
   );
}

const fetchHomeUpdates = async ({
   payload,
   siteId,
   user,
   request,
}: {
   payload: Payload;
   siteId: Site["slug"];
   user?: User;
   request: Request;
}): Promise<Update[]> => {
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
      { addQueryPrefix: true }
   );
   const updatesUrl = `${settings.domainFull}/api/updates${updatesQuery}`;

   const { docs: updateResults } = await fetchWithCache(updatesUrl, {
      headers: {
         cookie: request.headers.get("cookie") ?? "",
      },
   });
   return updateResults;
};

const fetchHomeContent = async ({
   payload,
   siteId,
   user,
   request,
}: {
   payload: Payload;
   siteId: Site["slug"];
   user?: User;
   request: Request;
}): Promise<{
   home: HomeContent["content"];
   isChanged: Boolean;
}> => {
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
      const site = homeData.site;
      const userId = user?.id;
      const hasAccess = isSiteOwnerOrAdmin(userId, site);

      //If site admin, pull the latest draft and update isChanged
      if (hasAccess) {
         const data = await payload.findByID({
            collection: "homeContents",
            id: homeData.id,
            depth: 1,
            draft: true,
            user,
         });

         const home = select({ id: false, content: true }, data).content;

         const isChanged =
            JSON.stringify(home) != JSON.stringify(homeData.content);

         return { home, isChanged };
      }

      const home = docs[0]?.content;

      return { home, isChanged: false };
   }

   //For anon, use cached endpoint call.
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
      { addQueryPrefix: true }
   );

   const homeContentUrl = `${settings.domainFull}/api/homeContents${homeContentQuery}`;

   const { docs } = await fetchWithCache(homeContentUrl, {
      headers: {
         cookie: request.headers.get("cookie") ?? "",
      },
   });

   const home = docs[0]?.content;

   return { home, isChanged: false };
};

const initialValue: CustomElement[] = [
   {
      id: nanoid(),
      type: BlockType.Paragraph,
      children: [
         {
            text: "",
         },
      ],
   },
];

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
         const siteUID = siteData?.docs[0].id;
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
         const siteUID = siteData?.docs[0].id;
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
               { status: 400 }
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
