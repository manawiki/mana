import { jsonToGraphQLQuery } from "json-to-graphql-query";
import type { PaginatedDocs } from "payload/database";

import type { Site } from "~/db/payload-types";
import { authGQLFetcher } from "~/utils/fetchers.server";

import { inngest } from "./inngest-client";

export const loadAnalyticsCron = inngest.createFunction(
   {
      id: "site-analytics-load",
   },
   { cron: "0 */4 * * *" },
   async ({ event, step }) => {
      const query = {
         query: {
            siteData: {
               __aliasFor: "Sites",
               __args: {
                  where: {
                     gaTagId: {
                        exists: true,
                     },
                     gaPropertyId: {
                        exists: true,
                     },
                     AND: [
                        {
                           gaTagId: {
                              not_equals: "",
                           },
                        },
                        {
                           gaPropertyId: {
                              not_equals: "",
                           },
                        },
                     ],
                  },
               },
               docs: {
                  id: true,
                  name: true,
                  type: true,
                  slug: true,
                  gaPropertyId: true,
                  gaTagId: true,
                  collections: {
                     id: true,
                     slug: true,
                     customDatabase: true,
                  },
               },
            },
         },
      };

      const graphql_query = jsonToGraphQLQuery(query, {
         pretty: true,
      });

      //@ts-ignore
      const { siteData }: { siteData: PaginatedDocs<Site> } =
         await authGQLFetcher({
            document: graphql_query,
         });

      const sites = siteData.docs;

      if (sites) {
         const events = sites.map((site) => {
            return {
               name: "analytics/site.analytics.send",
               data: {
                  siteId: site.id,
                  siteType: site.type,
                  siteSlug: site.slug,
                  gaPropertyId: site.gaPropertyId,
                  collections: site.collections,
               },
            };
         });
         await step.sendEvent("fan-out-site-analytics-update", events);

         return { count: events.length };
      }
   },
);
