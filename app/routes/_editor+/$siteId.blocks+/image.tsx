import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { type ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useFetcher, useMatches } from "@remix-run/react";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { z } from "zod";
import { zx } from "zodix";

import { Image } from "~/components";
import { Icon } from "~/components/Icon";
import {
   isAdding,
   assertIsPost,
   getMultipleFormData,
   uploadImage,
} from "~/utils";

import type { CustomElement, ImageElement } from "../core/types";
type Props = {
   element: ImageElement;
};

export function BlockImage({ element }: Props) {
   const editor = useSlate();
   const fetcher = useFetcher();
   const isImageAdding = isAdding(fetcher, "addBlockImage");

   //index presume to have results data, might be brittle in the future
   const { siteId } = useMatches()?.[2]?.data as {
      siteId: string;
   };

   const [dragActive, setDragActive] = useState(false);

   const actionPath = `/${siteId}/blocks/image`;

   useEffect(() => {
      if (fetcher.state === "idle" && fetcher.data != null) {
         const { id, url } = fetcher.data;
         const path = ReactEditor.findPath(editor, element);
         const newProperties: Partial<CustomElement> = {
            refId: id,
            url,
         };
         Transforms.setNodes<CustomElement>(editor, newProperties, {
            at: path,
         });
      }
   }, [fetcher.state, fetcher.data, editor, element]);

   const handleDrop = function (e: any, fetcher: any) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         const formData = new FormData();
         formData.append("intent", "addBlockImage");
         formData.append("image", e.dataTransfer.files[0]);
         fetcher.submit(formData, {
            encType: "multipart/form-data",
            method: "POST",
            action: actionPath,
         });
      }
   };

   const handleDrag = function (e: FormEvent) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
         setDragActive(true);
      } else if (e.type === "dragleave") {
         setDragActive(false);
      }
   };

   return (
      <div className="relative">
         {element.url ? (
            <div className="relative mb-3 flex h-auto min-h-[50px] w-full justify-center">
               <Image
                  className="w-full rounded-md"
                  alt="Inline"
                  url={element.url}
               />
            </div>
         ) : (
            <>
               <div className="relative mb-3">
                  <fetcher.Form
                     method="post"
                     encType="multipart/form-data"
                     onDragEnter={(e) => handleDrag(e)}
                     onChange={(event) => {
                        fetcher.submit(event.currentTarget, {
                           method: "post",
                           action: actionPath,
                        });
                     }}
                  >
                     <label
                        className={`${
                           dragActive
                              ? "border-zinc-400 bg-white dark:border-zinc-600 dark:bg-dark400"
                              : "hover:border-zinc-200 dark:hover:border-zinc-600"
                        } bg-2-sub border-color-sub group flex cursor-pointer
                        items-center justify-center overflow-hidden rounded-md border-2
                        border-y-2 border-dashed p-6 shadow-sm `}
                     >
                        <div className="text-1 space-y-2">
                           {isImageAdding ? (
                              <Icon
                                 name="loader-2"
                                 size={24}
                                 className="mx-auto animate-spin"
                              />
                           ) : (
                              <Icon
                                 name="upload"
                                 className="mx-auto"
                                 size={24}
                              />
                           )}

                           <div className="text-center text-sm font-bold group-hover:underline">
                              Drag or click to upload an image
                           </div>
                           <div className="text-center text-xs">
                              JPEG, PNG, JPG or WEBP (MAX. 5MB)
                           </div>
                        </div>
                        <input name="image" type="file" className="hidden" />
                     </label>
                     {dragActive && (
                        <div
                           className="absolute bottom-0 left-0 right-0 top-0 h-full w-full"
                           onDragEnter={handleDrag}
                           onDragLeave={handleDrag}
                           onDragOver={handleDrag}
                           onDrop={(e) => {
                              handleDrop(e, fetcher);
                           }}
                        />
                     )}
                     <input type="hidden" name="intent" value="addBlockImage" />
                  </fetcher.Form>
               </div>
            </>
         )}
      </div>
   );
}

export async function action({
   context: { payload, user },
   request,
}: ActionFunctionArgs) {
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   if (!user || !user.id) return redirect("/login", { status: 302 });

   switch (intent) {
      case "addBlockImage": {
         assertIsPost(request);
         const result = await getMultipleFormData({
            request,
            prefix: "blockImage",
            schema: z.any(),
         });
         if (result.success) {
            const { image } = result.data;
            try {
               return await uploadImage({
                  payload,
                  image: image,
                  user,
               });
            } catch (error) {
               return json({
                  error: "Something went wrong...unable to add image.",
               });
            }
         }
         // Last resort error message
         return json({
            error: "Something went wrong...unable to add image.",
         });
      }

      default:
         return null;
   }
}
