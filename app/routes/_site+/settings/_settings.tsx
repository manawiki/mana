import { useState } from "react";

import { redirect } from "@remix-run/node";
import type {
   MetaFunction,
   LoaderFunctionArgs,
   SerializeFrom,
   ActionFunctionArgs,
} from "@remix-run/node";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import { jsonWithSuccess } from "remix-toast";
import { z } from "zod";
import { zx } from "zodix";

import { isSiteOwnerOrAdmin } from "~/access/site";
import {
   Description,
   Field,
   FieldGroup,
   Fieldset,
   Label,
   Legend,
} from "~/components/Fieldset";
import { Input } from "~/components/Input";
import { Switch, SwitchField } from "~/components/Switch";
import { Strong, Text, TextLink } from "~/components/Text";
import { Textarea } from "~/components/Textarea";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";
import { assertIsPatch } from "~/utils";

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

export default function Settings() {
   const { site } = useRouteLoaderData("routes/_site+/_layout") as {
      site: SerializeFrom<typeof siteLoaderType>["site"];
   };

   const fetcher = useFetcher();

   const [isPublic, setIsPublic] = useState(site.isPublic);

   const accessText = isPublic ? "publicly" : "privately";
   return (
      <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-6">
         <h1 className="font-header text-2xl font-bold border-b-2 border-color pb-3">
            Settings
         </h1>
         <FieldGroup className="py-6">
            <SwitchField>
               <Label>Allow Public Access</Label>
               <Description>
                  Make your site public to allow anyone to view it
               </Description>
               <Switch
                  //@ts-ignore
                  checked={isPublic}
                  color="dark/white"
                  name="public"
                  onChange={() => {
                     console.log(!isPublic);
                     fetcher.submit(
                        {
                           intent: "updateSitePublicAccess",
                           siteId: site.id,
                           value: !isPublic,
                        },
                        {
                           method: "patch",
                           action: "/settings",
                        },
                     );
                     setIsPublic(!isPublic);
                  }}
               />
            </SwitchField>
            <Field>
               <Label>Slug</Label>
               <Input defaultValue={site.slug ?? ""} name="slug" type="text" />
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
               <Input defaultValue={site.name} name="name" type="text" />
            </Field>
            <Field>
               <Label>About</Label>
               <Textarea defaultValue={site.about ?? ""} name="about" />
            </Field>
         </FieldGroup>
         <Fieldset className="border-y border-color border-dashed pt-5 pb-6">
            <Legend>Analytics</Legend>
            <Text>
               Track your site's performance with Google Analytics. Learn how to
               create a free Google Analytics account{" "}
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
                     name="name"
                     type="text"
                  />
               </Field>
               <Field>
                  <Label>Google Analytics Property Id</Label>
                  <Input
                     defaultValue={site.gaPropertyId ?? ""}
                     name="name"
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
                  <Switch color="dark/white" name="enable_ads" />
               </SwitchField>
               <Field>
                  <Label>Domain Name</Label>
                  <Description>
                     Setup a custom domain name for your site
                  </Description>
                  <Input
                     defaultValue={site.domain ?? ""}
                     name="domain_name"
                     type="text"
                  />
               </Field>
            </FieldGroup>
         </Fieldset>
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
   const { intent, siteId, value } = await zx.parseForm(request, {
      intent: z.enum(["updateSitePublicAccess"]),
      siteId: z.string(),
      value: z.string(),
   });

   const url = new URL(request.url).pathname;

   if (!user) throw redirect(`/login?redirectTo=${url}`, { status: 302 });

   switch (intent) {
      case "updateSitePublicAccess": {
         assertIsPatch(request);
         console.log(value);
         await payload.update({
            collection: "sites",
            id: siteId,
            data: {
               //@ts-ignore
               isPublic: value,
            },
            overrideAccess: false,
            user,
         });
         return jsonWithSuccess(null, "Site Access updated");
      }
   }
}
