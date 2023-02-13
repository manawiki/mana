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
   useMatches,
   useFetcher,
   useActionData,
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
import { ChevronRight, ImagePlus, Loader2 } from "lucide-react";
import { AdminOrOwner } from "~/modules/auth";
import type { loader as siteDetailsLoader } from "./$siteId";
import { toast } from "~/components/Toaster";
import { Err } from "~/components/Forms";

export async function loader({
   context: { payload, user },
   params,
}: LoaderArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string().length(10),
   });
   const { docs } = await payload.find({
      collection: "collections",
      where: {
         site: {
            equals: siteId,
         },
      },
      user,
   });
   return json({ collections: docs });
}

const CollectionSchema = z.object({
   name: z.string().min(1).max(10),
   slug: z.string().min(1).max(10),
   icon: z.any(),
});

export const meta: V2_MetaFunction<
   typeof loader,
   { "routes/$siteId": typeof siteDetailsLoader }
> = ({ parentsData }) => {
   const name = parentsData["routes/$siteId"].site.name;
   return [
      {
         title: `Collections - ${name}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export const handle = {
   breadcrumb: ({ pathname }: { pathname: string }) => (
      <NavLink
         end
         className={({ isActive }) =>
            `${
               isActive &&
               "font-semibold text-zinc-500 underline  dark:text-zinc-300"
            } flex items-center gap-3 decoration-blue-300 underline-offset-2 hover:underline dark:decoration-blue-400`
         }
         to={pathname}
      >
         All
      </NavLink>
   ),
   // i18n key for this route. This will be used to load the correct translation
   i18n: "collection",
};

export default function CollectionIndex() {
   const { collections } = useLoaderData<typeof loader>();
   const matches = useMatches();
   const { t } = useTranslation(handle?.i18n);
   const fetcher = useFetcher();
   const disabled = isProcessing(fetcher.state);
   const adding = isAdding(fetcher, "addCollection");

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
      if (fetcher.type === "done") {
         if (fetcher.data?.success) {
            toast.success(fetcher.data?.success);
         }
         if (fetcher.data?.error) {
            toast.error(fetcher.data?.error);
         }
      }
   }, [fetcher.type]);

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
         <div className="mx-auto max-w-[728px] px-3 pt-4 laptop:pt-8">
            <h1 className="pb-2.5 text-3xl font-bold">Collections</h1>
            <ol className="border-color mb-5 flex items-center gap-3 border-y-2 py-2.5">
               {matches
                  // skip routes that don't have a breadcrumb
                  .filter((match) => match.handle && match.handle.breadcrumb)
                  // render breadcrumbs!
                  .map((match, index) => (
                     <li key={index}>{match?.handle?.breadcrumb(match)}</li>
                  ))}
            </ol>
            <AdminOrOwner>
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
                           {zoCollection.errors.icon((err) => (
                              <Err>{err.message}</Err>
                           ))}
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

                        {zoCollection.errors.name((err) => (
                           <Err>{err.message}</Err>
                        ))}
                     </div>
                     <div className="flex-grow">
                        <input
                           placeholder={t("new.slugPlaceholder") ?? undefined}
                           name={zoCollection.fields.slug()}
                           type="text"
                           className="input-text mt-0"
                           disabled={disabled}
                        />
                        {zoCollection.errors.slug((err) => (
                           <Err>{err.message}</Err>
                        ))}
                     </div>
                     <button
                        name="intent"
                        value="addCollection"
                        type="submit"
                        className="h-10 w-16 rounded bg-zinc-500 px-4 text-sm font-bold 
                        text-white hover:bg-zinc-600 focus:bg-zinc-400"
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
            </AdminOrOwner>
            {collections?.length === 0 ? null : (
               <>
                  <div className="grid grid-cols-2 gap-3 laptop:grid-cols-3">
                     {collections?.map((collection) => (
                        <NavLink
                           key={collection.id}
                           to={`${collection.slug}`}
                           prefetch="intent"
                           className={({ isActive }) =>
                              `${
                                 isActive &&
                                 "border-blue-100 !bg-blue-50 dark:border-blue-900 dark:!bg-blue-900/20"
                              } border-color flex items-center justify-between gap-2.5 rounded-full border bg-zinc-50 pr-2
                                    shadow-sm transition hover:bg-white dark:bg-zinc-800 dark:shadow-zinc-900 
                                    dark:hover:border-zinc-600 dark:hover:bg-zinc-700`
                           }
                        >
                           <div className="flex items-center gap-2.5 truncate">
                              <div
                                 className="flex h-9 w-9 flex-none items-center justify-between 
                                    overflow-hidden rounded-full border-2 border-zinc-400 dark:border-zinc-600"
                              >
                                 <img
                                    width={50}
                                    height={50}
                                    alt="List Icon"
                                    //@ts-ignore
                                    src={`https://mana.wiki/cdn-cgi/image/fit=crop,width=60,height=60,gravity=auto/${collection.icon?.url}`}
                                 />
                              </div>
                              <span className="truncate text-sm font-semibold">
                                 {collection.name}
                              </span>
                           </div>
                           <ChevronRight className="h-5 w-5 flex-none text-blue-500" />
                        </NavLink>
                     ))}
                  </div>
               </>
            )}
         </div>
         <div>
            <Outlet />
         </div>
      </>
   );
}

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
   params,
}) => {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string().length(10),
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
         const iconId = await uploadImage({
            payload,
            image: icon,
            user,
         });
         try {
            await payload.create({
               collection: "collections",
               data: {
                  id: `${siteId}${slug}`,
                  name,
                  slug,
                  icon: iconId,
                  site: siteId,
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
