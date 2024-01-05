import { Suspense } from "react";

import { offset, shift } from "@floating-ui/react";
import { Float } from "@headlessui-float/react";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Await, useFetcher, useLoaderData } from "@remix-run/react";
import type { Descendant } from "slate";
import { z } from "zod";
import { zx } from "zodix";

import { Icon } from "~/components/Icon";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/utils/useIsStaffSiteAdminOwner";
import { EditorCommandBar } from "~/routes/_editor+/core/components/EditorCommandBar";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { initialValue } from "~/routes/_editor+/core/utils";
import { ManaEditor } from "~/routes/_editor+/editor";

import { fetchHomeContent } from "./utils/fetchHomeContent.server";
import { fetchHomeUpdates } from "./utils/fetchHomeUpdates.server";
import { getSiteSlug } from "../_utils/getSiteSlug.server";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);
   const { page } = zx.parseQuery(request, {
      page: z.coerce.number().optional(),
   });

   const updateResults = await fetchHomeUpdates({
      payload,
      siteSlug,
      user,
      request,
   });

   const { home, isChanged, versions } = await fetchHomeContent({
      page,
      payload,
      siteSlug,
      user,
      request,
   });

   return json({ home, isChanged, updateResults, versions, siteSlug });
}

export default function SiteIndexMain() {
   const { home, siteSlug, isChanged } = useLoaderData<typeof loader>();
   const fetcher = useFetcher();
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   return hasAccess ? (
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
         <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-6">
            <Suspense fallback={<Loading />}>
               <Await resolve={home}>
                  <ManaEditor
                     key={siteSlug}
                     collectionSlug="homeContents"
                     fetcher={fetcher}
                     defaultValue={(home as Descendant[]) ?? initialValue()}
                  />
               </Await>
            </Suspense>
         </main>
         <div>
            <EditorCommandBar
               collectionSlug="homeContents"
               siteId={siteSlug}
               fetcher={fetcher}
               isChanged={isChanged}
            />
         </div>
      </Float>
   ) : (
      home && (
         <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-6">
            <Suspense fallback={<Loading />}>
               <EditorView data={home} />
            </Suspense>
         </main>
      )
   );
}

const Loading = () => (
   <div className="flex items-center justify-center py-10">
      <Icon
         name="loader-2"
         size={20}
         className="animate-spin dark:text-zinc-500 text-zinc-400"
      />
   </div>
);
