import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { redirect } from "@remix-run/node";
import type {
   MetaFunction,
   SerializeFrom,
   ActionFunctionArgs,
} from "@remix-run/node";
import { useFetcher, useRouteLoaderData, useSubmit } from "@remix-run/react";
import type { Crop, PixelCrop } from "react-image-crop";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { useZorm } from "react-zorm";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import { z } from "zod";
import { zx } from "zodix";

import { Button } from "~/components/Button";
import { Dialog } from "~/components/Dialog";
import {
   Description,
   Field,
   FieldGroup,
   Fieldset,
   Label,
   Legend,
} from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Input } from "~/components/Input";
import { Switch, SwitchField } from "~/components/Switch";
import { Strong, TextLink, Text } from "~/components/Text";
import { Textarea } from "~/components/Textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";
import { isAdding, isProcessing } from "~/utils/form";
import {
   getMultipleFormData,
   uploadImage,
} from "~/utils/upload-handler.server";

const SettingsSiteSchema = z.object({
   name: z.string().min(3),
   siteId: z.string().min(1),
   about: z.string().optional(),
   slug: z.string().min(1),
   isPublic: z.coerce.boolean(),
   enableAds: z.coerce.boolean(),
   gaTagId: z.string().optional(),
   gaPropertyId: z.string().optional(),
});

