import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import type {
   PokemonFamily as PokemonFamilyType,
   Pokemon as PokemonType,
} from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { PokemonFamily } from "./components/Pokemon.family";
import { Main } from "./components/Pokemon.main";
import { Moves } from "./components/Pokemon.moves";
import { OtherInfo } from "./components/Pokemon.otherInfo";
import { Ratings } from "./components/Pokemon.ratings";
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
         //Need to familyEntryID as its own variable sine the query is expecting it as a JSON object.
         variables: {
            familyEntryId: params.entryId,
         },
      },
   });

   return json({
      entry,
   });
}

const SECTIONS = {
   main: Main,
   family: PokemonFamily,
   // ratings: Ratings,
   moves: Moves,
   "type-chart": TypeChart,
   other: OtherInfo,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();

   const data = {
      pokemon: entry.data.pokemon as PokemonType,
      family: entry?.data?.family?.docs[0] as PokemonFamilyType,
   };

   return <Entry customComponents={SECTIONS} customData={data} />;
}

const QUERY = gql`
   query ($entryId: String!, $familyEntryId: JSON) {
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
                  duration
                  dodgeWindow
                  damagePerEnergy
                  damagePerSecond
                  energyPerSecond
               }
               icon {
                  url
               }
               type {
                  name
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
                  duration
                  dodgeWindow
                  damagePerEnergy
                  damagePerSecond
                  energyPerSecond
                  energyDeltaCharge
               }
               icon {
                  url
               }
               type {
                  name
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
      family: PokemonFamilies(
         where: { pokemonInFamily: { equals: $familyEntryId } }
      ) {
         docs {
            name
            basePokemon {
               id
               name
               slug
               icon {
                  url
               }
            }
            stage2Pokemon {
               evolutionRequirements {
                  id
                  name
               }
               pokemon {
                  id
                  name
                  slug
                  icon {
                     url
                  }
               }
            }
            stage3Pokemon {
               evolutionRequirements {
                  id
                  name
               }
               pokemon {
                  id
                  name
                  slug
                  icon {
                     url
                  }
               }
            }
            stage4Pokemon {
               evolutionRequirements {
                  id
                  name
               }
               pokemon {
                  id
                  name
                  slug
                  icon {
                     url
                  }
               }
            }
         }
      }
   }
`;
