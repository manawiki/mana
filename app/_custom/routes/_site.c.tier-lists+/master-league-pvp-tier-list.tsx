import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { EnumType, jsonToGraphQLQuery } from "json-to-graphql-query";

import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { TierFive } from "./components/TierFive";
import { TierFour } from "./components/TierFour";
import { TierOne } from "./components/TierOne";
import { TierThree } from "./components/TierThree";
import { TierTwo } from "./components/TierTwo";

export { entryMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const graphql_query = jsonToGraphQLQuery(query, { pretty: true });

   const { entry } = await fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: graphql_query,
      },
   });
   return json({
      entry,
   });
}

const SECTIONS = {
   "tier-1": TierOne,
   "tier-2": TierTwo,
   "tier-3": TierThree,
   "tier-4": TierFour,
   "tier-5": TierFive,
};

export default function MasterLeagueTierList() {
   const { entry } = useLoaderData<typeof loader>();

   const tier_list = entry.data;
   return <Entry customComponents={SECTIONS} customData={tier_list}></Entry>;
}

const query = {
   query: {
      tier1: {
         __aliasFor: "allPokemon",
         __args: {
            limit: 200,
            sort: "name",
            where: {
               ratings__masterLeagueRating: { equals: new EnumType("_5_0") },
            },
         },
         docs: {
            id: true,
            slug: true,
            name: true,
            number: true,
            icon: {
               url: true,
            },
            type: {
               name: true,
               icon: {
                  url: true,
               },
            },
         },
      },
      tier2: {
         __aliasFor: "allPokemon",
         __args: {
            limit: 200,
            sort: "name",
            where: {
               OR: [
                  {
                     ratings__masterLeagueRating: {
                        equals: new EnumType("_4_5"),
                     },
                  },
                  {
                     ratings__masterLeagueRating: {
                        equals: new EnumType("_4_0"),
                     },
                  },
               ],
            },
         },
         docs: {
            id: true,
            slug: true,
            name: true,
            number: true,
            icon: {
               url: true,
            },
            type: {
               name: true,
               icon: {
                  url: true,
               },
            },
         },
      },
      tier3: {
         __aliasFor: "allPokemon",
         __args: {
            limit: 200,
            sort: "name",
            where: {
               OR: [
                  {
                     ratings__masterLeagueRating: {
                        equals: new EnumType("_3_5"),
                     },
                  },
                  {
                     ratings__masterLeagueRating: {
                        equals: new EnumType("_3_0"),
                     },
                  },
               ],
            },
         },
         docs: {
            id: true,
            slug: true,
            name: true,
            number: true,
            icon: {
               url: true,
            },
            type: {
               name: true,
               icon: {
                  url: true,
               },
            },
         },
      },
      tier4: {
         __aliasFor: "allPokemon",
         __args: {
            limit: 200,
            sort: "name",
            where: {
               OR: [
                  {
                     ratings__masterLeagueRating: {
                        equals: new EnumType("_2_5"),
                     },
                  },
                  {
                     ratings__masterLeagueRating: {
                        equals: new EnumType("_2_0"),
                     },
                  },
               ],
            },
         },
         docs: {
            id: true,
            slug: true,
            name: true,
            number: true,
            icon: {
               url: true,
            },
            type: {
               name: true,
               icon: {
                  url: true,
               },
            },
         },
      },
      tier5: {
         __aliasFor: "allPokemon",
         __args: {
            limit: 200,
            sort: "name",
            where: {
               OR: [
                  {
                     ratings__masterLeagueRating: {
                        equals: new EnumType("_1_5"),
                     },
                  },
                  {
                     ratings__masterLeagueRating: {
                        equals: new EnumType("_1_0"),
                     },
                  },
               ],
            },
         },
         docs: {
            id: true,
            slug: true,
            name: true,
            number: true,
            icon: {
               url: true,
            },
            type: {
               name: true,
               icon: {
                  url: true,
               },
            },
         },
      },
   },
};
