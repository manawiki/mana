import { json } from "@remix-run/node";
import type {
   MetaFunction,
   LoaderFunctionArgs,
   SerializeFrom,
} from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";

import { Description, Field, Label } from "~/components/Fieldset";
import { Input } from "~/components/Input";
import { Switch, SwitchField } from "~/components/Switch";
import { Textarea } from "~/components/Textarea";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";

import { getSiteSlug } from "../_utils/getSiteSlug.server";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = getSiteSlug(request);
   return json({ siteSlug });
}

export default function Settings() {
   const { site } = useRouteLoaderData("routes/_site+/_layout") as {
      site: SerializeFrom<typeof siteLoaderType>["site"];
   };

   return (
      <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-6">
         <h1 className="font-header text-xl font-bold border-b border-color pb-3 mb-3">
            Settings
         </h1>
         <div className="space-y-3">
            <SwitchField className="border-b border-color pb-4">
               <Label>Enable Ads</Label>
               <Description>
                  Earn revenue by displaying ads on your site.
               </Description>
               <Switch name="enable_ads" defaultChecked />
            </SwitchField>
            <Field>
               <Label>Site Name</Label>
               <Input defaultValue={site.name} name="name" type="text" />
            </Field>
            <Field>
               <Label>Description</Label>
               <Textarea defaultValue={site.about ?? ""} name="about" />
            </Field>
            <Field>
               <Label>Domain Name</Label>
               <Input
                  defaultValue={site.domain ?? ""}
                  name="domain_name"
                  type="text"
               />
            </Field>
         </div>
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