export default function SiteSettings() {
   const { site } = useRouteLoaderData("routes/_site+/_layout") as {
      site: SerializeFrom<typeof siteLoaderType>["site"];
   };
   const accessText = site.isPublic ? "publicly" : "privately";

   const zo = useZorm("settings", SettingsSiteSchema);

   const fetcher = useFetcher();

   const saving = isAdding(fetcher, "saveSettings");
   const disabled =
      isProcessing(fetcher.state) || zo.validation?.success === false;

   const [isChanged, setIsChanged] = useState(false);

   useEffect(() => {
      if (!saving) {
         setIsChanged(false);
      }
   }, [saving]);

   const isImageAdding = isAdding(fetcher, `updateSiteIcon`);
   const isImageDeleting = isAdding(fetcher, `deleteSiteIcon`);

   const [dragActive, setDragActive] = useState(false);

   const [imgSrc, setImgSrc] = useState("");
   const imgRef = useRef<HTMLImageElement>(null);
   const [crop, setCrop] = useState<Crop>();
   const [aspect, setAspect] = useState<number | undefined>(16 / 9);
   const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
   const [preparedFile, setPreparedFile] = useState({});
   const [isOpen, setIsOpen] = useState(false);

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
               const file = new File([buffer], "filename", {
                  type: fileType,
               });
               setIsOpen(false);
               setPreparedFile(file);
            }
         }
      }
   }

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

   const handleDrop = function (e: any, fetcher: any) {
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

   let submit = useSubmit();

   // We need to set the formData here since we can't write to a read-only, hidden, input type if we want to submit it with a file upload
   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const $form = event.currentTarget;

      const formData = new FormData($form);

      //@ts-ignore
      formData.set("image", preparedFile);

      submit(formData, {
         method: "POST",
         encType: "multipart/form-data",
      });
   }

   return (
      <>
         <fetcher.Form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="h-full relative"
            method="POST"
            onChange={() => setIsChanged(true)}
            ref={zo.ref}
         >
            <div className="p-4 rounded-xl border border-color-sub bg-2-sub mb-4 shadow-sm dark:shadow-zinc-800/50">
               <>
                  {site.icon?.url ? (
                     <div className="group inline-flex items-center justify-center">
                        <Image
                           url={site?.icon?.url}
                           options="aspect_ratio=1:1&height=120&width=120"
                           alt="Image"
                        />
                        <button
                           className="absolute hidden group-hover:flex w-full h-full  items-center justify-center rounded-md bg-white/80 dark:bg-zinc-800/50"
                           onClick={() =>
                              fetcher.submit(
                                 //@ts-ignore
                                 {
                                    intent: `deleteSiteIcon`,
                                    imageId: site.icon?.id,
                                    site: site?.id,
                                 },
                                 {
                                    method: "delete",
                                    action: "/settings/site",
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
                     </div>
                  ) : (
                     <>
                        <Dialog size="md" onClose={setIsOpen} open={isOpen}>
                           {!!imgSrc && (
                              <>
                                 <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) =>
                                       setCrop(percentCrop)
                                    }
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspect}
                                    // minWidth={400}
                                    minHeight={100}
                                    // circularCrop
                                 >
                                    <img
                                       ref={imgRef}
                                       alt="Crop me"
                                       src={imgSrc}
                                       onLoad={onImageLoad}
                                    />
                                 </ReactCrop>
                                 <button onClick={onSubmitCrop}>Submit</button>
                              </>
                           )}
                        </Dialog>
                        <div
                           className="w-full h-full"
                           onDragEnter={(e) => handleDrag(e)}
                        >
                           <label
                              className={`${
                                 dragActive
                                    ? "border-zinc-400 bg-white dark:border-zinc-600 dark:bg-dark400"
                                    : "hover:border-zinc-200 dark:hover:border-zinc-600"
                              } bg-2-sub border-color-sub group flex cursor-pointer w-full h-full
                     items-center justify-center overflow-hidden rounded-lg border-2
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
                                    <Icon
                                       name="upload"
                                       className="mx-auto"
                                       size={18}
                                    />
                                 )}
                              </div>
                              <input
                                 type="file"
                                 className="hidden"
                                 onChange={onSelectFile}
                              />
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
                        </div>
                     </>
                  )}
               </>
            </div>
            <input type="hidden" name={zo.fields.siteId()} value={site.id} />
            <FieldGroup>
               <SwitchField className="p-4 rounded-xl border border-color-sub bg-2-sub shadow-sm dark:shadow-zinc-800/50">
                  <Label>Allow Public Access</Label>
                  <Description>
                     Make your site public to allow anyone to view it
                  </Description>
                  <Switch
                     //@ts-ignore
                     defaultChecked={site.isPublic}
                     onChange={() => setIsChanged(true)}
                     value="true"
                     color="dark/white"
                     name={zo.fields.isPublic()}
                  />
               </SwitchField>
               <Field>
                  <Label>Slug</Label>
                  <Input
                     defaultValue={site.slug ?? ""}
                     name={zo.fields.slug()}
                     type="text"
                  />
                  <Description>
                     Your site is{" "}
                     <Strong>
                        <i>{accessText}</i>
                     </Strong>{" "}
                     viewable at{" "}
                     <TextLink
                        target="_blank"
                        href={
                           site.domain
                              ? `https://${site.domain}`
                              : `https://${site.slug}.mana.wiki`
                        }
                     >
                        {site.domain ? site.domain : `${site.slug}.mana.wiki`}
                     </TextLink>
                     . You can change this to a custom domain{" "}
                     <TextLink href="/settings/domain">here</TextLink>.
                  </Description>
               </Field>
               <Field>
                  <Label>Name</Label>
                  <Input
                     name={zo.fields.name()}
                     defaultValue={site.name}
                     type="text"
                  />
               </Field>
               <Field>
                  <Label>About</Label>
                  <Textarea
                     defaultValue={site.about ?? ""}
                     name={zo.fields.about()}
                  />
               </Field>
               <SwitchField className="p-4 rounded-xl border border-color-sub bg-2-sub shadow-sm dark:shadow-zinc-800/50">
                  <Label>Enable Ads</Label>
                  <Description>
                     Earn revenue by displaying ads on your site
                  </Description>
                  <Switch
                     onChange={() => setIsChanged(true)}
                     //@ts-ignore
                     defaultChecked={site.enableAds}
                     color="dark/white"
                     value="true"
                     name={zo.fields.enableAds()}
                  />
               </SwitchField>
            </FieldGroup>
            <Fieldset className="py-6 border-y-2 border-color border-dashed mt-8">
               <Legend>Analytics</Legend>
               <Text>
                  Track your site's performance with Google Analytics. Learn how
                  to create a free Google Analytics account{" "}
                  <TextLink
                     target="_blank"
                     href="https://support.google.com/analytics/answer/9304153?hl=en"
                  >
                     here
                  </TextLink>
                  .
               </Text>
               <FieldGroup>
                  <Field>
                     <Label>Google Analytics Tracking Id</Label>
                     <Input
                        defaultValue={site.gaTagId ?? ""}
                        name={zo.fields.gaTagId()}
                        type="text"
                     />
                  </Field>
                  <Field>
                     <Label>Google Analytics Property Id</Label>
                     <Input
                        defaultValue={site.gaPropertyId ?? ""}
                        name={zo.fields.gaPropertyId()}
                        type="text"
                     />
                     <Description>
                        Grant view access to the associated Google Analytics
                        property to generate trending pages.
                     </Description>
                  </Field>
               </FieldGroup>
            </Fieldset>
            <div className="pt-6 flex items-center gap-3 justify-end">
               {isChanged && (
                  <Tooltip placement="top">
                     <TooltipTrigger
                        onClick={() => {
                           //@ts-ignore
                           zo.refObject.current.reset();
                           setIsChanged(false);
                        }}
                        className="text-xs cursor-pointer hover:dark:bg-dark400 
                      flex items-center justify-center w-7 h-7 rounded-full"
                     >
                        <Icon
                           title="Reset"
                           size={16}
                           name="refresh-ccw"
                           className="dark:text-zinc-500"
                        />
                     </TooltipTrigger>
                     <TooltipContent>Reset</TooltipContent>
                  </Tooltip>
               )}
               <input type="hidden" name="intent" value="saveSettings" />
               <Button
                  type="submit"
                  color="dark/white"
                  className="cursor-pointer !font-bold text-sm h-9 w-16"
                  disabled={!isChanged || disabled}
               >
                  {saving ? (
                     <Icon
                        size={16}
                        name="loader-2"
                        className="mx-auto animate-spin"
                     />
                  ) : (
                     "Save"
                  )}
               </Button>
            </div>
         </fetcher.Form>
      </>
   );
}

export const meta: MetaFunction = ({ matches }) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
      //@ts-ignore
   )?.data?.site.name;

   return [
      {
         title: `Site | Settings - ${siteName}`,
      },
   ];
};

export async function action({
   context: { payload, user },
   request,
}: ActionFunctionArgs) {
   const { intent } = await zx.parseForm(request, {
      intent: z.enum(["saveSettings", "addDomain"]),
   });

   if (!user) throw redirect("/404", 404);

   switch (intent) {
      case "saveSettings": {
         const result = await getMultipleFormData({
            request,
            prefix: "siteIcon",
            schema: z.any(),
         });
         if (result.success) {
            const { image, siteId } = result.data;

            if (image) {
               const upload = await uploadImage({
                  payload,
                  image: image,
                  user,
                  siteId,
               });

               await payload.update({
                  collection: "sites",
                  id: siteId,
                  data: {
                     //@ts-ignore
                     icon: upload?.id,
                  },
                  overrideAccess: false,
                  user,
               });
            }

            // await payload.update({
            //    collection: "sites",
            //    id: formData.siteId,
            //    //@ts-ignore
            //    data: {
            //       ...formData,
            //    },
            //    overrideAccess: false,
            //    user,
            // });
         }

         return jsonWithSuccess(null, "Settings updated");
      }
   }
}
