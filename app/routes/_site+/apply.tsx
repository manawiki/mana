import type {
   MetaFunction,
   LoaderFunctionArgs,
   ActionFunctionArgs,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useZorm } from "react-zorm";
import { z } from "zod";
import { zx } from "zodix";

import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { DotLoader } from "~/components/DotLoader";
import { Description, Field, FieldGroup, Label } from "~/components/Fieldset";
import { Input } from "~/components/Input";
import { Textarea } from "~/components/Textarea";
import { isAdding } from "~/utils/form";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { getSiteSlug } from "./_utils/getSiteSlug.server";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   if (!user) {
      throw redirect("/login?redirectTo=/apply");
   }

   const { siteSlug } = await getSiteSlug(request, payload, user);

   const { docs } = await payload.find({
      collection: "siteApplications",
      where: {
         "site.slug": {
            equals: siteSlug,
         },
         createdBy: {
            equals: user?.id,
         },
      },
      depth: 0,
      overrideAccess: false,
      user,
   });

   const application = docs[0];

   return { application };
}

const SiteApplicationSchema = z.object({
   siteId: z.string(),
   primaryDetails: z.string(),
   additionalNotes: z.string(),
   discordUsername: z.string().optional(),
});

export default function Apply() {
   const fetcher = useFetcher();

   const { application } = useLoaderData<typeof loader>();

   const zo = useZorm("siteApplication", SiteApplicationSchema);

   const { site } = useSiteLoaderData();

   const adding = isAdding(fetcher, "createApplication");

   return (
      <main className="max-w-[728px] max-laptop:pt-[82px] laptop:w-[728px] py-6 laptop:pb-20 max-tablet:px-3 mx-auto">
         <div className="pb-2.5 mb-4 laptop:mb-6 border-b border-color flex items-center justify-between">
            <h1 className="font-header text-lg laptop:text-xl font-bold ">
               Contributor Application
            </h1>
            <div className="flex items-center gap-2">
               {application?.status === "approved" && (
                  <Badge color="green">Approved</Badge>
               )}
               {application?.status === "under-review" && (
                  <Badge color="blue">Under Review</Badge>
               )}
               {application?.status === "denied" && (
                  <Badge color="red">Denied</Badge>
               )}
            </div>
         </div>
         {application?.reviewMessage ? (
            <div className="py-3 px-4 text-sm rounded-xl border border-color-sub bg-2-sub shadow-sm dark:shadow-zinc-800/50 mb-6">
               <div className="text-1 text-xs pb-1">Reviewer reply</div>
               {`${application?.reviewMessage}`}
            </div>
         ) : undefined}
         <fetcher.Form method="post" ref={zo.ref}>
            <FieldGroup>
               <Field
                  disabled={Boolean(application)}
                  className="laptop:flex items-start justify-center gap-8"
               >
                  <div className="laptop:min-w-72 pb-2 space-y-0.5">
                     <Label>Discord username</Label>
                     <Description>
                        We may reach out to you on Discord for further details.
                     </Description>
                  </div>
                  <Input name={zo.fields.discordUsername()} />
               </Field>
               <Field
                  disabled={Boolean(application)}
                  className="laptop:flex items-start justify-center gap-8"
               >
                  <div className="laptop:min-w-72 pb-2 space-y-0.5">
                     <Label>In what ways would you like to help?</Label>
                     <Description>
                        Wiki creation, guides/analysis, data entry,
                        moderation...
                     </Description>
                  </div>
                  <Textarea
                     rows={3}
                     name={zo.fields.primaryDetails()}
                     defaultValue={application?.primaryDetails as any}
                  />
               </Field>
               <Field
                  disabled={Boolean(application)}
                  className="laptop:flex items-start justify-center gap-8"
               >
                  <div className="laptop:min-w-72 pb-2 space-y-0.5">
                     <Label>Anything else you'd like to share?</Label>
                     <Description>
                        About yourself, past experience/projects, interests...
                     </Description>
                  </div>
                  <Textarea
                     rows={3}
                     name={zo.fields.additionalNotes()}
                     defaultValue={application?.additionalNotes as any}
                  />
               </Field>
            </FieldGroup>
            <input name={zo.fields.siteId()} value={site?.id} type="hidden" />
            <div className="flex items-center justify-end pt-6">
               <Button
                  disabled={Boolean(application) || adding}
                  type="submit"
                  value="createApplication"
                  name="intent"
                  className="w-[154px] laptop:w-[150px] h-8"
               >
                  {adding ? <DotLoader /> : " Submit Application"}
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

export async function action({
   context: { payload, user },
   request,
}: ActionFunctionArgs) {
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   if (!user) throw redirect("/login?redirectTo=/apply");

   switch (intent) {
      case "createApplication": {
         try {
            const { siteId, primaryDetails, additionalNotes, discordUsername } =
               await zx.parseForm(request, SiteApplicationSchema);
            return await payload.create({
               collection: "siteApplications",
               data: {
                  id: `${siteId}-${user.id}`,
                  primaryDetails: primaryDetails as any,
                  additionalNotes: additionalNotes as any,
                  createdBy: user.id as any,
                  discordUsername: discordUsername,
                  site: siteId as any,
                  status: "under-review",
               },
               depth: 0,
               overrideAccess: false,
               user,
            });
         } catch (err: unknown) {
            payload.logger.error(`${err}`);
         }
      }
   }
}
