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
import clsx from "clsx";
import { request as gqlRequest } from "graphql-request";
import { VariableType, jsonToGraphQLQuery } from "json-to-graphql-query";
import { useZorm } from "react-zorm";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import { Badge, BadgeButton } from "~/components/Badge";
import { Button } from "~/components/Button";
import { DotLoader } from "~/components/DotLoader";
import { Description, ErrorMessage, Field, Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { Code, Text, TextLink } from "~/components/Text";
import { isSiteOwner } from "~/db/collections/site/access";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";
import { isAdding } from "~/utils/form";
import { stripe } from "~/utils/stripe.server";

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
         return levels.length == 2 || levels.length == 3;
      },
      {
         message:
            "Subdomain can only have up to 3 levels, but no less than 2 levels",
      },
   ),
});

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   invariant(user, "User must be logged in to mutate domain names");

   let result = {
      ipv4: "",
      ipv6: "",
      flyAppId: "",
      certData: {
         app: {
            certificate: {
               issued: {
                  nodes: [],
               },
               clientStatus: "",
               configured: "",
               acmeDnsConfigured: "",
               dnsValidationTarget: "",
            },
         },
      },
      canPurchaseDomain: false,
      billingAccountSetupRequired: false,
      canSetupDomain: false,
   };

   const { siteSlug } = await getSiteSlug(request, payload, user);

   const domainExists = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteSlug,
         },
         customDomainInvoiceId: {
            not_equals: "",
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

   const customFlyDomainData = await payload.find({
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

   //If flyAppId exists, it's a custom site with own server, otherwise use default
   result.flyAppId = customFlyDomainData.docs[0]?.flyAppId ?? "mana";
   result.ipv4 = customFlyDomainData.docs[0]?.v4IP ?? "149.248.204.56";
   result.ipv6 = customFlyDomainData.docs[0]?.v6IP ?? "";
   if (domainExists.totalDocs === 0) {
      //If domain is not setup, check if user already purchased domain access
      const domainAccessUnlocked = await payload.find({
         collection: "sites",
         where: {
            slug: {
               equals: siteSlug,
            },
            and: [
               {
                  customDomainInvoiceId: {
                     exists: true,
                  },
               },
               {
                  customDomainInvoiceId: {
                     not_equals: "",
                  },
               },
            ],
         },
         depth: 0,
      });

      //User hasn't unlocked domain access, check if they can purchase a domain
      if (domainAccessUnlocked.totalDocs === 0) {
         //Check if user has billing setup
         const userData = await payload.findByID({
            collection: "users",
            id: user.id,
            depth: 0,
         });

         //User has billing setup, they can purchase a domain
         if (userData?.stripeCustomerId) {
            const customer = await stripe.customers.retrieve(
               userData?.stripeCustomerId,
            );
            //Check if user has a default payment method setup
            //@ts-ignore
            if (customer?.invoice_settings?.default_payment_method) {
               result.canPurchaseDomain = true;
               return json(result);
            }
         }

         //User doesn't have a stripeCustomerId, they need to add a payment method
         result.billingAccountSetupRequired = true;

         return json(result);
      }

      //Domain already purchased, but not setup
      result.canSetupDomain = true;

      return json(result);
   }

   //If domain exists and fly already created the cert, we then fetch the certificate data
   if (domainExists.totalDocs === 1) {
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

      const domain = domainExists.docs[0]?.domain;

      result.certData = await gqlRequest(
         endpoint,
         graphql_query,
         {
            appName: result.flyAppId,
            hostname: domain,
         },
         {
            ...(process.env.FLY_API_TOKEN && {
               authorization: "Bearer " + process.env.FLY_API_TOKEN,
            }),
         },
      );
      return json(result);
   }
   return json(result);
}

export default function Settings() {
   const {
      canPurchaseDomain,
      canSetupDomain,
      billingAccountSetupRequired,
      flyAppId,
      ipv4,
      ipv6,
      certData,
   } = useLoaderData<typeof loader>();

   const { site } = useRouteLoaderData("routes/_site+/_layout") as {
      site: SerializeFrom<typeof siteLoaderType>["site"];
   };

   const certificate = certData?.app?.certificate;

   const isCertsIssued = certificate?.issued?.nodes?.length == 2;

   const zo = useZorm("domain", DOMAIN_SCHEMA);

   const fetcher = useFetcher();

   //Check if domain is a subdomain
   //@ts-ignore
   const levels = site?.domain ? site?.domain.split(".") : [];
   let [subDomain] = levels;
   const isSubDomain = levels.length == 3;
   const addingDomain = isAdding(fetcher, "addDomain");
   const deletingDomain = isAdding(fetcher, "deleteDomain");
   const purchasingDomain = isAdding(fetcher, "purchaseDomain");

   const revalidator = useRevalidator();

   const disabled =
      deletingDomain || !canSetupDomain || billingAccountSetupRequired;

   return (
      <>
         {billingAccountSetupRequired && <div>User billing setup</div>}
         {canPurchaseDomain && (
            <>
               <div
                  className="shadow-sm dark:shadow-zinc-800 
               border border-zinc-300/70 dark:border-zinc-600/50 bg-zinc-50 dark:bg-dark350 px-4 py-3.5 rounded-xl mb-4"
               >
                  <div
                     className="flex items-center justify-between border-b
               pb-3 mb-3 border-zinc-300/70 dark:border-zinc-600/50"
                  >
                     <div className="space-y-0.5">
                        <div className="font-bold">Custom domain</div>
                        <div className="text-sm text-1">
                           Link a custom domain to your mana site
                        </div>
                     </div>
                     <div className="laptop:flex text-right max-laptop:space-y-2 items-center gap-4">
                        <Button
                           className="!text-sm laptop:order-2 laptop:w-[82px] h-9 cursor-pointer"
                           color="dark/white"
                           type="button"
                           onClick={() => {
                              fetcher.submit(
                                 {
                                    intent: "purchaseDomain",
                                    siteId: site.id,
                                 },
                                 {
                                    method: "post",
                                 },
                              );
                           }}
                        >
                           {purchasingDomain ? <DotLoader /> : "Purchase"}
                        </Button>
                        <div className="laptop:order-1 text-zinc-500 dark:text-zinc-400 text-sm">
                           One-time{" "}
                           <span className="dark:text-zinc-200 text-zinc-600 font-bold underline">
                              $50 fee
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className="text-xs">
                     Mana charges a one-time $50 USD fee to use a custom domain
                     for your site.
                  </div>
               </div>
               <div className="flex items-center gap-5 py-4">
                  <span className="h-[1px] rounded-full bg-zinc-100 dark:bg-zinc-700/50 flex-grow" />
                  <span className="text-sm text-1">
                     <Icon
                        className="dark:text-zinc-500 text-zinc-300"
                        name="lock"
                        size={16}
                     />
                  </span>
                  <span className="h-[1px] rounded-full bg-zinc-100 dark:bg-zinc-700/50 flex-grow" />
               </div>
            </>
         )}
         <fetcher.Form
            className={clsx(
               canPurchaseDomain ? "border-b dark:border-zinc-700/50 pb-6" : "",
            )}
            method="post"
            ref={zo.ref}
         >
            <input type="hidden" name="flyAppId" value={flyAppId} />
            <Field disabled={disabled} className="pb-4">
               <Label>Domain Name</Label>
               <Description>
                  Setup a custom domain name for your site
               </Description>
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
                        {
                           intent: "deleteDomain",
                           siteId: site.id,
                           domain: site.domain ?? "",
                           flyAppId: flyAppId,
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
                  disabled={disabled}
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
         </fetcher.Form>

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
               <div className="space-y-10 pt-3">
                  <section>
                     <div className="pb-1.5 flex items-center gap-2">
                        <span className="font-semibold">
                           Domain Configuration
                        </span>
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
                     <div className="space-y-5">
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
                           <Record value={ipv4} />
                        </div>
                        {!isSubDomain && flyAppId != "mana" && (
                           <div className="flex items-center justify-between gap-4">
                              <Record name value="@" type="AAAA" />
                              <Icon
                                 name="arrow-right"
                                 size={16}
                                 className="flex-none text-1 mt-5"
                              />
                              <Record value={ipv6} />
                           </div>
                        )}
                     </div>
                  </section>
                  <section>
                     <div className="pb-1.5 flex items-center gap-2">
                        <span className="font-semibold">
                           Domain ownership verification
                        </span>
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
                              isSubDomain
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
                     <Text className="pt-5">
                        If you’re using Cloudflare, you might be using their
                        Universal SSL feature which inserts a TXT record of{" "}
                        <Code>
                           _acme_challenge
                           {isSubDomain ? `.${subDomain}` : ""}
                        </Code>{" "}
                        for your domain.
                        <Text className="pt-4">
                           This can interfere with our certificate
                           validation/challenge and you should{" "}
                           <TextLink
                              target="_blank"
                              href="https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/disable-universal-ssl/#disable-universal-ssl-certificate"
                           >
                              disable
                           </TextLink>{" "}
                           this feature.
                        </Text>
                     </Text>
                  </section>
               </div>
            </div>
         )}
      </>
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
   const { intent, siteId } = await zx.parseForm(request, {
      intent: z.string(),
      siteId: z.string(),
   });

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
      case "purchaseDomain": {
         try {
            const stripeUser = await payload.findByID({
               collection: "users",
               id: user.id,
               user,
               overrideAccess: false,
            });

            if (!stripeUser.stripeCustomerId) {
               return jsonWithError(
                  null,
                  "You must add a payment method before purchasing a domain",
               );
            }
            const invoice = await stripe.invoices.create({
               customer: stripeUser.stripeCustomerId,
               auto_advance: true,
               collection_method: "charge_automatically",
            });
            await stripe.invoiceItems.create({
               invoice: invoice.id,
               customer: stripeUser.stripeCustomerId,
               price: "price_1OVK2IHY2vBdJM8emeVNeZ7q",
            });

            const payInvoice = await stripe.invoices.pay(invoice.id);
            if (payInvoice.status === "paid") {
               const updateSite = await payload.update({
                  collection: "sites",
                  id: siteId,
                  data: {
                     //@ts-ignore
                     customDomainInvoiceId: invoice.id,
                  },
               });

               if (updateSite)
                  return jsonWithSuccess(null, "Successfully purchased domain");
            }
         } catch (err: any) {
            // Error code will be authentication_required if authentication is needed
            console.log("Error code is: ", err.code);
         }
      }
      case "deleteDomain": {
         const { domain, flyAppId, siteId } = await zx.parseForm(
            request,
            DOMAIN_SCHEMA,
         );
         try {
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
            const deleteFlyCert = await gqlRequest(
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
            if (deleteFlyCert) {
               await payload.update({
                  collection: "sites",
                  id: siteId,
                  data: {
                     domain: null,
                  },
               });
               return jsonWithSuccess(null, "Domain name removed...");
            }
         } catch (err: unknown) {
            console.log(err);
            return jsonWithError(null, "Error, unable to delete domain.");
         }
      }
      case "addDomain": {
         const { domain, flyAppId, siteId } = await zx.parseForm(
            request,
            DOMAIN_SCHEMA,
         );
         try {
            const existingDomain = await payload.find({
               collection: "sites",
               where: {
                  domain: {
                     equals: domain,
                  },
               },
               depth: 0,
            });
            if (existingDomain.totalDocs == 1) {
               return jsonWithError(null, "Domain name already exists...");
            }
            //If domain doesn't exist, create a cert on fly
            if (existingDomain.totalDocs == 0) {
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

               const setupFlyDomain = await gqlRequest(
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
               if (setupFlyDomain) {
                  const updateSite = await payload.update({
                     collection: "sites",
                     id: siteId,
                     data: {
                        //@ts-ignore
                        domain: domain,
                     },
                  });
                  if (updateSite)
                     return jsonWithSuccess(null, "Domain name added...");
               }
            }
         } catch (err: unknown) {
            console.log(err);
            return jsonWithError(null, "Error, unable to add domain.");
         }
      }
   }
}
