import { Suspense } from "react";

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Await, defer, redirect, useLoaderData } from "@remix-run/react";
import type { Payload } from "payload";

import { cache } from "~/utils/cache.server";

import {
   addAandB,
   type GlobalSummaryType,
   subAandB,
   toGlobal,
} from "./_site.convene-tracker.($convene)/addToGlobal";
import { GachaHistory } from "./_site.convene-tracker.($convene)/GachaHistory";
import { GachaSummary } from "./_site.convene-tracker.($convene)/GachaSummary";
import type { GachaSummaryType } from "./_site.convene-tracker.($convene)/getSummary";

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

   // check user data for wuwa-url
   const userData = user
      ? await fetchSummary<{
           url: string;
           save: string;
           refresh: string;
        }>("wuwa-" + user?.id)
      : { url: "", save: "", refresh: "" };

   // check request cookie for wuwa-url
   let cookieURL = request.headers.get("Cookie")?.split("wuwa-url=")?.[1];

   const wuwaURL = cookieURL || userData?.url;

   const playerId = wuwaURL
      ? new URLSearchParams(wuwaURL)?.get("player_id")
      : null;

   const playerSummary = playerId
      ? fetchSummary<GachaSummaryType>("wuwa-" + playerId + "-" + convene)
      : null;

   return defer({
      playerSummary,
   });
}

export default function ConveneTracker() {
   const { playerSummary } = useLoaderData<typeof loader>();

   return (
      <Suspense
         fallback={
            <div className="flex items-center justify-center h-96">
               <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
         }
      >
         <Await resolve={playerSummary}>
            {(playerSummary) => (
               <>
                  {playerSummary && <GachaSummary summary={playerSummary} />}
                  {playerSummary && <GachaHistory summary={playerSummary} />}
               </>
            )}
         </Await>
      </Suspense>
   );
}

export async function action({
   request,
   context: { user, payload },
}: ActionFunctionArgs) {
   const { url, convene, summary, save, playerId, refresh } = JSON.parse(
      await request.text(),
   ) as {
      url: string;
      convene: string;
      save: string;
      refresh: string;
      summary: GachaSummaryType;
      playerId: string;
   };

   const id = "wuwa-" + playerId + "-" + convene;
   const globalId = "wuwa-convene-" + convene;

   // Check if these exists first
   let oldPlayerSummary: GachaSummaryType | undefined = undefined,
      oldGlobalSummary: GlobalSummaryType | undefined = undefined;

   try {
      oldPlayerSummary = (
         await payload.findByID({
            collection: "user-data",
            id,
            overrideAccess: true,
         })
      )?.data as GachaSummaryType;
   } catch (e) {
      console.error(e);
   }
   try {
      oldGlobalSummary = (
         await payload.findByID({
            collection: "user-data",
            id: globalId,
            overrideAccess: true,
         })
      )?.data as GlobalSummaryType;
   } catch (e) {
      console.error(e);
   }

   // First we compare the old and new player record
   const addToGlobal = oldPlayerSummary
      ? subAandB<GachaSummaryType>(
           toGlobal(summary),
           toGlobal(oldPlayerSummary),
        )
      : toGlobal(summary);

   // Then we calculate the new global summary
   const newGlobalSummary = oldGlobalSummary
      ? addAandB<GachaSummaryType>(oldGlobalSummary, addToGlobal)
      : addToGlobal;

   // console.log({
   //    id,
   //    globalId,
   //    oldPlayerSummary,
   //    oldGlobalSummary,
   //    addToGlobal,
   //    newGlobalSummary,
   // });

   try {
      // First we'll update the user record with the new summary
      if (oldPlayerSummary) {
         // try to update the record
         await payload.update({
            collection: "user-data",
            id,
            data: {
               data: summary,
               // @ts-expect-error this is fine
               site: "pogseal-imbhew2r8tg7",
            },
            // for public access we're overriding access control here
            overrideAccess: true,
         });
      } else {
         // console.log("no result, inserting new record");

         await payload.create({
            collection: "user-data",
            data: {
               id,
               data: summary,
               // @ts-expect-error this is fine
               site: "pogseal-imbhew2r8tg7",
               // @ts-expect-error we'll hardcode in an user for public access
               author: user?.id ?? "6447492be887aa8eaee61a4f",
            },
            // for public access we're overriding access control here
            overrideAccess: true,
         });
      }

      // Then we'll update the global record
      if (oldGlobalSummary) {
         // try to update the record
         await payload.update({
            collection: "user-data",
            id: globalId,
            data: {
               data: newGlobalSummary,
               // @ts-expect-error this is fine
               site: "pogseal-imbhew2r8tg7",
            },
            // for public access we're overriding access control here
            overrideAccess: true,
         });

         // purge cache of this global summary
         cache.delete(globalId);
      } else {
         // insert new record
         await payload.create({
            collection: "user-data",
            data: {
               id: globalId,
               data: newGlobalSummary,
               // @ts-expect-error this is fine
               site: "pogseal-imbhew2r8tg7",
               // @ts-expect-error we'll hardcode in an user for public access
               author: user?.id ?? "6447492be887aa8eaee61a4f",
            },
            // for public access we're overriding access control here
            overrideAccess: true,
         });
      }
   } catch (e) {
      console.error("Error updating userData ", id, e);
   }

   // update user-data
   await updateUserData(user, payload, {
      url,
      save,
      refresh,
   });

   // redirect and set url to cookie
   return redirect(`/convene-tracker/${convene}/track#track`, {
      headers: {
         "Set-Cookie": `wuwa-url=${url}; Path=/; Max-Age=31536000; SameSite=Strict`,
      },
   });
}

async function updateUserData(user: any, payload: Payload, data: any) {
   if (!user) return;

   try {
      return await payload.create({
         collection: "user-data",
         data: {
            id: "wuwa-" + user.id,
            data,
            // @ts-expect-error this is fine
            site: "pogseal-imbhew2r8tg7",
            author: user.id,
         },
         user,
         overrideAccess: false,
      });
   } catch (e) {
      console.error(user.username + " updating wuwa user-data");

      return await payload.update({
         collection: "user-data",
         id: "wuwa-" + user.id,
         data,
         user,
         overrideAccess: false,
      });
   }
}
