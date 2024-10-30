import { useEffect, useState } from "react";

import { Transition } from "@headlessui/react";
import { redirect } from "@remix-run/node";
import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useZorm } from "react-zorm";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import { string, z } from "zod";
import { zx } from "zodix";

import { Button } from "~/components/Button";
import { DotLoader } from "~/components/DotLoader";
import {
   Description,
   Field,
   FieldGroup,
   Fieldset,
   Label,
   Legend,
} from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { ImageUploader } from "~/components/ImageUploader";
import { Switch, SwitchField } from "~/components/Switch";
import { Strong, TextLink, Text } from "~/components/Text";
import { Textarea } from "~/components/Textarea";
import { isAdding, isProcessing } from "~/utils/form";
import {
   getMultipleFormData,
   uploadImage,
} from "~/utils/upload-handler.server";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { InputGroup, Input } from "~/components/Input";

const SettingsSiteSchema = z.object({
   name: z.string().min(3),
   siteId: z.string().min(1),
   about: z.string().optional(),
   slug: z.string().min(1),
   isPublic: z.coerce.boolean(),
   enableAds: z.coerce.boolean(),
   siteIcon: z.any().optional(),
   siteIconId: z.string().optional(),
   siteBannerId: z.string().optional(),
   siteBanner: z.any().optional(),
   gaTagId: z.string().optional(),
   gaPropertyId: z.string().optional(),
   intent: z.string(),
   announcementMessage: z.string().optional(),
   announcementLink: z.string().optional(),
});

