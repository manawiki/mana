import { useEffect, useState } from "react";

import { redirect } from "@remix-run/node";
import type {
   MetaFunction,
   LoaderFunctionArgs,
   SerializeFrom,
   ActionFunctionArgs,
} from "@remix-run/node";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import { useZorm } from "react-zorm";
import { jsonWithSuccess } from "remix-toast";
import { z } from "zod";
import { zx } from "zodix";

import { isSiteOwnerOrAdmin } from "~/access/site";
import { Button } from "~/components/Button";
import {
   Description,
   Field,
   FieldGroup,
   Fieldset,
   Label,
   Legend,
} from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { Switch, SwitchField } from "~/components/Switch";
import { Strong, Text, TextLink } from "~/components/Text";
import { Textarea } from "~/components/Textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";
import { isAdding, isProcessing } from "~/utils";

import { getSiteSlug } from "../_utils/getSiteSlug.server";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = getSiteSlug(request);
   if (!user) throw redirect("/404", 404);
   const site = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteSlug,
         },
      },
      depth: 0,
   });
   const hasAccess = isSiteOwnerOrAdmin(user.id, site.docs[0]);
   if (!hasAccess) throw redirect("/404", 404);
   return null;
}

const SettingsSchema = z.object({
   name: z.string().min(3),
   intent: z.enum(["saveSettings"]),
   siteId: z.string().min(1),
   about: z.string().optional(),
   slug: z.string().min(1),
   isPublic: z.coerce.boolean(),
   enableAds: z.coerce.boolean(),
   domain: z.string().optional(),
   gaTagId: z.string().optional(),
   gaPropertyId: z.string().optional(),
});

export default function Settings() {
   const { site } = useRouteLoaderData("routes/_site+/_layout") as {
      site: SerializeFrom<typeof siteLoaderType>["site"];
   };

   const zo = useZorm("settings", SettingsSchema);

   const fetcher = useFetcher();

   const saving = isAdding(fetcher, "saveSettings");
   const disabled =
      isProcessing(fetcher.state) || zo.validation?.success === false;

   const accessText = site.isPublic ? "publicly" : "privately";

   const [isChanged, setIsChanged] = useState(false);

   useEffect(() => {
      if (!saving) {
         setIsChanged(false);
      }
   }, [saving]);

   return (
      <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-6">
         <fetcher.Form
            method="post"
            onChange={() => setIsChanged(true)}
            ref={zo.ref}
         >
            <div className="sticky top-[117px] laptop:top-[60px] pt-2 bg-3 z-10">
               <h1 className="font-header text-2xl font-bold border-b-2 border-color pb-3">
                  Settings
               </h1>
               <div className="!absolute top-2.5 right-0 flex items-center gap-3">
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
                     className="text-xs cursor-pointer h-8 w-14"
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
            </div>
            <FieldGroup className="py-6">
               <SwitchField>
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
                        href={`https://${site.slug}.mana.wiki`}
                     >
                        {site.slug}.mana.wiki
                     </TextLink>
                     . You can change this to a custom domain{" "}
                     <TextLink target="_blank" href="domain">
                        here
                     </TextLink>
                     .
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
            </FieldGroup>
            <Fieldset className="border-y border-color border-dashed pt-5 pb-6">
               <Legend>Analytics</Legend>
               <Text>
                  Track your site's performance with Google Analytics. Learn how
                  to create a free Google Analytics account{" "}
                  <TextLink
                     target="_blank"
                     href={`https://${site.slug}.mana.wiki`}
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
                  </Field>
               </FieldGroup>
            </Fieldset>
            <Fieldset className="border-b border-color border-dashed pt-5 pb-6">
               <Legend>Advanced</Legend>
               <FieldGroup>
                  <SwitchField>
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
                  <Field>
                     <Label>Domain Name</Label>
                     <Description>
                        Setup a custom domain name for your site
                     </Description>
                     <Input
                        defaultValue={site.domain ?? ""}
                        name={zo.fields.domain()}
                        type="text"
                     />
                  </Field>
               </FieldGroup>
            </Fieldset>
            <input type="hidden" name={zo.fields.siteId()} value={site.id} />
         </fetcher.Form>
      </main>
   );
}

export const meta: MetaFunction<typeof loader, any> = ({ matches }) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site.name;

   return [
      {
         title: `Settings - ${siteName}`,
      },
   ];
};

export async function action({
   context: { payload, user },
   request,
   params,
}: ActionFunctionArgs) {
   const formData = await zx.parseForm(request, SettingsSchema);

   if (!user) throw redirect("/404", 404);

   switch (formData.intent) {
      case "saveSettings": {
         await payload.update({
            collection: "sites",
            id: formData.siteId,
            //@ts-ignore
            data: {
               ...formData,
            },
            overrideAccess: false,
            user,
         });
         return jsonWithSuccess(null, "Settings updated");
      }
   }
}
