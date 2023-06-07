import { ReactEditor, useSlate } from "slate-react";
import type { CustomElement, ImageElement } from "../types";
import { Transforms } from "slate";
import { Loader2, Upload } from "lucide-react";
import { useFetcher } from "@remix-run/react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { isAdding } from "~/utils";
import { Image } from "~/components";
type Props = {
   element: ImageElement;
};

export default function BlockImage({ element }: Props) {
   const editor = useSlate();
   const fetcher = useFetcher();
   const isImageAdding = isAdding(fetcher, "addBlockImage");

   const [dragActive, setDragActive] = useState(false);

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
            action: "/action/block-actions",
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
            <div className="relative my-3 flex h-auto min-h-[50px] w-full justify-center">
               <Image
                  className="w-full rounded-md"
                  alt="Inline"
                  url={element.url}
               />
            </div>
         ) : (
            <>
               <div className="relative mb-5">
                  <fetcher.Form
                     method="post"
                     encType="multipart/form-data"
                     replace
                     onDragEnter={(e) => handleDrag(e)}
                     onChange={(event) => {
                        fetcher.submit(event.currentTarget, {
                           method: "post",
                           action: "/action/block-actions",
                        });
                     }}
                  >
                     <label
                        className={`${
                           dragActive
                              ? "border-4 border-zinc-400 bg-white dark:border-zinc-600 dark:bg-bg4Dark"
                              : "hover:border-zinc-400 dark:hover:border-zinc-500"
                        } bg-2 group flex cursor-pointer items-center
                        justify-center overflow-hidden rounded-md border-2 border-y-2
                        border-dashed border-zinc-300 p-6 shadow-sm dark:border-zinc-600 `}
                     >
                        <div className="text-1 space-y-2">
                           {isImageAdding ? (
                              <Loader2
                                 size={24}
                                 className="mx-auto animate-spin"
                              />
                           ) : (
                              <Upload className="mx-auto" size={24} />
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
