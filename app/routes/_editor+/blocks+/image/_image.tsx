import { useEffect, useState } from "react";

import { type ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import clsx from "clsx";
import { Resizable } from "re-resizable";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { z } from "zod";
import { zx } from "zodix";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { ImageUploader } from "~/components/ImageUploader";
import { isAdding, isProcessing } from "~/utils/form";
import {
   getMultipleFormData,
   uploadImage,
} from "~/utils/upload-handler.server";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import type { CustomElement, ImageElement } from "../../core/types";

type Props = {
   element: ImageElement;
   children: React.ReactNode;
};

export function BlockImage({ element, children }: Props) {
   const editor = useSlate();
   const fetcher = useFetcher();
   const isImageAdding = isAdding(fetcher, "addBlockImage");
   const isImageDeleting = isAdding(fetcher, "deleteBlockImage");

   const { site } = useSiteLoaderData();

   const actionPath = `/blocks/image`;

   const path = ReactEditor.findPath(editor, element);

   useEffect(() => {
      if (fetcher.state === "idle" && fetcher.data != null) {
         //@ts-ignore
         if (fetcher.data?.isUpload == true) {
            //@ts-ignore
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
         //@ts-ignore
         if (fetcher.data?.isDelete == true) {
            const path = ReactEditor.findPath(editor, element);
            Transforms.removeNodes(editor, {
               at: path,
            });
         }
      }
   }, [fetcher.state, fetcher.data, editor, element]);

   const [preparedFile, setPreparedFile] = useState();
   const [previewImage, setPreviewImage] = useState("");

   // Append the images to the form data if they exist
   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const $form = event.currentTarget;

      const formData = new FormData($form);

      preparedFile && formData.set("image", preparedFile);

      fetcher.submit(formData, {
         method: "POST",
         encType: "multipart/form-data",
         action: actionPath,
      });
   }
   const disabled = isProcessing(fetcher.state);

   const [imageSize, setImageSize] = useState({
      width: element.containerWidth ?? 728,
   });

   const isLargerImage = imageSize.width > 728;

   return (
      <Resizable
         defaultSize={{
            width: imageSize.width as any,
            height: "auto",
         }}
         size={{
            width: imageSize.width as any,
            height: "auto",
         }}
         enable={
            preparedFile || element.url ? { right: true, left: true } : false
         }
         maxWidth={preparedFile || element.url ? 800 : 728}
         minWidth={280}
         className="mx-auto max-tablet:!max-w-full max-tablet:!w-full"
         onResizeStop={(e, direction, ref, d) => {
            Transforms.setNodes<CustomElement>(
               editor,
               {
                  containerWidth: imageSize?.width + d.width,
               },
               {
                  at: path,
               },
            );
            return setImageSize({
               width: imageSize?.width + d.width,
            });
         }}
      >
         <div className="relative">
            {/* Uploaded Image */}
            {element.url ? (
               <>
                  <div className="absolute top-3 left-3 flex items-center gap-3 z-20">
                     <Button
                        color="light/zinc"
                        className="!p-0 !size-9"
                        onClick={() =>
                           Transforms.setNodes<CustomElement>(
                              editor,
                              { caption: !element.caption },
                              {
                                 at: path,
                              },
                           )
                        }
                     >
                        <Icon
                           title="Toggle caption visibility"
                           name={element.caption ? "captions-off" : "captions"}
                           size={16}
                        />
                     </Button>
                  </div>
                  <div
                     className={clsx(
                        isLargerImage && "max-tablet:-mx-3",
                        "relative mt-3 mb-4",
                     )}
                  >
                     <div
                        className={clsx(
                           isLargerImage
                              ? "max-tablet:rounded-none tablet:rounded-xl tablet:border max-tablet:border-y"
                              : "rounded-xl border",
                           `flex flex-col h-auto min-h-[50px] w-full justify-center bg-zinc-50 dark:shadow-zinc-800
                           dark:bg-dark350/90  dark:border-zinc-700 overflow-hidden shadow-sm`,
                        )}
                     >
                        <Image
                           className="max-h-80 w-auto mx-auto"
                           alt="Inline"
                           url={element.url}
                        />
                        {element.caption ? (
                           <div className="p-2 text-center text-sm border-t dark:border-zinc-700 dark:bg-dark350/80 bg-white">
                              {children}
                           </div>
                        ) : (
                           <div contentEditable={false} className="hidden">
                              {children}
                           </div>
                        )}
                     </div>
                     <Button
                        color="red"
                        type="button"
                        className="!absolute top-3 !p-0 !size-9 right-3"
                        disabled={disabled}
                        onClick={() => {
                           fetcher.submit(
                              {
                                 intent: "deleteBlockImage",
                                 imageId: element.refId,
                              },
                              {
                                 method: "DELETE",
                                 action: actionPath,
                              },
                           );
                        }}
                     >
                        {isImageDeleting ? (
                           <Icon
                              name="loader-2"
                              size={16}
                              className="animate-spin"
                           />
                        ) : (
                           <Icon name="trash" size={16} />
                        )}
                     </Button>
                  </div>
               </>
            ) : (
               <>
                  {/* Null image */}
                  <div
                     className="my-3 flex flex-col h-auto min-h-[50px] w-full justify-center bg-3-sub rounded-xl border
                   dark:border-zinc-700 overflow-hidden bg-zinc-50 shadow-sm dark:shadow-zinc-800"
                  >
                     <fetcher.Form
                        method="POST"
                        action={actionPath}
                        encType="multipart/form-data"
                        onSubmit={preparedFile && handleSubmit}
                     >
                        <ImageUploader
                           type="rectangle"
                           previewImage={previewImage}
                           setPreparedFile={setPreparedFile}
                           setPreviewImage={setPreviewImage}
                           wrapperClassName={clsx(
                              element.caption ? "!rounded-b-none" : "",
                              "h-full !rounded-xl",
                           )}
                        />
                        <input type="hidden" name="siteId" value={site.id} />
                        <input
                           type="hidden"
                           name="intent"
                           value="addBlockImage"
                        />
                        {preparedFile && (
                           <div className="absolute top-3 w-full flex items-center justify-center z-10">
                              <Button
                                 disabled={disabled}
                                 color="green"
                                 type="submit"
                                 className="shadow shadow-1"
                              >
                                 {isImageAdding ? (
                                    <Icon
                                       name="loader-2"
                                       size={16}
                                       className="animate-spin"
                                    />
                                 ) : (
                                    <Icon name="upload" size={16} />
                                 )}
                                 Upload Image
                              </Button>
                           </div>
                        )}
                     </fetcher.Form>
                     {element.caption ? (
                        <div className="p-2 text-center text-sm border-t dark:border-zinc-700 dark:bg-dark350 bg-white">
                           {children ? children : "Add a caption"}
                        </div>
                     ) : (
                        <div contentEditable={false} className="hidden">
                           {children}
                        </div>
                     )}
                  </div>
               </>
            )}
         </div>
      </Resizable>
   );
}

export async function action({
   context: { payload, user },
   request,
}: ActionFunctionArgs) {
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   if (!user || !user.id)
      return redirect("/login", {
         status: 302,
      });

   switch (intent) {
      case "addBlockImage": {
         const result = await getMultipleFormData({
            request,
            prefix: "blockImage",
            schema: z.any(),
         });
         if (result.success) {
            const { image, siteId } = result.data;
            try {
               const { id, url } = await uploadImage({
                  payload,
                  image: image,
                  user,
                  siteId: siteId,
               });
               return jsonWithSuccess(
                  { id, url, isUpload: true },
                  "Image uploaded",
               );
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
      case "deleteBlockImage": {
         try {
            const { imageId } = await zx.parseForm(request, {
               imageId: z.string(),
            });
            await payload.delete({
               collection: "images",
               id: imageId,
               user,
               overrideAccess: false,
            });
            return jsonWithSuccess({ isDelete: true }, "Image deleted");
         } catch (error) {
            return jsonWithError(
               null,
               "Something went wrong...unable to delete image",
            );
         }
      }
      default:
         return null;
   }
}
