import { json, redirect } from "@remix-run/node";
import type {
   MetaFunction,
   LoaderFunctionArgs,
   SerializeFrom,
   ActionFunctionArgs,
} from "@remix-run/node";
import {
   useFetcher,
   useLoaderData,
   useRevalidator,
   useRouteLoaderData,
} from "@remix-run/react";
import { request as gqlRequest } from "graphql-request";
import { VariableType, jsonToGraphQLQuery } from "json-to-graphql-query";
import { useZorm } from "react-zorm";
import { jsonWithSuccess } from "remix-toast";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import { Badge, BadgeButton } from "~/components/Badge";
import { Button } from "~/components/Button";
import { Description, ErrorMessage, Field, Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { Text } from "~/components/Text";
import { isSiteOwner } from "~/db/collections/site/access";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";
import { isAdding } from "~/utils/form";

import { Record } from "./components/Record";
import { getSiteSlug } from "../_utils/getSiteSlug.server";

const endpoint = "https://api.fly.io/graphql";

const DOMAIN_SCHEMA = z.object({
   intent: z.string().min(1).optional(),
   siteId: z.string(),
   flyAppId: z.string(),
   domain: z.string().refine(
      (subdomain) => {
         const levels = subdomain.split(".");
         return levels.length <= 3;
      },
      {
         message: "Subdomain can only have up to 3 levels",
      },
   ),
});

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);

   const domainData = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteSlug,
         },
         v4IP: {
            exists: true,
         },
         flyAppId: {
            exists: true,
         },
      },
      depth: 0,
   });

   //If flyAppId exists, use it, otherwise use default
   const flyAppId = domainData.docs[0]?.flyAppId ?? "mana";
   const ipv4 = domainData.docs[0]?.v4IP ?? "149.248.204.56";

   //If domain exists, we need to fetch the certificate data
   const existingDomain = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteSlug,
         },
         and: [
            {
               domain: {
                  exists: true,
               },
            },
            {
               domain: {
                  not_equals: "",
               },
            },
         ],
      },
      depth: 0,
   });

   if (existingDomain.totalDocs === 1) {
      const query = {
         query: {
            __variables: {
               appName: "String!",
               hostname: "String!",
            },
            app: {
               __args: {
                  name: new VariableType("appName"),
               },
               certificate: {
                  __args: {
                     hostname: new VariableType("hostname"),
                  },
                  check: true,
                  configured: true,
                  acmeDnsConfigured: true,
                  acmeAlpnConfigured: true,
                  dnsValidationTarget: true,
                  hostname: true,
                  clientStatus: true,
                  issued: {
                     nodes: {
                        type: true,
                        expiresAt: true,
                     },
                  },
               },
            },
         },
      };

      const graphql_query = jsonToGraphQLQuery(query, {
         pretty: true,
      });

      const domain = existingDomain.docs[0]?.domain;

      const certData = await gqlRequest(
         endpoint,
         graphql_query,
         {
            appName: flyAppId,
            hostname: domain,
         },
         {
            ...(process.env.FLY_API_TOKEN && {
               authorization: "Bearer " + process.env.FLY_API_TOKEN,
            }),
         },
      );

      return json({ certData, ipv4, flyAppId });
   }
   return json({ ipv4, flyAppId });
}

