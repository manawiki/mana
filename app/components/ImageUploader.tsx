import type { FormEvent } from "react";
import { useState, useRef, useEffect } from "react";

import clsx from "clsx";
import type { Crop, PixelCrop } from "react-image-crop";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";

import { Button } from "~/components/Button";
import { Dialog } from "~/components/Dialog";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { imgPreview } from "~/routes/_site+/settings+/utils/imgPreview";

export function ImageUploader({
   label,
   icon,
   setPreparedFile,
   previewImage,
   setPreviewImage,
   type,
   aspect,
}: {
   label: string;
   icon: string | null | undefined;
   setPreparedFile: React.Dispatch<
      React.SetStateAction<undefined | File | any>
   >;
   previewImage: string | null | undefined;
   setPreviewImage: React.Dispatch<React.SetStateAction<string>>;
   type: "circle" | "rectangle";
   aspect?: number;
}) {
   const [dragActive, setDragActive] = useState(false);
   const [imgSrc, setImgSrc] = useState("");
   const imgRef = useRef<HTMLImageElement>(null);
   const [crop, setCrop] = useState<Crop>();
   const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
   const [isOpen, setIsOpen] = useState(false);
   const [scale, setScale] = useState(1);

   const aspectRatio = aspect && type === "rectangle" ? aspect : 1;

   function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
      if (e.target.files && e.target.files.length > 0) {
         setCrop(undefined); // Makes crop preview update between images.
         const reader = new FileReader();
         reader.addEventListener("load", () =>
            setImgSrc(reader.result?.toString() || ""),
         );
         //@ts-ignore
         reader.readAsDataURL(e.target.files[0]);
         setIsOpen(true);
      }
   }

   async function onSubmitCrop() {
      if (completedCrop) {
         const canvas = document.createElement("canvas");

         // get the image element
         const image = imgRef.current;

         // draw the image on the canvas
         if (image) {
            const crop = completedCrop;
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            // create a canvas element to draw the cropped image
            const ctx = canvas.getContext("2d");
            const pixelRatio = window.devicePixelRatio;
            canvas.width = crop.width * pixelRatio * scaleX;
            canvas.height = crop.height * pixelRatio * scaleY;

            if (ctx) {
               ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
               ctx.imageSmoothingQuality = "high";

               ctx.drawImage(
                  image,
                  crop.x * scaleX,
                  crop.y * scaleY,
                  crop.width * scaleX,
                  crop.height * scaleY,
                  0,
                  0,
                  crop.width * scaleX,
                  crop.height * scaleY,
               );
            }

            const base64Image = canvas.toDataURL("image/png");

            if (base64Image) {
               // @ts-ignore
               const fileType = base64Image.split(";")[0].split(":")[1];

               const buffer = Buffer.from(
                  base64Image.replace(/^data:image\/\w+;base64,/, ""),
                  "base64",
               );
               const file = new File([buffer], "filename.png", {
                  type: fileType,
               });
               setIsOpen(false);
               setPreparedFile(file);
            }
         }
      }
   }

   function centerAspectCrop(
      mediaWidth: number,
      mediaHeight: number,
      aspect: number,
   ) {
      return centerCrop(
         makeAspectCrop(
            {
               unit: "%",
               width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
         ),
         mediaWidth,
         mediaHeight,
      );
   }

   function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
      if (aspectRatio) {
         const { width, height } = e.currentTarget;
         setCrop(centerAspectCrop(width, height, aspectRatio));
      }
   }

   const handleDrop = function (e: any) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         setCrop(undefined); // Makes crop preview update between images.
         const reader = new FileReader();
         reader.addEventListener("load", () =>
            setImgSrc(reader.result?.toString() || ""),
         );
         reader.readAsDataURL(e.dataTransfer.files[0]);
         setIsOpen(true);
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

   useEffect(() => {
      async function getImagePreview() {
         if (completedCrop?.width && completedCrop?.height && imgRef.current) {
            const previewSrc = await imgPreview(
               imgRef.current,
               completedCrop,
               scale,
            );
            setPreviewImage(previewSrc);
         }
      }
      getImagePreview();
   }, [isOpen]);

   return (
      <section>
         <div className="text-sm font-semibold pb-3">{label}</div>
         <Dialog
            size="tablet"
            onClose={() => {
               setIsOpen(false);
            }}
            open={isOpen}
         >
            {imgSrc && (
               <>
                  <ReactCrop
                     crop={crop}
                     onChange={(crop) => setCrop(crop)}
                     onComplete={(c) => setCompletedCrop(c)}
                     aspect={aspectRatio}
                     circularCrop={type === "circle"}
                     minWidth={120}
                     minHeight={120}
                     maxWidth={512}
                     maxHeight={512}
                  >
                     <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        style={{ transform: `scale(${scale})` }}
                        onLoad={onImageLoad}
                     />
                  </ReactCrop>
                  <div className="pt-4">
                     <input
                        disabled={!imgSrc}
                        onChange={(e) => setScale(Number(e.target.value))}
                        type="range"
                        name="scale"
                        min={1}
                        max={2}
                        step="0.1"
                        value={scale}
                        className="w-full mb-4"
                     />
                     <Button
                        type="button"
                        className="w-full"
                        onClick={onSubmitCrop}
                     >
                        Submit
                     </Button>
                  </div>
               </>
            )}
         </Dialog>
         <div className="flex items-center gap-5">
            <label
               onDragEnter={(e) => handleDrag(e)}
               className={clsx(
                  type === "circle"
                     ? "size-20 rounded-full"
                     : "w-full rounded-lg",
                  dragActive
                     ? "border-zinc-400 dark:border-zinc-600"
                     : "hover:border-zinc-200 dark:hover:border-zinc-600",
                  !icon &&
                     !previewImage &&
                     "border-dashed border-color-sub border-2 bg-2-sub",
                  `flex cursor-pointer items-center justify-center  
                shadow-sm z-0 relative  flex-none group
                `,
               )}
            >
               <input type="file" className="hidden" onChange={onSelectFile} />
               {dragActive && (
                  <div
                     className="absolute bottom-0 left-0 right-0 top-0 h-full w-full z-10"
                     onDragEnter={handleDrag}
                     onDragLeave={handleDrag}
                     onDragOver={handleDrag}
                     onDrop={(e) => {
                        handleDrop(e);
                     }}
                  />
               )}
               <div
                  className={clsx(
                     type === "circle" ? "-top-1 -right-1" : " -top-3 right-3",
                     `absolute flex items-center justify-center dark:border-zinc-500 border shadow-sm 
                     size-6 dark:bg-zinc-600 bg-zinc-50 border-zinc-300 rounded-full shadow-1 z-20`,
                  )}
               >
                  <Icon
                     title="Upload Image"
                     name="image-plus"
                     className="mx-auto"
                     size={12}
                  />
               </div>
               <div
                  className={clsx(
                     type === "circle" ? "rounded-full" : "w-full rounded-lg",
                     "flex items-center justify-center overflow-hidden relative w-full h-full",
                  )}
               >
                  {icon && !previewImage ? (
                     <>
                        <Image url={icon} alt="Image" />
                        <div className="hidden group-hover:block absolute inset-0  z-10 overflow-hidden">
                           <div className="inset-0 size-20 bg-zinc-900/50 w-full h-full" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Icon
                                 size={18}
                                 name="pencil"
                                 className="text-white"
                              />
                           </div>
                        </div>
                     </>
                  ) : (
                     <>
                        {/* Cropped image preview */}
                        {completedCrop && !isOpen && previewImage ? (
                           <>
                              <img
                                 alt="Crop preview"
                                 src={previewImage}
                                 className={clsx(
                                    type === "circle"
                                       ? "rounded-full"
                                       : "rounded-lg",
                                 )}
                              />
                              <div
                                 className={clsx(
                                    type === "circle"
                                       ? "rounded-full"
                                       : "rounded-lg",
                                    "group-hover:block hidden absolute w-full h-full  overflow-hidden",
                                 )}
                              >
                                 <span className="inset-0 w-full h-full bg-zinc-900/50 z-10 absolute" />
                                 <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <Icon
                                       size={18}
                                       name="pencil"
                                       className="text-white"
                                    />
                                 </div>
                              </div>
                           </>
                        ) : (
                           <Icon
                              title="Upload Image"
                              name="upload"
                              className="text-1"
                              size={18}
                           />
                        )}
                     </>
                  )}
               </div>
            </label>
            {type === "circle" && (
               <div className="text-sm text-gray-500 dark:text-gray-400 pt-2">
                  We recommend a size of at least 256x256 pixels.
               </div>
            )}
         </div>
      </section>
   );
}
