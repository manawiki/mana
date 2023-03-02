import {
   type ActionFunction,
   type LoaderArgs,
   type V2_MetaFunction,
   json,
} from "@remix-run/node";
import {
   Link,
   Outlet,
   useLoaderData,
   useNavigation,
   Form,
   useActionData,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zx } from "zodix";
import { useEffect, useState } from "react";
import { createCustomIssues, useZorm } from "react-zorm";
import {
   assertIsPost,
   getMultipleFormData,
   uploadImage,
   type FormResponse,
   isAdding,
   isProcessing,
} from "~/utils";
import { ImagePlus, Loader2 } from "lucide-react";
import { Image } from "~/components/Image";
import { AdminOrOwner } from "~/modules/auth";

const EntrySchema = z.object({
   name: z.string(),
   icon: z.any(),
});

export async function loader({
   context: { payload, user },
   params,
}: LoaderArgs) {
   const { collectionId, siteId } = zx.parseParams(params, {
      collectionId: z.string(),
      siteId: z.string().length(10),
   });
   const id = `${collectionId}-${siteId}`;
   const collection = await payload.findByID({
      collection: "collections",
      id,
   });
   const { docs } = await payload.find({
      collection: "entries",
      where: {
         collectionEntity: {
            equals: id,
         },
      },
      user,
   });
   return json({ collection, entries: docs });
}

export const meta: V2_MetaFunction = ({ data, parentsData }) => {
   const siteName = parentsData["routes/$siteId"].site.name;
   const collectionName = data.collection.name;

   return [
      {
         title: `${collectionName} - ${siteName}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export const handle = {
   i18n: "entry",
};

export default function CollectionList() {
   const { collection, entries } = useLoaderData<typeof loader>();

   const transition = useNavigation();
   const disabled = isProcessing(transition.state);
   const { t } = useTranslation(handle?.i18n);

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
   const adding = isAdding(transition, "addEntry");
   const formResponse = useActionData<FormResponse>();
   const zoEntry = useZorm("newEntry", EntrySchema, {
      //@ts-ignore
      customIssues: formResponse?.serverIssues,
   });

   useEffect(() => {
      if (!adding) {
         //@ts-ignore
         zoEntry.refObject.current && zoEntry.refObject.current.reset();
         setImgData(null);
      }
   }, [adding, zoEntry.refObject]);

   return (
      <>
         <Outlet />
         <div className="mx-auto max-w-[728px] px-3 tablet:px-0 pt-4 pb-12">
            <h2 className="pt-6 pb-3.5 text-2xl font-bold">
               {collection.name}
            </h2>
            <AdminOrOwner>
               <Form
                  ref={zoEntry.ref}
                  method="post"
                  encType="multipart/form-data"
                  className="pb-3.5"
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
                              name={zoEntry.fields.icon()}
                              type="file"
                              className="hidden"
                              onChange={onChangePicture}
                           />
                        </label>
                     </div>
                     <div className="flex-grow">
                        <input
                           required
                           placeholder={t("new.namePlaceholder") ?? undefined}
                           autoFocus={true}
                           name={zoEntry.fields.name()}
                           type="text"
                           className="input-text mt-0"
                           disabled={disabled}
                        />
                        {zoEntry.errors.name()?.message && (
                           <div
                              className="pt-1 text-red-700"
                              id="entryName-error"
                           >
                              {zoEntry.errors.name()?.message}
                           </div>
                        )}
                     </div>
                     <button
                        name="intent"
                        value="addEntry"
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
               </Form>
            </AdminOrOwner>

            {entries?.length === 0 ? null : (
               <>
                  <div className="divide-y overflow-hidden rounded-lg border border-color divide-color bg-2">
                     {entries?.map((entry) => (
                        <Link
                           key={entry.id}
                           to={`${entry.id}`}
                           prefetch="intent"
                           className="flex items-center gap-3 p-2 bg-2 hover:underline"
                        >
                           <div
                              className="flex h-8 w-8 items-center justify-between dark:border-zinc-600
                                    overflow-hidden rounded-full border border-zinc-400"
                           >
                              <Image /* @ts-ignore */
                                 url={entry.icon?.url}
                                 options="fit=crop,width=60,height=60,gravity=auto"
                                 alt="List Icon"
                              />
                           </div>
                           <span>{entry.name}</span>
                        </Link>
                     ))}
                  </div>
               </>
            )}
         </div>
      </>
   );
}

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
   params,
}) => {
   const { collectionId } = zx.parseParams(params, {
      collectionId: z.string(),
   });
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   const issues = createCustomIssues(EntrySchema);

   // Add Entry
   if (intent === "addEntry") {
      assertIsPost(request);

      const result = await getMultipleFormData({
         request,
         prefix: "eIcon",
         schema: EntrySchema,
      });

      if (result.success) {
         const { name, icon } = result.data;
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
               collection: "entries",
               data: {
                  name,
                  icon: iconId,
                  collectionEntity: collectionId,
               },
               user,
               overrideAccess: false,
            });
            return json<FormResponse>({
               success: "New entry added.",
            });
         } catch (error) {
            return json({
               error: "Something went wrong...unable to add entry.",
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
         error: "Something went wrong...unable to add entry.",
      });
   }
};
