import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import type { Pokemon as PokemonType } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { Main } from "./components/Main";
import { Moves } from "./components/Moves";
import { OtherInfo } from "./components/OtherInfo";
import { Ratings } from "./components/Ratings";
import { TypeChart } from "./components/TypeChart";

export { entryMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: QUERY,
      },
   });

   return json({
      entry,
   });
}

const SECTIONS = {
   main: Main,
   ratings: Ratings,
   moves: Moves,
   "type-chart": TypeChart,
   other: OtherInfo,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();

   const pokemon = entry.data.pokemon as PokemonType;

   return <Entry customComponents={SECTIONS} customData={pokemon} />;
}

const QUERY = gql`
   query ($entryId: String!) {
      pokemon: Pokemon(id: $entryId) {
         id
         slug
         name
         number
         baseAttack
         baseDefense
         baseStamina
         level50CP
         level40CP
         level25CP
         level20CP
         level15CP
         raidBossTier
         femaleRate
         maleRate
         fleeRate
         buddyDistance
         catchRate
         purificationCost
         secondChargeMoveCost
         weight
         height
         ratings {
            attackerRating
            greatLeagueRating
            ultraLeagueRating
            masterLeagueRating
         }
         fastMoves {
            category
            move {
               id
               name
               slug
               category
               pve {
                  power
               }
               icon {
                  url
               }
               type {
                  boostedWeather {
                     name
                     icon {
                        url
                     }
                  }
               }
            }
         }
         chargeMoves {
            category
            move {
               id
               name
               slug
               category
               pve {
                  power
                  energyDeltaCharge
               }
               icon {
                  url
               }
               type {
                  boostedWeather {
                     name
                     icon {
                        url
                     }
                  }
               }
            }
         }
         icon {
            id
            url
         }
         type {
            name
            icon {
               url
            }
         }
         images {
            goImage {
               id
               url
            }
            goShinyImage {
               id
               url
            }
            florkImage {
               id
               url
            }
            shuffleImage {
               id
               url
            }
         }
      }
   }
`;
