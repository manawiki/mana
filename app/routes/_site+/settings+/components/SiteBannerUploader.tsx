import type { FormEvent } from "react";
import { useState, useRef, useEffect } from "react";

import clsx from "clsx";
import type { Crop, PixelCrop } from "react-image-crop";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";

import { Button } from "~/components/Button";
import { Dialog } from "~/components/Dialog";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";

import { imgPreview } from "../utils/imgPreview";

export function SiteBannerUploader({
   siteBanner,
   setPreparedFile,
   previewImage,
   setPreviewImage,
}: {
   siteBanner: string | null | undefined;
   setPreparedFile: React.Dispatch<React.SetStateAction<undefined | File>>;
   previewImage: string | null | undefined;
   setPreviewImage: React.Dispatch<React.SetStateAction<string>>;
}) {
   const [dragActive, setDragActive] = useState(false);
   const [imgSrc, setImgSrc] = useState("");
   const imgRef = useRef<HTMLImageElement>(null);
   const [crop, setCrop] = useState<Crop>();
   const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
   const [isOpen, setIsOpen] = useState(false);
   const [scale, setScale] = useState(1);
   const aspect = 1.6 / 1;

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
      if (aspect) {
         const { width, height } = e.currentTarget;
         setCrop(centerAspectCrop(width, height, aspect));
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
      <section className="laptop:w-[300px]">
         <div className="text-sm font-semibold pb-2">Banner</div>
         <Dialog
            size="md"
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
                     aspect={aspect}
                     minWidth={300}
                     minHeight={170}
                     maxWidth={600}
                     maxHeight={340}
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
                  dragActive
                     ? "border-zinc-400 dark:border-zinc-600"
                     : "hover:border-zinc-200 dark:hover:border-zinc-600",
                  !siteBanner &&
                     !previewImage &&
                     "border-dashed border-color-sub border-2 bg-2-sub",
                  `flex cursor-pointer items-center justify-center rounded-lg 
                shadow-sm z-0 relative flex-none group h-[170px] w-[300px] overflow-hidden
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
               <div className="overflow-hidden relative">
                  {siteBanner && !previewImage ? (
                     <>
                        <Image
                           url={siteBanner}
                           options="aspect_ratio=1.6:1&height=400"
                           alt="Image"
                        />
                        <div className="group-hover:block hidden absolute inset-0 w-full h-full z-10 overflow-hidden bg-zinc-900/50">
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
                                 className="rounded"
                                 width={300}
                                 height={170}
                                 src={previewImage}
                              />
                              <div className="group-hover:block hidden absolute w-full h-full overflow-hidden inset-0">
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
                           <>
                              <div className="flex items-center justify-center pb-3">
                                 <Icon
                                    title="Upload Image"
                                    name="upload"
                                    size={18}
                                 />
                              </div>
                              <div className="text-sm text-center">
                                 Click to upload or drag and drop
                              </div>
                              <div className="text-xs text-1 text-center px-4 pt-1">
                                 300x170px
                              </div>
                           </>
                        )}
                     </>
                  )}
               </div>
            </label>
         </div>
      </section>
   );
}