export default function Settings() {
   const data = useLoaderData<typeof loader>();

   const { site } = useRouteLoaderData("routes/_site+/_layout") as {
      site: SerializeFrom<typeof siteLoaderType>["site"];
   };

   //@ts-ignore
   const certificate = data?.certData?.app?.certificate;

   const isCertsIssued = certificate?.issued?.nodes?.length == 2;

   const zo = useZorm("domain", DOMAIN_SCHEMA);

   const fetcher = useFetcher();

   //Check if domain is a subdomain
   //@ts-ignore
   const levels = site?.domain ? site?.domain.split(".") : [];
   let [subDomain] = levels;
   const isSubDomain = levels.length <= 1;

   const addingDomain = isAdding(fetcher, "addDomain");
   const deletingDomain = isAdding(fetcher, "deleteDomain");

   const revalidator = useRevalidator();

   return (
      <fetcher.Form method="post" ref={zo.ref}>
         <input type="hidden" name="flyAppId" value={data?.flyAppId} />
         <Field className="pb-4">
            <Label>Domain Name</Label>
            <Description>Setup a custom domain name for your site</Description>
            <Input
               placeholder="example.com"
               defaultValue={site.domain ?? ""}
               name={zo.fields.domain()}
               type="text"
            />
            {zo.errors.domain((err) => (
               <ErrorMessage>{err.message}</ErrorMessage>
            ))}
         </Field>
         <input type="hidden" name={zo.fields.intent()} value="addDomain" />
         <input type="hidden" name={zo.fields.siteId()} value={site.id} />
         {site.domain ? (
            <Button
               className="text-sm tablet:text-xs !font-bold w-20 h-11 tablet:h-8 cursor-pointer"
               color="zinc"
               type="button"
               onClick={() => {
                  fetcher.submit(
                     //@ts-ignore
                     {
                        intent: "deleteDomain",
                        siteId: site.id,
                        domain: site.domain,
                        flyAppId: data?.flyAppId,
                     },
                     {
                        method: "post",
                     },
                  );
               }}
            >
               {deletingDomain ? (
                  <Icon
                     size={18}
                     name="loader-2"
                     className="mx-auto animate-spin"
                  />
               ) : (
                  "Remove"
               )}
            </Button>
         ) : (
            <Button
               className="text-sm tablet:text-xs !font-bold h-11 w-16 tablet:h-8 cursor-pointer"
               color="blue"
               type="submit"
            >
               {addingDomain ? (
                  <Icon
                     size={18}
                     name="loader-2"
                     className="mx-auto animate-spin"
                  />
               ) : (
                  "Add"
               )}
            </Button>
         )}
         {site.domain && (
            <div className="border-y-2 border-dashed border-color mt-6 py-6">
               <div className="pb-4 !text-base">
                  Setup instructions for{" "}
                  <span className="underline decoration-zinc-300 dark:decoration-zinc-500 !font-bold dark:text-white">
                     {site.domain}
                  </span>
               </div>

               <div
                  className="px-4 py-3 mb-4 flex items-center gap-3 rounded-xl bg-zinc-50 dark:bg-dark450
                  border dark:border-zinc-600 border-zinc-200 shadow-sm dark:shadow-zinc-800/50"
               >
                  {isCertsIssued ? (
                     <>
                        <div
                           className="border border-green-300 dark:border-green-900 bg-green-50 dark:bg-green-950 
                           h-5 w-5 flex items-center justify-center rounded-full"
                        >
                           <Icon
                              name="check"
                              size={12}
                              className="text-green-600 dark:text-green-400"
                           />
                        </div>
                        <div className="text-sm flex items-center justify-between flex-grow">
                           <span>Domain name successfully configured!</span>
                           <BadgeButton
                              color="green"
                              target="_blank"
                              href={`https://${site.domain}`}
                           >
                              Go To Site
                              <Icon
                                 name="external-link"
                                 size={14}
                                 className="ml-0.5"
                              />
                           </BadgeButton>
                        </div>
                     </>
                  ) : (
                     <>
                        <Icon
                           name="loader-2"
                           size={22}
                           className="animate-spin text-1"
                        />
                        <div className="flex items-center justify-between w-full">
                           <div className="text-sm font-bold">
                              {certificate.clientStatus}...
                           </div>
                           <div className="flex items-center gap-3">
                              {certificate.clientStatus ==
                                 "Awaiting certificates" && (
                                 <Badge color="teal">1 to 5 min wait...</Badge>
                              )}
                              <BadgeButton
                                 color="blue"
                                 disabled={revalidator.state === "loading"}
                                 onClick={() => revalidator.revalidate()}
                              >
                                 Check Again
                                 {revalidator.state === "idle" ? (
                                    <Icon
                                       name="refresh-ccw"
                                       size={14}
                                       className="ml-0.5"
                                    />
                                 ) : (
                                    <Icon
                                       size={14}
                                       name="loader-2"
                                       className="ml-0.5 animate-spin"
                                    />
                                 )}
                              </BadgeButton>
                           </div>
                        </div>
                     </>
                  )}
               </div>

               <div className="space-y-8 pt-3">
                  <div>
                     <div className="pb-1 flex items-center gap-2">
                        Domain Configuration
                        {!certificate?.configured ? (
                           <Icon
                              name="loader-2"
                              size={18}
                              className="animate-spin text-1"
                           />
                        ) : (
                           <div
                              className="border border-green-300 dark:border-green-900 bg-green-50 dark:bg-green-950 
                           h-5 w-5 flex items-center justify-center rounded-full"
                           >
                              <Icon
                                 name="check"
                                 size={12}
                                 className="text-green-600 dark:text-green-400"
                              />
                           </div>
                        )}
                     </div>
                     <Text className="pb-4">
                        Add DNS entries to direct visitors to your site.
                     </Text>
                     <div className="flex items-center justify-between gap-4">
                        <Record
                           name
                           value={isSubDomain ? subDomain : "@"}
                           type="A"
                        />
                        <Icon
                           name="arrow-right"
                           size={16}
                           className="flex-none text-1 mt-5"
                        />
                        <Record value={data?.ipv4} />
                     </div>
                  </div>
                  <div>
                     <div className="pb-1 flex items-center gap-2">
                        Domain ownership verification
                        {!certificate?.acmeDnsConfigured ? (
                           <Icon
                              name="loader-2"
                              size={18}
                              className="animate-spin text-1"
                           />
                        ) : (
                           <div
                              className="border border-green-300 dark:border-green-900 bg-green-50 dark:bg-green-950 
                           h-5 w-5 flex items-center justify-center rounded-full"
                           >
                              <Icon
                                 name="check"
                                 size={12}
                                 className="text-green-600 dark:text-green-400"
                              />
                           </div>
                        )}
                     </div>
                     <Text className="pb-4">
                        Verify your domain ownership to issue a certificate.
                     </Text>
                     <div className="flex items-center justify-between gap-4">
                        <Record
                           name
                           value={
                              subDomain
                                 ? `_acme-challenge.${subDomain}`
                                 : "_acme-challenge"
                           }
                           type="CNAME"
                        />
                        <Icon
                           name="arrow-right"
                           size={16}
                           className="flex-none text-1 mt-5"
                        />
                        <Record value={certificate.dnsValidationTarget} />
                     </div>
                  </div>
               </div>
            </div>
         )}
      </fetcher.Form>
   );
}

