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
import { TierSix } from "./components/TierSix";
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
   "tier-6": TierSix,
};

export default function UltraLeagueTierList() {
   const { entry } = useLoaderData<typeof loader>();

   const tier_list = entry.data;
   return (
      <Entry
         className="max-w-[728px] w-full mx-auto"
         customComponents={SECTIONS}
         customData={tier_list}
      />
   );
}

const query = {
   query: {
      tier1: {
         __aliasFor: "allPokemon",
         __args: {
            limit: 200,
            sort: "name",
            where: {
               ratings__attackerRating: { equals: new EnumType("s") },
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
               slug: true,
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
               ratings__attackerRating: { equals: new EnumType("a_plus") },
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
               slug: true,
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
               ratings__attackerRating: { equals: new EnumType("a") },
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
               slug: true,
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
               ratings__attackerRating: { equals: new EnumType("b_plus") },
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
               slug: true,
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
               ratings__attackerRating: { equals: new EnumType("b") },
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
               slug: true,
               icon: {
                  url: true,
               },
            },
         },
      },
      tier6: {
         __aliasFor: "allPokemon",
         __args: {
            limit: 200,
            sort: "name",
            where: {
               ratings__attackerRating: { equals: new EnumType("c") },
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
               slug: true,
               icon: {
                  url: true,
               },
            },
         },
      },
   },
};
