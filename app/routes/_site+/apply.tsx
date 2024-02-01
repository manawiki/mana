import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useZorm } from "react-zorm";
import { z } from "zod";

import { Button } from "~/components/Button";
import { Field, FieldGroup, Label } from "~/components/Fieldset";
import { Textarea } from "~/components/Textarea";

import { getSiteSlug } from "./_utils/getSiteSlug.server";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);

   return { siteSlug };
}

const SiteApplicationSchema = z.object({
   message: z.string(),
});

export default function Apply() {
   const fetcher = useFetcher();
   const zo = useZorm("siteApplication", SiteApplicationSchema);
   return (
      <main className="max-w-[728px] max-laptop:pt-[82px] laptop:w-[728px] py-6 laptop:pb-20 max-tablet:px-3 mx-auto">
         <fetcher.Form ref={zo.ref}>
            <FieldGroup>
               <Field>
                  <Label>Message</Label>
                  <Textarea name={zo.fields.message()} />
               </Field>
            </FieldGroup>
            <div className="flex items-center justify-end">
               <Button className="mt-4" type="submit">
                  Submit Application
               </Button>
            </div>
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
         title: `Apply - ${siteName}`,
      },
   ];
};
