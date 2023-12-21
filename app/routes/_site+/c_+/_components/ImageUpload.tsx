import type { FormEvent } from "react";
import { useState } from "react";

import { useFetcher, useMatches } from "@remix-run/react";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import type { Site } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { NotAdminOrStaffOrOwner } from "~/routes/_auth+/components/NotAdminOrStaffOrOwner";
import { isAdding } from "~/utils";

export function CircleImageUploader({
   intent,
   actionPath,
   entityId,
   image,
}: {
   intent: "entry" | "collection";
   actionPath?: string;
   entityId?: string;
   image: any;
}) {
   const { site } = (useMatches()?.[1]?.data as { site: Site | null }) ?? {
      site: null,
   };

   const fetcher = useFetcher();
   const isImageAdding = isAdding(fetcher, `${intent}UpdateIcon`);
   const isImageDeleting = isAdding(fetcher, `${intent}DeleteIcon`);

   const [dragActive, setDragActive] = useState(false);

   const handleDrop = function (e: any, fetcher: any) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         const formData = new FormData();
         entityId && formData.append("entityId", entityId);
         formData.append("intent", `${intent}UpdateIcon`);
         formData.append("image", e.dataTransfer.files[0]);
         fetcher.submit(formData, {
            encType: "multipart/form-data",
            method: "POST",
            ...(actionPath && { action: actionPath }),
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

   return image?.url ? (
      <div className="group inline-flex items-center justify-center">
         <AdminOrStaffOrOwner>
            <Image
               url={image.url}
               options="aspect_ratio=1:1&height=120&width=120"
               alt="Icon"
            />
            {/* TODO Custom site entry icons are stored externally, so we disable updating the image until we build it out */}
            {site?.type == "core" ||
            (site?.type == "custom" && intent != "entry") ? (
               <button
                  className="absolute hidden group-hover:flex w-full h-full  items-center justify-center rounded-md bg-white/80 dark:bg-zinc-800/50"
                  onClick={() =>
                     fetcher.submit(
                        //@ts-ignore
                        {
                           intent: `${intent}DeleteIcon`,
                           imageId: image?.id,
                           entityId: entityId,
                        },
                        {
                           method: "delete",
                           ...(actionPath && { action: actionPath }),
                        },
                     )
                  }
               >
                  {isImageDeleting ? (
                     <Icon
                        name="loader-2"
                        size={16}
                        className="mx-auto animate-spin text-red-500 dark:text-red-100"
                     />
                  ) : (
                     <Icon
                        name="image-minus"
                        size={16}
                        className="text-red-500 dark:text-red-100"
                     />
                  )}
               </button>
            ) : null}
         </AdminOrStaffOrOwner>
         <NotAdminOrStaffOrOwner>
            <Image
               url={image.url}
               options="aspect_ratio=1:1&height=120&width=120"
               alt="Icon"
            />
         </NotAdminOrStaffOrOwner>
      </div>
   ) : (
      <>
         <AdminOrStaffOrOwner>
            <fetcher.Form
               method="post"
               encType="multipart/form-data"
               className="w-full h-full"
               onDragEnter={(e) => handleDrag(e)}
               onChange={(event) => {
                  fetcher.submit(event.currentTarget, {
                     method: "post",
                     ...(actionPath && { action: actionPath }),
                  });
               }}
            >
               <label
                  className={`${
                     dragActive
                        ? "border-zinc-400 bg-white dark:border-zinc-600 dark:bg-dark400"
                        : "hover:border-zinc-200 dark:hover:border-zinc-600"
                  } bg-2-sub border-color-sub group flex cursor-pointer w-full h-full
           items-center justify-center overflow-hidden rounded-full border-2
            border-dashed shadow-sm `}
               >
                  <div className="text-1 space-y-2">
                     {isImageAdding ? (
                        <Icon
                           name="loader-2"
                           size={18}
                           className="mx-auto animate-spin"
                        />
                     ) : (
                        <Icon name="upload" className="mx-auto" size={18} />
                     )}
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
               {entityId && (
                  <input name="entityId" value={entityId} type="hidden" />
               )}
               <input
                  type="hidden"
                  name="intent"
                  value={`${intent}UpdateIcon`}
               />
            </fetcher.Form>
         </AdminOrStaffOrOwner>
         <NotAdminOrStaffOrOwner>
            <Icon name="component" className="text-1 mx-auto" size={20} />
         </NotAdminOrStaffOrOwner>
      </>
   );
}
