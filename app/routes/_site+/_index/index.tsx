import { json, redirect } from "@remix-run/node";
import type {
   ActionFunctionArgs,
   LoaderFunctionArgs,
   MetaFunction,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { jsonWithSuccess } from "remix-toast";
import type { Descendant } from "slate";
import { z } from "zod";
import { zx } from "zodix";

import type { Config } from "payload/generated-types";
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

   const { home, homeContentId, isChanged, versions } = await fetchHomeContent({
      page,
      payload,
      siteSlug,
      user,
      request,
   });

   return json({
      home,
      homeContentId,
      isChanged,
      updateResults,
      versions,
      siteSlug,
   });
}

export default function SiteIndexMain() {
   const { home, homeContentId, siteSlug, isChanged } =
      useLoaderData<typeof loader>();

   const fetcher = useFetcher();
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   return (
      <>
         <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-6 relative">
            {hasAccess ? (
               <>
                  <ManaEditor
                     key={siteSlug}
                     collectionSlug="homeContents"
                     fetcher={fetcher}
                     defaultValue={(home as Descendant[]) ?? initialValue()}
                  />
                  <div className="fixed tablet_editor:absolute tablet_editor:top-20 laptop:top-6 -right-16 h-full z-40">
                     <div
                        className="max-tablet_editor:fixed max-tablet_editor:bottom-8 
                     tablet_editor:sticky tablet_editor:top-[134px] laptop:top-20 w-full left-0"
                     >
                        <div
                           className="rounded-xl max-tablet_editor:shadow max-tablet_editor:shadow-1 max-tablet_editor:p-2 max-tablet_editor:max-w-sm
                     max-tablet_editor:backdrop-blur-lg max-tablet_editor:dark:bg-black/30 max-tablet_editor:bg-white/30 
                     max-tablet_editor:border border-zinc-300/70 dark:border-zinc-600/50 max-tablet_editor:mx-auto"
                        >
                           <EditorCommandBar
                              collectionSlug="homeContents"
                              homeContentId={homeContentId}
                              fetcher={fetcher}
                              isChanged={isChanged}
                           />
                        </div>
                     </div>
                  </div>
               </>
            ) : (
               <EditorView data={home} />
            )}
         </main>
      </>
   );
}

export async function action({
   context: { payload, user },
   request,
   params,
}: ActionFunctionArgs) {
   const { intent, collectionSlug, homeContentId } = await zx.parseForm(
      request,
      {
         homeContentId: z.string(),
         intent: z.enum(["publish"]),
         collectionSlug: z.custom<keyof Config["collections"]>(),
      },
   );

   if (!user)
      throw redirect("/login", {
         status: 302,
      });

   switch (intent) {
      case "publish": {
         await payload.update({
            collection: collectionSlug,
            id: homeContentId,
            data: {
               _status: "published",
            },
            overrideAccess: false,
            user,
         });
         return jsonWithSuccess(null, "Successfully published");
      }
   }
}

export const meta: MetaFunction = ({ matches }: any) => {
   const site = matches?.[1].data?.site;

   const title = site?.name;
   const collections = site?.collections?.map(
      (collection: any) => collection?.name,
   );

   const description = `Explore ${collections?.join(
      ", ",
   )} on ${site?.name}, Database, Guides, News, and more!`;
   const image = site?.banner?.url;

   return getMeta({ title, description, image, siteName: site?.name });
};
