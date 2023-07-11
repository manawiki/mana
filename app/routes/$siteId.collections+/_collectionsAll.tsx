import {
   type ActionFunction,
   type LoaderArgs,
   type V2_MetaFunction,
   json,
} from "@remix-run/node";
import {
   NavLink,
   Outlet,
   useLoaderData,
   useFetcher,
   useActionData,
   useRouteLoaderData,
} from "@remix-run/react";
import {
   assertIsPost,
   isProcessing,
   getMultipleFormData,
   uploadImage,
   isAdding,
   type FormResponse,
} from "~/utils";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zx } from "zodix";
import { useEffect, useState } from "react";
import { createCustomIssues, useZorm } from "react-zorm";
import { ChevronRight, Database, ImagePlus, Loader2 } from "lucide-react";
import { AdminOrStaffOrOwner } from "~/modules/auth";
import type { loader as siteDetailsLoader } from "../$siteId+/_layout";
import { toast } from "~/components/Toaster";
import { Image } from "~/components/Image";
import type { PaginatedDocs } from "payload/dist/mongoose/types";
import type { Collection } from "payload/generated-types";
import { fetchWithCache } from "~/utils/cache.server";

export async function loader({ params, request }: LoaderArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });

   const url = new URL(request.url).origin;

   try {
      const collectionDataFetchUrl = `${url}/api/collections?where[hiddenCollection][equals]=false&where[site.slug][equals]=${siteId}&depth=1`;

      const collectionData = (await fetchWithCache(collectionDataFetchUrl, {
         headers: {
            cookie: request.headers.get("cookie") ?? "",
         },
      })) as PaginatedDocs<Collection>;

      const collections = collectionData.docs;

      return json(
         { collections },
         { headers: { "Cache-Control": "public, s-maxage=60, max-age=60" } }
      );
   } catch (e) {
      throw new Response("Internal Server Error", { status: 500 });
   }
}

const CollectionSchema = z.object({
   name: z.string().min(1).max(40),
   slug: z.string().min(1).max(40),
   icon: z.any(),
});

export const meta: V2_MetaFunction<
   typeof loader,
   { "routes/$siteId+/_layout": typeof siteDetailsLoader }