export const meta: MetaFunction<typeof loader, any> = ({ matches }) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site.name;

   return [
      {
         title: `Domain | Settings - ${siteName}`,
      },
   ];
};

export async function action({
   context: { payload, user },
   request,
}: ActionFunctionArgs) {
   const { intent, domain, siteId, flyAppId } = await zx.parseForm(
      request,
      DOMAIN_SCHEMA,
   );

   const site = await payload.findByID({
      collection: "sites",
      id: siteId,
      user,
      overrideAccess: false,
      depth: 0,
   });

   invariant(user?.roles, "User must be logged in to mutate domain names");

   const isOwner = isSiteOwner(user?.id, site.owner);

   if (!isOwner && !user?.roles.includes("staff")) throw redirect("/404", 404);

   switch (intent) {
      case "deleteDomain": {
         await payload.update({
            collection: "sites",
            id: siteId,
            data: {
               //@ts-ignore
               domain: "",
            },
            user,
            overrideAccess: false,
         });

         const mutation = {
            mutation: {
               __variables: {
                  appId: "ID!",
                  hostname: "String!",
               },
               deleteCertificate: {
                  __args: {
                     appId: new VariableType("appId"),
                     hostname: new VariableType("hostname"),
                  },
                  app: {
                     name: true,
                  },
                  certificate: {
                     hostname: true,
                     id: true,
                  },
               },
            },
         };
         const graphql_query = jsonToGraphQLQuery(mutation, {
            pretty: true,
         });
         await gqlRequest(
            endpoint,
            graphql_query,
            {
               appId: flyAppId,
               hostname: domain,
            },
            {
               ...(process.env.FLY_API_TOKEN && {
                  authorization: "Bearer " + process.env.FLY_API_TOKEN,
               }),
            },
         );
         return jsonWithSuccess(null, "Domain name removed...");
      }
      case "addDomain": {
         const existingDomain = await payload.find({
            collection: "sites",
            where: {
               domain: {
                  equals: domain,
               },
            },
            depth: 0,
         });

         //If domain doesn't exist, add it
         if (existingDomain.totalDocs == 0) {
            await payload.update({
               collection: "sites",
               id: siteId,
               data: {
                  //@ts-ignore
                  domain: domain,
               },
               user,
               overrideAccess: false,
            });
            const mutation = {
               mutation: {
                  __variables: {
                     appId: "ID!",
                     hostname: "String!",
                  },
                  addCertificate: {
                     __args: {
                        appId: new VariableType("appId"),
                        hostname: new VariableType("hostname"),
                     },
                     certificate: {
                        configured: true,
                        acmeDnsConfigured: true,
                        acmeAlpnConfigured: true,
                        certificateAuthority: true,
                        certificateRequestedAt: true,
                        dnsProvider: true,
                        dnsValidationInstructions: true,
                        dnsValidationHostname: true,
                        dnsValidationTarget: true,
                        hostname: true,
                        id: true,
                        source: true,
                     },
                  },
               },
            };

            const graphql_query = jsonToGraphQLQuery(mutation, {
               pretty: true,
            });

            await gqlRequest(
               endpoint,
               graphql_query,
               {
                  appId: flyAppId,
                  hostname: domain,
               },
               {
                  ...(process.env.FLY_API_TOKEN && {
                     authorization: "Bearer " + process.env.FLY_API_TOKEN,
                  }),
               },
            );

            return jsonWithSuccess(null, "Domain name added...");
         }
      }
   }
}