export default function SiteSettings() {
   const { site } = useSiteLoaderData();

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

   //Icon Cropping
   const siteIcon = site.icon?.url;
   const [preparedIconFile, setPreparedIconFile] = useState();
   const [previewIconImage, setPreviewIconImage] = useState("");

   const siteBanner = site.banner?.url;
   const [preparedBannerFile, setPreparedBannerFile] = useState();
   const [previewBannerImage, setPreviewBannerImage] = useState("");

   // Append the images to the form data if they exist
   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const $form = event.currentTarget;

      const formData = new FormData($form);

      preparedIconFile && formData.set("siteIcon", preparedIconFile);
      preparedBannerFile && formData.set("siteBanner", preparedBannerFile);

      fetcher.submit(formData, {
         method: "POST",
         encType: "multipart/form-data",
      });
   }

   return (
      <>
         <fetcher.Form
            //Only onSubmit if we have an uploaded file
            onSubmit={(preparedIconFile || preparedBannerFile) && handleSubmit}
            encType="multipart/form-data"
            className="h-full relative"
            method="POST"
            onChange={() => setIsChanged(true)}
            ref={zo.ref}
         >
            <input type="hidden" name={zo.fields.siteId()} value={site.id} />
            <input
               type="hidden"
               name={zo.fields.siteIconId()}
               value={site.icon?.id}
            />
            <input
               type="hidden"
               name={zo.fields.siteBannerId()}
               value={site.banner?.id}
            />
            <div className="max-laptop:space-y-6 laptop:flex items-start gap-8">
               <FieldGroup>
                  <Field>
                     <Label>Name</Label>
                     <Input
                        name={zo.fields.name()}
                        defaultValue={site.name}
                        type="text"
                     />
                  </Field>
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
                           {site.domain
                              ? site.domain
                              : `${site.slug}.mana.wiki`}
                        </TextLink>
                        . You can change this to a custom domain{" "}
                        <TextLink href="/settings/domain">here</TextLink>.
                     </Description>
                  </Field>
                  <Field>
                     <Label>About</Label>
                     <Textarea
                        defaultValue={site.about ?? ""}
                        name={zo.fields.about()}
                     />
                  </Field>
               </FieldGroup>
               <section className="laptop:w-[300px] space-y-6 flex-none">
                  <ImageUploader
                     label="Site Icon"
                     icon={siteIcon}
                     previewImage={previewIconImage}
                     setPreparedFile={setPreparedIconFile}
                     setPreviewImage={setPreviewIconImage}
                     type="circle"
                  />
                  <ImageUploader
                     type="rectangle"
                     label="Site Banner"
                     wrapperClassName="overflow-hidden"
                     icon={siteBanner}
                     previewImage={previewBannerImage}
                     setPreparedFile={setPreparedBannerFile}
                     setPreviewImage={setPreviewBannerImage}
                     aspect={16 / 9}
                  />
               </section>
            </div>
            <section className="pt-6 space-y-4">
               <SwitchField fullWidth>
                  <Label>Public Access</Label>
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
               <SwitchField fullWidth>
                  <Label>Enable Ads</Label>
                  <Description>
                     Earn revenue by displaying ads on your site
                  </Description>
                  <Switch
                     onChange={() => setIsChanged(true)}
                     defaultChecked={site.enableAds ?? false}
                     color="dark/white"
                     value="true"
                     name={zo.fields.enableAds()}
                  />
               </SwitchField>
            </section>
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
            <Fieldset className="pb-6 border-b-2 border-color border-dashed mt-6">
               <Legend>Announcement</Legend>
               <Text>
                  Add an announcement to your site to notify users of important
                  updates or events.
               </Text>
               <FieldGroup>
                  <InputGroup>
                     <Icon name="text" />
                     <Input
                        placeholder="Type your announcement here..."
                        defaultValue={site?.announcementMessage ?? ""}
                        name={zo.fields.announcementMessage()}
                        type="text"
                     />
                  </InputGroup>
                  <InputGroup>
                     <Icon name="link" />
                     <Input
                        placeholder="https://example.com"
                        defaultValue={site.announcementLink ?? ""}
                        name={zo.fields.announcementLink()}
                        type="text"
                     />
                  </InputGroup>
               </FieldGroup>
            </Fieldset>
            <Transition
               show={isChanged}
               as="div"
               enter="transition ease-out duration-200"
               enterFrom="opacity-0 translate-y-1"
               enterTo="opacity-100 translate-y-0"
               leave="transition ease-in duration-200"
               leaveFrom="opacity-100 translate-y-0"
               leaveTo="opacity-0 translate-y-1"
               className="w-full max-tablet:inset-x-0 max-tablet:px-3 z-30 fixed bottom-8 tablet:w-[728px]"
            >
               <div
                  className="mt-6 flex items-center gap-5 justify-between dark:bg-dark450 bg-white
                  border dark:border-zinc-600 shadow-lg dark:shadow-zinc-900/50 rounded-lg py-3 px-2.5"
               >
                  <button
                     type="button"
                     onClick={() => {
                        //@ts-ignore
                        zo.refObject.current.reset();
                        setIsChanged(false);
                        setPreviewIconImage("");
                        setPreviewBannerImage("");
                     }}
                     className="text-sm h-8 font-semibold cursor-pointer rounded-lg
                     dark:hover:bg-dark500 gap-2 flex items-center justify-center pl-2 pr-3.5"
                  >
                     <Icon
                        title="Reset"
                        size={14}
                        name="refresh-ccw"
                        className="dark:text-zinc-500"
                     />
                     <span>Reset</span>
                  </button>
                  <input type="hidden" name="intent" value="saveSettings" />
                  <Button
                     type="submit"
                     color="dark/white"
                     className="cursor-pointer !font-bold text-sm h-8 w-[62px]"
                     disabled={disabled}
                  >
                     {saving ? <DotLoader /> : "Save"}
                  </Button>
               </div>
            </Transition>
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
      intent: z.enum(["saveSettings", "addDomain", "saveMenu"]),
   });

   if (!user) throw redirect("/404", 404);

   switch (intent) {
      case "saveMenu": {
         const { siteId, siteMenu } = await zx.parseForm(request, {
            siteId: z.string(),
            siteMenu: z.string(),
         });
         await payload.update({
            collection: "sites",
            id: siteId,
            data: {
               menu: JSON.parse(siteMenu),
            },
            overrideAccess: false,
            user,
         });
         return jsonWithSuccess({ message: "ok" }, "Successfully updated menu");
      }
      case "saveSettings": {
         const result = await getMultipleFormData({
            request,
            prefix: "site",
            schema: SettingsSiteSchema,
         });
         if (result.success) {
            const { siteIcon, siteIconId, siteBanner, siteBannerId, siteId } =
               result.data;

            //Icon
            if (siteIcon && !siteIconId) {
               const upload = await uploadImage({
                  payload,
                  image: siteIcon,
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
            //If existing icon, delete it and upload new one
            if (siteIcon && siteIconId) {
               await payload.delete({
                  collection: "images",
                  id: siteIconId,
                  overrideAccess: false,
                  user,
               });
               const upload = await uploadImage({
                  payload,
                  image: siteIcon,
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
            //Banner
            if (siteBanner && !siteBannerId) {
               const upload = await uploadImage({
                  payload,
                  image: siteBanner,
                  user,
                  siteId,
               });

               await payload.update({
                  collection: "sites",
                  id: siteId,
                  data: {
                     //@ts-ignore
                     banner: upload?.id,
                  },
                  overrideAccess: false,
                  user,
               });
            }
            //If existing banner, delete it and upload new one
            if (siteBanner && siteBannerId) {
               await payload.delete({
                  collection: "images",
                  id: siteBannerId,
                  overrideAccess: false,
                  user,
                  depth: 1,
               });
               const upload = await uploadImage({
                  payload,
                  image: siteBanner,
                  user,
                  siteId,
               });

               await payload.update({
                  collection: "sites",
                  id: siteId,
                  data: {
                     //@ts-ignore
                     banner: upload?.id,
                  },
                  overrideAccess: false,
                  user,
               });
            }

            await payload.update({
               collection: "sites",
               id: siteId,
               data: {
                  ...result.data,
               },
               overrideAccess: false,
               user,
            });
            return jsonWithSuccess(null, "Settings updated");
         }
         if (result.error) {
            return jsonWithError(
               null,
               "Something went wrong, unable to save settings...",
            );
         }
      }
   }
}