> = ({ matches }) => {
   const siteName = matches.find(({ id }) => id === "routes/$siteId+/_layout")
      ?.data?.site.name;
   return [
      {
         title: `Collections - ${siteName}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export const handle = {
   i18n: "collection",
};

export default function CollectionIndex() {
   const { collections } = useLoaderData<typeof loader>();
   const { t } = useTranslation(handle?.i18n);
   const fetcher = useFetcher();
   const disabled = isProcessing(fetcher.state);
   const adding = isAdding(fetcher, "addCollection");
   const { isMobileApp } = useRouteLoaderData("routes/$siteId+/_layout");

   //Image preview after upload
   const [, setPicture] = useState(null);
   const [imgData, setImgData] = useState(null);
   const onChangePicture = (e: any) => {
      if (e.target.files[0]) {
         setPicture(e.target.files[0]);
         const reader = new FileReader() as any;
         reader.addEventListener("load", () => {
            setImgData(reader.result);
         });
         reader.readAsDataURL(e.target.files[0]);
      }
   };

   useEffect(() => {
      if (fetcher.state === "idle" && fetcher.data != null) {
         if (fetcher.data?.success) {
            toast.success(fetcher.data?.success);
         }
         if (fetcher.data?.error) {
            toast.error(fetcher.data?.error);
         }
      }
   }, [fetcher.state, fetcher.data]);

   const formResponse = useActionData<FormResponse>();
   const zoCollection = useZorm("newCollection", CollectionSchema, {
      //@ts-ignore
      customIssues: formResponse?.serverIssues,
   });

   useEffect(() => {
      if (!adding) {
         zoCollection.refObject.current &&
            zoCollection.refObject.current.reset();
         setImgData(null);
      }
   }, [adding, zoCollection.refObject]);

   return (
      <>
         <main
            className={`${isMobileApp ? "pt-6" : "pt-20 laptop:pt-12"} 
            mx-auto max-w-[728px] pb-3 max-tablet:px-3`}
         >
            <h1 className="border-color mb-2.5 border-b-2 pb-2 font-header text-3xl font-bold">
               Collections
            </h1>
            <ul className="text-1 flex items-center gap-3 pb-5 text-xs uppercase">
               <li>Changelog</li>
               <li className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
               <li>Docs</li>
            </ul>

            <AdminOrStaffOrOwner>
               <fetcher.Form
                  ref={zoCollection.ref}
                  method="post"
                  encType="multipart/form-data"
                  className="pb-5"
                  replace
               >
                  <div className="flex items-center gap-4">
                     <div>
                        <label className="cursor-pointer">
                           {imgData ? (
                              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full">
                                 <img
                                    width={80}
                                    height={80}
                                    className="aspect-square object-contain"
                                    alt="preview"
                                    src={imgData}
                                 />
                              </div>
                           ) : (
                              <div
                                 className="flex h-11 w-11 
                                items-center justify-center rounded-full border-2 border-dashed
                              border-zinc-400 bg-white hover:border-zinc-600 hover:bg-zinc-100 dark:border-zinc-500
                              dark:bg-zinc-600 dark:hover:border-zinc-400"
                              >
                                 <ImagePlus className="h-5 w-5 text-zinc-400" />
                              </div>
                           )}
                           <input
                              //@ts-ignore
                              name={zoCollection.fields.icon()}
                              type="file"
                              className="hidden"
                              onChange={onChangePicture}
                           />
                        </label>
                     </div>
                     <div className="flex-grow">
                        <input
                           placeholder={t("new.namePlaceholder") ?? undefined}
                           autoFocus={true}
                           name={zoCollection.fields.name()}
                           type="text"
                           className="input-text mt-0"
                           disabled={disabled}
                        />
                     </div>
                     <div className="flex-grow">
                        <input
                           placeholder={t("new.slugPlaceholder") ?? undefined}
                           name={zoCollection.fields.slug()}
                           type="text"
                           className="input-text mt-0"
                           disabled={disabled}
                        />
                     </div>
                     <button
                        name="intent"
                        value="addCollection"
                        type="submit"
                        className="h-10 w-16 rounded bg-yellow-600 px-4 text-sm font-bold text-white 
                        hover:bg-yellow-600 focus:bg-yellow-400 dark:bg-yellow-600"
                        disabled={disabled}
                     >
                        {adding ? (
                           <Loader2 className="mx-auto h-5 w-5 animate-spin text-zinc-300" />
                        ) : (
                           t("new.action")
                        )}
                     </button>
                  </div>
               </fetcher.Form>
            </AdminOrStaffOrOwner>
            {collections?.length === 0 ? null : (
               <>
                  <div className="border-color grid grid-cols-2 gap-3 laptop:grid-cols-3">
                     {collections?.map((collection, int) => (
                        <NavLink
                           key={collection.id}
                           to={`${collection.slug}`}
                           prefetch="intent"
                           className={({ isActive }) =>
                              `${
                                 isActive
                                    ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20"
                                    : ""
                              } border-color bg-2 shadow-1 flex items-center justify-between gap-2.5 overflow-hidden rounded-xl
                              border pr-2 shadow-sm transition`
                           }
                        >
                           <div className="flex items-center gap-3.5 truncate">
                              <div
                                 className="border-color flex h-11 w-11 flex-none items-center
                                    justify-between overflow-hidden rounded-full"
                              >
                                 {collection.icon?.url ? (
                                    <Image
                                       width={50}
                                       height={50}
                                       alt={collection.name ?? "List Icon"}
                                       options="aspect_ratio=1:1&height=80&width=80"
                                       url={collection.icon?.url}
                                       loading={int > 10 ? "lazy" : undefined}
                                    />
                                 ) : (
                                    <Database
                                       className="text-1 mx-auto"
                                       size={18}
                                    />
                                 )}
                              </div>
                              <span className="text-1 truncate font-bold">
                                 {collection.name}
                              </span>
                           </div>
                           <ChevronRight
                              size={24}
                              className="flex-none text-yellow-500"
                           />
                        </NavLink>
                     ))}
                  </div>
               </>
            )}
         </main>
         <Outlet />
      </>
   );
}

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
   params,
}) => {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   const issues = createCustomIssues(CollectionSchema);

   // Add Collection
   if (intent === "addCollection") {
      assertIsPost(request);
      const result = await getMultipleFormData({
         request,
         prefix: "cIcon",
         schema: CollectionSchema,
      });
      if (result.success) {
         const { name, slug, icon } = result.data;
         // TODO Make a database check here to check if the slug already exists
         if (slug === "exists") {
            issues.slug("Slug" + slug + "already exists ");
         }
         // Respond with custom issues that require checks on server
         if (issues.hasIssues()) {
            return json<FormResponse>(
               { serverIssues: issues.toArray() },
               { status: 400 }
            );
         }
         const siteIcon = await uploadImage({
            payload,
            image: icon,
            user,
         });
         try {
            const sites = await payload.find({
               collection: "sites",
               where: {
                  slug: {
                     equals: siteId,
                  },
               },
               user,
            });
            const siteSlug = sites?.docs[0];
            await payload.create({
               collection: "collections",
               data: {
                  id: `${siteId}${slug}`,
                  name,
                  slug,
                  icon: siteIcon.id,
                  site: siteSlug.id,
               },
               user,
               overrideAccess: false,
            });
            return json<FormResponse>({
               success: "New collection added",
            });
         } catch (error) {
            return json({
               error: "Something went wrong...unable to add collection.",
            });
         }
      }
      //If user input has problems
      if (issues.hasIssues()) {
         return json<FormResponse>(
            { serverIssues: issues.toArray() },
            { status: 400 }
         );
      }
      // Last resort error message
      return json({
         error: "Something went wrong...unable to add collection.",
      });
   }
};
