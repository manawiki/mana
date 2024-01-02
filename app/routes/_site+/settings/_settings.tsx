import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";

import { Description, Field, Label } from "~/components/Fieldset";
import { Input } from "~/components/Input";
import { Switch, SwitchField } from "~/components/Switch";

import { getSiteSlug } from "../_utils/getSiteSlug.server";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = getSiteSlug(request);
   return json({ siteSlug });
}

export default function Settings() {
   return (
      <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-6">
         <h1 className="font-header text-xl font-bold border-b border-color pb-3 mb-3">
            Settings
         </h1>
         <div className="space-y-3">
            <Field>
               <Label>Domain Name</Label>
               <Input type="text" />
            </Field>
            <SwitchField>
               <Label>Allow embedding</Label>
               <Description>
                  Allow others to embed your event details on their own site.
               </Description>
               <Switch name="allow_embedding" defaultChecked />
            </SwitchField>
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
