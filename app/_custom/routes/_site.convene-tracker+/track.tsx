import { Suspense, useEffect, useState } from "react";

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
   Await,
   defer,
   useLoaderData,
   useNavigation,
   useSubmit,
} from "@remix-run/react";
import type { Payload } from "payload";
import { z } from "zod";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { cache } from "~/utils/cache.server";

import type { RollData } from "./($convene)";
import { useConveneLayoutData } from "./_layout";
import {
   addAandB,
   type GlobalSummaryType,
   subAandB,
   toGlobal,
} from "./components/addToGlobal";
import { GachaHistory } from "./components/GachaHistory";
import { GachaSummary } from "./components/GachaSummary";
import { getSummary, type GachaSummaryType } from "./components/getSummary";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
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

   const convenes = [0, 1, 2, 3, 4, 5, 6, 7];

   return defer({
      userData,
      wuwaURL,
      playerId,
      ...convenes.map((convene) =>
         playerId && convene
            ? fetchSummary<GachaSummaryType>("wuwa-" + playerId + "-" + convene)
            : null,
      ),
   });
}

export default function ConveneTracker() {
   // @ts-expect-error
   const { userData, wuwaURL, playerId, ...convenes } =
      useLoaderData<typeof loader>();
   const { itemImages, conveneTypes } = useConveneLayoutData();
   const [convene, setConvene] = useState(1);

   const submit = useSubmit();

   const ConveneBannerButton = ({ current }: any) => {
      var banner_currency = itemImages?.find((a) => a.id == "3")?.icon?.url; // Uses Astrite by default if banner is not enum'd

      switch (current.id) {
         case "1":
            banner_currency = itemImages?.find((a) => a.id == "50002")?.icon
               ?.url;
            break;
         case "2":
            banner_currency = itemImages?.find((a) => a.id == "50005")?.icon
               ?.url;
            break;
         case "3":
         case "4":
         case "5":
         case "6":
         case "7":
            banner_currency = itemImages?.find((a) => a.id == "50001")?.icon
               ?.url;
            break;
         default:
      }

      return (
         <button
            key={current.id}
            value={current.id}
            onClick={() => setConvene(parseInt(current.id))}
            className={`w-full relative isolate inline-flex items-center justify-center justify-between gap-x-2 rounded-lg border text-base/6 font-semibold border-color-sub p-2 mt-2 cursor-pointer ${
               parseInt(current.id) === convene && "bg-orange-500/10"
            }`}
         >
            <div className="inline-flex">
               <div className="inline-flex h-full align-middle mr-1 min-w-6">
                  <Image
                     height={24}
                     className="object-contain"
                     url={banner_currency}
                     options="height=24"
                     alt={"Icon"}
                  />
               </div>
               <div className="inline-flex align-middle text-left">
                  {current.name}
               </div>
            </div>

            <Await resolve={convenes[parseInt(current.id)]}>
               {(playerSummary) => {
                  return (
                     <>
                        {playerSummary && (
                           <div className="text-right min-w-[102px]">
                              <div className="flex justify-between gap-x-2 text-yellow-500">
                                 <div>5* Pity</div>
                                 <div>{playerSummary.pity5}/80</div>
                              </div>
                              <div className="flex justify-between gap-x-2 text-purple-500">
                                 <div>4* Pity</div>
                                 <div>{playerSummary.pity4}/10</div>
                              </div>
                           </div>
                        )}
                     </>
                  );
               }}
            </Await>
         </button>
      );
   };

   // =========================
   // Main Interface Section
   // =========================
   return (
      <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20 ">
         <div className="laptop:mt-1 mt-14">
            {conveneTypes?.map((current) => (
               <ConveneBannerButton current={current} />
            ))}
         </div>
         <RefreshButton onClick={onSubmit} />
         <Suspense
            fallback={
               <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
               </div>
            }
         >
            <Await resolve={convenes[convene]}>
               {(playerSummary) => (
                  <>
                     {playerSummary && (
                        <GachaSummary
                           summary={playerSummary}
                           images={itemImages}
                        />
                     )}
                     {playerSummary && <GachaHistory summary={playerSummary} />}
                  </>
               )}
            </Await>
         </Suspense>
      </div>
   );

   async function onSubmit(e: React.FormEvent<HTMLButtonElement>) {
      // We want to fetch from the client, so submit it manually
      e.preventDefault();

      const url = wuwaURL;

      const { save, refresh } = userData;

      const convenes = ["1", "2", "3", "4", "5", "6", "7"];

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
   }
}

function RefreshButton({ onClick }: any) {
   const [disableRefresh, setDisableRefresh] = useState<boolean>(true);
   const navigation = useNavigation();

   useEffect(() => {
      // Turn disableRefresh false after 60 seconds
      setTimeout(() => {
         setDisableRefresh(false);
      }, 60 * 1000);

      // Disable Refresh if already submitting
      if (navigation.state !== "idle") setDisableRefresh(true);
   }, [navigation.state]);

   return (
      <div className="flex justify-end">
         <button
            disabled={disableRefresh}
            onClick={onClick}
            type="submit"
            className="border-color shadow-1 relative flex
            items-center gap-2.5 rounded-b-xl border-2 bg-white py-2.5 pl-5 pr-6 text-sm font-bold
            shadow disabled:opacity-50 dark:bg-zinc-800 max-desktop:mt-[1px] max-desktop:border-t-0 desktop:mt-1 desktop:rounded-full"
            aria-label={disableRefresh ? "On cooldown..." : "Refresh"}
            title={disableRefresh ? "On cooldown..." : "Refresh"}
         >
            {disableRefresh ? (
               <Icon name="hourglass" size={18} />
            ) : (
               <Icon name="refresh-ccw" size={18} />
            )}
            <span>Refresh</span>
         </button>
      </div>
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

   // console.log(convene, summary);

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

   return null;

   // redirect and set url to cookie
   // return redirect(`/convene-tracker/${convene}/track#track`, {
   //    headers: {
   //       "Set-Cookie": `wuwa-url=${url}; Path=/; Max-Age=31536000; SameSite=Strict`,
   //    },
   // });
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

const WuwaPayloadSchema = z.object({
   playerId: z.string(),
   serverId: z.string(),
   languageCode: z.string(),
   cardPoolType: z.string(),
   recordId: z.string(),
});

// we'll fetch the data on the client side then save it to the server
export async function getConveneData({
   url,
   convene,
}: {
   url: FormDataEntryValue | undefined;
   convene: string;
}) {
   if (!url) return { error: "No URL provided" };

   try {
      const searchParams = new URLSearchParams(url?.toString().split("?")?.[1]);

      const wuwaPayload = WuwaPayloadSchema.parse({
         playerId: searchParams.get("player_id"),
         serverId: searchParams.get("svr_id"),
         languageCode: searchParams.get("lang"),
         cardPoolType: convene ?? "1",
         recordId: searchParams.get("record_id"),
      });

      const response = await fetch(
         "https://gmserver-api.aki-game2.net/gacha/record/query",
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(wuwaPayload),
         },
      );

      return await response.json();

      // const summary = getSummary(gacha, convene);

      // return {
      //    gacha,
      //    summary,
      //    playerId: wuwaPayload.playerId,
      //    convene,
      //    refresh,
      //    save,
      //    url,
      // };
   } catch (e) {
      console.error(e);
      return e;
   }
}
