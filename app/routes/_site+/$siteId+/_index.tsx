import { Suspense, useCallback, useMemo, useState } from "react";

import {
   FloatingDelayGroup,
   autoUpdate,
   offset,
   shift,
   useFloating,
} from "@floating-ui/react";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Await, useFetcher, useLoaderData } from "@remix-run/react";
import { deferIf } from "defer-if";
import { Check, History, Loader2 } from "lucide-react";
import type { Payload } from "payload";
import type { Select } from "payload-query";
import { select } from "payload-query";
import qs from "qs";
import type { Descendant } from "slate";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import {
   AdminOrStaffOrOwner,
   useIsStaffOrSiteAdminOrStaffOrOwner,
} from "~/modules/auth";
import { EditorBlocks } from "~/routes/_editor+/blocks/EditorBlocks";
import { Leaf } from "~/routes/_editor+/blocks/Leaf";
import { ManaEditor } from "~/routes/_editor+/editor";
import { isNativeSSR, isProcessing } from "~/utils";
import { fetchWithCache } from "~/utils/cache.server";

import { HomeVersionModal } from "./components/HomeVersionModal";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
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
      isMobileApp
   );
}

export default function SiteIndexMain() {
   const { home, siteId } = useLoaderData<typeof loader>();
   const editor = useMemo(() => withReact(createEditor()), []);
   const renderElement = useCallback((props: RenderElementProps) => {
      return <EditorBlocks {...props} />;
   }, []);
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   const fetcher = useFetcher();

   const { refs, floatingStyles } = useFloating({
      whileElementsMounted: autoUpdate,
      placement: "right-start",
      middleware: [
         shift({
            padding: {
               top: 80,
            },
         }),
         offset({
            mainAxis: 50,
            crossAxis: 0,
         }),
      ],
   });

   return (
      <>
         <main
            ref={refs.setReference}
            className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px]"
         >
            {hasAccess ? (
               <AdminOrStaffOrOwner>
                  <div className="relative min-h-screen">
                     <Suspense fallback="Loading...">
                        <Await resolve={home}>
                           <ManaEditor
                              key={siteId}
                              fetcher={fetcher}
                              siteId={siteId}
                              intent="homeContent"
                              defaultValue={home as Descendant[]}
                           />
                        </Await>
                     </Suspense>
                  </div>
               </AdminOrStaffOrOwner>
            ) : (
               <>
                  {home && (
                     <Suspense fallback="Loading...">
                        <Await resolve={home}>
                           <Slate
                              key={siteId}
                              editor={editor}
                              initialValue={home as Descendant[]}
                           >
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
         <AdminOrStaffOrOwner>
            <EditorCommandBar
               fetcher={fetcher}
               refs={refs}
               floatingStyles={floatingStyles}
            />
         </AdminOrStaffOrOwner>
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

const EditorCommandBar = ({
   fetcher,
   refs,
   floatingStyles,
}: {
   fetcher: any;
   refs: any;
   floatingStyles: any;
}) => {
   const { isChanged, siteId } = useLoaderData<typeof loader>();

   const isAutoSaving =
      fetcher.state === "submitting" &&
      fetcher.formData?.get("intentType") === "update";

   const isPublishing =
      fetcher.state === "submitting" &&
      fetcher.formData?.get("intentType") === "publish";

   const disabled = isProcessing(fetcher.state);
   const [isVersionModalOpen, setVersionModal] = useState(false);

   return (
      <>
         <HomeVersionModal
            isVersionModalOpen={isVersionModalOpen}
            setVersionModal={setVersionModal}
         />
         <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="shadow-1 bg-2 border-color z-40 flex w-12 flex-col items-center justify-between gap-3 rounded-full border p-2 shadow max-laptop:hidden"
         >
            {/* <div className="shadow-1 border-color bg-3 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm">
            <MoreVertical size={18} />
         </div> */}
            <FloatingDelayGroup delay={{ open: 1000, close: 200 }}>
               {isPublishing ? (
                  <div
                     className="shadow-1 inline-flex h-8 w-8 items-center justify-center 
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
                        <Tooltip placement="left">
                           <TooltipTrigger>
                              <button
                                 className="shadow-1 flex h-8 w-8 items-center justify-center rounded-full
                              border border-blue-200/70 bg-gradient-to-b from-blue-50 to-blue-100
                              text-sm font-bold text-blue-500 shadow-sm transition dark:border-blue-900
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
                                          action: "/editor",
                                       }
                                    );
                                 }}
                              >
                                 <PaperAirplaneIcon className="h-4 w-4" />
                              </button>
                           </TooltipTrigger>
                           <TooltipContent>
                              Publish latest changes
                           </TooltipContent>
                        </Tooltip>
                     ) : (
                        <Tooltip placement="left">
                           <TooltipTrigger>
                              <div
                                 className="shadow-1 border-color bg-3 flex h-8
                                 w-8 items-center justify-center rounded-full border shadow-sm"
                              >
                                 {isAutoSaving ? (
                                    <Loader2
                                       size={16}
                                       className="animate-spin"
                                    />
                                 ) : (
                                    <Check size={16} />
                                 )}
                              </div>
                           </TooltipTrigger>
                           <TooltipContent>
                              No changes to publish...
                           </TooltipContent>
                        </Tooltip>
                     )}
                  </>
               )}
               <Tooltip placement="left">
                  <TooltipTrigger>
                     <button
                        className="shadow-1 border-color bg-3 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm"
                        onClick={() => setVersionModal(true)}
                     >
                        <History size={18} />
                     </button>
                  </TooltipTrigger>
                  <TooltipContent>History</TooltipContent>
               </Tooltip>
            </FloatingDelayGroup>
         </div>
      </>
   );
};

const fetchHomeContent = async ({
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
}) => {
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
                  doc.version
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
      const home = docs[0].content;

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
      { addQueryPrefix: true }
   );

   const homeContentUrl = `${settings.domainFull}/api/homeContents${homeContentQuery}`;

   const { docs } = await fetchWithCache(homeContentUrl, {
      headers: {
         cookie: request.headers.get("cookie") ?? "",
      },
   });

   const home = docs[0].content as HomeContent["content"];

   return { home, isChanged: false };
};

export async function action({
   context: { payload, user },
   request,
}: ActionArgs) {
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   if (!user || !user.id) return redirect("/login", { status: 302 });

   switch (intent) {
      case "versionUpdate": {
         const { versionId, collectionSlug } = await zx.parseForm(request, {
            versionId: z.string(),
            collectionSlug: z.string(),
         });
         return await payload.restoreVersion({
            //@ts-ignore
            collection: collectionSlug,
            id: versionId,
            overrideAccess: false,
            user,
         });
      }

      default:
         return null;
   }
}
