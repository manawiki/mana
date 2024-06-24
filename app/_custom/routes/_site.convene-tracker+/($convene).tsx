// Track Achievements using Local Storage on this page!
// Note all achievements and subcategories / total roll currency rewards will be included if possible.

import { Suspense } from "react";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import {
   Await,
   Form,
   Outlet,
   useLoaderData,
   useNavigate,
   useParams,
   useSubmit,
} from "@remix-run/react";
import { z } from "zod";

import { Button } from "~/components/Button";
import { Checkbox } from "~/components/Checkbox";
import { H2 } from "~/components/Headers";
import { cacheThis } from "~/utils/cache.server";

import { useConveneLayoutData } from "./_layout";
import type { GlobalSummaryType } from "./components/addToGlobal";
import { GachaGlobal } from "./components/GachaGlobal";
import { getSummary } from "./components/getSummary";
import { getConveneData } from "./track";

export type RollData = {
   pity?: number;
   cardPoolType: string;
   resourceId: string;
   qualityLevel: number;
   resourceType: string;
   name: string;
   count: number;
   time: string;
};

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const convene = params.convene || "1";

   // we'll avoid access control for global summary
   async function fetchSummary<T>(id: string) {
      try {
         return (
            await payload.findByID({
               collection: "user-data",
               id,
               overrideAccess: true,
            })
         ).data as T;
      } catch (e) {
         console.error(id, e);
         return null;
      }
   }

   const globalSummary = await cacheThis(
      () => fetchSummary<GlobalSummaryType>("wuwa-convene-" + convene),
      "wuwa-convene-" + convene,
   );

   // check user data for wuwa-url, this is deferred to the client to avoid blocking render
   const userData = user
      ? fetchSummary<{
           url: string;
           save: string;
           refresh: string;
        }>("wuwa-" + user?.id)
      : undefined;

   return defer({
      globalSummary,
      userData,
   });
}

function getCookie(name: string) {
   if (typeof document !== "undefined") {
      return document.cookie
         .split(";")
         .map((c) => c.trim())
         .find((c) => c.startsWith(name + "="))
         ?.slice(name.length + 1);
   }
}

export default function HomePage() {
   const { convene: conveneId } = useParams();
   const { conveneTypes, itemImages } = useConveneLayoutData();
   const loaderData = useLoaderData<typeof loader>();
   const submit = useSubmit();
   const navigate = useNavigate();

   const convene = conveneTypes?.find((c) => c.id === (conveneId ?? "1"));

   return (
      <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20 ">
         <select
            className="dark:text-zinc-100 mt-8 mb-3 p-3.5 leading-7 dark:bg-dark400 bg-zinc-50 block shadow-sm dark:shadow-zinc-800/70 border-zinc-200/70
      font-header relative text-lg scroll-mt-32 laptop:scroll-mt-60 rounded-l rounded-r-md py-2 overflow-hidden border shadow-zinc-50 dark:border-zinc-700 w-full"
            name="convene"
            defaultValue={conveneId ?? "1"}
            onChange={(e) => navigate("/convene-tracker/" + e.target.value)}
         >
            {conveneTypes?.map((convene) => (
               <option key={convene.id} value={convene.id}>
                  {convene.name}
               </option>
            ))}
         </select>
         <Suspense
            fallback={
               <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
               </div>
            }
         >
            <Await resolve={loaderData.userData}>
               {(userData) => {
                  let wuwaURL = userData?.url;

                  let cookieURL = getCookie("wuwa-url");

                  // check cookie for wuwa-url
                  if (cookieURL) wuwaURL = cookieURL;

                  return (
                     <Form
                        method="POST"
                        navigate={false}
                        onSubmit={onSubmit}
                        className="justify-left flex items-center gap-x-1"
                     >
                        <label htmlFor="url">Import URL</label>
                        <input
                           name="url"
                           placeholder="Insert URL here"
                           type="url"
                           className="w-full"
                           defaultValue={wuwaURL}
                           required
                        />
                        <input
                           hidden
                           name="convene"
                           defaultValue={convene?.id ?? "1"}
                        />
                        <Button type="submit" value="Import">
                           Import
                        </Button>
                        <Checkbox
                           name="save"
                           defaultChecked={
                              userData ? Boolean(userData?.save) : true
                           }
                        >
                           Share
                        </Checkbox>
                        {/* <input
                  type="checkbox"
                  name="refresh"
                  defaultChecked={Boolean(loaderData.userData?.refresh)}
               />
               <label htmlFor="refresh">Auto Refresh</label> */}
                     </Form>
                  );
               }}
            </Await>
         </Suspense>
         <H2 text={`${convene?.name ?? "Convene"} Global Stats`} />
         {loaderData.globalSummary && (
            <GachaGlobal
               summary={loaderData.globalSummary}
               images={itemImages}
            />
         )}

         {/* <H2 text={loaderData.convene?.name ?? "Convene"} /> */}
         <Outlet />
      </div>
   );

   async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
      // We want to fetch from the client, so submit it manually
      e.preventDefault();

      const body = new FormData(e.currentTarget);

      const { url, refresh, save } = Object.fromEntries(body);

      const convenes = ["1", "2", "3", "4", "5", "6", "7"];

      const playerId = new URLSearchParams(
         url?.toString().split("?")?.[1],
      )?.get("player_id");

      await Promise.all(
         convenes.map(
            async (convene) =>
               await getConveneData({ url, convene })
                  .then((gacha: { data: Array<RollData> }) =>
                     getSummary(gacha, convene),
                  )
                  .catch((error) => {
                     console.error(error);
                     return {};
                  })
                  .then((summary) =>
                     submit(
                        // @ts-ignore - should change the nulls to undefined
                        {
                           summary: summary,
                           playerId,
                           save,
                           refresh,
                           convene,
                           url,
                        },
                        {
                           method: "POST",
                           action: "/convene-tracker/track",
                           navigate: false,
                           fetcherKey: "wuwa-convene-" + convene,
                           encType: "application/json",
                        },
                     ),
                  ),
         ),
      );

      console.log("should be working!");

      navigate("/convene-tracker/track");
   }
}
